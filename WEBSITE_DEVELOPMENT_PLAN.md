# 2026 Texas-Mexico International Border Crossings Guide

## Website Development Plan

### Overview

Create a unified website platform that consolidates content from the existing **ArcGIS StoryMap**, data from the **2025 Bridge Guidebook (PDF)**, and interactive **ArcGIS Online (AGOL)** maps into one comprehensive resource. The content will be updated to reflect the **2026 version** of the Texas-Mexico International Border Crossings Guide.

**Mission:** Provide a one-stop solution for comprehensive Texas-Mexico border crossing information, serving travelers, logistics professionals, and stakeholders with accurate, up-to-date, and accessible bilingual resources.

**Website Features:**
- Region overview pages with interactive maps and scroll-triggered animations
- Individual border crossing detail pages (English + Spanish)
- PDF download capability for each crossing (2-3 page fact sheets)
- Automated content generation from centralized data sources

**Note on Existing Interactive Components:**
- **ArcGIS Experience Builder App**: Currently embedded in StoryMap—will be reused as-is (migration is complex and not prioritized)
- **Tableau Data Visualizations**: Currently embedded in StoryMap—will be reused as-is initially; may migrate to web technologies later

**Charts and Data Visualizations from Guidebook:**
- Static charts from 2024 Bridge Guidebook will be converted to interactive web-based visualizations

### Team Roles & Responsibilities

**Digital Solution Developer:**
- Develops and maintains data analysis and visualizations
- Creates interactive dashboards and web applications
- Designs visual layouts, graphics, and user interface elements
- Sets up data spreadsheets (CSV) and text document (Markdown) structure
- Leads initial data migration from existing sources
- Runs build scripts to generate pages
- Manages deployment and maintains templates
- Configures ArcGIS Online (AGOL) web map

**Content Expert / Subject Matter Expert (SME):**
- Serves as project manager and primary client liaison
- Manages stakeholder expectations and project timelines
- Reviews migrated data for accuracy
- Updates content with most recent information
- Updates statistics and operational details
- Edits region narratives in Markdown files
- Validates bilingual content

### Key Advantages Over ArcGIS StoryMaps

| Aspect | Previous Process | New Automated Process |
|--------|------------------|----------------------|
| **Data Management** | Content duplicated across PDF, StoryMap; inconsistency risk | Single source of truth (CSV + Markdown files) |
| **Update Workflow** | Multiple rounds of back-and-forth with designer | SME edits directly; automated build |
| **Quality Control** | Errors accumulate across versions | One data source eliminates discrepancies |
| **Customization** | Limited by StoryMap constraints | Full control over design, layout, features |
| **Scalability** | Single-page limitation | Multi-page site with bilingual support |
| **Output Formats** | Manual PDF creation | Automated website + PDF generation |

### Key Building Challenges

**1. PDF Generation Quality & Layout Precision**

- Automated PDFs must exactly match sample format (2-3 pages, mostly 3 pages)
- Bilingual text (EN/ES) has different lengths - layout must accommodate both
- Time-consuming trial-and-error to get layout pixel-perfect

**2. ArcGIS Online (AGOL) Map Integration & Scroll Animations**

- Coordinating smooth scroll-triggered map animations
- Single ArcGIS Online (AGOL) map used across 3 region pages with different zoom/center coordinates
- Requires careful tuning and testing to feel smooth

**3. CSV Data Structure & Parsing**

- Designing CSV structure with 30+ bilingual columns that works for both HTML pages AND PDF generation
- Must handle special characters and formatting variations
- Need robust error handling

**4. Content Migration from 2025 Bridge Guidebook**

- Extracting and structuring content from existing PDF guidebook into CSV/Markdown format
- Manual data entry from PDF (no automated extraction)
- Ensuring accuracy during migration
- Creating bilingual content if Spanish doesn't exist yet
- Labor-intensive; QC is critical

### Content Management Strategy

**Three-Tier Data Approach:**

1. **ArcGIS Online (AGOL) Web Map** - Interactive map display with points and popups
   - Developer updates in AGOL portal
   - Changes appear instantly on website (no deployment needed)

2. **CSV File** - Structured border crossing data
   - Names, coordinates, statistics, hours, tolls, descriptions (bilingual)
   - SME edits in SharePoint Excel
   - Generates individual crossing pages and PDFs

3. **Markdown Files** - Long-form narrative content
   - Regional histories and detailed stories
   - SME edits in SharePoint or GitHub web editor
   - Populates region overview pages

**Content Update Workflow:**

- **ArcGIS Online (AGOL) Map**: Developer edits → Saves → Instant update
- **CSV Data**: SME edits in SharePoint → Developer builds → Deploys
- **Markdown**: SME edits in SharePoint/GitHub → Developer builds → Deploys

### Site Structure

**Home Page:**
- Overview map showing all regions
- Quick links to each region
- Featured border crossings

**Region Overview Pages (RGV, Laredo, El Paso):**
- Interactive map with scroll-triggered animations
- Historical narratives and regional context
- Links to individual crossing detail pages

