# 2026 Texas-Mexico International Border Crossings Guide

## Website Development Plan

### Overview

Create a website platform that consolidates content from existing 
*  **ArcGIS StoryMap** - narrative, Quick Facts, Tableau Visualizations,
*  **2025 Bridge Guidebook (PDF)** - Bridges/Border Crossings factsheets, and 
*   interactive **ArcGIS Online (AGOL)** maps
*  **ArcGIS Experience Builder App**
*   into one comprehensive resource. 
The content will be updated with **2026 data and additional information for Mexico (Comprehensive 2026 Texas-Mexico International Border Crossings Guide**).

**Mission:** Provide a one-stop resource for comprehensive Texas-Mexico border crossing information providing stakeholders with accurate, up-to-date, and accessible bilingual information.

**Website Features:**

* Region overview pages with interactive maps and scroll-triggered animations
* Individual border crossing information (English + Spanish)- PDF downloads for each crossing (2-3 page fact sheets)
*  Customized interactive web-based visualizations (graphs, tables)
* Automated content updates from centralized data sources

**Note on Existing Interactive Components:**

* **ArcGIS Experience Builder App**: Currently embedded in StoryMap—will be reused as-is (migration is complex and not prioritized)
* **Tableau Data Visualizations**: Currently embedded in StoryMap—will be reused as-is initially

### Team Roles \& Responsibilities

**Digital Solution Developer:**

* Develops and maintains data analysis and visualizations
* Creates interactive dashboards and web applications
* Designs visual layouts, graphics, and user interface elements
* Sets up data spreadsheets (CSV) and text document (Markdown) structure
* Leads initial data migration from existing sources
* Runs build scripts to generate pages
* Manages deployment and maintains templates
* Configures ArcGIS Online (AGOL) web map

**Content Generator(s):**

* Serves as project manager and primary client liaison
* Manages stakeholder expectations and project timelines
* Reviews migrated data for accuracy
* Updates content with up-to-date information
* Updates statistics and operational details
* Edits region narratives in Markdown files
* Validates bilingual content

### Key Advantages Over ArcGIS StoryMaps

|Aspect|Previous Process|New Automated Process|
|-|-|-|
|**Data Management**|Content duplicated across several files and types of files (PDF, StoryMap; Excel, PPT). Inconsistencies and errors|Single source of data and text (CSV + Markdown files)|
|**Update Workflow**|Multiple rounds of back-and-forth between developer and content generators|Content generator(s) edit(s) directly; automated build|
|**Quality Control**|Errors/inconsistencies accumulate across versions|One data source eliminates discrepancies|
|**Customization**|ArcGIS StoryMap limitations|Full control over design, layout, features|
|**Scalability**|Single-page limitation|Multi-page site|
|**Content Translation**|Limited to pdf factsheets|Fully bilingual website - toggle button|
|**Output Formats**|Manual PDF creation|Automated website + PDF generation|

### Key Migration Challenges

**1. PDF Generation Quality \ Layout**

* Automated PDFs must exactly match sample format (2-3 pages, mostly 3 pages)
* Bilingual text (EN/ES) has different lengths - layout must accommodate both
* Time-consuming trial-and-error to get layout pixel-perfect

**2. ArcGIS Online (AGOL) Map Integration \ Scroll Animations**

* ArcGIS Online (AGOL)has build in smooth scroll-triggered map animations
* Single ArcGIS Online (AGOL) map used for all three region pages with different zoom/center coordinates
* Will require trials to achieve same result

**3. CSV Data Structure \ Parsing**

* Design CSV file structure with 30+ bilingual columns that "feeds" both HTML pages AND PDF generation
* Must handle special characters and formatting variations
* Need robust error handling

**4. Content Migration from 2025 Bridge Guidebook**

* Extract and structure content from existing PDF factsheets into CSV/Markdown format - Manually
* Ensure accuracy during migration
* Create bilingual content for Spanish StoryMap text
* QC is critical

### Content Management Strategy

**Three-Tier Data Approach:**

1. **ArcGIS Online (AGOL) Web Map** - Interactive map display with points and popups

   * Developer updates in AGOL portal
   * Changes appear instantaneously on website (no deployment needed)

2. **CSV File** - Structured border crossing data/ Quick Facts

   * Names, coordinates, statistics, hours, tolls, descriptions (bilingual)
   * Content generator edits in Excel (Sharepoint)
   * Generates individual crossing pages and PDFs

3. **Markdown Files** - Long-form narrative content (✓ Implemented for homepage)

   * Structured markdown with section delimiters, stat blocks, region cards, trend cards
   * Standard markdown images `![alt](path)` and links `[text](url)` — visible in Markdown viewers
   * Content generator edits in SharePoint or GitHub web editor
   * Client-side parsing by `md-utils.js` populates website pages at runtime
   * Authoring guide: `build-plans/MARKDOWN-CONTENT-SKILL.md`

**Content Update Workflow:**

* **ArcGIS Online (AGOL) Map**: Developer edits → Saves → Instant update
* **CSV Data**: SME edits in SharePoint → Developer builds → Deploys
* **Markdown**: SME edits in SharePoint/GitHub → Deploy → Page auto-refreshes (client-side parsing, no build step)

