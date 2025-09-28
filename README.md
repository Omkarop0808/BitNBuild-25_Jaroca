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

