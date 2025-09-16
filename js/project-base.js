/**
 * Project Base Behaviors - Reusable for all project pages
 * 
 * Features:
 * - Header blur effect on scroll
 * - Smooth scroll navigation
 * - Hero video fallback handling
 * - Lazy YouTube iframe loading
 * - Responsive utilities
 * - Save-data preferences
 * - Intersection observers for animations
 */

class ProjectPageManager {
    constructor(options = {}) {
        this.options = {
            headerSelector: '.project-header',
            heroSelector: '.project-hero',
            videoSelector: '.project-hero__video',
            scrollCueSelector: '.project-hero__scroll-cue',
            demoFrameSelector: '.project-demo__frame',
            demoLoadButtonSelector: '.project-demo__load-button',
            transcriptToggleSelector: '.project-demo__transcript-toggle',
            transcriptSelector: '.project-demo__transcript',
            scrollThreshold: 24,
            youtubeVideoId: null, // Override in project-specific files
            ...options
        };
        
        this.header = null;
        this.hero = null;
        this.video = null;
        this.demoFrame = null;
        this.isVideoLoaded = false;
        this.isYouTubeLoaded = false;
        this.prefersReducedData = this.checkReducedDataPreference();
        
        this.init();
    }
    
    /**
     * Initialize all page behaviors
     */
    init() {
        this.findElements();
        this.setupHeaderEffects();
        this.setupHeroVideo();
        this.setupScrollEffects();
        this.setupDemoSection();
        this.setupAccessibilityFeatures();
        this.setupIntersectionObservers();
        
        console.log('Project page manager initialized');
    }
    
    /**
     * Find DOM elements
     */
    findElements() {
        this.header = document.querySelector(this.options.headerSelector);
        this.hero = document.querySelector(this.options.heroSelector);
        this.video = document.querySelector(this.options.videoSelector);
        this.demoFrame = document.querySelector(this.options.demoFrameSelector);
    }
    
    /**
     * Check if user prefers reduced data
     */
    checkReducedDataPreference() {
        // Check for Save-Data header support
        if ('connection' in navigator && 'saveData' in navigator.connection) {
            return navigator.connection.saveData;
        }
        
        // Check for reduced data preference in URL
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('reduced-data')) {
            return urlParams.get('reduced-data') === '1';
        }
        
