/**
 * Texas-Mexico Border Crossings Guide
 * Main JavaScript file
 */

(function() {
    'use strict';

    // ==========================================
    // DOM Ready Handler
    // ==========================================
    document.addEventListener('DOMContentLoaded', function() {
        initLanguageDropdown();
        initMobileNavigation();
        initDropdownNavigation();
        initDataVizTabs();
        initScrollAnimations();
    });

    // ==========================================
    // Language Dropdown
    // ==========================================
    function initLanguageDropdown() {
        const langToggle = document.querySelector('.lang-dropdown__toggle');
        const langMenu = document.querySelector('.lang-dropdown__menu');

        if (!langToggle || !langMenu) return;

        langToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            const isExpanded = langToggle.getAttribute('aria-expanded') === 'true';
            langToggle.setAttribute('aria-expanded', !isExpanded);
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!langToggle.contains(e.target) && !langMenu.contains(e.target)) {
                langToggle.setAttribute('aria-expanded', 'false');
            }
        });

        // Close on escape key (only when dropdown is open)
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && langToggle.getAttribute('aria-expanded') === 'true') {
                langToggle.setAttribute('aria-expanded', 'false');
                langToggle.focus();
            }
        });
    }

    // ==========================================
    // Mobile Navigation
    // ==========================================
    function initMobileNavigation() {
        const navToggle = document.querySelector('.main-nav__toggle');
        const navMenu = document.querySelector('.main-nav__menu');

        if (!navToggle || !navMenu) return;

        navToggle.addEventListener('click', function() {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('is-open');
        });

        // Handle dropdown items on mobile
        const dropdownItems = document.querySelectorAll('.main-nav__item--has-dropdown');
        dropdownItems.forEach(function(item) {
            const link = item.querySelector('.main-nav__link');
            
            link.addEventListener('click', function(e) {
                // Only prevent default on mobile
                if (window.innerWidth < 1024) {
                    e.preventDefault();
                    item.classList.toggle('is-open');
                }
            });
        });
    }

    // ==========================================
    // Desktop Dropdown Navigation
    // ==========================================
    function initDropdownNavigation() {
        const dropdownItems = document.querySelectorAll('.main-nav__item--has-dropdown');

        dropdownItems.forEach(function(item) {
            const link = item.querySelector('.main-nav__link');

            // Keyboard navigation
            link.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const isExpanded = link.getAttribute('aria-expanded') === 'true';
                    link.setAttribute('aria-expanded', !isExpanded);
                }
            });

            // Update aria-expanded on hover (desktop only)
            item.addEventListener('mouseenter', function() {
                if (window.innerWidth >= 1024) {
                    link.setAttribute('aria-expanded', 'true');
                }
            });

            item.addEventListener('mouseleave', function() {
                if (window.innerWidth >= 1024) {
                    link.setAttribute('aria-expanded', 'false');
                }
            });
        });
    }

    // ==========================================
    // Data Visualization Tabs
    // ==========================================
    function initDataVizTabs() {
        const tabs = document.querySelectorAll('.data-viz-tab');
        const panels = document.querySelectorAll('.data-viz-panel');

        if (tabs.length === 0) return;

        tabs.forEach(function(tab) {
            tab.addEventListener('click', function() {
                const vizId = tab.dataset.viz;

                // Update active tab
                tabs.forEach(function(t) {
                    t.classList.remove('data-viz-tab--active');
                    t.setAttribute('aria-selected', 'false');
                });
                tab.classList.add('data-viz-tab--active');
                tab.setAttribute('aria-selected', 'true');

                // Show corresponding panel
                panels.forEach(function(p) {
                    p.style.display = 'none';
                    p.setAttribute('aria-hidden', 'true');
                });
                
                const activePanel = document.getElementById('viz-' + vizId);
                if (activePanel) {
                    activePanel.style.display = 'block';
                    activePanel.setAttribute('aria-hidden', 'false');
                }
            });

            // Keyboard navigation for tabs
            tab.addEventListener('keydown', function(e) {
                let newTab;
                if (e.key === 'ArrowRight') {
                    newTab = tab.nextElementSibling || tabs[0];
                } else if (e.key === 'ArrowLeft') {
                    newTab = tab.previousElementSibling || tabs[tabs.length - 1];
                }

                if (newTab) {
                    newTab.focus();
                    newTab.click();
                }
            });
        });
    }

    // ==========================================
    // Scroll Animations for Region Pages
    // ==========================================
    function initScrollAnimations() {
        const sections = document.querySelectorAll('.region-narrative__section');
        
        if (sections.length === 0) return;

        // Simple Intersection Observer for scroll-triggered effects
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    
                    // Dispatch custom event for map updates
                    const mapView = entry.target.dataset.mapView;
                    if (mapView) {
                        document.dispatchEvent(new CustomEvent('mapViewChange', {
                            detail: { view: mapView }
                        }));
                    }
                }
            });
        }, {
            threshold: 0.5,
            rootMargin: '-100px 0px'
        });

        sections.forEach(function(section) {
            observer.observe(section);
        });
    }

    // ==========================================
    // Search Form Enhancement
    // ==========================================
    function initSearchForm() {
        const searchForm = document.querySelector('.search-form');
        const searchInput = document.querySelector('.search-form__input');

        if (!searchForm || !searchInput) return;

        // Prevent empty searches
        searchForm.addEventListener('submit', function(e) {
            if (searchInput.value.trim() === '') {
                e.preventDefault();
                searchInput.focus();
            }
        });
    }

    // ==========================================
    // Utility Functions
    // ==========================================
    
    // Debounce function for performance
    function debounce(func, wait) {
        let timeout;
        return function executedFunction() {
            const context = this;
            const args = arguments;
            const later = function() {
                timeout = null;
                func.apply(context, args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Throttle function for scroll events
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(function() {
                    inThrottle = false;
                }, limit);
            }
        };
    }

    // Expose utility functions globally if needed
    window.BorderCrossings = {
        debounce: debounce,
        throttle: throttle
    };

})();

// ==========================================
// CSS for Data Viz Tabs (add to components.css if needed)
// ==========================================
/*
.data-viz-container {
    background: var(--color-white);
    border-radius: var(--border-radius-lg);
    overflow: hidden;
    box-shadow: var(--shadow-md);
}

.data-viz-tabs {
    display: flex;
    border-bottom: 1px solid var(--color-border);
    overflow-x: auto;
}

.data-viz-tab {
    flex: 1;
    padding: var(--space-4);
    background: transparent;
    border: none;
    font-weight: var(--font-weight-medium);
    color: var(--color-text-light);
    cursor: pointer;
    transition: all var(--transition-fast);
    white-space: nowrap;
}

.data-viz-tab:hover {
    color: var(--color-primary);
    background: var(--color-background-alt);
}

.data-viz-tab--active {
    color: var(--color-primary);
    border-bottom: 3px solid var(--color-primary);
    margin-bottom: -1px;
}

.data-viz-panel {
    padding: var(--space-6);
    min-height: 300px;
}

.data-viz-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 250px;
    background: var(--color-background-alt);
    border-radius: var(--border-radius);
    color: var(--color-text-light);
}
*/