### Site Structure

**Home Page:**

* Overview map showing all regions
* Quick Facts to each region
* Featured border crossings

**Region Overview Pages (El Paso, Laredo, RGV):**

* Interactive map with scroll-triggered animations
* Narrative and regional context
* Links to individual crossing information

**Individual Crossing Pages (English + Spanish):**

* Comprehensive crossing information
* Statistics and operational details
* PDF download option
* Language switcher

**PDF Fact Sheets:**

* 2-3 page downloadable documents (most will be 3 pages)
* Match existing guidebook format
* Available in English and Spanish

### Architecture Overview

**Data Flow:**

1. **Data Management (Inputs):**

   * **Structured border crossing data**: Managed in CSV files.
   * **Long-form narrative content**: Managed in Markdown files.

2. **Automated Build Process:**

   * **Generate Website Pages**: Creates the site structure and content.
   * **Generate PDF Fact Sheets per Border Crossing**: Automated creation of downloadable PDFs.
   * **Generate Data Visualizations and Dashboards**: Converts data into interactive charts.
   * **Interactive Map ArcGIS Online**: Integrates the dynamic map component.

3. **Deployment:**

   * **GitHub Repository** → **GitHub Pages Hosting**: Continuous deployment to the public web.

**Current Implementation Architecture:**

The project uses two main content directories:

| Folder | Purpose |
|--------|---------|
| `page-previews/` | Homepage template and CSS design system (variables, base, layout, components, print) |
| `app/` | Dynamic pages — homepage (loads markdown content), bridge pages (load CSV data), all client-side rendering |

All pages in `app/` use a data-driven approach with client-side rendering:

**Homepage** (`app/index.html`) — markdown-driven:
* `Data/home-content-eng.md` — structured markdown content (single source of truth)
* `app/js/md-utils.js` — shared markdown parsing utilities (frontmatter, sections, stats, cards, images, links)
* `app/js/home-loader.js` — fetches markdown, parses sections, populates DOM containers
* `app/css/home.css` — homepage-specific styles
* Images use standard markdown `![alt](path)` and links use `[text](url)` for visibility in Markdown viewers

**Bridge pages** — CSV-driven:
* `app/js/csv-utils.js` — parses CSV data files at runtime
* `app/js/bridge-loader.js` — loads all 3 CSV tables, joins by Bridge-ID, and renders the page
* `app/css/bridge.css` — bridge page-specific styles
* `app/pdf-templates/` — PDF factsheet template and styles for print/download
* Each bridge page HTML file (e.g., `app/ELP-ELP-PASO.html`) loads the shared JS and renders data for that crossing
* Assets are organized per crossing (e.g., `assets/ELP-ELP-PASO/`) with 19 shared SVG mode icons in `assets/icons/`

### Implementation Timeline

**Project Goal:** Complete the entire initiative in six months, with the final product (website launch) delivered by early August 2026.

**Note:** The phases represent major work streams that will often happen concurrently rather than sequentially. For example, initial templates can be built while data migration is ongoing, and design work can proceed in parallel with core development.

**Phase 1: Data Preparation \ Content Migration** — *In Progress*

* ~~Developer: Structure data spreadsheets (CSV) and text document (Markdown) templates~~ ✓ Done — 3 CSV tables (`border-info-eng.csv`, `modes-info.csv`, `modes-tolls.csv`) + 6 metadata dictionaries in `Data/metadata/`
* Developer: Lead initial data extraction from 2025 Bridge Guidebook PDFs
* Developer: Populate structured CSV files (35 crossings × 25+ fields)
* Developer: Update data points
* SME: Review migrated data for accuracy
* SME: Update with most recent information and statistics
* Both: Ensure bilingual content is complete (English + Spanish versions)
* Both: Quality checking and data validation
* Both: Multiple review and correction cycles

**Phase 2: Foundation** — *In Progress*

* ~~Project setup and build system architecture~~ ✓ Done — GitHub repo, VS Code tasks, Python dev server
* ~~CSV structure design and validation logic~~ ✓ Done — 3-table normalized schema with Bridge-ID join key
* Template creation (home, region, crossing, PDF templates) — *In progress:* Dynamic homepage (`app/index.html`) loads content from markdown at runtime; static preview at `page-previews/home-preview.html`; first bridge page (`app/ELP-ELP-PASO.html`) working; PDF template started (`app/pdf-templates/bridge-factsheet.html`); region templates not yet started
* ~~Markdown content system~~ ✓ Done — `app/js/md-utils.js` (shared parser), `app/js/home-loader.js` (homepage DOM population), `Data/home-content-eng.md` (English homepage content), authoring guide at `build-plans/MARKDOWN-CONTENT-SKILL.md`
* Build script development — Node.js build system not yet implemented; currently using client-side CSV loading (`app/js/bridge-loader.js`, `app/js/csv-utils.js`) and client-side markdown parsing (`app/js/md-utils.js`)

**Phase 3: Core Development** — *Early Progress*

