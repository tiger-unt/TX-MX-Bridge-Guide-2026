# Texas-Mexico Border Crossings Website

Automated website + PDF generation system for the TxDOT Texas-Mexico international border crossings guide. Replaces manual ArcGIS StoryMap workflow with a single source of truth approach.

## Project Structure

| Folder | Purpose |
|--------|---------|
| `Data/` | CSV border crossing data (source of truth) — 3 data tables + `metadata/` dictionaries |
| `Project_Plan/` | Development plan, process diagrams, planning docs |
| `Ref_Storymaps/` | Reference StoryMap content and comparison analysis |
| `assets/` | Images (`images/`), logos (`Logos/`), transition images (`Transition-Images/`) |
| `page-previews/` | HTML page templates, CSS design system, client-side JS |

## Tech Stack

- **Frontend:** HTML5, CSS3, vanilla JavaScript (no frameworks)
- **Fonts:** IBM Plex Sans (Google Fonts)
- **Maps:** ArcGIS Online (AGOL) Experience Builder iframes
- **Dev Server:** Python HTTP server on port 8080 (`open-preview.ps1`)
- **Deployment:** GitHub Pages
- **PDF:** Print CSS + automated generation (planned)
- **Build System:** Node.js (planned, not yet implemented)

## Architecture

### Three-Tier Data Management
1. **AGOL Web Map** — interactive map display, edited in portal, instant updates
2. **CSV Data** (`Data/`) — normalized crossing data across 3 tables joined by `Bridge-ID`, generates pages + PDFs
3. **Markdown files** (planned) — long-form narrative content for region overviews

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

## CSS Architecture

Files in `page-previews/css/`:
- `variables.css` — CSS custom properties (colors, typography, spacing, shadows)
- `base.css` — global reset and foundational styles
- `layout.css` — grid system, containers, sections, responsive layouts
- `components.css` — UI components (buttons, cards, nav, forms)
- `print.css` — print and PDF-specific styles

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

- `page-previews/home-preview.html` — main homepage template (current working preview)
- `page-previews/js/main.js` — client-side JS (language dropdown, mobile nav, scroll animations, data viz tabs)
- `Data/border-info-eng.csv` — main crossing data (1 row per crossing, 25 columns)
- `Data/modes-info.csv` — per-mode operational data (inspection lanes, hours of operation)
- `Data/modes-tolls.csv` — per-mode toll rates (southbound USD, northbound MXN)
- `Data/metadata/` — data dictionaries and lookup tables for Bridge-ID, POE, and district codes
- `Project_Plan/WEBSITE_DEVELOPMENT_PLAN.md` — full development plan and timeline
- `Project_Plan/PROCESS_DIAGRAM.md` — architecture and workflow diagrams (Mermaid)
- `open-preview.ps1` — PowerShell script to launch dev server and open browser

## Development Workflow

### Preview locally
Run the VS Code task "Preview: Home Page" or execute `open-preview.ps1`. This starts a Python HTTP server on port 8080 and opens `http://localhost:8080/page-previews/home-preview.html`.

### Content updates
- **AGOL Map:** Edit in ArcGIS portal → Save → instant update
- **CSV Data:** Edit CSVs in `Data/` → Run build → Deploy to GitHub Pages

## Important Notes

- Target launch: Early August 2026
- Container max-width: 1280px
- PDF fact sheets: 2-3 page format, pixel-perfect layout required
- Single AGOL map reused across 3 region pages with different zoom/center
- No CSS frameworks — custom design system matching TxDOT brand
