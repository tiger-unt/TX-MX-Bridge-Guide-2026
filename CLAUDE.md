# Texas-Mexico Border Crossings Website

Automated website + PDF generation system for the TxDOT Texas-Mexico international border crossings guide. Replaces manual ArcGIS StoryMap workflow with a single source of truth approach.

## Project Structure

| Folder | Purpose |
|--------|---------|
| `Data/` | Source of truth — 3 CSV data tables + `metadata/` dictionaries + markdown content files (`home-content-eng.md`) |
| `Project_Plan/` | Development plan, process diagrams, planning docs |
| `Ref_Storymaps/` | Reference StoryMap content and comparison analysis |
| `assets/` | Images (`images/`), logos (`Logos/`), transition images (`Transition-Images/`), mode icons (`icons/`), per-crossing photos (`{Bridge-ID}/`) |
| `page-previews/` | Homepage template, CSS design system, client-side JS |
| `app/` | Dynamic bridge pages, CSV data loader, PDF factsheet templates |
| `build-plans/` | Implementation plans and notes for features in progress |

## Tech Stack

- **Frontend:** HTML5, CSS3, vanilla JavaScript (no frameworks)
- **Fonts:** IBM Plex Sans (Google Fonts)
- **Maps:** ArcGIS Online (AGOL) Experience Builder iframes
- **Dev Server:** Python HTTP server on port 8080 (`open-preview.ps1`, `open-bridge-preview.ps1`)
- **Deployment:** GitHub Pages
- **PDF:** Print CSS + automated generation (planned)
- **Build System:** Node.js (planned, not yet implemented)

## Architecture

### Three-Tier Data Management
1. **AGOL Web Map** — interactive map display, edited in portal, instant updates
2. **CSV Data** (`Data/`) — normalized crossing data across 3 tables joined by `Bridge-ID`, generates pages + PDFs
3. **Markdown files** (`Data/`) — long-form narrative content for homepage and region overviews, parsed client-side by `md-utils.js`

### Data Tables
All tables use `Bridge-ID` as the primary key (format: `{DISTRICT}-{POE}-{BRIDGE}`, e.g., `ELP-ELP-PASO`).

| File | Granularity | Columns | Description |
|------|------------|---------|-------------|
| `border-info-eng.csv` | 1 row per crossing (35 total) | 25 | Bridge details: names (ENG/ESP), ownership, operators, location, access roads, highway connections, inspection facilities, descriptions, "Did You Know" facts |
| `modes-info.csv` | 1 row per crossing × mode | 12 | Operational data: inspection lanes, hours of operation (CBP & ADUANAS), UPC status, sources & reference links |
| `modes-tolls.csv` | 1 row per crossing × mode × toll tier | 11 | Toll rates: southbound (USD) & northbound (MXN) by axle count, sources & reference links |

### Data Dictionaries (`Data/metadata/`)
| File | Purpose |
|------|---------|
| `crossings-dict.csv` | Lookup: crossing name → 4-char B-CODE → full Bridge-ID (35 crossings) |
| `border-info-eng-column-dict.csv` | Column descriptions for `border-info-eng.csv` |
| `modes-info-column-dict.csv` | Column descriptions for `modes-info.csv` |
| `modes-tolls-column-dict.csv` | Column descriptions for `modes-tolls.csv` |
| `ports-of-entry-dict.csv` | Lookup: POE name → 3-char code (13 ports of entry) |
| `TxDOT-districts-dict.csv` | Lookup: district name → 3-char code (3 districts: ELP, LRD, RGV) |

### Content Regions
- **El Paso** — 4 ports of entry, 10 crossings
- **Laredo** — 3 ports of entry, 10 crossings
- **Rio Grande Valley** — 5 ports of entry, 14 crossings

### Homepage Architecture (Markdown-Driven)
The homepage (`app/index.html`) uses a markdown-driven pattern parallel to the CSV-driven bridge pages:
1. Content authored in `Data/home-content-eng.md` using structured markdown (sections, stat blocks, region cards, trend cards)
2. `md-utils.js` parses frontmatter, sections, stats, cards, images, and links
3. `home-loader.js` fetches the MD file, parses it, and populates empty DOM containers by ID
4. Images use standard markdown `![alt](path)` and links use `[text](url)` — visible in any Markdown viewer
5. Structured data uses HTML-comment markers (`<!-- stats -->`, `<!-- region: id -->`, `<!-- trend-card: type -->`, `<!-- source -->`)
6. Authoring guide: `build-plans/MARKDOWN-CONTENT-SKILL.md`

## CSS Architecture

