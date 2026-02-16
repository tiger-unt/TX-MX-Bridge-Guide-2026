# Texas-Mexico Border Crossings Guide — Web App Overview

## What This App Does

This web application is an interactive guide to all 34 operational Texas-Mexico border crossings across 12 ports of entry. It replaces the previous ArcGIS StoryMap workflow with a modern, data-driven website where all content lives in simple, editable files — no web development expertise required to maintain.

**Live prototype links:**

| Page | URL |
|------|-----|
| **Homepage** | https://tiger-unt.github.io/TX-MX-Bridge-Guide-2026/app/index.html |
| **Bridge page** (Paso del Norte) | https://tiger-unt.github.io/TX-MX-Bridge-Guide-2026/app/ELP-ELP-PASO.html |

---

## The Core Idea: Two Types of Content, Two Simple Formats

The website has two fundamentally different kinds of content, and each one is managed in the format best suited to it:

| | Narrative Content | Structured Data |
|---|---|---|
| **What it is** | Paragraphs, descriptions, statistics, regional overviews — the "story" of the border | Bridge names, toll rates, hours of operation, inspection lanes — the "facts" for each crossing |
| **Where it lives** | **Markdown files** — plain text documents that anyone can read and edit | **CSV spreadsheets** — rows and columns that open directly in Excel |
| **Which pages use it** | Homepage, region overview pages | Individual bridge pages, PDF fact sheets |
| **Example** | The homepage's introduction, trade trend narratives, region descriptions | Paso del Norte's toll rates, operating hours, ownership details |

This separation is intentional. Narrative content reads naturally as a text document. Structured data fits naturally into spreadsheet rows and columns. By storing each type in its native format, we make content updates as intuitive as possible for the people who manage the data.

### Markdown: For Narrative Content

The homepage content lives in a single text file (`home-content-eng.md`). It's written in Markdown — a lightweight format that's readable as plain text but renders as formatted content on the website. Here's what part of the file actually looks like:

```
## Trade Trends (2014–2024)

The Texas-Mexico international bridges and border crossings serve as
important gateways in facilitating trade.

- +71% | Truck trade value increase
- +41% | Rail trade value increase
- $5.4B | Trade via pipeline (2024)
```

You can read it, understand it, and edit it without any special tools. The website reads this file and displays it with proper formatting, layout, and styling. To update a statistic or rewrite a paragraph, you edit the text file — the website picks up the change automatically.

### CSV Spreadsheets: For Structured Crossing Data

All bridge-specific information lives in three CSV files — essentially Excel spreadsheets:

| File | What It Contains |
|------|-----------------|
| **border-info-eng.csv** | General bridge info — names, location, ownership, highway connections, descriptions |
| **modes-info.csv** | Operational details — travel modes, inspection lanes, hours of operation |
| **modes-tolls.csv** | Toll rates — southbound (USD) and northbound (MXN) by vehicle type |

Every row is linked by a **Bridge-ID** (e.g., `ELP-ELP-PASO` for the Paso del Norte Bridge). This ID is how the website knows which bridge data to pull from across all three files. The same three spreadsheets feed every bridge page and every PDF fact sheet on the entire website.

---

## Why This Approach Matters

The previous workflow required multiple rounds of back-and-forth between content authors and the web developer — every text change, every updated toll rate, every new statistic meant someone had to manually edit a StoryMap or a PDF. Content was duplicated across several files and formats, leading to inconsistencies.

With this approach:

> **Content authors edit spreadsheets and text files directly. The website and PDFs read those files and display the current information automatically. One source of data, no duplication, no middleman for routine updates.**

For example, if toll rates change at a crossing:
1. Open `modes-tolls.csv` in Excel
2. Update the toll amount
3. Save and upload the file
4. Both the website and the PDF fact sheet now show the new rate

The people maintaining the data work in formats they already know — Excel and text documents. No code changes needed.

---

## What the Prototype Demonstrates

The prototype includes two working pages that prove out both halves of the content strategy:

### Homepage (Markdown-Driven)

The homepage demonstrates how narrative content can be authored in a simple text file and rendered as a fully styled web page. The current content is **draft placeholder** — it's there to showcase the capability, not as final copy. The text, statistics, images, and layout will all be refined as the project progresses.

What the demo shows:

- Border overview with statistics, region cards with photos, an interactive ArcGIS map, trade and crossing volume data, trend summaries, and a Quick Facts download link
- Every piece of text and every number on the page comes from the markdown file — nothing is hardcoded into the website
- To change any content, you edit the text file; the website reflects the update automatically

### Bridge Page (CSV-Driven)

The Paso del Norte Bridge page reads its content from the three CSV spreadsheets and renders all sections dynamically:

- Bridge names (English and Spanish), location, description, and map
- Ownership and operations (U.S. and Mexico)
- Highway connections on both sides of the border
- Hours of operation and inspection lanes (CBP and ADUANAS schedules)
- Toll rates by mode and vehicle type
- Data visualizations and photo gallery
- "Download Fact Sheet" button that generates a 3-page print-ready PDF

Every piece of data on this page comes from the CSV files — the same template will work for all 34 crossings by simply changing the Bridge-ID.

### PDF Fact Sheets

Each bridge page includes a **"Download Fact Sheet"** button that generates a **3-page, landscape-format PDF**:

- **Page 1:** Bridge overview — title, location, description, regional and local maps
- **Page 2:** Operational details — highway connections, inspection facilities, hours, tolls
- **Page 3:** Data visualizations (charts) and photo gallery

The PDF reads from the same CSV files as the web page — update the data once, both outputs reflect the change.

---

## Design and Branding

A custom design system ensures consistent TxDOT branding across all pages:

- TxDOT brand colors and IBM Plex Sans typography
- Responsive layout that works on desktop, tablet, and mobile
- Print-optimized stylesheets for PDF generation
- Accessibility compliance — screen reader support, keyboard navigation, proper contrast ratios

---