# Plan: Add PDF Download Button to Bridge Pages

## Context

The project's development plan (`Project_Plan/WEBSITE_DEVELOPMENT_PLAN.md`) lists "PDF download option" and "PDF fact sheets (2-3 pages)" as planned features, but no implementation exists yet. We need a **Download PDF** button on each bridge page (starting with `app/ELP-ELP-PASO.html`) that produces a **letter-size** (8.5" x 11") PDF matching the style of the reference PDF — a 3-page magazine-style fact sheet with TxDOT branding.

**Reference PDF:** `Ref_Storymaps/ELP_ENG/Paso_Del_Norte_Bridge.pdf` — 3-page fact sheet with:
- Page 1: Large hero with bridge name (EN/ES), two maps, location, alternate names, description
- Page 2: 3-column layout — highways/facilities/lanes, hours, toll table, "Did You Know?" callout + bridge photo
- Page 3: Data visualization charts + photo gallery

## Approach

Use `window.print()` with bridge-specific print CSS. The browser's "Save as PDF" produces a letter-size PDF. No external JS libraries needed. The existing `print.css` already sets `@page { size: letter; margin: 0.75in; }`.

Later, when the Node.js build system is implemented, this can be swapped for pre-generated static PDFs with zero HTML changes.

---

## Files Modified

| File | Change |
|------|--------|
| `app/ELP-ELP-PASO.html` | Add download button, print-only header/footer, link to `print.css` |
| `app/css/bridge.css` | Add `.bridge-hero__actions` screen styles, `@media print` block (~100 lines), `.no-screen` utility |
| `app/js/bridge-loader.js` | Add `initDownloadButton()` function (~8 lines), call it after data loads |

**Reference files (read-only):**
- `page-previews/css/print.css` — existing print foundation (letter size, hides nav/footer/buttons)
- `page-previews/css/base.css` — `.btn` / `.btn--secondary` styles reused

---

## Implementation Details

### Step 1: Link `print.css` from Bridge Page

In `app/ELP-ELP-PASO.html` `<head>`, after the `bridge.css` link, added:

```html
<link rel="stylesheet" href="../page-previews/css/print.css" media="print">
```

The `media="print"` attribute ensures this stylesheet only loads during printing.

### Step 2: Download Button in Hero Section

Added after `.bridge-hero__meta` div:

```html
<div class="bridge-hero__actions">
    <button type="button"
            class="btn btn--secondary btn--sm bridge-hero__download"
            id="download-pdf-btn"
            aria-label="Download fact sheet for Paso del Norte Bridge as PDF">
        <svg> ... download icon ... </svg>
        Download Fact Sheet (PDF)
    </button>
</div>
```

The existing `print.css` hides `.btn` elements, so this auto-hides in PDF output.

### Step 3: Print-Only Header and Footer

- **Header:** TxDOT logo + "Texas-Mexico Border Crossings Guide" title (hidden on screen via `.no-screen`)
- **Footer:** "Texas Department of Transportation | txdot.gov | 2026 Texas-Mexico Border Crossings Guide"

Both use `aria-hidden="true"` since they are decorative in print context.

### Step 4: Bridge-Specific Print CSS

Added `@media print` block to `bridge.css` with:
- **Brand color overrides** — selectively override `print.css` global `* { color: #000; background: transparent }` for hero, callout, badges, and table headers
- **`print-color-adjust: exact`** — ensures browsers render background colors in PDF
- **Page breaks** — `page-break-before: always` on charts grid for clean 3-page structure
- **Layout preservation** — 2-column hero grid, 2-column details grid, 2x2 gallery
- **Hidden elements** — download button, breadcrumb, page loader

### Step 5: JavaScript Click Handler

Simple `initDownloadButton()` in `bridge-loader.js` that calls `window.print()`. Called after CSV data loads and content is visible.

---

## PDF Output Structure (Letter Size, 8.5" x 11")

```
┌─ Page 1 ──────────────────────────────┐
│ [TxDOT Logo]  TX-MX Border Guide      │
│ ─────────────────────────────────────  │
│ Bridge Name (EN)        [Map Image]    │
│ Bridge Name (ES)                       │
│ [District] [Type]                      │
│ Location, Alternate Names              │
│ Description                            │
│ Bridge Opened                          │
├─ Page 2 ──────────────────────────────┤
│ ┌───────────────┬─────────────────┐   │
│ │ Ownership &   │ Connection to   │   │
│ │ Operations    │ Major Highways  │   │
│ ├───────────────┼─────────────────┤   │
│ │ Hours of Op.  │ Inspection      │   │
│ │ & Lanes Table │ Facilities      │   │
│ └───────────────┴─────────────────┘   │
│ ┌─────────────────────────────────┐   │
│ │     "Did You Know?" Callout     │   │
│ └─────────────────────────────────┘   │
│         Toll Rates Table              │
├─ Page 3 ──────────────────────────────┤
│ ┌─────────────┬───────────────────┐   │
│ │ Donut Chart │ Trend Chart       │   │
│ └─────────────┴───────────────────┘   │
│ ┌───────┬───────┐                     │
│ │ Photo │ Photo │                     │
│ ├───────┼───────┤                     │
│ │ Photo │ Photo │                     │
│ └───────┴───────┘                     │
│ ─────────────────────────────────────  │
│ TxDOT | txdot.gov | 2026 Guide        │
└───────────────────────────────────────┘
```

## Verification

1. Open `http://localhost:8080/app/ELP-ELP-PASO.html` via the dev server
2. Confirm download button appears in hero section
3. Click button → browser print dialog opens
4. Chrome → "Save as PDF" → verify letter-size output with 3 pages
5. Verify TxDOT branding (blue hero, callout, table headers) preserved in PDF
6. Verify no nav, footer, breadcrumb, or download button in PDF
7. Keyboard test: Tab → Enter triggers print dialog
8. No visual regressions on screen layout

## Scalability

This pattern scales to all 35 bridge pages because:
- Button HTML uses generic `id="download-pdf-btn"` — same across all pages
- Print CSS lives in shared `bridge.css`
- JS handler lives in shared `bridge-loader.js`
- When build system generates static PDFs, the handler can be upgraded without HTML changes
