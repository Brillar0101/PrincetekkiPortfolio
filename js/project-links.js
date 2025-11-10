// Updated project-links.js - Complete URL mapping for all projects

// Project URL mapping - maps project titles to their HTML file names
const PROJECT_URL_MAP = {
    // Embedded Systems
    "Smart Weather Monitoring System": "smart-weather-monitoring-system.html",
    "Smart Home Controller": "smart-home-controller.html",
    "Fitness Tracker Device": "fitness-tracker-device.html",
    "Motor Control System": "motor-control-system.html",
    "Smart Security Gateway": "smart-security-gateway.html",
    
    // Game Development
    "Custom Arcade Console": "custom-arcade-console.html",
    "Haptic VR Controller": "haptic-vr-controller.html",
    "LED Matrix Gaming Board": "led-matrix-gaming-board.html",
    "DIY Racing Simulator Rig": "diy-racing-simulator-rig.html",
    "Portable Gaming Device": "portable-gaming-device.html",
    
    // PCB Design
    "Multi-Rail Power Supply": "multi-rail-power-supply.html",
    "2.4GHz Transceiver Board": "2-4ghz-transceiver-board.html",
    "Multi-Sensor Interface PCB": "multi-sensor-interface-pcb.html",
    "Class-D Audio Amplifier": "class-d-audio-amplifier.html",
    "USB-C Development Board": "usb-c-development-board.html",
    
    // Computer Vision
    "Tennis Analysis System": "tennis_analysis_system.html",
    "Synthetic Fashion Generator": "synthetic_fashion_generator.html",
    "Industrial Inspection System": "industrial-inspection-system.html",
    "Hand Gesture Recognition": "hand-gesture-recognition.html",
    "Three Seconds Violation": "3_seconds_violation.html"
};

// Function to make project cards clickable
function makeProjectCardsClickable() {
    console.log('Making project cards clickable...');
    
    // Handle portfolio project cards
    const portfolioCards = document.querySelectorAll('.project-card-detailed');
    portfolioCards.forEach(card => {
        // Skip hidden cards
        if (card.style.display === 'none') return;
        
        const projectTitle = card.querySelector('h4')?.textContent?.trim();
        if (!projectTitle) return;
        
        // Skip if already processed
        if (card.hasAttribute('data-clickable-processed')) return;
        
        // Mark as processed
        card.setAttribute('data-clickable-processed', 'true');
        card.setAttribute('data-project-id', projectTitle);
        
        // Add cursor pointer and hover effect
        card.style.cursor = 'pointer';
        card.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
        
        // Add click event listener
        card.addEventListener('click', function(e) {
            // Don't trigger if clicking on status badge
            if (e.target.closest('.project-status-badge')) return;
            
            const projectUrl = PROJECT_URL_MAP[projectTitle];
            if (projectUrl) {
                // Add loading state
                card.style.opacity = '0.7';
                card.style.pointerEvents = 'none';
                
                console.log(`Navigating to: projects/${projectUrl}`);
                window.location.href = `projects/${projectUrl}`;
            } else {
                console.warn(`No URL mapping found for project: ${projectTitle}`);
                // Fallback: create URL from title
                const fallbackUrl = projectTitle.toLowerCase()
                    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
                    .replace(/\s+/g, '-') // Replace spaces with hyphens
                    .replace(/-+/g, '-') // Remove multiple consecutive hyphens
                    + '.html';
                
                console.log(`Using fallback URL: projects/${fallbackUrl}`);
                window.location.href = `projects/${fallbackUrl}`;
            }
        });
        
        // Enhanced hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
            this.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.2)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-5px)'; // Keep slight elevation from original hover
            this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
        });
        
        // Add keyboard support
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `View details for ${projectTitle}`);
        
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
    
    // Handle featured project cards on home page
    const featuredCards = document.querySelectorAll('.project-card');
    featuredCards.forEach(card => {
        const projectTitle = card.querySelector('h4')?.textContent?.trim();
        if (!projectTitle) return;
        
        // Skip if already processed
        if (card.hasAttribute('data-clickable-processed')) return;
        
        // Mark as processed
        card.setAttribute('data-clickable-processed', 'true');
        card.setAttribute('data-project-id', projectTitle);
        
        // Add cursor pointer
        card.style.cursor = 'pointer';
        card.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
        
        // Add click event listener
        card.addEventListener('click', function(e) {
            // Don't trigger if clicking on status badge
            if (e.target.closest('.project-status-badge')) return;
            
            const projectUrl = PROJECT_URL_MAP[projectTitle];
            if (projectUrl) {
                // Add loading state
                card.style.opacity = '0.7';
                card.style.pointerEvents = 'none';
                
                console.log(`Navigating to: projects/${projectUrl}`);
                window.location.href = `projects/${projectUrl}`;
            } else {
                console.warn(`No URL mapping found for featured project: ${projectTitle}`);
                // Fallback: create URL from title
                const fallbackUrl = projectTitle.toLowerCase()
                    .replace(/[^a-z0-9\s-]/g, '')
                    .replace(/\s+/g, '-')
                    .replace(/-+/g, '-')
                    + '.html';
                
                console.log(`Using fallback URL: projects/${fallbackUrl}`);
                window.location.href = `projects/${fallbackUrl}`;
            }
        });
        
        // Add hover effect to featured cards
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.2)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
        });
        
        // Add keyboard support
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `View details for ${projectTitle}`);
        
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
    
    console.log(`Made ${portfolioCards.length + featuredCards.length} project cards clickable`);
}

