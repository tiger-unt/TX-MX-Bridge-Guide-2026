/**
 * Bridge Page Data Loader
 * Fetches CSV data and populates the bridge page DOM.
 *
 * Usage: set window.BRIDGE_ID before this script runs, e.g.:
 *   <script>window.BRIDGE_ID = "ELP-ELP-PASO";</script>
 *   <script src="js/bridge-loader.js"></script>
 */
(function () {
    'use strict';

    var BRIDGE_ID = window.BRIDGE_ID;
    if (!BRIDGE_ID) {
        console.error('bridge-loader: window.BRIDGE_ID is not set.');
        return;
    }

    // Paths are relative to the HTML file inside app/
    var CSV_BASE = '../Data/';
    var FILES = {
        info:  CSV_BASE + 'border-info-eng.csv',
        modes: CSV_BASE + 'modes-info.csv',
        tolls: CSV_BASE + 'modes-tolls.csv'
    };

    // ==========================================
    // CSV Parser
    // ==========================================

    /**
     * Parse a CSV string into an array of objects keyed by header row.
     * Handles quoted fields (including fields with commas and newlines).
     */
    function parseCSV(text) {
        var rows = [];
        var current = '';
        var inQuotes = false;
        var fields = [];
        var i = 0;
        var len = text.length;

        while (i < len) {
            var ch = text[i];

            if (inQuotes) {
                if (ch === '"') {
                    // Escaped quote ""
                    if (i + 1 < len && text[i + 1] === '"') {
                        current += '"';
                        i += 2;
                        continue;
                    }
                    // End of quoted field
                    inQuotes = false;
                    i++;
                    continue;
                }
                current += ch;
                i++;
            } else {
                if (ch === '"') {
                    inQuotes = true;
                    i++;
                } else if (ch === ',') {
                    fields.push(current.trim());
                    current = '';
                    i++;
                } else if (ch === '\n' || ch === '\r') {
                    fields.push(current.trim());
                    current = '';
                    rows.push(fields);
                    fields = [];
                    // Handle \r\n
                    if (ch === '\r' && i + 1 < len && text[i + 1] === '\n') {
                        i++;
                    }
                    i++;
                } else {
                    current += ch;
                    i++;
                }
            }
        }

        // Last field / row
        if (current.length > 0 || fields.length > 0) {
            fields.push(current.trim());
            rows.push(fields);
        }

        if (rows.length === 0) return [];

        var headers = rows[0];
        var objects = [];
        for (var r = 1; r < rows.length; r++) {
            // Skip empty rows
            if (rows[r].length === 1 && rows[r][0] === '') continue;
            var obj = {};
            for (var c = 0; c < headers.length; c++) {
                obj[headers[c]] = (rows[r][c] || '').replace(/_x0002_/g, '');
            }
            objects.push(obj);
        }
        return objects;
    }

    // ==========================================
    // Data Filtering
    // ==========================================

    function filterByBridgeID(rows) {
        return rows.filter(function (row) {
            return row['Bridge-ID'] === BRIDGE_ID;
        });
    }

    // ==========================================
    // DOM Population — Simple Fields
    // ==========================================

    /**
     * Find all elements with [data-field] and set their text content
     * from the info row object.
     */
    function populateFields(info) {
        var els = document.querySelectorAll('[data-field]');
        els.forEach(function (el) {
            var field = el.getAttribute('data-field');
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
        var tbody = document.getElementById('hours-table-body');
        if (!tbody || modesRows.length === 0) return;

        // Clear placeholder
        tbody.innerHTML = '';

        modesRows.forEach(function (row) {
            var tr = document.createElement('tr');

            // Mode column
            var tdMode = document.createElement('td');
            tdMode.textContent = row['Modes'] || '';
            tr.appendChild(tdMode);

            // Combined Lane Details column (lanes + notes)
            var tdLaneDetails = document.createElement('td');
            var laneCount = row['InspectionLanes'] || '';
            var laneNotes = row['InspectionLaneNotes'] || '';

            if (laneCount && laneNotes) {
                tdLaneDetails.innerHTML = '<strong>' + laneCount + ' lanes</strong><br>' + laneNotes;
            } else if (laneCount) {
                tdLaneDetails.innerHTML = '<strong>' + laneCount + ' lanes</strong>';
            } else if (laneNotes) {
                tdLaneDetails.textContent = laneNotes;
            } else {
                tdLaneDetails.textContent = '—';
            }
            tr.appendChild(tdLaneDetails);

            // Combined Hours Column
            var tdHours = document.createElement('td');
            var cbpHours = row['Hours-of-Operation--CBP-Facilities'] || '';
            var aduanasHours = row['Hours-of-Operation--ADUANAS-Facilities'] || '';

            // Smart formatting: combine if same, show both if different
            if (cbpHours && aduanasHours) {
                if (cbpHours === aduanasHours) {
                    // Same hours - show once with both labels
                    tdHours.textContent = cbpHours + ' (CBP & ADUANAS)';
                } else {
                    // Different hours - show both with labels
                    tdHours.textContent = cbpHours + ' (CBP), ' + aduanasHours + ' (ADUANAS)';
                }
            } else if (cbpHours) {
                tdHours.textContent = cbpHours + ' (CBP)';
            } else if (aduanasHours) {
                tdHours.textContent = aduanasHours + ' (ADUANAS)';
            } else {
                tdHours.textContent = '—';
            }
            tr.appendChild(tdHours);

            tbody.appendChild(tr);
        });

        // Update "as of" note
        var asOf = modesRows[0]['HOO-As-of'];
        if (asOf) {
            setText('hours-as-of', asOf);
        }
    }

    // ==========================================
    // DOM Population — Toll Rates Table
    // ==========================================

    // Map mode names to icon files
    function getModeIcon(modeName) {
        // Normalize whitespace (some CSV entries have double spaces)
        var name = modeName.trim().replace(/\s+/g, ' ');

        var iconMap = {
            'Bus':                                      'bus.svg',
            'Commercial Truck':                         'commercial-truck.svg',
            'Commercial Truck (Empty)':                 'commercial-truck.svg',
            'Commercial Trucks':                        'commercial-truck.svg',
            'Commercial Trucks and Dual Tire Vehicles': 'commercial-truck.svg',
            'Dual Tire Pickup':                         'pickup-truck.svg',
            'Maquila Workers':                          'maquila-workers.svg',
            'Motorcycle':                               'motorcycle.svg',
            'Motorhome':                                'motorhome.svg',
            'Passenger Vehicle':                        'passenger-vehicle.svg',
            'Passenger Vehicles':                       'passenger-vehicle.svg',
            'Pedestrian':                               'pedestrian.svg',
            'Pedestrian or Bicycle':                    'pedestrian-bicycle.svg',
            'Pedestrians':                              'pedestrian.svg',
            'Pick-Up Trucks':                           'pickup-truck.svg',
            'Transmigrant: Bus or Truck':               'transmigrant-bus.svg',
            'Transmigrant: Passenger Vehicle':           'transmigrant-vehicle.svg',
            'Rail':                                     'rail.svg'
        };

        if (iconMap[name]) {
            return '../assets/icons/' + iconMap[name];
        }
        return null;
    }

    function buildTollsTable(tollRows) {
        var tbody = document.getElementById('tolls-table-body');
        if (!tbody || tollRows.length === 0) return;

        tbody.innerHTML = '';

        // Group rows by mode to calculate rowspan
        var modeGroups = [];
        var currentMode = null;
        var currentGroup = [];

        tollRows.forEach(function (row, index) {
            var modeName = row['Modes'] || '';
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
        modeGroups.forEach(function (group) {
            var iconPath = getModeIcon(group.mode);
            var rowspan = group.rows.length;

            // Check if all SB axles and tolls are the same within this mode group
            var firstSBAxles = group.rows[0]['AxlesSouthbound'] || '—';
            var firstSBTolls = group.rows[0]['SouthboundTolls'] || '—';
            var allSBSame = group.rows.every(function (r) {
                return (r['AxlesSouthbound'] || '—') === firstSBAxles &&
                       (r['SouthboundTolls'] || '—') === firstSBTolls;
            });

            group.rows.forEach(function (row, rowIndex) {
                var tr = document.createElement('tr');

                // Icon column (only on first row of group)
                if (rowIndex === 0) {
                    var tdIcon = document.createElement('td');
                    if (rowspan > 1) tdIcon.setAttribute('rowspan', rowspan);
                    if (iconPath) {
                        tdIcon.innerHTML = '<img src="' + iconPath + '" alt="" class="mode-icon" aria-hidden="true">';
                    }
                    tr.appendChild(tdIcon);

                    // Mode column (only on first row of group)
                    var tdMode = document.createElement('td');
                    if (rowspan > 1) tdMode.setAttribute('rowspan', rowspan);
                    tdMode.textContent = group.mode;
                    tr.appendChild(tdMode);

                    // SB Axles and Tolls (merge if all same within group)
                    if (allSBSame) {
                        var tdSBAxles = document.createElement('td');
                        if (rowspan > 1) tdSBAxles.setAttribute('rowspan', rowspan);
                        tdSBAxles.textContent = firstSBAxles;
                        tr.appendChild(tdSBAxles);

                        var tdSBTolls = document.createElement('td');
                        if (rowspan > 1) tdSBTolls.setAttribute('rowspan', rowspan);
                        tdSBTolls.textContent = firstSBTolls;
                        tr.appendChild(tdSBTolls);
                    }
                }

                // If SB is not merged, show SB columns for each row
                if (!allSBSame) {
                    var tdSBAxles = document.createElement('td');
                    tdSBAxles.textContent = row['AxlesSouthbound'] || '—';
                    tr.appendChild(tdSBAxles);

                    var tdSBTolls = document.createElement('td');
                    tdSBTolls.textContent = row['SouthboundTolls'] || '—';
                    tr.appendChild(tdSBTolls);
                }

                // NB Axles and Tolls (always shown for each row)
                var tdNBAxles = document.createElement('td');
                tdNBAxles.className = 'tolls-col--nb-axles';
                tdNBAxles.textContent = row['AxlesNorthbound'] || '—';
                tr.appendChild(tdNBAxles);

                var tdNBTolls = document.createElement('td');
                tdNBTolls.className = 'tolls-col--nb-toll';
                tdNBTolls.textContent = row['NorthboundTolls'] || '—';
                tr.appendChild(tdNBTolls);

                tbody.appendChild(tr);
            });
        });

        // Update "as of" note and source
        var asOf = tollRows[0]['TollsAsOf'];
        if (asOf) {
            setText('tolls-as-of', asOf);
        }
        var sources = tollRows[0]['Sources'];
        if (sources) {
            setText('tolls-source', sources);
        }
    }

    // ==========================================
    // DOM Population — Alternate Names
    // ==========================================

    function populateAlternateNames(info) {
        var container = document.getElementById('alternate-names');
        if (!container) return;
        var raw = info['AlternateNames'] || '';
        if (!raw) {
            container.parentElement.style.display = 'none';
            return;
        }
        var names = raw.split('|').map(function (n) { return n.trim(); }).filter(Boolean);
        container.textContent = names.join(' \u2022 ');
    }

    // ==========================================
    // Helpers
    // ==========================================

    function setText(id, value) {
        var el = document.getElementById(id);
        if (el && value) {
            el.textContent = value;
        }
    }

    // ==========================================
    // Main Loader
    // ==========================================

    function loadAll() {
        Promise.all([
            fetch(FILES.info).then(function (r) { return r.text(); }),
            fetch(FILES.modes).then(function (r) { return r.text(); }),
            fetch(FILES.tolls).then(function (r) { return r.text(); })
        ]).then(function (texts) {
            var allInfo  = parseCSV(texts[0]);
            var allModes = parseCSV(texts[1]);
            var allTolls = parseCSV(texts[2]);

            var infoRows  = filterByBridgeID(allInfo);
            var modesRows = filterByBridgeID(allModes);
            var tollRows  = filterByBridgeID(allTolls);

            if (infoRows.length === 0) {
                console.error('bridge-loader: No data found for Bridge-ID "' + BRIDGE_ID + '"');
                return;
            }

            var info = infoRows[0];

            // Populate simple data-field elements
            populateFields(info);

            // Populate structured sections
            populateOwnership(info);
            populateHighways(info);
            populateAlternateNames(info);

            // Build dynamic tables
            buildHoursTable(modesRows);
            buildTollsTable(tollRows);

            // Update page title
            document.title = info['Bridge-ENG'] + ' | Texas-Mexico Border Crossings Guide | TxDOT';

            // Hide loading indicator
            var loader = document.getElementById('page-loader');
            if (loader) loader.style.display = 'none';

            // Show content
            var content = document.getElementById('bridge-content');
            if (content) content.style.opacity = '1';

        }).catch(function (err) {
            console.error('bridge-loader: Failed to load CSV data.', err);
            var loader = document.getElementById('page-loader');
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
