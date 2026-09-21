# Upload and deploy

## 1. Upload these files

Upload all five files from this folder to the root of your GitHub repository:

- `index.html`
- `styles.css`
- `app.js`
- `staticwebapp.config.json`
- `UPLOAD-TO-GITHUB.md`

The files must sit beside the existing `README.md`. Do not place them inside `.github`.

## 2. Update the Azure Static Web Apps workflow

Open `.github/workflows/azure-static-web-apps-....yml` and use these settings under the existing `with:` section of the **Build And Deploy** step:

```yaml
app_location: "/"
api_location: ""
output_location: ""
skip_app_build: true
```

Keep the existing token, `repo_token`, and `action` lines unchanged.

The completed section should resemble:

```yaml
with:
  azure_static_web_apps_api_token: ${{ secrets.YOUR_EXISTING_SECRET_NAME }}
  repo_token: ${{ secrets.GITHUB_TOKEN }}
  action: "upload"
  app_location: "/"
  api_location: ""
  output_location: ""
  skip_app_build: true
```

## 3. Commit

Commit the uploaded files and workflow change to `main`. GitHub Actions will start a new deployment automatically.
