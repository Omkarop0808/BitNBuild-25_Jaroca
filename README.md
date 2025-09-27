# Review Radar

**TL;DR:** Review Radar ingests a product URL (start with Amazon), scrapes customer reviews and price, runs sentiment & keyword analysis, and displays a concise dashboard: sentiment breakdown, top praise / complaints, representative snippets, and the current price. Built as a hackathon-ready MVP with clear upgrade paths.

---

## Table of Contents

* [Project Overview](#project-overview)
* [Key Features](#key-features)
* [MVP Scope (Hackathon)](#mvp-scope-hackathon)
* [Stretch / Wow Features](#stretch--wow-features)
* [Tech Stack](#tech-stack)
* [Architecture & Data Flow](#architecture--data-flow)
* [Installation & Local Setup](#installation--local-setup)
* [API Endpoints](#api-endpoints)
* [Frontend Usage](#frontend-usage)
* [Demo Script (30–60s)](#demo-script-30%E2%80%9360s)
* [Concrete Task Checklist (Team Roles)](#concrete-task-checklist-team-roles)
* [Risks & Mitigations](#risks--mitigations)
* [Contributing](#contributing)
* [License](#license)

---

## Project Overview

Review Radar helps shoppers quickly understand the collective opinion about a product without reading hundreds of reviews. For hackathon MVP, we target **Amazon product pages**: user pastes a product URL → backend scrapes reviews + price → runs sentiment classification and keyword extraction → frontend renders a concise, actionable dashboard.

---

## Key Features

1. **URL-Based Web Scraper** — Load the product page, extract review text + metadata (reviewer, rating, date) and product title/price.
2. **Pre-trained Sentiment Classifier** — Label each review as **positive / neutral / negative** using a pre-trained Hugging Face model.
3. **Keyword & Topic Extraction** — TF-IDF or BERTopic to extract top positive / negative keywords.
4. **Simple Summary Dashboard** — Sentiment pie chart, top keywords (praise & complaints), representative snippets, and current price.
5. **Export** — Download analysis as CSV (MVP optional).

---

## MVP Scope (Hackathon)

* Input: single Amazon product URL.
* Backend: scraper + sentiment API.
* Analysis: sentiment labels + top 5 positive + top 5 negative keywords.
* Frontend: React dashboard with pie chart, keyword lists, and price display.
* Demo: one-click analyze for a prepared product URL.

---

## Stretch / Wow Features (post-MVP)

* Aspect-Based Sentiment (feature-level sentiment: battery, camera, etc.)
* Multi-platform aggregation (Flipkart, eBay, Myntra)
* Price history (store periodically — Keepa-style visualization)
* Reviewer credibility / verified purchase filter
* Real-time alerts for sudden negative sentiment spikes or price drops
* Browser extension for in-context pop-up summaries
* Natural language one-line summary via an LLM

---

## Tech Stack (recommended)

* **Frontend:** React or Next.js, Chart.js or Recharts
* **Backend:** Python + FastAPI (or Flask)
* **Scraping:** `requests` + `BeautifulSoup` for static pages, `Selenium` or `Playwright` for dynamic content
* **NLP:** Hugging Face Transformers (`distilbert-base-uncased-finetuned-sst-2-english`) or VADER for quick demos
* **Keyword Extraction:** scikit-learn `TfidfVectorizer` or `BERTopic`
* **DB (optional):** SQLite (MVP), MongoDB/Postgres for scaling
* **Hosting:** Vercel (frontend), Render/Heroku (backend)
* **Browser Extension:** Chrome Extension (Manifest v3) hitting backend API

---

## Architecture & Data Flow

1. **Frontend** — Accepts product URL → calls backend `/analyze` API.
2. **Backend (Scraper)** — Loads URL, handles dynamic loading/pagination, extracts reviews, product title, and price.
3. **Cleaner** — Normalize text (strip HTML, emojis, duplicates), prepare corpus.
4. **Analyzer** — Run sentiment model on each review; run TF-IDF per sentiment bucket to extract keywords.
5. **Storage (optional)** — Persist reviews and price into DB for history.
6. **Response** — Send results to frontend for visualization.

---

## Installation & Local Setup

> These steps assume the repository contains two folders: `/backend` and `/frontend`.

### Prerequisites

* Node.js (16+)
* Python 3.9+
* Chrome (for Selenium demo) if using Selenium

### Backend (Python + FastAPI) - Quickstart

```bash
# from project root
cd backend
python -m venv .venv
source .venv/bin/activate     # macOS / Linux
.venv\Scripts\activate      # Windows (PowerShell)

pip install -r requirements.txt
# example requirements: fastapi, uvicorn, beautifulsoup4, requests, selenium, transformers, torch, scikit-learn, pandas

# run dev server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend (React) - Quickstart

```bash
cd frontend
npm install
npm run dev    # or `npm start` depending on template
# open http://localhost:3000 (or shown host)
```

---

## API Endpoints (example)

### POST `/analyze`

Request body (JSON):

```json
{ "url": "https://www.amazon.in/dp/PRODUCT_ID" }
```

Response (JSON):

```json
{
  "product": {
    "title": "Example Product",
    "price": "₹12,999",
    "url": "https://..."
  },
  "counts": { "positive": 170, "neutral": 20, "negative": 10 },
  "sentiment_percent": { "positive": 85, "neutral": 10, "negative": 5 },
  "top_keywords": {
    "positive": ["battery", "display", "value"],
    "negative": ["heat", "battery life", "network"]
  },
  "sample_snippets": {
    "positive": ["Amazing battery life!"],
    "negative": ["Heats up after 10 mins"]
  }
}
```

> **Note:** For hackathon demo, consider preparing a cached/saved JSON response for the chosen product so the demo is reliable if scraping is flaky.

---

## Frontend Usage

1. Open the app.
2. Paste the prepared Amazon product URL into the input box.
3. Click **Analyze** — watch the spinner while backend processes.
4. Results: Sentiment pie chart, price, top positive/negative keywords, and representative snippets.
5. Optional: Click **Export CSV** to download results.

---

## Demo Script (30–60 seconds)

1. “Paste an Amazon product URL — I’ll show why people love or hate it.”
2. Paste the prepared URL → click **Analyze**.
3. Show the **Opinion Mix** pie (e.g., 85% positive).
4. Point to **Top Complaints**: e.g., battery, overheating; highlight a snippet: “Phone broiled after 2 weeks.”
5. End: “This tells product teams what to fix and shoppers what to expect — all in <30s.”

---

## Concrete Task Checklist (Team Roles)

* **Scraper (1 person)**: Build Amazon scraper (100–200 reviews), handle lazy loading.
* **NLP (1 person)**: Integrate sentiment model, TF-IDF, prepare summary JSON.
* **Frontend (1–2 people)**: URL input UI, spinner, pie chart, keyword lists, CSV export.
* **Integrator / QA (all)**: Wire API endpoints, test, prepare demo fallback.

---

## Risks & Mitigations

* **Scraper blocked by anti-bot protections**: Use small delays, rotate user agents, limit scraping for demo; pre-cache results for fallback.
* **Model latency / memory**: Use distilled models or run inference server-side; batch requests.
* **Data mismatches when scaling platforms**: MVP focuses on single site; later use UPC/ASIN/SKU or fuzzy-match algorithms.
* **Legal/ethical scraping issues**: Respect robots.txt, use data responsibly and cite sources in any external release.

---

## Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/<your-feature>`
3. Implement & test
4. Open a PR with a clear description and demo steps

---

## License

This project is provided for hackathon/demo purposes. Choose an appropriate license before open-sourcing. (e.g., MIT)

---

## Contact / Notes

* Demo fallback: Keep a cached `sample_result.json` for the product you will demo.
* Want me to generate the exact `FastAPI` `main.py` skeleton and a React `Analyze` component? Reply: **yes generate code** and I’ll drop copy-paste-ready files.

Good luck — go win that hackathon. 🎯
