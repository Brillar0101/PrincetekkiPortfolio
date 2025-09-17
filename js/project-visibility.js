// project-visibility.js
// Simple Project Visibility Management - Configuration Method Only

// Configuration object: Set to true to show project, false to hide it
const PROJECT_VISIBILITY_CONFIG = {
    embedded: {
        "Smart Weather Monitoring System": true,     // Set to true for real projects
        "Smart Home Controller": true,              // Set to false to hide placeholder projects
        "Fitness Tracker Device": false,
        "Motor Control System": false,
        "Smart Security Gateway": false
    },
    gaming: {
        "Custom Arcade Console": true,               // Set to true for real projects
        "Haptic VR Controller": false,
        "LED Matrix Gaming Board": false,
        "DIY Racing Simulator Rig": false,
        "Portable Gaming Device": false
    },
    pcb: {
        "Multi-Rail Power Supply": true,             // Set to true for real projects
        "2.4GHz Transceiver Board": false,
        "Multi-Sensor Interface PCB": false,
        "Class-D Audio Amplifier": false,
        "USB-C Development Board": false
    },
    vision: {
        "Tennis Analysis System": true,    // All set to false as examples
        "Autonomous Drone Navigation": false,
        "Industrial Inspection System": false,
        "Hand Gesture Recognition": false,
        "Intelligent Parking System": false
    }
};

// Main function to show/hide projects based on configuration
function manageProjectVisibility() {
    console.log('Managing project visibility...');
    
    const portfolioSections = document.querySelectorAll('.portfolio-section');
    
    portfolioSections.forEach((section) => {
        const sectionTitle = section.querySelector('.subsection-title')?.textContent || '';
        const projectCards = section.querySelectorAll('.project-card-detailed');
        
        let visibleProjectsCount = 0;
        
        // Determine section type based on title
        let sectionType = '';
        if (sectionTitle.includes('Embedded')) sectionType = 'embedded';
        else if (sectionTitle.includes('Game')) sectionType = 'gaming';
        else if (sectionTitle.includes('PCB')) sectionType = 'pcb';
        else if (sectionTitle.includes('Vision')) sectionType = 'vision';
        
        // Show/hide projects based on configuration
        projectCards.forEach(card => {
            const projectTitle = card.querySelector('h4')?.textContent || '';
            
            const shouldShow = sectionType && 
                              PROJECT_VISIBILITY_CONFIG[sectionType] && 
                              PROJECT_VISIBILITY_CONFIG[sectionType][projectTitle] === true;
            
            if (shouldShow) {
                card.style.display = 'block';
                visibleProjectsCount++;
            } else {
                card.style.display = 'none';
            }
        });
        
        // Hide entire section if no projects are visible
        if (visibleProjectsCount === 0) {
            section.style.display = 'none';
            console.log(`Hidden section: ${sectionTitle} (no visible projects)`);
        } else {
            section.style.display = 'block';
            console.log(`Section: ${sectionTitle} - ${visibleProjectsCount} visible projects`);
        }
    });
    
    // Refresh featured projects after visibility changes
    if (window.PortfolioUtils && window.PortfolioUtils.populateFeaturedProjects) {
        setTimeout(() => {
            window.PortfolioUtils.populateFeaturedProjects();
        }, 100);
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(manageProjectVisibility, 500);
});

// Re-run when portfolio section is shown
document.addEventListener('click', function(e) {
    const link = e.target.closest('a');
    if (link && (link.getAttribute('href') === '#portfolio' || link.textContent.includes('Portfolio'))) {
        setTimeout(manageProjectVisibility, 200);
    }
});

// Export for global use
window.ProjectVisibilityManager = {
    manageProjectVisibility,
    PROJECT_VISIBILITY_CONFIG
};