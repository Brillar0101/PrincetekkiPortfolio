/**
 * Section Toggle System - Reusable for all project pages
 * 
 * Features:
 * - Toggle sections visibility with checkboxes
 * - Persist state to localStorage 
 * - URL parameter and hash override support
 * - Keyboard shortcuts (Ctrl+Shift+E)
 * - Full accessibility support
 * - Mobile responsive
 * 
 * Usage:
 * 1. Add data-section="name" to any section
 * 2. Include the toggle panel HTML markup
 * 3. Import this module script
 */

class SectionToggleManager {
    constructor() {
        this.panel = null;
        this.sections = new Map();
        this.projectName = this.getProjectName();
        this.storageKey = `project:${this.projectName}:sections`;
        
        this.init();
    }
    
    /**
     * Extract project name from URL for localStorage key
     */
    getProjectName() {
        const path = window.location.pathname;
        const filename = path.split('/').pop();
        return filename.replace('.html', '').replace(/[^a-z0-9-]/gi, '-');
    }
    
    /**
     * Initialize the section toggle system
     */
    init() {
        this.findSections();
        this.setupPanel();
        this.loadState();
        this.applyUrlOverrides();
        this.bindEvents();
        this.updatePanelVisibility();
        
        console.log(`Section Toggle initialized for project: ${this.projectName}`);
    }
    
    /**
     * Find all sections with data-section attributes
     */
    findSections() {
        const sectionElements = document.querySelectorAll('[data-section]');
        
        sectionElements.forEach(element => {
            const sectionName = element.getAttribute('data-section');
            if (sectionName) {
                this.sections.set(sectionName, {
                    element,
                    visible: true, // Default to visible
                    checkbox: null
                });
            }
        });
        
        console.log(`Found ${this.sections.size} toggleable sections:`, Array.from(this.sections.keys()));
    }
    
    /**
     * Setup the toggle panel and associate checkboxes with sections
     */
    setupPanel() {
        this.panel = document.getElementById('st-panel');
        if (!this.panel) {
            console.warn('Section toggle panel not found in DOM');
            return;
        }
        
        // Associate checkboxes with sections
        const checkboxes = this.panel.querySelectorAll('.st-panel__checkbox');
        checkboxes.forEach(checkbox => {
            const sectionName = checkbox.getAttribute('data-section');
            if (this.sections.has(sectionName)) {
                this.sections.get(sectionName).checkbox = checkbox;
                
                // Bind checkbox change event
                checkbox.addEventListener('change', (e) => {
                    this.toggleSection(sectionName, e.target.checked);
                });
            }
        });
        
        // Bind panel controls
        this.bindPanelEvents();
    }
    
