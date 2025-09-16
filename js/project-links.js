// Add this to your main.js file or create as project-links.js

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
    "Real-time Face Detection System": "real-time-face-detection-system.html",
    "Autonomous Drone Navigation": "autonomous-drone-navigation.html",
    "Industrial Inspection System": "industrial-inspection-system.html",
    "Hand Gesture Recognition": "hand-gesture-recognition.html",
    "Intelligent Parking System": "intelligent-parking-system.html"
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
        
        // Add cursor pointer and hover effect
        card.style.cursor = 'pointer';
        card.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
        
        // Add click event listener
        card.addEventListener('click', function(e) {
            // Don't trigger if clicking on status badge
            if (e.target.closest('.project-status-badge')) return;
            
            const projectUrl = PROJECT_URL_MAP[projectTitle];
            if (projectUrl) {
                window.location.href = `projects/${projectUrl}`;
            } else {
                console.warn(`No URL mapping found for project: ${projectTitle}`);
                // Fallback: create URL from title
                const fallbackUrl = projectTitle.toLowerCase()
                    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
                    .replace(/\s+/g, '-') // Replace spaces with hyphens
                    .replace(/-+/g, '-') // Remove multiple consecutive hyphens
                    + '.html';
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
    });
    
    // Handle featured project cards on home page
    const featuredCards = document.querySelectorAll('.project-card');
    featuredCards.forEach(card => {
        const projectTitle = card.querySelector('h4')?.textContent?.trim();
        if (!projectTitle) return;
        
        // Add cursor pointer
        card.style.cursor = 'pointer';
        card.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
        
        // Add click event listener
        card.addEventListener('click', function(e) {
            // Don't trigger if clicking on status badge
            if (e.target.closest('.project-status-badge')) return;
            
            const projectUrl = PROJECT_URL_MAP[projectTitle];
            if (projectUrl) {
                window.location.href = `projects/${projectUrl}`;
            } else {
                console.warn(`No URL mapping found for featured project: ${projectTitle}`);
                // Fallback: create URL from title
                const fallbackUrl = projectTitle.toLowerCase()
                    .replace(/[^a-z0-9\s-]/g, '')
                    .replace(/\s+/g, '-')
                    .replace(/-+/g, '-')
                    + '.html';
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
    });
}

// Function to add visual indicators that cards are clickable
function addClickableIndicators() {
    const css = `
        .project-card-detailed {
            cursor: pointer;
            user-select: none;
        }
        
        .project-card {
            cursor: pointer;
            user-select: none;
        }
        
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
        
        /* Make sure status badges don't block clicks but remain clickable themselves */
        .project-status-badge {
            pointer-events: auto;
            z-index: 10;
        }
    `;
    
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
}

// Function to initialize clickable project cards
function initializeClickableProjectCards() {
    console.log('Initializing clickable project cards...');
    
    // Add CSS for clickable indicators
    addClickableIndicators();
    
    // Make cards clickable on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(makeProjectCardsClickable, 1000);
        });
    } else {
        setTimeout(makeProjectCardsClickable, 1000);
    }
    
    // Re-run when portfolio section is shown
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a');
        if (link && (link.getAttribute('href') === '#portfolio' || link.textContent.includes('Portfolio'))) {
            setTimeout(makeProjectCardsClickable, 500);
        }
    });
    
    // Re-run when featured projects are populated
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && mutation.target.id === 'featured-projects-scroll') {
                setTimeout(makeProjectCardsClickable, 100);
            }
        });
    });
    
    const featuredContainer = document.getElementById('featured-projects-scroll');
    if (featuredContainer) {
        observer.observe(featuredContainer, { childList: true });
    }
}

// Export functions for global use
window.ProjectClickHandler = {
    makeProjectCardsClickable,
    PROJECT_URL_MAP,
    
    // Utility function to update URL mapping
    updateProjectUrl: (projectTitle, url) => {
        PROJECT_URL_MAP[projectTitle] = url;
        console.log(`Updated URL for "${projectTitle}": ${url}`);
    },
    
    // Function to refresh clickable cards
    refreshClickableCards: () => {
        makeProjectCardsClickable();
    }
};

// Auto-initialize
initializeClickableProjectCards();

// Console helper
console.log(`
Project Click Handler loaded!

Features:
- Click any project card to view details
- Enhanced hover effects
- Status badges remain clickable
- Automatic URL mapping

Commands:
- ProjectClickHandler.refreshClickableCards()
- ProjectClickHandler.updateProjectUrl('Project Name', 'filename.html')
`);