// Function to add visual indicators that cards are clickable
function addClickableIndicators() {
    // Check if CSS already added
    if (document.querySelector('#clickable-indicators-css')) return;
    
    const css = `
        .project-card-detailed {
            cursor: pointer;
            user-select: none;
            position: relative;
            overflow: hidden;
        }
        
        .project-card {
            cursor: pointer;
            user-select: none;
            position: relative;
            overflow: hidden;
        }
        
        /* Clickable overlay effect */
        .project-card-detailed::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
            border-radius: 15px;
        }
        
        .project-card-detailed:hover::after {
            opacity: 1;
        }
        
        .project-card::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
            border-radius: 15px;
        }
        
        .project-card:hover::after {
            opacity: 1;
        }
        
        /* Add a subtle click indicator */
        .project-card-detailed:active,
        .project-card:active {
            transform: scale(0.98) !important;
        }
        
        /* Focus styles for accessibility */
        .project-card-detailed:focus,
        .project-card:focus {
            outline: 3px solid #007acc;
            outline-offset: 2px;
        }
        
        /* Make sure status badges don't block clicks but remain clickable themselves */
        .project-status-badge {
            pointer-events: auto;
            z-index: 10;
        }
        
        /* Loading state */
        .project-card-detailed.loading,
        .project-card.loading {
            opacity: 0.7 !important;
            pointer-events: none;
        }
        
        /* Mobile specific styles */
        @media (max-width: 768px) {
            .project-card-detailed:hover::after,
            .project-card:hover::after {
                opacity: 0.5;
            }
        }
        
        /* Reduced motion preferences */
        @media (prefers-reduced-motion: reduce) {
            .project-card-detailed,
            .project-card {
                transition: none !important;
            }
            
            .project-card-detailed::after,
            .project-card::after {
                transition: none !important;
            }
        }
    `;
    
    const style = document.createElement('style');
    style.id = 'clickable-indicators-css';
    style.textContent = css;
    document.head.appendChild(style);
}

// Function to debug project links
function debugProjectLinks() {
    console.log('=== PROJECT LINKS DEBUG ===');
    
    const portfolioCards = document.querySelectorAll('.project-card-detailed');
    const featuredCards = document.querySelectorAll('.project-card');
    
    console.log(`Found ${portfolioCards.length} portfolio cards and ${featuredCards.length} featured cards`);
    
    portfolioCards.forEach((card, index) => {
        const title = card.querySelector('h4')?.textContent?.trim();
        const url = PROJECT_URL_MAP[title];
        const isVisible = card.style.display !== 'none';
        
        console.log(`Portfolio Card ${index + 1}:`, {
            title,
            url: url || 'NO MAPPING',
            visible: isVisible,
            clickable: card.style.cursor === 'pointer'
        });
    });
    
    featuredCards.forEach((card, index) => {
        const title = card.querySelector('h4')?.textContent?.trim();
        const url = PROJECT_URL_MAP[title];
        
        console.log(`Featured Card ${index + 1}:`, {
            title,
            url: url || 'NO MAPPING',
            clickable: card.style.cursor === 'pointer'
        });
    });
    
    console.log('=== END DEBUG ===');
}

