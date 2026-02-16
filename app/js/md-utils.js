/**
 * Markdown Content Utilities
 * Parses structured markdown files used as content sources for dynamic pages.
 * Attaches to window.MDUtils for use without a module bundler.
 *
 * Requires: csv-utils.js loaded first (provides window.CSVUtils.escHTML)
 *
 * Supported markdown format:
 *   - YAML-like frontmatter between --- delimiters
 *   - Section delimiters: <!-- section: name -->
 *   - Stat blocks: <!-- stats --> with - value | label lines
 *   - Card blocks: <!-- region: id --> or <!-- trend-card: type --> with - key: value lines
 *   - Source citations: <!-- source --> followed by text
 *   - Inline: **bold**, *italic*, [link](url)
 *   - Block: ## headings, ### subheadings, paragraphs, * unordered lists
 */
(function () {
    'use strict';

    // ==========================================
    // Frontmatter Parser
    // ==========================================

    /**
     * Extract YAML-like frontmatter from the top of a markdown file.
     * @param {string} text - Raw markdown file content
     * @returns {{ meta: Object, body: string }}
     */
    function parseFrontmatter(text) {
        var meta = {};
        var body = text;
        var match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
        if (match) {
            match[1].split(/\r?\n/).forEach(function (line) {
                var idx = line.indexOf(':');
                if (idx > 0) {
                    var key = line.substring(0, idx).trim();
                    var val = line.substring(idx + 1).trim();
                    meta[key] = val;
                }
            });
            body = match[2];
        }
        return { meta: meta, body: body };
    }

    // ==========================================
    // Section Parser
    // ==========================================

    /**
     * Split markdown body into named sections using <!-- section: name --> delimiters.
     * @param {string} body - Markdown body (after frontmatter removal)
     * @returns {Array<{ name: string, content: string }>}
     */
    function parseSections(body) {
        var parts = body.split(/<!--\s*section:\s*(\S+)\s*-->/);
        var sections = [];
        for (var i = 1; i < parts.length; i += 2) {
            sections.push({
                name: parts[i].trim(),
                content: parts[i + 1] || ''
            });
        }
        return sections;
    }

    // ==========================================
    // Stat Cards Parser
    // ==========================================

    /**
     * Extract stat card data from a <!-- stats --> block within section content.
     * Format: - value | label
     * @param {string} content - Section content
     * @returns {Array<{ value: string, label: string }>}
     */
    function parseStats(content) {
        var statsMatch = content.match(/<!--\s*stats\s*-->([\s\S]*?)(?=<!--|$)/);
        if (!statsMatch) return [];
        var lines = statsMatch[1].trim().split(/\r?\n/);
        return lines
            .filter(function (l) { return /^\s*-\s+/.test(l); })
            .map(function (l) {
                var text = l.replace(/^\s*-\s+/, '');
                var parts = text.split('|');
                return {
                    value: parts[0].trim(),
                    label: (parts[1] || '').trim()
                };
            });
    }

    // ==========================================
    // Structured Card Parser
    // ==========================================

    /**
     * Extract structured card blocks (e.g., region cards, trend cards).
     * Format: <!-- markerPrefix: id --> followed by - key: value lines
     * @param {string} content - Section content
     * @param {string} markerPrefix - e.g. "region" or "trend-card"
     * @returns {Array<Object>} Each object has { id, key: value, ... }
     */
    function parseCards(content, markerPrefix) {
        var regex = new RegExp(
            '<!--\\s*' + markerPrefix + ':\\s*(\\S+)\\s*-->([\\s\\S]*?)(?=<!--\\s*' + markerPrefix + ':|<!--\\s*section:|<!--\\s*source|$)',
            'g'
        );
        var cards = [];
        var match;
        while ((match = regex.exec(content)) !== null) {
            var data = { id: match[1] };
            var block = match[2];
            block.split(/\r?\n/).forEach(function (line) {
                var m = line.match(/^\s*-\s+(\S+?):\s+(.*)$/);
                if (m) data[m[1]] = m[2].trim();
            });
            cards.push(data);
        }
        return cards;
    }

    // ==========================================
    // Source Citation Parser
    // ==========================================

    /**
     * Extract a source citation from a <!-- source --> block.
     * @param {string} content - Section content
     * @returns {string|null}
     */
    function parseSource(content) {
        var match = content.match(/<!--\s*source\s*-->\s*\n\s*(.+)/);
        return match ? match[1].trim() : null;
    }

    // ==========================================
    // Inline Attribute Parser
    // ==========================================

    /**
     * Extract an inline attribute from a <!-- key: value --> or <!-- key: value | alt --> comment.
     * Used for section-level metadata like image paths, iframe URLs, download links.
     *
     * @param {string} content - Section content
     * @param {string} key - The attribute key to look for (e.g. "image", "iframe", "download", "hero-image")
     * @returns {{ value: string, alt: string }|null}
     */
    function parseAttribute(content, key) {
        var regex = new RegExp('<!--\\s*' + key + ':\\s*(.+?)\\s*-->');
        var match = content.match(regex);
        if (!match) return null;
        var parts = match[1].split('|');
        return {
            value: parts[0].trim(),
            alt: (parts[1] || '').trim()
        };
    }

    // ==========================================
    // Markdown Image Parser
    // ==========================================

    /**
     * Extract a standalone markdown image from section content.
     * Matches lines that contain only ![alt](src).
     * Used for section-level images (hero background, content images).
     *
     * @param {string} content - Section content
     * @returns {{ src: string, alt: string }|null}
     */
    function parseMarkdownImage(content) {
        var match = content.match(/^!\[([^\]]*)\]\(([^)]+)\)\s*$/m);
        if (!match) return null;
        return { src: match[2].trim(), alt: match[1].trim() };
    }

    // ==========================================
    // Markdown Link Parser
    // ==========================================

    /**
     * Extract a standalone markdown link from section content.
     * Matches lines that contain only [text](url).
     * Used for section-level links (iframe URLs, download buttons).
     *
     * @param {string} content - Section content
     * @returns {{ url: string, text: string }|null}
     */
    function parseMarkdownLink(content) {
        var match = content.match(/^\[([^\]]+)\]\(([^)]+)\)\s*$/m);
        if (!match) return null;
        return { url: match[2].trim(), text: match[1].trim() };
    }

    // ==========================================
    // Inline Markdown Renderer
    // ==========================================

    /**
     * Convert inline markdown to HTML string.
     * Supports: **bold**, *italic*, [link](url)
     *
     * Note: Content comes from trusted project MD files, not user input.
     * Basic HTML entity escaping is applied first, then markdown syntax is converted.
     *
     * @param {string} text - Single line or inline text
     * @returns {string} HTML string
     */
    function renderInline(text) {
        if (!text) return '';
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.+?)\*/g, '<em>$1</em>')
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
    }

    // ==========================================
    // Block Markdown Renderer
    // ==========================================

    /**
     * Convert a block of markdown text into an array of DOM elements.
     * Supports: ## headings, ### subheadings, paragraphs, * or - unordered lists.
     * Strips out <!-- stats -->, <!-- source -->, <!-- region: -->, <!-- trend-card: --> blocks.
     *
     * @param {string} content - Multi-line markdown content
     * @returns {Array<HTMLElement>}
     */
    function renderBlock(content) {
        if (!content) return [];
        var elements = [];

        // Strip structured data blocks (handled by their own parsers)
        // Strip inline attribute comments (<!-- key: value --> on a single line)
        var prose = content
            .replace(/<!--\s*stats\s*-->[\s\S]*?(?=\n\n|<!--|$)/g, '')
            .replace(/<!--\s*source\s*-->[\s\S]*?(?=\n\n|<!--|$)/g, '')
            .replace(/<!--\s*region:\s*\S+\s*-->[\s\S]*?(?=<!--\s*region:|<!--\s*section:|$)/g, '')
            .replace(/<!--\s*trend-card:\s*\S+\s*-->[\s\S]*?(?=<!--\s*trend-card:|<!--\s*section:|<!--\s*source|$)/g, '')
            .replace(/^!\[[^\]]*\]\([^)]+\)\s*$/gm, '')
            .replace(/^\[[^\]]+\]\([^)]+\)\s*$/gm, '')
            .trim();

        if (!prose) return elements;

        // Split into blocks by double newlines
        var blocks = prose.split(/\n\n+/);

        blocks.forEach(function (block) {
            block = block.trim();
            if (!block) return;

            // Heading: ## or ###
            var headingMatch = block.match(/^(#{1,3})\s+(.+)$/);
            if (headingMatch) {
                var level = headingMatch[1].length;
                var el = document.createElement('h' + level);
                el.innerHTML = renderInline(headingMatch[2]);
                elements.push(el);
                return;
            }

            // Unordered list: lines starting with * or -
            if (/^\s*[\*\-]\s+/.test(block)) {
                var ul = document.createElement('ul');
                block.split(/\r?\n/).forEach(function (line) {
                    var liMatch = line.match(/^\s*[\*\-]\s+(.+)$/);
                    if (liMatch) {
                        var li = document.createElement('li');
                        li.innerHTML = renderInline(liMatch[1]);
                        ul.appendChild(li);
                    }
                });
                elements.push(ul);
                return;
            }

            // Default: paragraph
            var p = document.createElement('p');
            p.innerHTML = renderInline(block.replace(/\r?\n/g, ' '));
            elements.push(p);
        });

        return elements;
    }

    // ==========================================
    // Export
    // ==========================================

    window.MDUtils = {
        parseFrontmatter: parseFrontmatter,
        parseSections: parseSections,
        parseStats: parseStats,
        parseCards: parseCards,
        parseSource: parseSource,
        parseAttribute: parseAttribute,
        parseMarkdownImage: parseMarkdownImage,
        parseMarkdownLink: parseMarkdownLink,
        renderInline: renderInline,
        renderBlock: renderBlock
    };
})();
