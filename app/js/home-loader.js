/**
 * Homepage Content Loader
 * Fetches the markdown content file and populates the homepage DOM.
 *
 * Requires:
 *   - csv-utils.js loaded first (provides window.CSVUtils.fetchText, escHTML)
 *   - md-utils.js loaded first (provides window.MDUtils)
 *   - window.PAGE_LANG set before this script runs (default: "eng")
 */
(function () {
    'use strict';

    var fetchText = window.CSVUtils.fetchText;
    var escHTML = window.CSVUtils.escHTML;
    var MD = window.MDUtils;

    // Language for content file selection
    var LANG = (window.PAGE_LANG || 'eng').toLowerCase();
    var MD_PATH = '../Data/home-content-' + LANG + '.md';

    // Arrow SVG reused in region card links
    var ARROW_SVG = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
        '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>';

    // ==========================================
    // Main Loader
    // ==========================================

    function loadHomepage() {
        fetchText(MD_PATH).then(function (raw) {
            var parsed = MD.parseFrontmatter(raw);
            var meta = parsed.meta;
            var sections = MD.parseSections(parsed.body);

            // Update page metadata
            if (meta['page-title']) document.title = meta['page-title'];
            var metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc && meta['meta-description']) {
                metaDesc.setAttribute('content', meta['meta-description']);
            }

            // Build section lookup map
            var sectionMap = {};
            sections.forEach(function (s) { sectionMap[s.name] = s.content; });

            // Populate each section — all data flows from the MD content
            populateHero(sectionMap['hero']);
            populateIntro(sectionMap['intro']);
            populateBorderOverview(sectionMap['border-overview']);
            populateRegions(sectionMap['regions']);
            populateMap(sectionMap['map']);
            populateTradeRole(sectionMap['trade-role']);
            populateTradeTrends(sectionMap['trade-trends']);
            populateCrossings(sectionMap['crossings']);
            populateCrossingTrends(sectionMap['crossing-trends']);
            populateQuickFacts(sectionMap['quick-facts']);

            // Hide loader, show content
            var loader = document.getElementById('page-loader');
            if (loader) loader.style.display = 'none';
            var content = document.getElementById('home-content');
            if (content) content.style.opacity = '1';

        }).catch(function (err) {
            console.error('home-loader: Failed to load content.', err);
            var loader = document.getElementById('page-loader');
            if (loader) {
                loader.textContent = 'Failed to load page content. Please try refreshing.';
            }
        });
    }

    // ==========================================
    // Section: Hero
    // ==========================================

    function populateHero(content) {
        if (!content) return;
        var lines = content.trim().split(/\r?\n/);
        var title = '';
        var subtitle = '';

        for (var i = 0; i < lines.length; i++) {
            var line = lines[i].trim();
            if (!line) continue;
            var h = line.match(/^#\s+(.+)$/);
            if (h && !title) {
                title = h[1];
                continue;
            }
            if (title && !subtitle && line) {
                subtitle = line;
                break;
            }
        }

        var heroTitle = document.getElementById('hero-title');
        var heroSubtitle = document.getElementById('hero-subtitle');
        var heroSection = document.getElementById('hero-section');

        if (heroTitle && title) heroTitle.textContent = title;
        if (heroSubtitle && subtitle) heroSubtitle.textContent = subtitle;

        // Hero background image from standalone markdown image ![alt](path)
        var heroImage = MD.parseMarkdownImage(content);
        if (heroSection && heroImage) {
            heroSection.style.backgroundImage = "url('" + heroImage.src + "')";
        }
    }

    // ==========================================
    // Section: Introduction
    // ==========================================

    function populateIntro(content) {
        if (!content) return;
        var container = document.getElementById('intro-content');
        if (!container) return;
        var elements = MD.renderBlock(content);
        elements.forEach(function (el) {
            el.classList.add('text-lead');
            container.appendChild(el);
        });
    }

    // ==========================================
    // Section: Border Overview
    // ==========================================

    function populateBorderOverview(content) {
        if (!content) return;

        // Extract content before <!-- stats -->
        var beforeStats = content.split(/<!--\s*stats\s*-->/)[0];
        var elements = MD.renderBlock(beforeStats);

        // Heading goes into the centered prose container
        var proseContainer = document.getElementById('border-overview-prose');
        // Description paragraph(s) go into the content-narrow container below the image
        var descContainer = document.getElementById('border-overview-desc');

        elements.forEach(function (el) {
            if (el.tagName && /^H[1-3]$/.test(el.tagName)) {
                if (proseContainer) proseContainer.appendChild(el);
            } else {
                if (descContainer) descContainer.appendChild(el);
            }
        });

        // Image from standalone markdown image ![alt](path)
        var imageAttr = MD.parseMarkdownImage(content);
        var img = document.getElementById('border-overview-image');
        if (img && imageAttr) {
            img.src = imageAttr.src;
            img.alt = imageAttr.alt || 'Texas-Mexico border region overview';
        }

        // Stat cards
        var stats = MD.parseStats(content);
        var grid = document.getElementById('border-overview-stats');
        if (grid && stats.length > 0) buildStatCards(grid, stats);
    }

    // ==========================================
    // Section: Regions
    // ==========================================

    function populateRegions(content) {
        if (!content) return;

        // Header (heading + description before first region card)
        var header = document.getElementById('regions-header');
        if (header) {
            var beforeCards = content.split(/<!--\s*region:/)[0];
            var elements = MD.renderBlock(beforeCards);
            elements.forEach(function (el) {
                // Apply text-muted and section-desc to non-heading elements
                if (el.tagName && !/^H[1-3]$/.test(el.tagName)) {
                    el.classList.add('text-muted', 'section-desc');
                }
                header.appendChild(el);
            });
        }

        // Region cards
        var cards = MD.parseCards(content, 'region');
        var grid = document.getElementById('regions-grid');
        if (grid && cards.length > 0) {
            cards.forEach(function (card) {
                grid.appendChild(buildRegionCard(card));
            });
        }
    }

    // ==========================================
    // Section: Map
    // ==========================================

    function populateMap(content) {
        if (!content) return;

        var container = document.getElementById('map-header');
        if (container) {
            var elements = MD.renderBlock(content);
            elements.forEach(function (el) {
                if (el.tagName && !/^H[1-3]$/.test(el.tagName)) {
                    el.classList.add('text-muted');
                }
                container.appendChild(el);
            });
        }

        // Iframe URL from standalone markdown link [text](url)
        var linkAttr = MD.parseMarkdownLink(content);
        var iframe = document.querySelector('.map-embed__iframe');
        if (iframe && linkAttr) {
            iframe.setAttribute('data-src', linkAttr.url);
        }
    }

    // ==========================================
    // Section: Trade Role
    // ==========================================

    function populateTradeRole(content) {
        if (!content) return;

        // Extract heading separately (it goes above the two-column layout)
        var headingEl = document.getElementById('trade-role-heading');
        var headingText = '';
        var bodyContent = content;
        var headingMatch = content.match(/^##\s+(.+)$/m);
        if (headingMatch) {
            headingText = headingMatch[1];
            bodyContent = content.replace(/^##\s+.+\r?\n\r?\n?/m, '');
        }
        if (headingEl && headingText) {
            headingEl.innerHTML = MD.renderInline(headingText);
        }

        // Body prose (remove source and image attribute blocks before rendering)
        var contentContainer = document.getElementById('trade-role-content');
        if (contentContainer) {
            var proseContent = bodyContent
                .replace(/<!--\s*source\s*-->[\s\S]*$/m, '')
                .trim();
            var elements = MD.renderBlock(proseContent);
            elements.forEach(function (el) { contentContainer.appendChild(el); });
        }

        // Source
        var source = MD.parseSource(content);
        var sourceEl = document.getElementById('trade-role-source');
        if (sourceEl && source) sourceEl.innerHTML = '<em>' + escHTML(source) + '</em>';

        // Image from standalone markdown image ![alt](path)
        var imageAttr = MD.parseMarkdownImage(content);
        var img = document.getElementById('trade-role-image');
        if (img && imageAttr) {
            img.src = imageAttr.src;
            img.alt = imageAttr.alt || '';
        }
    }

    // ==========================================
    // Section: Trade Trends
    // ==========================================

    function populateTradeTrends(content) {
        if (!content) return;
        populateSectionWithStats('trade-trends', content);
    }

    // ==========================================
    // Section: Cross-Border Crossings
    // ==========================================

    function populateCrossings(content) {
        if (!content) return;
        populateSectionWithStats('crossings', content);
    }

    // ==========================================
    // Section: Crossing Volume Trends
    // ==========================================

    function populateCrossingTrends(content) {
        if (!content) return;

        // Header (heading text before first trend card)
        var header = document.getElementById('crossing-trends-header');
        if (header) {
            var beforeCards = content.split(/<!--\s*trend-card:/)[0];
            var elements = MD.renderBlock(beforeCards);
            elements.forEach(function (el) { header.appendChild(el); });
        }

        // Trend cards
        var cards = MD.parseCards(content, 'trend-card');
        var descriptiveGrid = document.getElementById('crossing-trends-descriptive');
        var metricGrid = document.getElementById('crossing-trends-metric');

        cards.forEach(function (card) {
            if (card.id === 'descriptive') {
                if (descriptiveGrid) descriptiveGrid.appendChild(buildTrendCard(card, false));
            } else if (card.id === 'metric') {
                if (metricGrid) metricGrid.appendChild(buildTrendCard(card, true));
            }
        });

        // Source
        var source = MD.parseSource(content);
        var sourceEl = document.getElementById('crossing-trends-source');
        if (sourceEl && source) sourceEl.innerHTML = '<em>' + escHTML(source) + '</em>';
    }

    // ==========================================
    // Section: Quick Facts
    // ==========================================

    function populateQuickFacts(content) {
        if (!content) return;

        var container = document.getElementById('quick-facts-content');
        if (container) {
            var elements = MD.renderBlock(content);
            elements.forEach(function (el) { container.appendChild(el); });
        }

        // Download link from standalone markdown link [text](url)
        var downloadLink = MD.parseMarkdownLink(content);
        var link = document.getElementById('quick-facts-link');
        if (link && downloadLink) {
            link.href = downloadLink.url;
            if (downloadLink.text) link.textContent = downloadLink.text;
        }
    }

    // ==========================================
    // Helper: Generic Section with Stats
    // ==========================================

    /**
     * Populates a section that has: heading + description, stats grid, optional extra prose, source.
     * DOM IDs follow convention: {sectionId}-header, {sectionId}-stats, {sectionId}-extra, {sectionId}-source
     */
    function populateSectionWithStats(sectionId, content) {
        // Header prose (before <!-- stats -->)
        var header = document.getElementById(sectionId + '-header');
        if (header) {
            var beforeStats = content.split(/<!--\s*stats\s*-->/)[0];
            var elements = MD.renderBlock(beforeStats);
            elements.forEach(function (el) {
                if (el.tagName && !/^H[1-3]$/.test(el.tagName)) {
                    el.classList.add('text-muted', 'section-desc');
                }
                header.appendChild(el);
            });
        }

        // Stat cards
        var stats = MD.parseStats(content);
        var grid = document.getElementById(sectionId + '-stats');
        if (grid && stats.length > 0) buildStatCards(grid, stats);

        // Extra prose after stats (e.g., additional paragraphs in crossings section)
        var afterStatsParts = content.split(/<!--\s*stats\s*-->/);
        if (afterStatsParts.length > 1) {
            var afterStats = afterStatsParts[1];
            // Remove the stat list lines (lines starting with -)
            var extraProse = afterStats
                .split(/\r?\n/)
                .filter(function (line) { return !/^\s*-\s+/.test(line); })
                .join('\n');
            // Remove source block
            extraProse = extraProse.replace(/<!--\s*source\s*-->[\s\S]*$/m, '').trim();
            if (extraProse) {
                var extraContainer = document.getElementById(sectionId + '-extra');
                if (extraContainer) {
                    var extraElements = MD.renderBlock(extraProse);
                    extraElements.forEach(function (el) { extraContainer.appendChild(el); });
                }
            }
        }

        // Source citation
        var source = MD.parseSource(content);
        var sourceEl = document.getElementById(sectionId + '-source');
        if (sourceEl && source) sourceEl.innerHTML = '<em>' + escHTML(source) + '</em>';
    }

    // ==========================================
    // DOM Builders
    // ==========================================

    /**
     * Build stat card elements and append to container.
     */
    function buildStatCards(container, stats) {
        stats.forEach(function (stat) {
            var card = document.createElement('div');
            card.className = 'stat-card';

            var val = document.createElement('div');
            val.className = 'stat-card__value';
            val.textContent = stat.value;

            var label = document.createElement('div');
            label.className = 'stat-card__label';
            label.textContent = stat.label;

            card.appendChild(val);
            card.appendChild(label);
            container.appendChild(card);
        });
    }

    /**
     * Build a region card element from parsed card data.
     */
    function buildRegionCard(data) {
        var article = document.createElement('article');
        article.className = 'region-card';

        // Image wrapper
        var imgWrapper = document.createElement('div');
        imgWrapper.className = 'region-card__image-wrapper';
        var img = document.createElement('img');
        img.className = 'region-card__image';
        img.src = data.image || '';
        img.alt = data.alt || data.title || '';
        img.loading = 'lazy';
        imgWrapper.appendChild(img);
        article.appendChild(imgWrapper);

        // Content
        var contentDiv = document.createElement('div');
        contentDiv.className = 'region-card__content';

        var h3 = document.createElement('h3');
        h3.className = 'region-card__title';
        h3.textContent = data.title || '';
        contentDiv.appendChild(h3);

        var desc = document.createElement('p');
        desc.className = 'region-card__description';
        desc.textContent = data.description || '';
        contentDiv.appendChild(desc);

        var link = document.createElement('a');
        link.className = 'region-card__link';
        link.href = data.link || '#';
        link.innerHTML = escHTML(data['link-text'] || 'Explore') + ' ' + ARROW_SVG;
        contentDiv.appendChild(link);

        article.appendChild(contentDiv);
        return article;
    }

    /**
     * Build a trend card element from parsed card data.
     * @param {Object} data - Card data with title, text, and optional value
     * @param {boolean} hasMetric - Whether to show a large metric value
     */
    function buildTrendCard(data, hasMetric) {
        var card = document.createElement('div');
        card.className = 'stat-card';

        var h3 = document.createElement('h3');
        h3.className = 'trend-card__title';
        h3.textContent = data.title || '';
        card.appendChild(h3);

        if (hasMetric && data.value) {
            var val = document.createElement('div');
            val.className = 'stat-card__value';
            val.textContent = data.value;
            card.appendChild(val);
        }

        var p = document.createElement('p');
        p.className = 'trend-card__text';
        p.textContent = data.text || '';
        card.appendChild(p);

        return card;
    }

    // ==========================================
    // Run on DOM Ready
    // ==========================================

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadHomepage);
    } else {
        loadHomepage();
    }
})();
