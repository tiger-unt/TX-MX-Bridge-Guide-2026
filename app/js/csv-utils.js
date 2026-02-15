/**
 * Shared CSV utilities for bridge pages and PDF fact sheets.
 * Attaches to window.CSVUtils for use without a module bundler.
 */
(function () {
    'use strict';

    const ICON_MAP = {
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
        'Transmigrant: Passenger Vehicle':          'transmigrant-vehicle.svg',
        'Rail':                                     'rail.svg'
    };

    /**
     * Parse a CSV string into an array of objects keyed by header row.
     * Handles quoted fields (including embedded commas and newlines).
     */
    function parseCSV(text) {
        if (typeof text !== 'string' || text.length === 0) return [];

        const rows = [];
        let current = '';
        let inQuotes = false;
        let fields = [];
        let i = 0;
        const len = text.length;

        while (i < len) {
            const ch = text[i];
            if (inQuotes) {
                if (ch === '"') {
                    if (i + 1 < len && text[i + 1] === '"') {
                        current += '"';
                        i += 2;
                        continue;
                    }
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
                    if (ch === '\r' && i + 1 < len && text[i + 1] === '\n') i++;
                    i++;
                } else {
                    current += ch;
                    i++;
                }
            }
        }

        if (current.length > 0 || fields.length > 0) {
            fields.push(current.trim());
            rows.push(fields);
        }

        if (inQuotes) {
            console.warn('parseCSV: detected unclosed quote in CSV input.');
        }

        if (rows.length === 0) return [];

        const rawHeaders = rows[0];
        const headers = [];
        const headerCounts = Object.create(null);

        for (let h = 0; h < rawHeaders.length; h++) {
            const base = (rawHeaders[h] || '').trim() || ('Column-' + (h + 1));
            const seen = (headerCounts[base] || 0) + 1;
            headerCounts[base] = seen;
            const finalName = seen === 1 ? base : (base + '__' + seen);
            if (seen > 1) {
                console.warn('parseCSV: duplicate header "' + base + '" renamed to "' + finalName + '".');
            }
            headers.push(finalName);
        }

        const objects = [];
        for (let r = 1; r < rows.length; r++) {
            if (rows[r].length === 1 && rows[r][0] === '') continue;
            if (rows[r].length !== rawHeaders.length) {
                console.warn(
                    'parseCSV: row ' + (r + 1) + ' has ' + rows[r].length +
                    ' columns; expected ' + rawHeaders.length + '.'
                );
            }
            const obj = {};
            for (let c = 0; c < headers.length; c++) {
                obj[headers[c]] = (rows[r][c] || '').replace(/_x0002_/g, '');
            }
            objects.push(obj);
        }
        return objects;
    }

    /**
     * Validate and normalize a Bridge-ID token for file paths and URLs.
     * Returns fallback when value is missing or invalid.
     */
    function sanitizeBridgeID(value, fallback) {
        const candidate = String(value || '').trim();
        if (/^[A-Z0-9-]+$/.test(candidate)) return candidate;
        if (candidate) {
            console.warn('sanitizeBridgeID: invalid Bridge-ID "' + candidate + '", using fallback.');
        }
        return typeof fallback === 'string' ? fallback : '';
    }

    /**
     * Return the full icon path for a crossing mode name.
     * @param {string} modeName
     * @param {string} iconBase - path prefix ending in '/'
     * @returns {string|null}
     */
    function getModeIcon(modeName, iconBase) {
        const name = modeName.trim().replace(/\s+/g, ' ');
        return ICON_MAP[name] ? iconBase + ICON_MAP[name] : null;
    }

    /**
     * Escape a string for safe insertion via innerHTML.
     */
    function escHTML(str) {
        const div = document.createElement('div');
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    }

    /**
     * Fetch a URL as text, throwing on non-ok responses.
     */
    function fetchText(url) {
        return fetch(url).then(r => {
            if (!r.ok) throw new Error(url + ' returned HTTP ' + r.status);
            return r.text();
        });
    }

    window.CSVUtils = { parseCSV, getModeIcon, escHTML, fetchText, sanitizeBridgeID };
})();
