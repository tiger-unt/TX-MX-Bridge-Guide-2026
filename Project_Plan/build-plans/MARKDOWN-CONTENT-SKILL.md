# Markdown Content Authoring Guide

This document defines the structured markdown format used for dynamically-generated pages in the Border Crossings website. When the markdown file is updated and deployed, the corresponding web page automatically reflects the changes — no HTML editing required.

## How It Works

1. Content authors edit a `.md` file in the `Data/` folder
2. The HTML page template in `app/` has empty containers with `id` attributes
3. On page load, JavaScript fetches the `.md` file, parses it, and populates the template
4. The page renders with the latest content

This mirrors the CSV-driven pattern used for bridge pages, but uses markdown for long-form prose content.

---

## File Naming Convention

```
Data/{page-name}-content-{lang}.md
```

Examples:
- `Data/home-content-eng.md` — English homepage
- `Data/home-content-esp.md` — Spanish homepage
- `Data/el-paso-content-eng.md` — English El Paso region page
- `Data/laredo-content-eng.md` — English Laredo region page

---

## Overall File Structure

Every content markdown file follows this structure:

```markdown
---
key: value
key: value
---

<!-- section: section-name -->
Content for this section...

<!-- section: another-section -->
Content for another section...
```

### 1. Frontmatter Block

The file begins with a `---` delimited frontmatter block containing metadata and URLs. This data is NOT rendered as prose — it provides configuration values like image paths, iframe URLs, and page titles.

```markdown
---
page-title: Page Title Here | TxDOT
meta-description: SEO description for this page
hero-image: ../assets/Transition-Images/CoverImage_v1.png
map-url: https://experience.arcgis.com/experience/...
---
```

**Rules:**
- Each line is a `key: value` pair
- Keys are lowercase, hyphen-separated (e.g., `hero-image`, `map-url`)
- Values are plain text — no quotes needed
- URLs must be complete (absolute or relative to `app/`)
- One key-value pair per line

### 2. Section Delimiters

Sections are separated by HTML comments in this format:

```markdown
<!-- section: section-name -->
```

**Rules:**
- Section names are lowercase, hyphen-separated (e.g., `hero`, `border-overview`, `trade-role`)
- Every piece of content must be inside a section
- Section order in the markdown does NOT affect page layout (the HTML template controls layout order)
- The section name maps to DOM element IDs in the HTML template

---

## Content Types

### Headings

Use standard markdown heading syntax. Only `##` (h2) and `###` (h3) are supported.

```markdown
## Section Heading
### Subsection Heading
```

**Do NOT use `#` (h1)** for section headings — the page template handles the page title. Use `#` only for the hero title.

### Paragraphs

Plain text separated by blank lines becomes paragraphs.

```markdown
First paragraph of text here.

Second paragraph of text here.
```

### Bold Text

Wrap text in double asterisks for bold/strong emphasis.

```markdown
Texas traded **$281.2 billion** in goods with Mexico.
```

Renders as: Texas traded **$281.2 billion** in goods with Mexico.

### Italic Text

Wrap text in single asterisks for italic/emphasis.

```markdown
Data covers the period *2014 to 2024*.
```

### Links

Use standard markdown link syntax.

```markdown
Visit the [Bureau of Transportation Statistics](https://www.bts.gov/) for more data.
```

### Unordered Lists

Use `*` (asterisk) or `-` (dash) for list items.

```markdown
* Machinery/electrical equipment
* Transportation equipment
* Metals
```

---

## Images and Links

Images and links use **standard markdown syntax** so they are visible when previewing the file in any Markdown viewer. The loader extracts these from the section content and places them in the correct DOM containers — they are stripped from rendered prose so they don't appear twice.

### Section Image

Use standard markdown image syntax on its own line. The loader uses this as the section's featured image.

```markdown
![Texas-Mexico border region overview](../assets/images/Border-intro.svg)
```

The alt text becomes the image's `alt` attribute. The path is relative to `app/`.

### Hero Background Image

Same syntax — placed in the hero section, the loader uses it as the background image.

```markdown
![Hero background](../assets/Transition-Images/CoverImage_v1.png)
```

### Iframe / Map Link

Use standard markdown link syntax on its own line. In the map section, the loader extracts the URL and sets it as the iframe source.

```markdown
[View Interactive Map](https://experience.arcgis.com/experience/0224d33cb25d48c09d551dc46d404ebe)
```

### Download Link

Use standard markdown link syntax on its own line. In the quick-facts section, the loader extracts the URL and link text for the download button.

```markdown
[Download Quick Facts (PDF)](https://example.com/file.pdf)
```

**Rules:**
- One image or link per line, on its own line (not mixed with other text)
- The loader identifies these by their position within the section — each section knows what to expect
- These are stripped from rendered prose by `renderBlock()` so they don't double-render as inline content
- Standard markdown means images and links are visible in any Markdown viewer or GitHub preview

---

## Structured Data Blocks

### Stat Cards

Use `<!-- stats -->` followed by a list of `value | label` pairs. These render as the large-number stat cards on the page.

```markdown
<!-- stats -->
- 1,254 | Miles of Border
- 4 | Mexican States
- 34 | Operational Crossings
- 12 | Ports of Entry
```

