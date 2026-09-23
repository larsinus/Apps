const stations = {
  JEH: { name: "Jessheim", tracks: [1, 2], defaultTrack: 1 },
  OSL: { name: "Oslo S", tracks: Array.from({ length: 19 }, (_, index) => index + 1), defaultTrack: 11 }
};

const state = { station: "JEH", view: "departure", track: "1" };
const els = {
  stationTabs: document.querySelector("#stationTabs"),
  viewTabs: document.querySelector("#viewTabs"),
  trackPicker: document.querySelector("#trackPicker"),
  trackSelect: document.querySelector("#trackSelect"),
  screenStack: document.querySelector("#screenStack")
};

const mobileLayout = window.matchMedia("(max-width: 720px)");

function screenUrl(page = "") {
  const params = new URLSearchParams({
    station: state.station,
    layout: state.view === "track" ? "landscape" : (mobileLayout.matches ? "portrait" : "landscape"),
    content: state.view,
    notice: "yes",
    header: "no",
    page: String(page)
  });
  if (state.view === "track") params.set("track", state.track);
  return `https://rtd.banenor.no/web_client/std?${params.toString()}`;
}

function populateTracks() {
  const tracks = stations[state.station].tracks;
  if (!tracks.map(String).includes(state.track)) state.track = String(stations[state.station].defaultTrack);
  els.trackSelect.innerHTML = tracks.map(track => `<option value="${track}" ${String(track) === state.track ? "selected" : ""}>Spor ${track}</option>`).join("");
}

function setActiveButtons(container, attribute, value) {
  container.querySelectorAll("button").forEach(button => {
    const active = button.dataset[attribute] === value;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

function createScreen(page, showPageLabel) {
  const station = stations[state.station];
  const isTrack = state.view === "track";
  const card = document.createElement("article");
  card.className = "screen-card";

  if (showPageLabel) {
    const label = document.createElement("div");
    label.className = "screen-page-label";
    label.innerHTML = `<span>Oslo S · avganger</span><strong>Side ${page}</strong>`;
    card.append(label);
  }

  const frame = document.createElement("div");
  frame.className = "screen-frame";
  frame.classList.toggle("is-landscape", isTrack);

  const loading = document.createElement("div");
  loading.className = "loading";
  loading.innerHTML = "<span></span> Kobler til Bane NOR …";

  const iframe = document.createElement("iframe");
  iframe.allow = "fullscreen";
  iframe.title = isTrack
    ? `Bane NOR sporvisning for spor ${state.track} på ${station.name}`
    : `Bane NOR avganger fra ${station.name}${showPageLabel ? `, side ${page}` : ""}`;
  iframe.addEventListener("load", () => frame.classList.add("is-loaded"));
  iframe.src = screenUrl(page);

  frame.append(loading, iframe);
  card.append(frame);
  return card;
}

function loadScreen() {
  populateTracks();
  const isTrack = state.view === "track";
  const showAllDeparturePages = !isTrack && state.station === "OSL";
  const pages = showAllDeparturePages ? [1, 2, 3, 4, 5, 6] : [""];

  els.trackPicker.hidden = !isTrack;
  const screens = document.createDocumentFragment();
  pages.forEach(page => screens.append(createScreen(page, showAllDeparturePages)));
  els.screenStack.replaceChildren(screens);
}

els.stationTabs.addEventListener("click", event => {
  const button = event.target.closest("button[data-station]");
  if (!button || button.dataset.station === state.station) return;
  state.station = button.dataset.station;
  state.track = String(stations[state.station].defaultTrack);
  setActiveButtons(els.stationTabs, "station", state.station);
  loadScreen();
});

els.viewTabs.addEventListener("click", event => {
  const button = event.target.closest("button[data-view]");
  if (!button || button.dataset.view === state.view) return;
  state.view = button.dataset.view;
  setActiveButtons(els.viewTabs, "view", state.view);
  loadScreen();
});

els.trackSelect.addEventListener("change", () => {
  state.track = els.trackSelect.value;
  loadScreen();
});

mobileLayout.addEventListener("change", () => loadScreen());

loadScreen();
