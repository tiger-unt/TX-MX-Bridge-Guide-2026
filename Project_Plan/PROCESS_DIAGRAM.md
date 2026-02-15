# Website Development Process Diagrams

These diagrams illustrate the content management, build, and deployment processes for the 2026 Texas-Mexico Border Crossings Guide website.

## 1. Architecture & Data Flow

```mermaid
graph TD
    %% Nodes
    subgraph "Team Roles"
        SME([Subject Matter Expert<br/>Content Manager])
        DEV([Web Developer])
    end

    subgraph "Data Management (Inputs)"
        SharePoint_CSV[("Border Data (CSV)<br/>SharePoint Excel")]
        SharePoint_MD[("Narratives (Markdown)<br/>SharePoint/GitHub")]
        AGOL_Map[("Interactive Map<br/>ArcGIS Online")]
    end

    subgraph "Automated Build Process"
        BuildScript[[Build Script<br/>Node.js]]
        HTML_Gen[Generate HTML Pages]
        PDF_Gen[Generate PDF Fact Sheets]
    end

    subgraph "Deployment"
        GitHub_Repo[GitHub Repository]
        GHPages[GitHub Pages Hosting]
    end

    subgraph "Live Product"
        Website[Live Website]
        EmbeddedMap[Embedded Map]
        Downloads[PDF Downloads]
    end

    %% Workflow Connections
    
    %% Content Updates
    SME -- "Updates Data" --> SharePoint_CSV
    SME -- "Writes Stories" --> SharePoint_MD
    DEV -- "Configures" --> AGOL_Map
    
    %% Build Flow
    SharePoint_CSV -- "Input" --> BuildScript
    SharePoint_MD -- "Input" --> BuildScript
    
    BuildScript --> HTML_Gen
    BuildScript --> PDF_Gen
    
    %% Deployment Flow
    HTML_Gen --> GitHub_Repo
    PDF_Gen --> GitHub_Repo
    
    GitHub_Repo -- "Deploys to" --> GHPages
    GHPages --> Website
    
    %% AGOL Direct Integration
    AGOL_Map -.-> |"Instant Update (No Build)"| EmbeddedMap
    
    %% Website Components
    Website --> EmbeddedMap
    Website --> Downloads
    
    %% Styling
    classDef role fill:#f9f9f9,stroke:#333,stroke-width:2px;
    classDef data fill:#e1f5fe,stroke:#0277bd,stroke-width:2px;
    classDef process fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px;
    classDef deploy fill:#fff3e0,stroke:#ef6c00,stroke-width:2px;
    classDef live fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px;

    class SME,DEV role;
    class SharePoint_CSV,SharePoint_MD,AGOL_Map data;
    class BuildScript,HTML_Gen,PDF_Gen process;
    class GitHub_Repo,GHPages deploy;
    class Website,EmbeddedMap,Downloads live;
```

## 2. Update Workflow Sequence

This sequence diagram shows the difference between updating the Map (Instant) vs. Content (Requires Build).

```mermaid
sequenceDiagram
    participant SME as Subject Matter Expert
    participant Dev as Developer
    participant SP as SharePoint (Data)
    participant AGOL as ArcGIS Online
    participant Build as Build System
    participant GH as GitHub Pages
    participant User as Website Visitor

    %% Scenario 1: Map Update
    rect rgb(240, 248, 255)
        note over Dev, AGOL: Scenario 1: Map Update (Instant)
        Dev->>AGOL: Updates Map Layer
        AGOL-->>User: Updates immediately on next refresh
    end

    %% Scenario 2: Content Update
    rect rgb(255, 250, 240)
        note over SME, GH: Scenario 2: Content/Data Update (Requires Build)
        SME->>SP: Updates CSV or Markdown
        SME->>Dev: Notifies of changes
        Dev->>Build: Triggers Build Script
        Build->>SP: Fetches Data
        Build->>Build: Generates HTML & PDFs
        Build->>GH: Deploys new files
        GH-->>User: Updates after deployment (~1-2 mins)
    end
```
