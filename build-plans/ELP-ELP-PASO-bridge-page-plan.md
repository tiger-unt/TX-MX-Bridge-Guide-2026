# Plan: Build Bridge Page for ELP-ELP-PASO (Paso del Norte Bridge)

## Context

We need to create the first individual bridge crossing webpage for **Paso del Norte Bridge** (Bridge-ID: `ELP-ELP-PASO`). This page will serve as the template/pattern for all 34 bridge pages. All content must come from CSV files (not the PDF), and the page must auto-update when CSVs change. The reference PDF (Presidio-Ojinaga) defines the *layout/sections* to replicate, not the content.

---

## Step 1: Data Mapping — CSV to Page Sections

### Section 1: Hero Header + Bridge Overview
| Page Element | CSV File | Column(s) | ELP-ELP-PASO Value |
|---|---|---|---|
| Bridge Name (EN) | `border-info-eng.csv` | `Bridge-ENG` | Paso del Norte Bridge |
| Bridge Name (ES) | `border-info-eng.csv` | `Bridge-ESP` | Puente Santa Fe |
| District | `border-info-eng.csv` | `District` | El Paso |
| Port of Entry | `border-info-eng.csv` | `POE` | El Paso |
| Location | `border-info-eng.csv` | `Location` | El Paso, El Paso County, TX – Ciudad Juárez, Chihuahua, MX |
| Alternate Names | `border-info-eng.csv` | `AlternateNames` | Santa Fe Street Bridge, Puente Benito Juárez, etc. |
| Type/Status | `border-info-eng.csv` | `Type-Status` | Highway Crossing |
| Description | `border-info-eng.csv` | `Description` | Full paragraph about bridge history |
| Bridge Opened | `border-info-eng.csv` | `BridgeOpened` | Current bridge opened in 1967 |
| Map Image | **Static asset** | — | `assets/ELP-ELP-PASO/ELP-ELP-PASO_map.png` |

### Section 2: Ownership & Operations
| Page Element | CSV File | Column(s) |
|---|---|---|
| US Owner | `border-info-eng.csv` | `US-Owner` |
| US Operator | `border-info-eng.csv` | `US-Operator` |
| Mexico Owner | `border-info-eng.csv` | `MexicanOwner` |
| Mexico Operator | `border-info-eng.csv` | `MexicanOperator` |

### Section 3: Connection to Major Highways
| Page Element | CSV File | Column(s) |
|---|---|---|
| Port Access Road TX | `border-info-eng.csv` | `PortAccess-or-Egress Road-TX` |
| Port Access Road MX | `border-info-eng.csv` | `PortAccess-or-Egress-Road-MX` |
| Highway Connection US | `border-info-eng.csv` | `Connection-to-Major-Highways-US` |
| Highway Connection MX | `border-info-eng.csv` | `Connection-to-Major Highways-MX` |

### Section 4: Hours of Operation & Inspection Lanes
| Page Element | CSV File | Column(s) |
|---|---|---|
| Mode | `modes-info.csv` | `Modes` |
| Inspection Lanes count | `modes-info.csv` | `InspectionLanes` |
| Lane Notes | `modes-info.csv` | `InspectionLaneNotes` |
| Hours (CBP) | `modes-info.csv` | `Hours-of-Operation--CBP-Facilities` |
| Hours (ADUANAS) | `modes-info.csv` | `Hours-of-Operation--ADUANAS-Facilities` |
| As-of date | `modes-info.csv` | `HOO-As-of` |

**ELP-ELP-PASO has 2 mode rows:**
- Pedestrians/Bicyclists — 14 lanes, 24/7
- Passenger Vehicles — 12 lanes, 24/7 (note: CSV shows "27/7" which is likely a typo)

### Section 5: Inspection Facilities
| Page Element | CSV File | Column(s) |
|---|---|---|
| Facility description | `border-info-eng.csv` | `InspectionFacility-BorderStation` |

### Section 6: Toll Rates Table
| Page Element | CSV File | Column(s) |
|---|---|---|
| Mode | `modes-tolls.csv` | `Modes` |
| SB Axles | `modes-tolls.csv` | `AxlesSouthbound` |
| SB Tolls | `modes-tolls.csv` | `SouthboundTolls` |
| NB Axles | `modes-tolls.csv` | `AxlesNorthbound` |
| NB Tolls | `modes-tolls.csv` | `NorthboundTolls` |
| As-of date | `modes-tolls.csv` | `TollsAsOf` |
| Source | `modes-tolls.csv` | `Sources` |