**Rules:**
- Each stat is on its own line, starting with `- `
- The `|` (pipe) separates the display value from the label
- Values can include symbols: `$5.4B`, `+71%`, `17.5M`, `109`
- Labels should be concise (2-5 words)
- Typically 3 or 4 stats per block

### Region Cards

Use `<!-- region: id -->` followed by key-value pairs. These render as image+text cards.

```markdown
<!-- region: el-paso -->
- title: El Paso Region
- image: ../assets/Transition-Images/ELP Region Photo.jpg
- alt: El Paso region border crossing
- link: el-paso.html
- link-text: Explore El Paso
- description: Four ports of entry with 10 operational border crossings...
```

**Required fields:**
- `title` — Card heading
- `image` — Image path (relative to `app/`)
- `link` — Page URL
- `link-text` — Call-to-action button text
- `description` — Card body text

**Optional fields:**
- `alt` — Image alt text (defaults to title if omitted)

### Trend Cards

Use `<!-- trend-card: type -->` followed by key-value pairs. Two types:

**Descriptive** (text only):
```markdown
<!-- trend-card: descriptive -->
- title: Pedestrian/Bicycle
- text: Increased 23% from 2014 to 2019. Sharp reduction in 2020-2021 due to COVID-19.
```

**Metric** (big number + text):
```markdown
<!-- trend-card: metric -->
- title: Commercial Truck
- value: +44%
- text: More than 1.6 million additional northbound commercial truck crossings.
```

### Source Citations

Use `<!-- source -->` followed by the source text on the next line.

```markdown
<!-- source -->
Source: Bureau of Transportation Statistics (BTS)
```

---

## Complete Section Examples

### Hero Section

```markdown
<!-- section: hero -->
# Texas-Mexico International Border Crossings
Connecting People and Goods Across the Texas-Mexico Border: A Guide to the State's Border Crossings

![Hero background](../assets/Transition-Images/CoverImage_v1.png)
```

The `#` heading becomes the hero title. The first non-heading line becomes the subtitle. The image sets the hero background.

### Section with Image and Stats

```markdown
<!-- section: border-overview -->
## Texas-Mexico Border

![Texas-Mexico border region overview](../assets/images/Border-intro.svg)

Texas shares a **1,254-mile land border** with **four Mexican states**...

<!-- stats -->
- 1,254 | Miles of Border
- 4 | Mexican States
- 34 | Operational Crossings
- 12 | Ports of Entry
```

The image is extracted for placement in the DOM; it does not render inline with the prose.

### Section with Rich Text and Image

```markdown
<!-- section: trade-role -->
## The Role of Texas' Border Infrastructure in U.S.-Mexico Trade

![2024 Quick Facts](../assets/images/2024_Quick_Facts_TX_Trade_Values.svg)

Mexico is the U.S. and Texas' most important international trading partner. In 2024, the U.S. and Mexico traded **$839.9 billion** in goods.

### Top Commodities (2024)
* Machinery/electrical equipment
* Transportation equipment
* Metals

<!-- source -->
Source: Bureau of Transportation Statistics (BTS)
```

### Section with Iframe Link

```markdown
<!-- section: map -->
## Interactive Border Crossings Map

Explore Texas' 34 border crossings across three regions.

[View Interactive Map](https://experience.arcgis.com/experience/0224d33cb25d48c09d551dc46d404ebe)
```

The standalone link is extracted as the iframe URL; it does not render as a clickable link in the prose.

### Section with Download Link

```markdown
<!-- section: quick-facts -->
## Texas-Mexico Quick Facts

Download the Quick Facts infographic summarizing trade and crossing data.

[Download Quick Facts (PDF)](https://example.com/file.pdf)
```

The standalone link is extracted for the download button.

---

## Adding a New Page

To create a new markdown-driven page:

1. **Create the markdown file**: `Data/{page-name}-content-eng.md`
   - Add frontmatter with page metadata and URLs
   - Add sections following the format above

2. **Create the HTML template**: `app/{page-name}.html`
   - Copy the structural chrome from an existing template (utility bar, header, nav, footer)
   - Add empty content containers with `id` attributes matching your section names
   - Load the scripts: `csv-utils.js`, `md-utils.js`, and a page-specific loader

3. **Create the page loader**: `app/js/{page-name}-loader.js`
   - Follow the pattern in `home-loader.js`
   - Set `window.PAGE_LANG` in the HTML template
   - Map each section to its DOM container
   - Handle section-specific rendering (stats, cards, prose)

4. **Reuse `md-utils.js`** — all parsing functions are shared across pages

---

## Tips for Content Authors

- **Preview your changes**: Run `python -m http.server 8080` from the project root and visit `http://localhost:8080/app/index.html`
- **Don't edit HTML templates** unless you're adding/removing entire sections
- **Keep stat values short**: `$5.4B` not `$5,400,000,000`
- **Use relative paths** for images: `../assets/images/file.svg` (relative to `app/`)
- **Special characters**: Use actual Unicode characters (e.g., `\u2013` for en-dash shows as `–`). The parser handles basic text — no need for HTML entities
- **Blank lines matter**: They separate paragraphs. Don't add extra blank lines inside stat blocks or card blocks