    /**
     * Bind panel-specific events
     */
    bindPanelEvents() {
        if (!this.panel) return;
        
        // Close button
        const closeButton = this.panel.querySelector('.st-panel__close');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                this.hidePanel();
            });
        }
        
        // Reset button
        const resetButton = this.panel.querySelector('.st-panel__reset');
        if (resetButton) {
            resetButton.addEventListener('click', () => {
                this.resetLayout();
            });
        }
        
        // Handle clicks outside panel to close it
        document.addEventListener('click', (e) => {
            if (this.isPanelVisible() && !this.panel.contains(e.target)) {
                this.hidePanel();
            }
        });
        
        // Prevent panel from closing when clicking inside it
        this.panel.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
    
    /**
     * Bind global events
     */
    bindEvents() {
        // Keyboard shortcut: Ctrl+Shift+E (or Cmd+Shift+E on Mac)
        document.addEventListener('keydown', (e) => {
            const isModifierPressed = e.metaKey || e.ctrlKey;
            if (isModifierPressed && e.shiftKey && e.key === 'E') {
                e.preventDefault();
                this.togglePanel();
            }
        });
        
        // Handle URL parameter changes
        window.addEventListener('popstate', () => {
            this.applyUrlOverrides();
        });
        
        // Handle hash changes
        window.addEventListener('hashchange', () => {
            this.applyUrlOverrides();
        });
    }
    
    /**
     * Toggle section visibility
     */
    toggleSection(sectionName, visible) {
        const sectionData = this.sections.get(sectionName);
        if (!sectionData) return;
        
        sectionData.visible = visible;
        this.applySectionVisibility(sectionName, visible);
        this.saveState();
        
        console.log(`Toggled section "${sectionName}" to ${visible ? 'visible' : 'hidden'}`);
    }
    
    /**
     * Apply visibility to a section element
     */
    applySectionVisibility(sectionName, visible) {
        const sectionData = this.sections.get(sectionName);
        if (!sectionData) return;
        
        const { element, checkbox } = sectionData;
        
        if (visible) {
            // Show section
            element.removeAttribute('hidden');
            element.removeAttribute('aria-hidden');
            element.removeAttribute('inert');
            
            // Update tab order
            const focusableElements = element.querySelectorAll(
                'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            focusableElements.forEach(el => {
                if (el.hasAttribute('data-original-tabindex')) {
                    el.setAttribute('tabindex', el.getAttribute('data-original-tabindex'));
                    el.removeAttribute('data-original-tabindex');
                } else {
                    el.removeAttribute('tabindex');
                }
            });
        } else {
            // Hide section
            element.setAttribute('hidden', '');
            element.setAttribute('aria-hidden', 'true');
            
            // Add inert if supported
            if ('inert' in element) {
                element.inert = true;
            }
            
            // Remove from tab order
            const focusableElements = element.querySelectorAll(
                'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            focusableElements.forEach(el => {
                const currentTabindex = el.getAttribute('tabindex');
                if (currentTabindex && currentTabindex !== '-1') {
                    el.setAttribute('data-original-tabindex', currentTabindex);
                }
                el.setAttribute('tabindex', '-1');
            });
        }
        
        // Update checkbox state
        if (checkbox) {
            checkbox.checked = visible;
        }
    }
    
    /**
     * Show/hide the toggle panel
     */
    togglePanel() {
        if (this.isPanelVisible()) {
            this.hidePanel();
        } else {
            this.showPanel();
        }
    }
    
    showPanel() {
        if (!this.panel) return;
        
        this.panel.hidden = false;
        this.panel.classList.add('st-panel--entering');
        
        // Focus first checkbox for accessibility
        const firstCheckbox = this.panel.querySelector('.st-panel__checkbox');
        if (firstCheckbox) {
            setTimeout(() => firstCheckbox.focus(), 100);
        }
        
        // Remove entering class after animation
        setTimeout(() => {
            this.panel.classList.remove('st-panel--entering');
        }, 300);
    }
    
    hidePanel() {
        if (!this.panel) return;
        
        this.panel.classList.add('st-panel--leaving');
        
        setTimeout(() => {
            this.panel.hidden = true;
            this.panel.classList.remove('st-panel--leaving');
        }, 300);
    }
    
    isPanelVisible() {
        return this.panel && !this.panel.hidden;
    }
    
    /**
     * Reset all sections to visible
     */
    resetLayout() {
        this.sections.forEach((sectionData, sectionName) => {
            this.applySectionVisibility(sectionName, true);
            sectionData.visible = true;
        });
        
        this.saveState();
        console.log('Layout reset - all sections visible');
    }
    
    /**
     * Load state from localStorage
     */
    loadState() {
        try {
            const savedState = localStorage.getItem(this.storageKey);
            if (savedState) {
                const state = JSON.parse(savedState);
                
                // Apply saved visibility states
                Object.entries(state).forEach(([sectionName, visible]) => {
                    if (this.sections.has(sectionName)) {
                        this.applySectionVisibility(sectionName, visible);
                        this.sections.get(sectionName).visible = visible;
                    }
                });
                
                console.log('Loaded section state from localStorage:', state);
            }
        } catch (error) {
            console.warn('Failed to load section state:', error);
        }
    }
    
    /**
     * Save current state to localStorage
     */
    saveState() {
        try {
            const state = {};
            this.sections.forEach((sectionData, sectionName) => {
                state[sectionName] = sectionData.visible;
            });
            
            localStorage.setItem(this.storageKey, JSON.stringify(state));
        } catch (error) {
            console.warn('Failed to save section state:', error);
        }
    }
    
    /**
     * Apply URL parameter and hash overrides
     */
    applyUrlOverrides() {
        const urlParams = new URLSearchParams(window.location.search);
        const hash = window.location.hash;
        
        // Check for hash override (takes precedence, for sharing)
        if (hash.startsWith('#sections=')) {
            const sectionsParam = hash.slice(10); // Remove '#sections='
            this.applyVisibilityOverride(sectionsParam, false); // Don't persist hash overrides
            return;
        }
        
        // Check for URL parameter override
        if (urlParams.has('sections')) {
            const sectionsParam = urlParams.get('sections');
            this.applyVisibilityOverride(sectionsParam, true); // Persist URL param overrides
            return;
        }
    }
    
    /**
     * Apply visibility override from URL parameters
     */
    applyVisibilityOverride(sectionsParam, persist = true) {
        const visibleSections = sectionsParam.split(',').map(s => s.trim());
        
        // Hide all sections first
        this.sections.forEach((sectionData, sectionName) => {
            const shouldBeVisible = visibleSections.includes(sectionName);
            this.applySectionVisibility(sectionName, shouldBeVisible);
            sectionData.visible = shouldBeVisible;
        });
        
        if (persist) {
            this.saveState();
        }
        
        console.log('Applied URL override - visible sections:', visibleSections);
    }
    
    /**
     * Check if panel should be visible based on URL parameters
     */
    updatePanelVisibility() {
        const urlParams = new URLSearchParams(window.location.search);
        const shouldShowPanel = urlParams.has('edit') && urlParams.get('edit') === '1';
        
        if (shouldShowPanel) {
            this.showPanel();
        }
    }
    
    /**
     * Get current visibility state
     */
    getCurrentState() {
        const state = {};
        this.sections.forEach((sectionData, sectionName) => {
            state[sectionName] = sectionData.visible;
        });
        return state;
    }
    
    /**
     * Public API methods for external use
     */
    getAPI() {
        return {
            toggleSection: (name, visible) => this.toggleSection(name, visible),
            showSection: (name) => this.toggleSection(name, true),
            hideSection: (name) => this.toggleSection(name, false),
            resetLayout: () => this.resetLayout(),
            showPanel: () => this.showPanel(),
            hidePanel: () => this.hidePanel(),
            getCurrentState: () => this.getCurrentState(),
            getSectionNames: () => Array.from(this.sections.keys())
        };
    }
}

// Initialize when DOM is ready
let sectionToggleManager = null;

function initSectionToggle() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            sectionToggleManager = new SectionToggleManager();
            window.SectionToggle = sectionToggleManager.getAPI();
        });
    } else {
        sectionToggleManager = new SectionToggleManager();
        window.SectionToggle = sectionToggleManager.getAPI();
    }
}

// Auto-initialize
initSectionToggle();

// Export for ES modules
export { SectionToggleManager };
export default SectionToggleManager;