**ELP-ELP-PASO toll rows:**
- Pedestrian/Bicycle: SB $0.50, NB MX$6.00
- Motorcycle: SB "No southbound vehicle crossings permitted", NB MX$20.00
- Passenger Vehicle (2 axles): SB "No southbound vehicle crossings permitted", NB MX$39.00
- Passenger Vehicle (per additional axle): NB MX$19.00
- Bus (2-4 axles): SB "No southbound vehicle crossings permitted", NB MX$67.00

### Section 7: "Did You Know?" Callout
| Page Element | CSV File | Column(s) |
|---|---|---|
| Fun fact | `border-info-eng.csv` | `DidYouKnow` |

**Value:** "Paso del Norte Bridge had 3.5 million northbound pedestrian crossings in 2024—the most at any Texas-Mexico border crossing."

### Section 8: Data Visualizations (Chart Images)
| Page Element | Source | File |
|---|---|---|
| 2024 Crossings by Mode (donut chart) | Static asset | `assets/ELP-ELP-PASO/ELP-ELP-PASO_chart_1.png` |
| Crossings 2014-2024 (trend chart) | Static asset | `assets/ELP-ELP-PASO/ELP-ELP-PASO_chart_2.png` |

### Section 9: Photo Gallery
| Image | File | Description |
|---|---|---|
| Photo 1 | `assets/ELP-ELP-PASO/ELP-ELP-PASO_1.JPG` | Red X sculpture near bridge |
| Photo 2 | `assets/ELP-ELP-PASO/ELP-ELP-PASO_2.png` | Aerial view of bridge with traffic |
| Photo 3 | `assets/ELP-ELP-PASO/ELP-ELP-PASO_3.JPG` | Port of entry building |
| Photo 5 | `assets/ELP-ELP-PASO/ELP-ELP-PASO_5.jpg` | Panoramic bridge view with flags |

---

## Step 2: Data Gaps Identified

| Gap | Detail | Impact |
|---|---|---|
| No Bus/Commercial Truck rows in `modes-info.csv` | Only Pedestrians + Passenger Vehicles have hours/lanes data | Hours of Operation and Inspection Lanes sections will only show 2 modes. Tolls section has bus rates but no corresponding hours/lanes. |
| No Motorcycle in `modes-info.csv` | Motorcycle tolls exist but no lane/hours data | Toll table will show motorcycle rates; hours table won't list motorcycle separately. |
| Crossing volume numbers not in CSV | The donut chart values (3,536,801 pedestrians; 2,681,194 vehicles; 4,423 buses) exist only in the chart images | Charts will be displayed as static images — this is fine since the assets provide them. |
| `modes-info.csv` shows "27/7" for Passenger Vehicles | Likely typo for "24/7" | Will display as-is from CSV (data source of truth). |

**No content will be pulled from the PDF. All gaps are documented above for your review.**

---

## Step 3: Implementation Plan

### Decisions (from user review)
- **Output folder:** `app/`
- **Data loading:** Client-side JS fetch (best for GitHub Pages — no build step needed; CSV updates auto-reflect on page reload)
- **Data gaps:** Show what's available; leave sections empty if no data exists in CSV

### 3.1 Files to Create

| File | Purpose |
|---|---|
| `app/ELP-ELP-PASO.html` | Bridge page (HTML template with data-field placeholders) |
| `app/css/bridge.css` | Bridge-page-specific styles (imports shared design system) |
| `app/js/bridge-loader.js` | Vanilla JS: fetch CSVs, parse, filter by Bridge-ID, populate DOM |

### 3.2 Page Layout (matching PDF design structure)

