# ITO5002-TP1-26-TEAM3: E-Waste Manager

This repo contains the **E-Waste Management Tool** web app (React + Vite) deployed via **S3 + CloudFront**.
Team members should work in **feature branches** and merge via **Pull Requests** into `dev` for Iteration 1.
The `main` branch will only be used as part of Iteration 2.

---

## Table of Contents
- [Requirements](#requirements)
- [First-time Setup](#first-time-setup)
- [Run Locally (Dev Server)](#run-locally-dev-server)
- [Where the Data Lives](#where-the-data-lives)
- [How to Work on a Feature (Branch Workflow)](#how-to-work-on-a-feature-branch-workflow)
- [Create a Pull Request](#create-a-pull-request)
- [Deployment](#deployment)
- [Team Rules](#team-rules)

---

## Requirements

Install:
- **Node.js 20+**
- **Git**
- (Optional) VS Code

Check versions:
```bash
node -v
npm -v
git --version
```

---

## First-time Setup
1. Clone the repo:
```bash
git clone <REPO_URL>
cd <REPO_FOLDER>
```
2. Install dependencies (inside the app folder):
```bash
cd frontend/app
npm ci
```

---

## Run Locally (Dev Server)
From `frontend/app`:
```bash
npm run dev
```
Vite will print a local URL (usually `http://localhost:5173`).
To stop the server: press `CTRL + C`.

---

## Where the Data Lives

The app loads JSON/GeoJSON files from the public folder:
- `frontend/app/public/data/...`
Anything in public/ is served as a static file.
Example:
- File: `frontend/app/public/data/vic_lga_risk.json`
- URL in code: `fetch("/data/vic_lga_risk.json")`

---

## How to Work on a Feature (Branch Workflow)
1. Update your local `dev`
Before starting work, sync your local `dev` branch:
```bash
git checkout dev
git pull origin dev
```
2. Create a feature branch
Branch naming examples:
- `feature/dashboard-tabs`
- `feature/resident-search-ui`
- `fix/map-tooltip`
Create and switch:
```bash
git checkout -b feature/<short-name>
```
3. Make changes + test locally
Run the app and verify everything works:
```bash
cd frontend/app
npm run dev
```
4. Commit your changes
From the repo root (or anywhere inside it):
```bash
git status
git add .
git commit -m "Add <what you changed>"
```
5. Push your feature branch to GitHub
```bash
git push -u origin feature/<short-name>
```

---

## Create a Pull Request
1. Go to GitHub → Pull Requests → New pull request
2. Base branch: dev
3. Compare branch: your feature branch
4. Add a clear title and description (screenshots welcome)
5. Request a review
✅ After approval, merge into dev.

---

## Deployment
When changes are merged into `dev`:
- **GitHub Actions** builds the React app
- The build output is synced to the S3 bucket
- **CloudFront** serves the latest site

---

## Team Rules
- ✅ Work in a feature branch
- ✅ Test locally before pushing
- ✅ PR into `dev` (not `main`)
- ✅ Keep PRs small and focused
- ❌ No direct pushes to `dev` or `main`
