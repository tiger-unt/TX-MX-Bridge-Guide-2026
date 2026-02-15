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

3. **Markdown Files** - Long-form narrative content

   * Website text
   * Content generator edits in Sharepoint or GitHub web editor
   * Populates website text

**Content Update Workflow:**

* **ArcGIS Online (AGOL) Map**: Developer edits → Saves → Instant update
* **CSV Data**: SME edits in SharePoint → Developer builds → Deploys
* **Markdown**: SME edits in SharePoint/GitHub → Developer builds → Deploys

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

### Implementation Timeline

**Project Goal:** Complete the entire initiative in six months, with the final product (website launch) delivered by early August 2026.

**Note:** The phases represent major work streams that will often happen concurrently rather than sequentially. For example, initial templates can be built while data migration is ongoing, and design work can proceed in parallel with core development.

**Phase 1: Data Preparation \ Content Migration**

* Developer: Structure data spreadsheets (CSV) and text document (Markdown) templates
* Developer: Lead initial data extraction from 2025 Bridge Guidebook PDFs
* Developer: Create structured CSV file (34 crossings × 30+ fields)
* Developer: Update data points
* SME: Review migrated data for accuracy
* SME: Update with most recent information and statistics
* Both: Ensure bilingual content is complete (English + Spanish versions)
* Both: Quality checking and data validation
* Both: Multiple review and correction cycles

**Phase 2: Foundation**

* Project setup and build system architecture
* CSV structure design and validation logic
* Template creation (home, region, crossing, PDF templates)
* Build script development

**Phase 3: Core Development**

* Build scripts for page and PDF generation
* ArcGIS Online (AGOL) map integration and configuration
* Scroll animation implementation
* Bilingual navigation and language switching
* PDF generation system with layout precision
* Interactive data visualizations (graphs, tables)
* Custom charts for traffic statistics, trends, and crossing data

**Phase 4: Design \ Style**

* **TxDOT Design Implementation:**
  * Analyze TxDOT website (https://www.txdot.gov/) structure and design
  * Extract and replicate navigation structure, header/footer, color scheme, typography
  * Create component library matching TxDOT's visual language (cards, buttons, hero sections)
  * Reference TxDOT Brand Guidelines for official colors, logos, and standards
* **Website Style**:**
  * Cascading Style Sheet (CSS) styling for all page types matching TxDOT design
  * Responsive design implementation matching TxDOT breakpoints
  * Print CSS for PDF generation
  * Ensuring visual consistency across all pages
* **Brand Alignment:**
  * Verify alignment with TxDOT brand identity
  * Client feedback and design revisions
  * Final design and consistency checks

**Phase 5: Testing, QA \ Deployment**

* Build process testing with full dataset
* Cross-browser testing
* PDF quality verification
* Link checking and validation
* Performance testing
* GitHub Pages deployment
* SME documentation and training

**Phase 6: Revisions \ Final Edits**

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