* Build scripts for page and PDF generation — not yet started
* ArcGIS Online (AGOL) map integration and configuration — not yet started
* Scroll animation implementation — not yet started
* Bilingual navigation and language switching — not yet started
* PDF generation system with layout precision — *started:* print CSS and PDF template infrastructure in place; download button implemented on bridge page
* Interactive data visualizations (graphs, tables) — not yet started
* Custom charts for traffic statistics, trends, and crossing data — not yet started

**Phase 4: Design \ Style** — *In Progress*

* **TxDOT Design Implementation:**
  * ~~Analyze TxDOT website (https://www.txdot.gov/) structure and design~~ ✓ Done
  * ~~Extract and replicate navigation structure, header/footer, color scheme, typography~~ ✓ Done — IBM Plex Sans, TxDOT brand colors implemented
  * ~~Create component library matching TxDOT's visual language (cards, buttons, hero sections)~~ ✓ Done — CSS design system in `page-previews/css/` (variables, base, layout, components)
  * Reference TxDOT Brand Guidelines for official colors, logos, and standards — ongoing
* **Website Style:**
  * ~~CSS styling for homepage matching TxDOT design~~ ✓ Done
  * CSS styling for bridge pages — *in progress* (`app/css/bridge.css`)
  * Responsive design implementation matching TxDOT breakpoints — *in progress*
  * ~~Print CSS for PDF generation~~ ✓ Done — `page-previews/css/print.css` + `app/pdf-templates/css/factsheet.css`
  * Ensuring visual consistency across all pages — ongoing
* **Brand Alignment:**
  * Verify alignment with TxDOT brand identity
  * Client feedback and design revisions
  * Final design and consistency checks

**Phase 5: Testing, QA \ Deployment** — *Not Started*

* Build process testing with full dataset
* Cross-browser testing
* PDF quality verification
* Link checking and validation
* Performance testing
* GitHub Pages deployment
* SME documentation and training

**Phase 6: Revisions \ Final Edits** — *Not Started*

* Client review cycles and stakeholder feedback
* Content adjustments and refinements
* Design tweaks and branding consistency
* Bug fixes and edge case handling
* Final edits and quality assurance

**Target Launch Date:** Early August 2026

**Project Duration:** Six months from project kickoff to website launch.

### Design Requirements - TxDOT Website Alignment

**Question:** Must the website match the visual design, layout patterns, and user experience of the official TxDOT website (https://www.txdot.gov/) to ensure brand consistency and familiarity for users.

**Key Design Elements to Match:**

* **Navigation Structure**: Top-level navigation menu with main categories (similar to TxDOT's "Discover Texas", "Data and maps", "Do business", "Explore projects", "Stay safe", "About")
* **Header/Footer**: Match TxDOT header with logo placement, search functionality, and footer structure with organized link categories
* **Color Scheme**: Use TxDOT's official color palette (typically blue/white government design)
* **Typography**: Match TxDOT's font choices and hierarchy
* **Layout Patterns**: 
  * Hero sections with large background images
  * Card-based layouts for featured content
  * Clean, spacious white-space usage
  * Professional government website aesthetic
* **Component Styles**: Match button styles, link treatments, form elements, and interactive components
* **Responsive Design**: Ensure mobile-friendly responsive layout matching TxDOT's breakpoints
* **Brand Guidelines**: Reference TxDOT Brand Guidelines (https://www.txdot.gov/about/brand-guidelines.html) for official colors, logos, and design standards

**Implementation Approach:**

* Analyze TxDOT website structure and extract CSS patterns
* Create design system components matching TxDOT's visual language
* Ensure all pages maintain consistent TxDOT-branded appearance
* Test design consistency across all device sizes


### Next Steps

1. **Review \ Approval**: TxDOT reviews plan and provides feedback
2. **Content Preparation**: Begin extracting data from 2025 Bridge Guidebook
3. **Development Kickoff**: Developer begins implementation
4. **Iterative Testing**: Regular check-ins to review progress and generated samples
5. **Content Population**: Content Generator populates CSV with all crossing data
6. **Final Review**: TxDOT reviews generated website and PDFs
7. **Launch**: Deploys to GitHub Pages and make public

### Future Enhancements

**AI-Powered Chatbot Assistant:**

* Intelligent conversational interface to answer user questions about border crossings
* Natural language query support (English and Spanish)
* Provides instant answers about crossing hours, wait times, toll fees, documentation requirements, and facility information
* Contextual recommendations based on user needs (commercial vs. passenger vehicles, travel times, etc.)
* Integration with real-time data sources for current wait times and operational status
* Reduces need for manual information searching and improves user experience

**Benefits:**

* Enhanced accessibility for users seeking quick answers
* Reduced support burden on TxDOT staff
* Improved user engagement and satisfaction
* Valuable analytics on common user questions and information needs

### Questions for Discussion

1. Do we have all border crossing data ready?
2. Are Spanish translations available for all content, or will they need to be created?
3. What is the desired launch date for the public website?
4. Do we need a custom domain, or is the GitHub Pages default URL acceptable? (Question for TxDOT)
5. What is the expected frequency of content updates after launch?
6. Does the website have to align with TxDOT website structure/layout? (Question for TxDOT)