**Individual Crossing Pages (English + Spanish):**
- Comprehensive crossing information
- Statistics and operational details
- PDF download option
- Language switcher

**PDF Fact Sheets:**
- 2-3 page downloadable documents (most will be 3 pages)
- Match existing guidebook format
- Available in English and Spanish

### Architecture Overview

**Data Flow:**

1.  **Inputs (Data Sources):**
    *   **Border Crossing Data**: Managed in Spreadsheets (CSV).
    *   **Regional Narratives**: Managed in Text Documents (Markdown).
    *   **Map Data**: Managed in ArcGIS Online (AGOL).

2.  **Processing:**
    *   **Automated Build Process**: The system takes the spreadsheets and text documents and combines them.

3.  **Outputs:**
    *   **Website Pages**: Interactive web pages for each region and crossing.
    *   **PDF Documents**: Downloadable fact sheets generated automatically.

4.  **Hosting & Display:**
    *   Everything is published to **GitHub Pages** to create the final **Public Website**.

### Implementation Timeline Estimate

**Note:** These phases represent major work streams that will often happen concurrently rather than sequentially. For example, initial templates can be built while data migration is ongoing, and design work can proceed in parallel with core development.

**Phase 1: Data Preparation & Content Migration (Estimated 60-80 hours)**
- Developer: Set up data spreadsheets (CSV) and text document (Markdown) templates
- Developer: Lead initial data extraction from 2025 Bridge Guidebook PDF
- Developer: Create structured CSV file (20+ crossings × 30+ fields)
- Developer: Update technical data points
- SME: Review migrated data for accuracy
- SME: Update with most recent information and statistics
- Both: Ensure bilingual content is complete (English + Spanish versions)
- Both: Quality checking and data validation
- Both: Multiple review and correction cycles

**Phase 2: Foundation & Build System (Estimated 25-35 hours)**
- Project setup and build system architecture
- CSV structure design and validation logic
- Template creation (home, region, crossing, PDF templates)
- Build script development

**Phase 3: Core Development (Estimated 60-80 hours)**
- Build scripts for page and PDF generation
- ArcGIS Online (AGOL) map integration and configuration
- Scroll animation implementation
- Bilingual navigation and language switching
- PDF generation system with layout precision
- Interactive data visualizations (converting static guidebook charts to interactive web-based visualizations)
- Custom charts for traffic statistics, trends, and crossing data

**Phase 4: Design & Styling (Estimated 30-40 hours)**
- Website design and branding
- CSS styling for all page types
- Print CSS for PDF generation
- Ensuring consistency across all pages
- Client feedback and design revisions

**Phase 5: Testing, QA & Deployment (Estimated 25-35 hours)**
- Build process testing with full dataset
- Cross-browser testing
- PDF quality verification
- Link checking and validation
- Performance testing
- GitHub Pages deployment
- SME documentation and training

**Phase 6: Revisions & Polish (Estimated 40-60 hours)**
- Client review cycles and stakeholder feedback
- Content adjustments and refinements
- Design tweaks and branding consistency
- Bug fixes and edge case handling
- Final polish and quality assurance

**Total Estimated Time: 240-340 hours**

**Breakdown by Role:**
- **Developer: 170-240 hours** (Technical implementation, build system, development, interactive maps, testing, bug fixes)
- **SME: 70-100 hours** (Data review, content updates, statistics, validation, content revisions)

**Note:** This estimate accounts for the significant manual work required to create structured CSV and Markdown files from existing sources, comprehensive bilingual content creation and translation, and multiple rounds of client feedback and revisions.


### Next Steps

1. **Review & Approval**: Team reviews this plan and provides feedback
2. **Content Preparation**: Begin extracting data from 2025 Bridge Guidebook
3. **Development Kickoff**: Developer begins implementation
4. **Iterative Testing**: Regular check-ins to review progress and generated samples
5. **Content Population**: SME populates CSV with all crossing data
6. **Final Review**: Team reviews generated website and PDFs
7. **Launch**: Deploy to GitHub Pages and announce to public

### Future Enhancements

**AI-Powered Chatbot Assistant:**
- Intelligent conversational interface to answer user questions about border crossings
- Natural language query support (English and Spanish)
- Provides instant answers about crossing hours, wait times, toll fees, documentation requirements, and facility information
- Contextual recommendations based on user needs (commercial vs. passenger vehicles, travel times, etc.)
- Integration with real-time data sources for current wait times and operational status
- 24/7 availability to assist travelers and logistics professionals
- Reduces need for manual information searching and improves user experience

**Benefits:**
- Enhanced accessibility for users seeking quick answers
- Reduced support burden on TxDOT staff
- Improved user engagement and satisfaction
- Valuable analytics on common user questions and information needs

### Questions for Discussion

1. Do we have all border crossing data ready?
2. Are Spanish translations available for all content, or will they need to be created?
3. What is the desired launch date for the public website?
4. Do we need a custom domain, or is the GitHub Pages default URL acceptable?
5. What is the expected frequency of content updates after launch?