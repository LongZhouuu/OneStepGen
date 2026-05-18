# OneStepGen — Smart Task Support for ADHD Workers

A web app for ADHD workers in Australia who need support managing day-to-day workplace tasks: dump ideas, let AI break them into small steps, plan in a priority matrix, focus one task at a time, and celebrate progress with collectible rewards.

---

## Project Overview

Our target users are ADHD workers in Australia who experience difficulties managing day-to-day workplace tasks, particularly when dealing with unclear instructions, competing priorities, distractions, and overwhelming workloads. These challenges can affect their ability to start tasks, maintain focus, stay organised, and complete work confidently, which may negatively impact both work performance and emotional well-being.

OneStepGen reduces overwhelm through a **guided four-step workflow**, **AI-assisted task breakdown**, and **in-session support tools** (breathing exercises, quiet-place finder, helplines). Session data stays in the browser (`localStorage`); nothing is stored on our servers by default.

---

## Key Features

### Four-step workflow

| Step | Route | What it does |
|------|--------|----------------|
| 1. AI dump | `/workflow/ai-dump` | Paste text or upload a PDF; backend extracts 2–5 minute actionable steps with priorities |
| 2. Planner | `/workflow/planner` | Review, add, edit, reorder tasks in an Eisenhower-style matrix; save up to 10 named histories |
| 3. Focus (swiper) | `/workflow/swiper` | One-task-at-a-time UI with timer; complete or skip; optional focus lock |
| 4. Complete | `/workflow/complete` | Session summary and random Australian animal reward |

Progress is tracked in `localStorage`; the router only allows access to steps you have already unlocked (or resume from the latest step).

### AI backend (`aiTool/`)

- Text and PDF input → Groq (Llama 3) task extraction → semantic urgency/importance scoring
- FastAPI for local dev; `lambda_handler.py` for AWS Lambda deployment
- See [aiTool/README.md](aiTool/README.md) and [aiTool/FRONTEND_INTEGRATION.md](aiTool/FRONTEND_INTEGRATION.md) for API details

### Support & wellbeing

- Floating support menu: box breathing, quiet places map (Melbourne focus data), helplines
- About page with employment/disability and psychological distress visualisations

### Rewards

- Collect Australian animal cards after completing a session (`/reward`)

### Privacy

- Planning data stored locally in the browser
- Optional site password gate (client-side or server-side via API)
- Privacy and terms pages: `/privacy`, `/terms`

---

## Tech Stack

| Layer | Technologies |
|--------|----------------|
| Frontend | Vue 3, Vue Router 5, Vite 8, Bootstrap 5 |
| Maps / charts | Leaflet, ECharts, D3, TopoJSON |
| State | Browser `localStorage` (sessions, task history, rewards) |
| Backend | Python 3.10+, FastAPI, Groq API (Llama 3) |
| Deploy (optional) | AWS Lambda + API Gateway (see `aiTool/lambda_handler.py`) |

**Node:** `^20.19.0` or `>=22.12.0` (see `package.json` `engines`)

---

## How to Run

### Frontend (root)

```bash
git clone https://github.com/LongZhouuu/OneStepGen.git
cd OneStepGen
npm install
npm run dev
```

Open the URL Vite prints (typically `http://localhost:5173`).

**Other scripts**

```bash
npm run build    # production build → dist/
npm run preview  # preview production build
npm run lint     # oxlint + eslint
npm run format   # prettier (src/)
```

**Environment variables (frontend)**

Create `.env.local` in the project root as needed:

| Variable | Purpose |
|----------|---------|
| `VITE_API_BASE_URL` | Backend base URL. Dev: `/api` (proxied to `http://127.0.0.1:8000` via `vite.config.js`) |
| `VITE_SITE_GATE` | `server` \| `client` — password gate mode |
| `VITE_SITE_ACCESS_PASSWORD` | Legacy client-only gate phrase (build-time) |
| `VITE_SKIP_SITE_GATE` | `true` to skip gate in development |
| `VITE_MELBOURNE_ODATA_BASE` | Optional proxy path for Melbourne open data (quiet places) |

### AI backend (`aiTool/`)

```bash
cd aiTool
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env       # add GROQ_API_KEY
uvicorn main:app --reload
```

API docs: `http://127.0.0.1:8000/docs`

With the frontend on `/api` proxy, set `VITE_API_BASE_URL=/api` in `.env.local` and run both servers together for full AI dump functionality.

---

## Project Structure

```
OneStepGen/
├── public/                 # Static assets, focus map CSVs, chart data
├── src/
│   ├── assets/             # Images, fonts, global CSS
│   ├── components/         # UI pieces (TaskCard, timers, support panels, modals, …)
│   ├── data/               # Animals, templates, tips, map sources
│   ├── router/
│   │   ├── index.js        # Routes + workflow step guards
│   │   └── workflow.js     # Step state, session & history localStorage API
│   ├── utils/              # Site access helpers
│   ├── views/              # Pages (Home, workflow steps, About, Reward, …)
│   │   └── tools/          # Standalone tool views (prioritizer, support, tips)
│   ├── App.vue
│   └── main.js
├── aiTool/                 # FastAPI AI pipeline
│   ├── main.py
│   ├── lambda_handler.py
│   ├── utils/              # pdf_parser, ai_processor, scoring
│   ├── requirements.txt
│   └── README.md
├── index.html
├── vite.config.js
└── package.json
```

### Main routes

| Path | View |
|------|------|
| `/` | Landing / how it works |
| `/workflow/ai-dump` | Step 1 — input & AI processing |
| `/workflow/planner` | Step 2 — task matrix |
| `/workflow/swiper` | Step 3 — focus mode |
| `/workflow/complete` | Step 4 — completion |
| `/reward` | Animal collection |
| `/about` | Project info & data viz |
| `/privacy`, `/terms` | Legal pages |

---

## Target Users

ADHD workers in Australia who experience difficulties managing day-to-day workplace tasks, particularly when dealing with:

- Unclear instructions
- Competing priorities
- Distractions
- Overwhelming workloads

These challenges can affect their ability to start tasks, maintain focus, stay organised, and complete work confidently, which may negatively impact both work performance and emotional well-being.

---

## Related Documentation

- [aiTool/README.md](aiTool/README.md) — AI pipeline, scoring model, API testing
- [aiTool/FRONTEND_INTEGRATION.md](aiTool/FRONTEND_INTEGRATION.md) — Connecting the Vue app to the API

---

## Future Improvements

- Deeper emotional support integrations
- Progress reward visualisation enhancements
- Focus awareness check-ins
- Expanded workplace templates and export flows