// Function to validate all project URLs exist
function validateProjectUrls() {
    const missingUrls = [];
    const allTitles = new Set();
    
    // Collect all project titles from the page
    document.querySelectorAll('.project-card-detailed h4, .project-card h4').forEach(h4 => {
        const title = h4.textContent?.trim();
        if (title) allTitles.add(title);
    });
    
    // Check if each title has a URL mapping
    allTitles.forEach(title => {
        if (!PROJECT_URL_MAP[title]) {
            missingUrls.push(title);
        }
    });
    
    if (missingUrls.length > 0) {
        console.warn('Missing URL mappings for projects:', missingUrls);
        return false;
    }
    
    console.log('All project titles have URL mappings!');
    return true;
}

// Function to initialize clickable project cards
function initializeClickableProjectCards() {
    console.log('Initializing clickable project cards...');
    
    // Add CSS for clickable indicators
    addClickableIndicators();
    
    // Function to setup cards with delay for DOM readiness
    const setupCards = () => {
        setTimeout(() => {
            makeProjectCardsClickable();
            validateProjectUrls();
        }, 1000);
    };
    
    // Make cards clickable on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupCards);
    } else {
        setupCards();
    }
    
    // Re-run when portfolio section is shown
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a');
        if (link && (link.getAttribute('href') === '#portfolio' || link.textContent.includes('Portfolio'))) {
            setTimeout(() => {
                makeProjectCardsClickable();
            }, 500);
        }
    });
    
    // Re-run when featured projects are populated
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && mutation.target.id === 'featured-projects-scroll') {
                setTimeout(() => {
                    makeProjectCardsClickable();
                }, 200);
            }
        });
    });
    
    const featuredContainer = document.getElementById('featured-projects-scroll');
    if (featuredContainer) {
        observer.observe(featuredContainer, { childList: true, subtree: true });
    }
    
    // Also observe portfolio sections for changes
    const portfolioSection = document.querySelector('.portfolio-sections');
    if (portfolioSection) {
        observer.observe(portfolioSection, { childList: true, subtree: true });
    }
}

// Export functions for global use
window.ProjectClickHandler = {
    makeProjectCardsClickable,
    PROJECT_URL_MAP,
    debugProjectLinks,
    validateProjectUrls,
    
    // Utility function to update URL mapping
    updateProjectUrl: (projectTitle, url) => {
        PROJECT_URL_MAP[projectTitle] = url;
        console.log(`Updated URL for "${projectTitle}": ${url}`);
        // Re-setup cards after URL update
        setTimeout(makeProjectCardsClickable, 100);
    },
    
    // Function to refresh clickable cards
    refreshClickableCards: () => {
        makeProjectCardsClickable();
    },
    
    // Function to get missing URL mappings
    getMissingUrls: () => {
        const missingUrls = [];
        const allTitles = new Set();
        
        document.querySelectorAll('.project-card-detailed h4, .project-card h4').forEach(h4 => {
            const title = h4.textContent?.trim();
            if (title) allTitles.add(title);
        });
        
        allTitles.forEach(title => {
            if (!PROJECT_URL_MAP[title]) {
                missingUrls.push(title);
            }
        });
        
        return missingUrls;
    }
};

// Auto-initialize
initializeClickableProjectCards();

// Console helper
console.log(`
🔗 Project Click Handler loaded!

Features:
✅ Click any project card to view details
✅ Enhanced hover effects  
✅ Keyboard navigation support
✅ Status badges remain clickable
✅ Automatic URL mapping
✅ Loading states
✅ Accessibility support

Debug Commands:
- ProjectClickHandler.debugProjectLinks()
- ProjectClickHandler.validateProjectUrls() 
- ProjectClickHandler.getMissingUrls()
- ProjectClickHandler.refreshClickableCards()
- ProjectClickHandler.updateProjectUrl('Project Name', 'filename.html')

${PROJECT_URL_MAP ? Object.keys(PROJECT_URL_MAP).length : 0} project URLs mapped.
`);