**Design system** in `page-previews/css/`:
- `variables.css` — CSS custom properties (colors, typography, spacing, shadows)
- `base.css` — global reset and foundational styles
- `layout.css` — grid system, containers, sections, responsive layouts
- `components.css` — UI components (buttons, cards, nav, forms)
- `print.css` — print and PDF-specific styles

**App pages** in `app/css/`:
- `home.css` — homepage-specific styles (loading transition, section descriptions, trend cards)
- `bridge.css` — styles for dynamic individual crossing pages

**PDF templates** in `app/pdf-templates/css/`:
- `factsheet.css` — styles for PDF factsheet output

### TxDOT Brand Colors
- Primary Blue: `#0056a9`
- Primary Dark: `#002e69`
- Accent Red: `#d90d0d`
- Text Dark: `#333f48`
- Background Light: `#dadee5`

### Breakpoints
- sm: 640px, md: 768px, lg: 1024px, xl: 1280px, 2xl: 1536px

## Conventions

### Code Style
- **CSS:** BEM notation (`.site-header__title`, `.main-nav__item--active`)
- **HTML classes:** kebab-case with semantic meaning
- **JS functions:** camelCase, `init` prefix for initialization (`initLanguageDropdown`)
- **No external JS dependencies** — vanilla JavaScript only

### Accessibility (Required)
- ARIA labels and roles on all interactive elements
- Semantic HTML (`nav`, `main`, `section`, `article`, `footer`)
- Keyboard navigation (Tab, Enter, Space, Arrow keys, Escape)
- Focus-visible outlines
- WCAG color contrast compliance
- `lang` attribute on `<html>`

### Bilingual Content (Required)
- All crossing data must have English and Spanish versions
- Separate HTML files for each language (e.g., `index.html` / `index-es.html`)
- Language switcher in utility bar
- PDF layouts must accommodate different text lengths

## Key Files

### Homepage
- `app/index.html` — dynamic homepage (loads content from markdown at runtime)
- `app/js/home-loader.js` — fetches markdown, parses sections, populates DOM
- `app/js/md-utils.js` — shared markdown parsing utilities (frontmatter, sections, stats, cards, images, links)
- `app/css/home.css` — homepage-specific styles
- `Data/home-content-eng.md` — English homepage content (single source of truth)
- `build-plans/MARKDOWN-CONTENT-SKILL.md` — authoring guide for structured markdown format
- `page-previews/home-preview.html` — original static homepage preview (reference only)
- `page-previews/js/main.js` — client-side JS (language dropdown, mobile nav, scroll animations, data viz tabs)

### Bridge Pages (`app/`)
- `app/ELP-ELP-PASO.html` — first working bridge page (template for all crossings)
- `app/js/bridge-loader.js` — loads CSV data and renders bridge page content dynamically
- `app/js/csv-utils.js` — CSV parsing and data manipulation utilities
- `app/css/bridge.css` — bridge page styles
- `app/pdf-templates/bridge-factsheet.html` — PDF factsheet template
- `app/pdf-templates/css/factsheet.css` — PDF factsheet styles

### Data
- `Data/border-info-eng.csv` — main crossing data (1 row per crossing, 25 columns)
- `Data/modes-info.csv` — per-mode operational data (inspection lanes, hours of operation)
- `Data/modes-tolls.csv` — per-mode toll rates (southbound USD, northbound MXN)
- `Data/metadata/` — data dictionaries and lookup tables for Bridge-ID, POE, and district codes

### Planning & Config
- `Project_Plan/WEBSITE_DEVELOPMENT_PLAN.md` — full development plan and timeline
- `open-preview.ps1` — PowerShell script to launch dev server for homepage
- `open-bridge-preview.ps1` — PowerShell script to launch dev server for bridge pages

## Development Workflow

### Preview locally
- **Homepage:** `py -m http.server 8080` from project root → `http://localhost:8080/app/index.html`
- **Homepage (static preview):** Run `open-preview.ps1` → opens `http://localhost:8080/page-previews/home-preview.html`
- **Bridge pages:** Run `open-bridge-preview.ps1` → opens `http://localhost:8080/app/ELP-ELP-PASO.html`
- Dev server uses Python HTTP server on port 8080.

### Content updates
- **AGOL Map:** Edit in ArcGIS portal → Save → instant update
- **CSV Data:** Edit CSVs in `Data/` → Run build → Deploy to GitHub Pages
- **Homepage content:** Edit `Data/home-content-eng.md` → refresh browser → instant update (client-side parsing)

## Important Notes

- Target launch: Early August 2026
- Container max-width: 1280px
- PDF fact sheets: 2-3 page format, pixel-perfect layout required
- Single AGOL map reused across 3 region pages with different zoom/center
- No CSS frameworks — custom design system matching TxDOT brand
