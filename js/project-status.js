// project-status.js - Add to your existing project-visibility.js or create as separate file

// Project Status Configuration
// Add status to each project: 'complete', 'in-progress', 'coming-soon'
const PROJECT_STATUS_CONFIG = {
    embedded: {
        "Smart Weather Monitoring System": "complete",
        "Smart Home Controller": "in-progress",
        "Fitness Tracker Device": "coming-soon",
        "Motor Control System": "in-progress",
        "Smart Security Gateway": "complete"
    },
    gaming: {
        "Custom Arcade Console": "complete",
        "Haptic VR Controller": "in-progress",
        "LED Matrix Gaming Board": "complete",
        "DIY Racing Simulator Rig": "coming-soon",
        "Portable Gaming Device": "in-progress"
    },
    pcb: {
        "Multi-Rail Power Supply": "coming-soon",
        "2.4GHz Transceiver Board": "in-progress",
        "Multi-Sensor Interface PCB": "complete",
        "Class-D Audio Amplifier": "coming-soon",
        "USB-C Development Board": "in-progress"
    },
    vision: {
        "Tennis Analysis System": "in-progress",
        "Synthetic Fashion Generator": "in-progress",
        "Industrial Inspection System": "coming-soon",
        "Hand Gesture Recognition": "complete",
        "Three Seconds Violation": "in-progress"
    }
};

// Status icon and styling configuration
const STATUS_CONFIG = {
    'complete': {
        icon: '✅',
        color: '#ffffff',           // White text
        bgColor: '#28a745',        // Green background
        borderColor: '#1e7e34',    // Darker green border
        text: 'Complete'
    },
    'in-progress': {
        icon: '🚧',
        color: '#000000',           // Black text
        bgColor: '#ffc107',        // Yellow background
        borderColor: '#e0a800',    // Darker yellow border
        text: 'In Progress'
    },
    'coming-soon': {
        icon: '⏳',
        color: '#ffffff',           // White text
        bgColor: '#dc3545',        // Red background
        borderColor: '#c82333',    // Darker red border
        text: 'Coming Soon'
    }
};

// Function to create status badge
function createStatusBadge(status) {
    if (!status || !STATUS_CONFIG[status]) return null;
    
    const config = STATUS_CONFIG[status];
    const badge = document.createElement('div');
    badge.className = 'project-status-badge';
    badge.setAttribute('data-status', status);
    badge.title = config.text; // Tooltip
    
    badge.style.cssText = `
        position: absolute;
        top: 12px;
        right: 12px;
        background: ${config.bgColor};
        border: 2px solid ${config.borderColor};
        border-radius: 20px;
        padding: 4px 8px;
        font-size: 14px;
        font-weight: bold;
        color: ${config.color};
        display: flex;
        align-items: center;
        gap: 4px;
        z-index: 10;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        transition: all 0.3s ease;
        cursor: default;
        text-shadow: ${config.color === '#000000' ? 'none' : '0 1px 2px rgba(0,0,0,0.3)'};
    `;
    
    badge.innerHTML = `
        <span class="status-icon">${config.icon}</span>
        <span class="status-text">${config.text}</span>
    `;
    
    // Add hover effect
    badge.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05)';
        this.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
    });
    
    badge.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
        this.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
    });
    
    return badge;
}

// Function to add status badges to all project cards
function addStatusBadgesToProjects() {
    console.log('Adding status badges to project cards...');
    
    const portfolioSections = document.querySelectorAll('.portfolio-section');
    
    portfolioSections.forEach((section, sectionIndex) => {
        const sectionTitle = section.querySelector('.subsection-title')?.textContent || '';
        const projectCards = section.querySelectorAll('.project-card-detailed');
        
        // Determine section type
        let sectionType = '';
        if (sectionTitle.includes('Embedded')) sectionType = 'embedded';
        else if (sectionTitle.includes('Game')) sectionType = 'gaming';
        else if (sectionTitle.includes('PCB')) sectionType = 'pcb';
        else if (sectionTitle.includes('Vision')) sectionType = 'vision';
        
        projectCards.forEach(card => {
            // Skip hidden cards
            if (card.style.display === 'none') return;
            
            const projectTitle = card.querySelector('h4')?.textContent || '';
            const projectImage = card.querySelector('.project-image');
            
            if (!projectImage) return;
            
            // Remove existing badge if any
            const existingBadge = projectImage.querySelector('.project-status-badge');
            if (existingBadge) {
                existingBadge.remove();
            }
            
            // Get status from configuration
            let status = null;
            if (sectionType && PROJECT_STATUS_CONFIG[sectionType]) {
                status = PROJECT_STATUS_CONFIG[sectionType][projectTitle];
            }
            
            // Default status based on visibility if not configured
            if (!status) {
                // Check if project is visible (from PROJECT_VISIBILITY_CONFIG)
                if (window.ProjectVisibilityManager?.PROJECT_VISIBILITY_CONFIG[sectionType]?.[projectTitle] === true) {
                    status = 'complete'; // Default visible projects to complete
                } else {
                    status = 'coming-soon'; // Default hidden projects to coming soon
                }
            }
            
            // Create and add badge
            if (status) {
                const badge = createStatusBadge(status);
                if (badge) {
                    // Make sure project image is positioned relative
                    projectImage.style.position = 'relative';
                    projectImage.appendChild(badge);
                }
            }
        });
    });
}

