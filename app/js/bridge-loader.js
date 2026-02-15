/**
 * Bridge Page Data Loader
 * Fetches CSV data and populates the bridge page DOM.
 *
 * Requires:
 *   - csv-utils.js loaded first (provides window.CSVUtils)
 *   - window.BRIDGE_ID set before this script runs
 */
(function () {
    'use strict';

    const { parseCSV, getModeIcon, fetchText, sanitizeBridgeID } = window.CSVUtils;
    const BRIDGE_ID = sanitizeBridgeID(window.BRIDGE_ID, '');

    if (!BRIDGE_ID) {
        console.error('bridge-loader: invalid or missing window.BRIDGE_ID.');
        const loader = document.getElementById('page-loader');
        if (loader) loader.textContent = 'Invalid bridge identifier. Please verify the page configuration.';
        return;
    }

    // Paths relative to the HTML file inside app/
    const CSV_BASE  = '../Data/';
    const ICON_BASE = '../assets/icons/';
    const ASSET_BASE = '../assets/' + BRIDGE_ID + '/';

    const FILES = {
        info:  CSV_BASE + 'border-info-eng.csv',
        modes: CSV_BASE + 'modes-info.csv',
        tolls: CSV_BASE + 'modes-tolls.csv'
    };

    // Asset filename patterns — extensions match actual files on disk.
    // TODO: normalize all asset filenames to lowercase extensions.
    const ASSET_FILES = {
        map:    ASSET_BASE + BRIDGE_ID + '_map.png',
        chart1: ASSET_BASE + BRIDGE_ID + '_chart_1.png',
        chart2: ASSET_BASE + BRIDGE_ID + '_chart_2.png',
        photos: [
            ASSET_BASE + BRIDGE_ID + '_1.JPG',
            ASSET_BASE + BRIDGE_ID + '_2.png',
            ASSET_BASE + BRIDGE_ID + '_3.JPG',
            ASSET_BASE + BRIDGE_ID + '_5.jpg'
        ]
    };

    // ==========================================
    // Data Filtering
    // ==========================================

    const filterByBridgeID = (rows) =>
        rows.filter(row => row['Bridge-ID'] === BRIDGE_ID);

    // ==========================================
    // DOM Population — Simple Fields
    // ==========================================

    function populateFields(info) {
        document.querySelectorAll('[data-field]').forEach(el => {
            const field = el.getAttribute('data-field');
            if (info[field] !== undefined && info[field] !== '') {
                el.textContent = info[field];
            }
        });
    }

    // ==========================================
    // DOM Population — Ownership Grid
    // ==========================================

    function populateOwnership(info) {
        setText('us-owner', info['US-Owner']);
        setText('us-operator', info['US-Operator']);
        setText('mx-owner', info['MexicanOwner']);
        setText('mx-operator', info['MexicanOperator']);
    }

    // ==========================================
    // DOM Population — Highways
    // ==========================================

    function populateHighways(info) {
        setText('port-access-tx', info['PortAccess-or-Egress Road-TX']);
        setText('port-access-mx', info['PortAccess-or-Egress-Road-MX']);
        setText('highway-us', info['Connection-to-Major-Highways-US']);
        setText('highway-mx', info['Connection-to-Major Highways-MX']);
    }

    // ==========================================
    // DOM Population — Hours of Operation Table
    // ==========================================

    function buildHoursTable(modesRows) {
        const tbody = document.getElementById('hours-table-body');
        if (!tbody) return;

        tbody.innerHTML = '';
        if (modesRows.length === 0) {
            const tr = document.createElement('tr');
            const td = document.createElement('td');
            td.colSpan = 3;
            td.textContent = 'No hours of operation data available.';
            td.style.textAlign = 'center';
            tr.appendChild(td);
            tbody.appendChild(tr);
            const asOfEl = document.getElementById('hours-as-of');
            if (asOfEl) asOfEl.textContent = '';
            return;
        }

        modesRows.forEach(row => {
            const tr = document.createElement('tr');

            // Mode column
            const tdMode = document.createElement('td');
            tdMode.setAttribute('data-label', 'Mode');
            tdMode.textContent = row['Modes'] || '';
            tr.appendChild(tdMode);

            // Combined Lane Details column
            const tdLaneDetails = document.createElement('td');
            tdLaneDetails.setAttribute('data-label', 'Lane Details');
            const laneCount = row['InspectionLanes'] || '';
            const laneNotes = row['InspectionLaneNotes'] || '';

            if (laneCount && laneNotes) {
                const strong = document.createElement('strong');
                strong.textContent = laneCount + ' lanes';
                tdLaneDetails.appendChild(strong);
                tdLaneDetails.appendChild(document.createElement('br'));
                tdLaneDetails.appendChild(document.createTextNode(laneNotes));
            } else if (laneCount) {
                const strong = document.createElement('strong');
                strong.textContent = laneCount + ' lanes';
                tdLaneDetails.appendChild(strong);
            } else if (laneNotes) {
                tdLaneDetails.textContent = laneNotes;
            } else {
                tdLaneDetails.textContent = '\u2014';
            }
            tr.appendChild(tdLaneDetails);

            // Combined Hours Column
            const tdHours = document.createElement('td');
            tdHours.setAttribute('data-label', 'Hours of Operation');
            const cbpHours = row['Hours-of-Operation--CBP-Facilities'] || '';
            const aduanasHours = row['Hours-of-Operation--ADUANAS-Facilities'] || '';

            if (cbpHours && aduanasHours) {
                if (cbpHours === aduanasHours) {
                    tdHours.textContent = cbpHours + ' (CBP & ADUANAS)';
                } else {
                    tdHours.textContent = cbpHours + ' (CBP), ' + aduanasHours + ' (ADUANAS)';
                }
            } else if (cbpHours) {
                tdHours.textContent = cbpHours + ' (CBP)';
            } else if (aduanasHours) {
                tdHours.textContent = aduanasHours + ' (ADUANAS)';
            } else {
                tdHours.textContent = '\u2014';
            }
            tr.appendChild(tdHours);

            tbody.appendChild(tr);
        });

        const asOf = modesRows[0]['HOO-As-of'];
        if (asOf) setText('hours-as-of', asOf);
    }

    // ==========================================
    // DOM Population — Toll Rates Table
    // ==========================================

    function buildTollsTable(tollRows) {
        const tbody = document.getElementById('tolls-table-body');
        if (!tbody) return;

        tbody.innerHTML = '';
        if (tollRows.length === 0) {
            const tr = document.createElement('tr');
            const td = document.createElement('td');
            td.colSpan = 6;
            td.textContent = 'No toll data available.';
            td.style.textAlign = 'center';
            tr.appendChild(td);
            tbody.appendChild(tr);
            const asOfEl = document.getElementById('tolls-as-of');
            if (asOfEl) asOfEl.textContent = '';
            const sourceEl = document.getElementById('tolls-source');
            if (sourceEl) sourceEl.textContent = '';
            return;
        }

        // Group rows by mode for rowspan
        const modeGroups = [];
        let currentMode = null;
        let currentGroup = [];

        tollRows.forEach(row => {
            const modeName = row['Modes'] || '';
            if (modeName !== currentMode) {
                if (currentGroup.length > 0) {
                    modeGroups.push({ mode: currentMode, rows: currentGroup });
                }
                currentMode = modeName;
                currentGroup = [row];
            } else {
                currentGroup.push(row);
            }
        });
        if (currentGroup.length > 0) {
            modeGroups.push({ mode: currentMode, rows: currentGroup });
        }

        // Build table with merged cells
        modeGroups.forEach(group => {
            const iconPath = getModeIcon(group.mode, ICON_BASE);
            const rowspan = group.rows.length;

            // Check if all SB axles and tolls are identical within group
            const firstSBAxles = group.rows[0]['AxlesSouthbound'] || '\u2014';
            const firstSBTolls = group.rows[0]['SouthboundTolls'] || '\u2014';
            const allSBSame = group.rows.every(r =>
                (r['AxlesSouthbound'] || '\u2014') === firstSBAxles &&
                (r['SouthboundTolls'] || '\u2014') === firstSBTolls
            );

            group.rows.forEach((row, rowIndex) => {
                const tr = document.createElement('tr');

                // Icon + Mode columns (only first row of group)
                if (rowIndex === 0) {
                    const tdIcon = document.createElement('td');
                    tdIcon.setAttribute('data-label', '');
                    if (rowspan > 1) tdIcon.setAttribute('rowspan', rowspan);
                    if (iconPath) {
                        const icon = document.createElement('img');
                        icon.src = iconPath;
                        icon.alt = '';
                        icon.className = 'mode-icon';
                        tdIcon.appendChild(icon);
                    }
                    tr.appendChild(tdIcon);

                    const tdMode = document.createElement('td');
                    tdMode.setAttribute('data-label', 'Mode');
                    if (rowspan > 1) tdMode.setAttribute('rowspan', rowspan);
                    tdMode.textContent = group.mode;
                    tr.appendChild(tdMode);

                    // SB Axles and Tolls (merge if all same)
                    if (allSBSame) {
                        const tdSBAxles = document.createElement('td');
                        tdSBAxles.setAttribute('data-label', 'Axles (SB)');
                        if (rowspan > 1) tdSBAxles.setAttribute('rowspan', rowspan);
                        tdSBAxles.textContent = firstSBAxles;
                        tr.appendChild(tdSBAxles);

                        const tdSBTolls = document.createElement('td');
                        tdSBTolls.setAttribute('data-label', 'Southbound Toll');
                        if (rowspan > 1) tdSBTolls.setAttribute('rowspan', rowspan);
                        tdSBTolls.textContent = firstSBTolls;
                        tr.appendChild(tdSBTolls);
                    }
                }

                // SB columns per row if not merged
                if (!allSBSame) {
                    const tdSBAxles = document.createElement('td');
                    tdSBAxles.setAttribute('data-label', 'Axles (SB)');
                    tdSBAxles.textContent = row['AxlesSouthbound'] || '\u2014';
                    tr.appendChild(tdSBAxles);

                    const tdSBTolls = document.createElement('td');
                    tdSBTolls.setAttribute('data-label', 'Southbound Toll');
                    tdSBTolls.textContent = row['SouthboundTolls'] || '\u2014';
                    tr.appendChild(tdSBTolls);
                }

                // NB columns (always per row)
                const tdNBAxles = document.createElement('td');
                tdNBAxles.className = 'tolls-col--nb-axles';
                tdNBAxles.setAttribute('data-label', 'Axles (NB)');
                tdNBAxles.textContent = row['AxlesNorthbound'] || '\u2014';
                tr.appendChild(tdNBAxles);

                const tdNBTolls = document.createElement('td');
                tdNBTolls.className = 'tolls-col--nb-toll';
                tdNBTolls.setAttribute('data-label', 'Northbound Toll');
                tdNBTolls.textContent = row['NorthboundTolls'] || '\u2014';
                tr.appendChild(tdNBTolls);

                tbody.appendChild(tr);
            });
        });

        // Update "as of" note and source
        const asOf = tollRows[0]['TollsAsOf'];
        if (asOf) setText('tolls-as-of', asOf);
        const sources = tollRows[0]['Sources'];
        if (sources) setText('tolls-source', sources);
    }

    // ==========================================
    // DOM Population — Alternate Names
    // ==========================================

    function populateAlternateNames(info) {
        const container = document.getElementById('alternate-names');
        if (!container) return;
        const raw = info['AlternateNames'] || '';
        if (!raw) {
            container.parentElement.style.display = 'none';
            return;
        }
        const names = raw.split('|').map(n => n.trim()).filter(Boolean);
        container.textContent = names.join(' \u2022 ');
    }

    // ==========================================
    // DOM Population — Dynamic Assets
    // ==========================================

    function populateAssets(info) {
        const bridgeName = info['Bridge-ENG'] || BRIDGE_ID;

        // Map image
        const mapImg = document.getElementById('bridge-map');
        if (mapImg) {
            setImageSource(mapImg, ASSET_FILES.map, 'Map showing the location of ' + bridgeName);
        }

        // Charts
        const chart1 = document.getElementById('bridge-chart-1');
        const chart2 = document.getElementById('bridge-chart-2');
        if (chart1) {
            setImageSource(chart1, ASSET_FILES.chart1, '2024 border crossings by mode at ' + bridgeName);
        }
        if (chart2) {
            setImageSource(chart2, ASSET_FILES.chart2, 'Northbound border crossings 2014 to 2024 trend chart for ' + bridgeName);
        }

        // Gallery photos
        const photos = document.querySelectorAll('.gallery-photo');
        photos.forEach((img, i) => {
            if (ASSET_FILES.photos[i]) {
                setImageSource(img, ASSET_FILES.photos[i], img.alt || ('Photo of ' + bridgeName));
            }
        });
    }

    // ==========================================
    // Helpers
    // ==========================================

    function setText(id, value) {
        const el = document.getElementById(id);
        if (el && value) el.textContent = value;
    }

    function setImageSource(img, src, altText) {
        if (!img || !src) return;
        img.src = src;
        if (altText) img.alt = altText;
        img.addEventListener('error', () => {
            img.style.display = 'none';
        }, { once: true });
    }

    // ==========================================
    // PDF Download Button
    // ==========================================

    function initDownloadButton() {
        const btn = document.getElementById('download-pdf-btn');
        if (!btn) return;
        btn.addEventListener('click', () => {
            const queryBridge = encodeURIComponent(BRIDGE_ID);
            window.open('pdf-templates/bridge-factsheet.html?bridge=' + queryBridge + '&download=true', '_blank');
        });
    }

    // ==========================================
    // Main Loader
    // ==========================================

    function loadAll() {
        Promise.all([
            fetchText(FILES.info),
            fetchText(FILES.modes),
            fetchText(FILES.tolls)
        ]).then(texts => {
            const allInfo  = parseCSV(texts[0]);
            const allModes = parseCSV(texts[1]);
            const allTolls = parseCSV(texts[2]);

            const infoRows  = filterByBridgeID(allInfo);
            const modesRows = filterByBridgeID(allModes);
            const tollRows  = filterByBridgeID(allTolls);

            if (infoRows.length === 0) {
                console.error('bridge-loader: No data found for Bridge-ID "' + BRIDGE_ID + '"');
                const loader = document.getElementById('page-loader');
                if (loader) loader.textContent = 'No data found for this bridge. Please check the Bridge-ID.';
                return;
            }

            const info = infoRows[0];

            // Populate simple data-field elements
            populateFields(info);

            // Populate structured sections
            populateOwnership(info);
            populateHighways(info);
            populateAlternateNames(info);
            populateAssets(info);

            // Build dynamic tables
            buildHoursTable(modesRows);
            buildTollsTable(tollRows);

            // Update page title
            document.title = info['Bridge-ENG'] + ' | Texas-Mexico Border Crossings Guide | TxDOT';

            // Update download button aria-label with actual bridge name
            const btn = document.getElementById('download-pdf-btn');
            if (btn) btn.setAttribute('aria-label', 'Download fact sheet for ' + info['Bridge-ENG'] + ' as PDF');

            // Hide loading indicator
            const loader = document.getElementById('page-loader');
            if (loader) loader.style.display = 'none';

            // Show content
            const content = document.getElementById('bridge-content');
            if (content) content.style.opacity = '1';

            // Initialize PDF download button
            initDownloadButton();

        }).catch(err => {
            console.error('bridge-loader: Failed to load CSV data.', err);
            const loader = document.getElementById('page-loader');
            if (loader) {
                loader.textContent = 'Failed to load bridge data. Please try refreshing the page.';
            }
        });
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadAll);
    } else {
        loadAll();
    }
})();
