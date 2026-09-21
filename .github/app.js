const stations = {
  JEH: { name: "Jessheim", tracks: [1, 2] },
  OSL: { name: "Oslo S", tracks: Array.from({ length: 19 }, (_, index) => index + 1) }
};

const state = { station: "JEH", view: "departure", track: "1" };
const els = {
  stationTabs: document.querySelector("#stationTabs"),
  viewTabs: document.querySelector("#viewTabs"),
  trackPicker: document.querySelector("#trackPicker"),
  trackSelect: document.querySelector("#trackSelect"),
  screenFrame: document.querySelector(".screen-frame"),
  infoScreen: document.querySelector("#infoScreen")
};

const mobileLayout = window.matchMedia("(max-width: 720px)");

function screenUrl() {
  const params = new URLSearchParams({
    station: state.station,
    layout: mobileLayout.matches ? "portrait" : "landscape",
    content: state.view,
    notice: "yes",
    header: "no",
    page: ""
  });
  if (state.view === "track") params.set("track", state.track);
  return `https://rtd.banenor.no/web_client/std?${params.toString()}`;
}

function populateTracks() {
  const tracks = stations[state.station].tracks;
  if (!tracks.map(String).includes(state.track)) state.track = String(tracks[0]);
  els.trackSelect.innerHTML = tracks.map(track => `<option value="${track}" ${String(track) === state.track ? "selected" : ""}>Spor ${track}</option>`).join("");
}

function setActiveButtons(container, attribute, value) {
  container.querySelectorAll("button").forEach(button => {
    const active = button.dataset[attribute] === value;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

function loadScreen() {
  populateTracks();
  const station = stations[state.station];
  const isTrack = state.view === "track";
  const url = screenUrl();
  els.trackPicker.hidden = !isTrack;
  els.infoScreen.title = isTrack ? `Bane NOR sporvisning for spor ${state.track} på ${station.name}` : `Bane NOR avganger fra ${station.name}`;
  els.screenFrame.classList.remove("is-loaded");
  els.infoScreen.src = url;
}

els.stationTabs.addEventListener("click", event => {
  const button = event.target.closest("button[data-station]");
  if (!button || button.dataset.station === state.station) return;
  state.station = button.dataset.station;
  state.track = String(stations[state.station].tracks[0]);
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
els.infoScreen.addEventListener("load", () => els.screenFrame.classList.add("is-loaded"));

populateTracks();