```
┌─────────────────────────────────────────────┐
│ Utility Bar (language switcher, contact)     │  ← Reuse from home-preview.html
├─────────────────────────────────────────────┤
│ Site Header (TxDOT logo + title)            │  ← Reuse
├─────────────────────────────────────────────┤
│ Main Nav (Home | El Paso | Laredo | RGV)    │  ← Reuse
├─────────────────────────────────────────────┤
│ Breadcrumb: Home > El Paso > Paso del Norte │
├─────────────────────────────────────────────┤
│ HERO SECTION                                │
│ ┌──────────────┬───────────────────────┐    │
│ │ Bridge Name  │    Map Image          │    │
│ │ (EN + ES)    │    (ELP-ELP-PASO_map) │    │
│ │ Location     │                       │    │
│ │ Alt Names    │                       │    │
│ │ Description  │                       │    │
│ └──────────────┴───────────────────────┘    │
├─────────────────────────────────────────────┤
│ BRIDGE DETAILS (2-column grid)              │
│ ┌─────────────────┬───────────────────┐     │
│ │ Connection to   │ Hours of          │     │
│ │ Major Highways  │ Operation table   │     │
│ │ (US + MX)       │ (by mode)         │     │
│ ├─────────────────┼───────────────────┤     │
│ │ Inspection      │ Inspection Lanes  │     │
│ │ Facilities      │ (by mode + count) │     │
│ └─────────────────┴───────────────────┘     │
├─────────────────────────────────────────────┤
│ "DID YOU KNOW?" Callout                     │
├─────────────────────────────────────────────┤
│ TOLL RATES TABLE                            │
│ (Southbound / Northbound by mode)           │
├─────────────────────────────────────────────┤
│ DATA VISUALIZATIONS                         │
│ ┌───────────────┬─────────────────────┐     │
│ │ Donut Chart   │ Trend Chart         │     │
│ │ (chart_1.png) │ (chart_2.png)       │     │
│ └───────────────┴─────────────────────┘     │
├─────────────────────────────────────────────┤
│ PHOTO GALLERY (2x2 grid)                    │
│ ┌─────────┬─────────┐                      │
│ │ Photo 1 │ Photo 2 │                      │
│ ├─────────┼─────────┤                      │
│ │ Photo 3 │ Photo 5 │                      │
│ └─────────┴─────────┘                      │
├─────────────────────────────────────────────┤
│ Footer                                      │  ← Reuse from home-preview.html
└─────────────────────────────────────────────┘
```

### 3.3 Dynamic CSV Loading (Vanilla JS)

`bridge-loader.js` will:
1. Accept a `BRIDGE_ID` constant (set per page, e.g., `"ELP-ELP-PASO"`)
2. Fetch all 3 CSV files using `fetch()` with relative paths
3. Parse CSV with a lightweight built-in parser (no external libraries)
4. Filter rows by `Bridge-ID` column matching `BRIDGE_ID`
5. Populate DOM elements using `data-field` attributes (e.g., `<span data-field="Bridge-ENG"></span>`)
6. Build the Hours of Operation table from `modes-info.csv` rows
7. Build the Toll Rates table from `modes-tolls.csv` rows

This ensures: **when a CSV file is updated and the page reloads, the content updates automatically.**

### 3.4 Styling Approach

- Import the existing CSS design system (`variables.css`, `base.css`, `layout.css`, `components.css`)
- Create `bridge.css` for bridge-page-specific styles (hero layout, toll table, chart section, gallery)
- Reuse existing BEM component classes: `.breadcrumb`, `.section`, `.container`, `.grid`, `.stat-card`, etc.
- Match the TxDOT brand colors (blue `#0056a9`, dark `#002e69`, accent `#d90d0d`, text `#333f48`)

### 3.5 Accessibility

- Semantic HTML (`main`, `section`, `article`, `table`, `nav`)
- ARIA labels on all interactive elements
- `alt` text on all images
- Proper table headers with `scope` attributes
- Keyboard navigable
- `lang="en"` on `<html>`

---

## Step 4: Verification

After building, verify by:
1. Open `app/ELP-ELP-PASO.html` via the Python dev server (port 8080)
2. Confirm all sections populate from CSV data (not hardcoded)
3. Check that modifying a CSV value and reloading the page reflects the change
4. Validate responsive layout at mobile (640px), tablet (768px), and desktop (1280px)
5. Run accessibility check (semantic HTML, ARIA, alt text, keyboard nav)
6. Verify all 7 images load correctly

---

## Key Files to Modify/Create

| Action | File |
|---|---|
| **CREATE** | `app/ELP-ELP-PASO.html` |
| **CREATE** | `app/css/bridge.css` |
| **CREATE** | `app/js/bridge-loader.js` |
| **READ** (data source) | `Data/border-info-eng.csv` |
| **READ** (data source) | `Data/modes-info.csv` |
| **READ** (data source) | `Data/modes-tolls.csv` |
| **READ** (assets) | `assets/ELP-ELP-PASO/*.{jpg,png,JPG}` (7 files) |
| **REUSE** (styles) | `page-previews/css/variables.css`, `base.css`, `layout.css`, `components.css` |

## Why Client-Side JS for GitHub Pages

GitHub Pages serves only static files — no server-side processing. Client-side fetch means:
- Push updated CSV to repo → page auto-reflects changes on next reload
- No build script needed (build system is "planned, not yet implemented" per project plan)
- Same pattern as the existing AGOL iframe approach (load remote data at runtime)
- CSV files are served as static assets alongside the HTML
