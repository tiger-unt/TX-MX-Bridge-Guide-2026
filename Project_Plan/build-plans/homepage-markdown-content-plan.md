# Plan: Markdown-Driven Homepage in `app/`

## Context

The homepage preview (`page-previews/home-preview.html`) has all content hardcoded in HTML. This plan extracts that content into a structured markdown file (`Data/home-content-eng.md`) that serves as the single source of truth, then builds a dynamic homepage at `app/index.html` that loads and renders the markdown at runtime — matching the pattern used by bridge pages (CSV + `bridge-loader.js` + DOM).

## Files Created

| File | Purpose |
|------|---------|
| `Data/home-content-eng.md` | English homepage content (source of truth) |
| `app/index.html` | Homepage HTML template with empty containers |
| `app/js/md-utils.js` | Markdown parsing utilities (shared, reusable for future pages) |
| `app/js/home-loader.js` | Fetches MD, parses it, populates the DOM |
| `app/css/home.css` | Homepage-specific styles (extracted from inline) |
| `build-plans/MARKDOWN-CONTENT-SKILL.md` | Authoring guide for the MD content format |

## Architecture

### Data Flow

```
Data/home-content-eng.md  →  md-utils.js (parse)  →  home-loader.js (populate)  →  app/index.html (template)
```

### Separation of Concerns

- **Markdown file**: All editable prose, statistics, URLs, image paths, source citations
- **HTML template**: Structural chrome (nav, header, footer), empty containers with `id` attributes
- **home-loader.js**: Fetch + parse + DOM population logic
- **md-utils.js**: Reusable parsing functions (frontmatter, sections, stats, cards, inline rendering)

### What Goes Where

| Content | Location | Rationale |
|---------|----------|-----------|
| Hero title/subtitle | Markdown | Editable prose |
| Introduction paragraphs | Markdown | Editable prose |
| Stat cards (numbers + labels) | Markdown | Data that updates periodically |
| Region card details | Markdown | Structured content |
| Trade section text | Markdown | Rich prose with bold, lists |
| Map iframe URL | Markdown frontmatter | External URL |
| Quick Facts PDF URL | Markdown frontmatter | External URL |
| Image paths | Markdown frontmatter/cards | Asset references |
| Navigation dropdowns | HTML template | Structural chrome |
| Footer contact info | HTML template | Rarely changes |
| Utility bar / search | HTML template | Interactive components |

## Markdown Format

Uses `<!-- section: name -->` HTML-comment delimiters and `---` YAML-like frontmatter. See `MARKDOWN-CONTENT-SKILL.md` for the full authoring guide.

### Section ID Mapping

| MD Section | DOM Container IDs |
|-----------|-------------------|
| `hero` | `#hero-section`, `#hero-title`, `#hero-subtitle` |
| `intro` | `#intro-content` |
| `border-overview` | `#border-overview-prose`, `#border-overview-image`, `#border-overview-stats` |
| `regions` | `#regions-header`, `#regions-grid` |
| `map` | `#map-header`, `.map-embed__iframe[data-src]` |
| `trade-role` | `#trade-role-heading`, `#trade-role-content`, `#trade-role-image`, `#trade-role-source` |
| `trade-trends` | `#trade-trends-header`, `#trade-trends-stats`, `#trade-trends-source` |
| `crossings` | `#crossings-header`, `#crossings-stats`, `#crossings-extra`, `#crossings-source` |
| `crossing-trends` | `#crossing-trends-header`, `#crossing-trends-descriptive`, `#crossing-trends-metric`, `#crossing-trends-source` |
| `quick-facts` | `#quick-facts-content`, `#quick-facts-link` |

## JS Modules

### `md-utils.js` (attaches to `window.MDUtils`)

| Function | Returns | Purpose |
|----------|---------|---------|
| `parseFrontmatter(text)` | `{ meta: {}, body: "" }` | Extract YAML-like frontmatter |
| `parseSections(body)` | `[{ name, content }]` | Split body into named sections |
| `parseStats(content)` | `[{ value, label }]` | Extract `<!-- stats -->` blocks |
| `parseCards(content, prefix)` | `[{ id, ...fields }]` | Extract structured card data |
| `parseSource(content)` | `string or null` | Extract `<!-- source -->` citations |
| `renderInline(text)` | HTML string | Convert `**bold**`, `[link](url)`, `*italic*` |
| `renderBlock(content)` | DOM element array | Convert paragraphs, lists, headings |

### `home-loader.js` (IIFE, mirrors bridge-loader.js)

1. Fetches `Data/home-content-{lang}.md` via `CSVUtils.fetchText()`
2. Parses frontmatter + sections via `MDUtils`
3. Populates each section by DOM `id`
4. Hides loader, fades in content
5. Error handling with user-facing message

## Scope Decisions

- **Nav & footer**: Stay hardcoded in HTML template
- **Spanish version**: Deferred to a later task
- **Future region pages**: Will use the same `md-utils.js` with region-specific MD files