        // Check localStorage preference
        try {
            return localStorage.getItem('prefer-reduced-data') === 'true';
        } catch {
            return false;
        }
    }
    
    /**
     * Setup header scroll effects
     */
    setupHeaderEffects() {
        if (!this.header) return;
        
        let ticking = false;
        
        const updateHeader = () => {
            const scrollY = window.scrollY;
            const shouldBlur = scrollY > this.options.scrollThreshold;
            
            this.header.classList.toggle('project-header--scrolled', shouldBlur);
            ticking = false;
        };
        
        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(updateHeader);
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', handleScroll, { passive: true });
        
        // Initial check
        updateHeader();
    }
    
    /**
     * Setup hero video with fallbacks
     */
    setupHeroVideo() {
        if (!this.video) return;
        
        // Don't autoplay video if user prefers reduced data or motion
        if (this.prefersReducedData || this.prefersReducedMotion()) {
            this.video.removeAttribute('autoplay');
            this.video.muted = true;
            return;
        }
        
        // Handle video load errors
        this.video.addEventListener('error', () => {
            console.warn('Hero video failed to load, using poster image');
            this.video.style.display = 'none';
        });
        
        // Ensure video is muted for autoplay compliance
        this.video.muted = true;
        
        // Handle video ready state
        this.video.addEventListener('loadeddata', () => {
            this.isVideoLoaded = true;
            console.log('Hero video loaded successfully');
        });
    }
    
    /**
     * Check if user prefers reduced motion
     */
    prefersReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    
    /**
     * Setup smooth scroll effects
     */
    setupScrollEffects() {
        const scrollCue = document.querySelector(this.options.scrollCueSelector);
        if (!scrollCue) return;
        
        scrollCue.addEventListener('click', () => {
            this.scrollToNextVisibleSection();
        });
        
        // Setup smooth scroll for all internal links
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (!link) return;
            
            const href = link.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                this.smoothScrollTo(target);
            }
        });
    }
    
    /**
     * Scroll to the next visible section
     */
    scrollToNextVisibleSection() {
        const sections = document.querySelectorAll('[data-section]');
        const heroRect = this.hero?.getBoundingClientRect();
        
        if (!heroRect) return;
        
        // Find first section below the fold that's not hidden
        for (const section of sections) {
            if (section === this.hero) continue; // Skip hero itself
            
            const isVisible = !section.hidden && 
                            !section.hasAttribute('aria-hidden') &&
                            section.style.display !== 'none';
            
            if (isVisible) {
                this.smoothScrollTo(section);
                break;
            }
        }
    }
    
    /**
     * Smooth scroll to element
     */
    smoothScrollTo(element, offset = 80) {
        const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetTop = elementTop - offset;
        
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
    
    /**
     * Setup demo section with lazy loading
     */
    setupDemoSection() {
        if (!this.demoFrame) return;
        
        const loadButton = document.querySelector(this.options.demoLoadButtonSelector);
        if (!loadButton) return;
        
        // Auto-load if not reduced data, otherwise wait for user click
        if (!this.prefersReducedData) {
            this.setupLazyYouTubeLoading();
        } else {
            loadButton.addEventListener('click', () => {
                this.loadYouTubeVideo();
            });
        }
        
        // Setup transcript toggle
        this.setupTranscriptToggle();
    }
    
    /**
     * Setup lazy YouTube loading with Intersection Observer
     */
    setupLazyYouTubeLoading() {
        if (!this.options.youtubeVideoId) {
            console.warn('No YouTube video ID provided for lazy loading');
            return;
        }
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.isYouTubeLoaded) {
                    this.loadYouTubeVideo();
                    observer.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '50px'
        });
        
        observer.observe(this.demoFrame);
    }
    
    /**
     * Load YouTube video iframe
     */
    loadYouTubeVideo() {
        if (this.isYouTubeLoaded || !this.options.youtubeVideoId) return;
        
        const placeholder = this.demoFrame.querySelector('.project-demo__placeholder');
        const iframe = document.createElement('iframe');
        
        iframe.className = 'project-demo__iframe';
        iframe.src = `https://www.youtube.com/embed/${this.options.youtubeVideoId}?rel=0&modestbranding=1`;
        iframe.title = 'Project Demo Video';
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        iframe.allowFullscreen = true;
        iframe.loading = 'lazy';
        
        // Replace placeholder with iframe
        if (placeholder) {
            placeholder.remove();
        }
        
        this.demoFrame.appendChild(iframe);
        this.isYouTubeLoaded = true;
        
        console.log('YouTube video loaded');
    }
    
    /**
     * Setup transcript toggle for accessibility
     */
    setupTranscriptToggle() {
        const toggle = document.querySelector(this.options.transcriptToggleSelector);
        const transcript = document.querySelector(this.options.transcriptSelector);
        
        if (!toggle || !transcript) return;
        
        toggle.addEventListener('click', () => {
            const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
            const newExpanded = !isExpanded;
            
            toggle.setAttribute('aria-expanded', newExpanded);
            transcript.hidden = !newExpanded;
            toggle.textContent = newExpanded ? 'Hide Transcript' : 'Show Transcript';
        });
    }
    
    /**
     * Setup accessibility features
     */
    setupAccessibilityFeatures() {
        // Handle focus management for dynamically loaded content
        this.setupFocusManagement();
        
        // Add skip links if needed
        this.addSkipLinks();
        
        // Enhance keyboard navigation
        this.enhanceKeyboardNavigation();
    }
    
    /**
     * Setup focus management
     */
    setupFocusManagement() {
        // Ensure proper focus order after dynamic content loads
        document.addEventListener('DOMNodeInserted', (e) => {
            if (e.target.nodeType === Node.ELEMENT_NODE) {
                const focusableElements = e.target.querySelectorAll(
                    'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                
                // Update focus order if needed
                focusableElements.forEach((el, index) => {
                    if (!el.hasAttribute('tabindex')) {
                        el.setAttribute('tabindex', '0');
                    }
                });
            }
        });
    }
    
    /**
     * Add skip links for screen readers
     */
    addSkipLinks() {
        const body = document.body;
        const mainContent = document.querySelector('main') || document.querySelector('[role="main"]');
        
        if (!mainContent) return;
        
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'skip-link';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: #000;
            color: #fff;
            padding: 8px;
            text-decoration: none;
            z-index: 10000;
            border-radius: 4px;
            transition: top 0.2s;
        `;
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        
        skipLink.addEventListener('click', (e) => {
            e.preventDefault();
            mainContent.focus();
            mainContent.scrollIntoView({ behavior: 'smooth' });
        });
        
        if (!mainContent.id) {
            mainContent.id = 'main-content';
        }
        
        body.insertBefore(skipLink, body.firstChild);
    }
    
    /**
     * Enhance keyboard navigation
     */
    enhanceKeyboardNavigation() {
        // Add escape key handling for modals/overlays
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                // Close any open overlays, panels, etc.
                const openOverlays = document.querySelectorAll('[aria-expanded="true"]');
                openOverlays.forEach(overlay => {
                    if (overlay.click) overlay.click();
                });
            }
        });
    }
    
    /**
     * Setup intersection observers for animations
     */
    setupIntersectionObservers() {
        // Animate elements as they come into view
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                }
            });
        }, observerOptions);
        
        // Observe animatable elements
        const animatableElements = document.querySelectorAll(
            '.project-blurb__spec, .project-demo__frame, .project-footer'
        );
        
        animatableElements.forEach(el => {
            el.classList.add('animate-on-scroll');
            observer.observe(el);
        });
    }
    
    /**
     * Public API for external use
     */
    getAPI() {
        return {
            scrollToSection: (selector) => {
                const element = document.querySelector(selector);
                if (element) this.smoothScrollTo(element);
            },
            loadYouTubeVideo: () => this.loadYouTubeVideo(),
            setYouTubeVideoId: (id) => {
                this.options.youtubeVideoId = id;
            },
            prefersReducedData: () => this.prefersReducedData,
            prefersReducedMotion: () => this.prefersReducedMotion()
        };
    }
}

// Auto-initialize when DOM is ready
let projectPageManager = null;

function initProjectPage(options = {}) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            projectPageManager = new ProjectPageManager(options);
            window.ProjectPage = projectPageManager.getAPI();
        });
    } else {
        projectPageManager = new ProjectPageManager(options);
        window.ProjectPage = projectPageManager.getAPI();
    }
}

// Add CSS for animations
const animationCSS = `
.animate-on-scroll {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.6s ease, transform 0.6s ease;
}

.animate-on-scroll.in-view {
    opacity: 1;
    transform: translateY(0);
}

.skip-link:focus {
    top: 6px !important;
}

@media (prefers-reduced-motion: reduce) {
    .animate-on-scroll {
        opacity: 1;
        transform: none;
        transition: none;
    }
}
`;

// Inject animation CSS
const style = document.createElement('style');
style.textContent = animationCSS;
document.head.appendChild(style);

// Export for ES modules
export { ProjectPageManager, initProjectPage };
export default ProjectPageManager;

// Auto-initialize with default options
// Individual project files can override by calling initProjectPage() with custom options
if (typeof window !== 'undefined') {
    initProjectPage();
}