// Function to add status badges to featured project cards
function addStatusBadgesToFeaturedProjects() {
    const featuredCards = document.querySelectorAll('#featured-projects-scroll .project-card');
    
    featuredCards.forEach(card => {
        const projectTitle = card.querySelector('h4')?.textContent || '';
        const projectImage = card.querySelector('.project-image');
        
        if (!projectImage || !projectTitle) return;
        
        // Remove existing badge
        const existingBadge = projectImage.querySelector('.project-status-badge');
        if (existingBadge) {
            existingBadge.remove();
        }
        
        // Find status by searching all sections
        let status = null;
        Object.keys(PROJECT_STATUS_CONFIG).forEach(sectionType => {
            if (PROJECT_STATUS_CONFIG[sectionType][projectTitle]) {
                status = PROJECT_STATUS_CONFIG[sectionType][projectTitle];
            }
        });
        
        // Default to complete for featured projects if not found
        if (!status) status = 'complete';
        
        // Create smaller badge for featured cards
        const badge = createStatusBadge(status);
        if (badge) {
            // Adjust size for featured cards
            badge.style.fontSize = '12px';
            badge.style.padding = '2px 6px';
            badge.style.top = '8px';
            badge.style.right = '8px';
            
            // Hide text on small cards, show only icon
            const statusText = badge.querySelector('.status-text');
            if (statusText && card.offsetWidth < 300) {
                statusText.style.display = 'none';
            }
            
            projectImage.style.position = 'relative';
            projectImage.appendChild(badge);
        }
    });
}

// Function to update a project's status
function updateProjectStatus(sectionType, projectTitle, status) {
    if (!PROJECT_STATUS_CONFIG[sectionType]) {
        PROJECT_STATUS_CONFIG[sectionType] = {};
    }
    
    PROJECT_STATUS_CONFIG[sectionType][projectTitle] = status;
    
    // Refresh badges
    addStatusBadgesToProjects();
    addStatusBadgesToFeaturedProjects();
    
    console.log(`Updated ${sectionType}/${projectTitle} status to: ${status}`);
}

// Function to get project status
function getProjectStatus(sectionType, projectTitle) {
    return PROJECT_STATUS_CONFIG[sectionType]?.[projectTitle] || null;
}

// Function to count projects by status
function getProjectStatusStats() {
    const stats = {
        complete: 0,
        'in-progress': 0,
        'coming-soon': 0,
        total: 0
    };
    
    Object.values(PROJECT_STATUS_CONFIG).forEach(section => {
        Object.values(section).forEach(status => {
            if (stats.hasOwnProperty(status)) {
                stats[status]++;
                stats.total++;
            }
        });
    });
    
    console.log('Project status statistics:', stats);
    return stats;
}

// Add CSS for responsive design
function addStatusBadgeCSS() {
    const css = `
        .project-status-badge {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
        }
        
        .project-status-badge:hover {
            transform: scale(1.05) !important;
        }
        
        @media (max-width: 768px) {
            .project-status-badge {
                font-size: 12px !important;
                padding: 2px 6px !important;
                top: 8px !important;
                right: 8px !important;
            }
            
            .project-status-badge .status-text {
                display: none;
            }
        }
        
        @media (max-width: 480px) {
            .project-status-badge {
                font-size: 14px !important;
                padding: 4px !important;
                border-radius: 50% !important;
                width: 28px;
                height: 28px;
                justify-content: center;
            }
            
            .project-status-badge .status-text {
                display: none !important;
            }
        }
    `;
    
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
}

// Initialize status badges system
function initializeProjectStatusBadges() {
    console.log('Initializing Project Status Badges...');
    
    // Add CSS
    addStatusBadgeCSS();
    
    // Wait for DOM and other systems to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
                addStatusBadgesToProjects();
                addStatusBadgesToFeaturedProjects();
            }, 1000);
        });
    } else {
        setTimeout(() => {
            addStatusBadgesToProjects();
            addStatusBadgesToFeaturedProjects();
        }, 1000);
    }
    
    // Re-run when sections are shown
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a');
        if (link && (link.getAttribute('href') === '#portfolio' || link.textContent.includes('Portfolio'))) {
            setTimeout(() => {
                addStatusBadgesToProjects();
            }, 300);
        }
    });
}

// Export functions
window.ProjectStatusManager = {
    addStatusBadgesToProjects,
    addStatusBadgesToFeaturedProjects,
    updateProjectStatus,
    getProjectStatus,
    getProjectStatusStats,
    PROJECT_STATUS_CONFIG,
    STATUS_CONFIG,
    
    // Utility functions
    setProjectComplete: (sectionType, projectTitle) => updateProjectStatus(sectionType, projectTitle, 'complete'),
    setProjectInProgress: (sectionType, projectTitle) => updateProjectStatus(sectionType, projectTitle, 'in-progress'),
    setProjectComingSoon: (sectionType, projectTitle) => updateProjectStatus(sectionType, projectTitle, 'coming-soon'),
    
    // Refresh all badges
    refreshAllBadges: () => {
        addStatusBadgesToProjects();
        addStatusBadgesToFeaturedProjects();
    }
};

// Auto-initialize
initializeProjectStatusBadges();

// Console helper
console.log(`
Project Status Manager loaded!

Quick commands:
- ProjectStatusManager.getProjectStatusStats()
- ProjectStatusManager.setProjectComplete('embedded', 'Smart Home Controller')
- ProjectStatusManager.refreshAllBadges()

Status types: 'complete', 'in-progress', 'coming-soon'
`);