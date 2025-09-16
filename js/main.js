// Main JavaScript functionality for the portfolio website

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    console.log('Portfolio website loaded successfully!');
    
    // Initialize the website
    initializeWebsite();
    
    // Initialize project visibility first, then populate featured projects
    if (window.ProjectVisibilityManager) {
        setTimeout(() => {
            window.ProjectVisibilityManager.manageProjectVisibility();
            populateFeaturedProjects();
        }, 500);
    } else {
        populateFeaturedProjects();
    }
    
    // Add scroll effects
    addScrollEffects();
    
    // Add animation effects
    addAnimationEffects();
});

// Initialize website functionality
function initializeWebsite() {
    // Show home section by default
    showSection('home');
    
    // Add navbar scroll effects
    addNavbarScrollEffects();
    
    // Add project scroll animation controls
    addProjectScrollControls();
}

// Function to extract project data from portfolio sections (updated to respect visibility)
function extractProjectsFromSections() {
    const projects = {
        embedded: [],
        gaming: [],
        pcb: [],
        vision: []
    };

    // Extract Embedded Systems projects
    const embeddedSection = document.querySelector('.portfolio-section:nth-child(2) .projects-grid');
    if (embeddedSection) {
        const embeddedCards = embeddedSection.querySelectorAll('.project-card-detailed');
        embeddedCards.forEach(card => {
            // Skip hidden projects
            if (card.style.display === 'none') return;
            
            const imageElement = card.querySelector('.project-image .project-title');
            const titleElement = card.querySelector('h4');
            const descriptionElement = card.querySelector('p');
            
            if (imageElement && titleElement && descriptionElement) {
                const image = imageElement.textContent;
                const title = titleElement.textContent;
                const description = descriptionElement.textContent;
                projects.embedded.push({ image, title, description });
            }
        });
    }

    // Extract Game Development projects
    const gamingSection = document.querySelector('.portfolio-section:nth-child(3) .projects-grid');
    if (gamingSection) {
        const gamingCards = gamingSection.querySelectorAll('.project-card-detailed');
        gamingCards.forEach(card => {
            // Skip hidden projects
            if (card.style.display === 'none') return;
            
            const imageElement = card.querySelector('.project-image .project-title');
            const titleElement = card.querySelector('h4');
            const descriptionElement = card.querySelector('p');
            
            if (imageElement && titleElement && descriptionElement) {
                const image = imageElement.textContent;
                const title = titleElement.textContent;
                const description = descriptionElement.textContent;
                projects.gaming.push({ image, title, description });
            }
        });
    }

    // Extract PCB Design projects
    const pcbSection = document.querySelector('.portfolio-section:nth-child(4) .projects-grid');
    if (pcbSection) {
        const pcbCards = pcbSection.querySelectorAll('.project-card-detailed');
        pcbCards.forEach(card => {
            // Skip hidden projects
            if (card.style.display === 'none') return;
            
            const imageElement = card.querySelector('.project-image .project-title');
            const titleElement = card.querySelector('h4');
            const descriptionElement = card.querySelector('p');
            
            if (imageElement && titleElement && descriptionElement) {
                const image = imageElement.textContent;
                const title = titleElement.textContent;
                const description = descriptionElement.textContent;
                projects.pcb.push({ image, title, description });
            }
        });
    }

    // Extract Computer Vision projects
    const visionSection = document.querySelector('.portfolio-section:nth-child(5) .projects-grid');
    if (visionSection) {
        const visionCards = visionSection.querySelectorAll('.project-card-detailed');
        visionCards.forEach(card => {
            // Skip hidden projects
            if (card.style.display === 'none') return;
            
            const imageElement = card.querySelector('.project-image .project-title');
            const titleElement = card.querySelector('h4');
            const descriptionElement = card.querySelector('p');
            
            if (imageElement && titleElement && descriptionElement) {
                const image = imageElement.textContent;
                const title = titleElement.textContent;
                const description = descriptionElement.textContent;
                projects.vision.push({ image, title, description });
            }
        });
    }

    return projects;
}

// Function to get random project from array
function getRandomProject(projectArray) {
    if (projectArray.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * projectArray.length);
    return projectArray[randomIndex];
}

// Function to generate featured projects (only visible ones)
function generateFeaturedProjects() {
    const allProjects = extractProjectsFromSections();
    const featuredProjects = [];
    const maxProjects = 5;
    
    // Get one random project from each category (if available)
    const categories = ['embedded', 'gaming', 'pcb', 'vision'];
    
    categories.forEach(category => {
        const randomProject = getRandomProject(allProjects[category]);
        if (randomProject && featuredProjects.length < maxProjects) {
            featuredProjects.push(randomProject);
        }
    });

    // If we have less than 5 projects, fill remaining slots with random projects
    if (featuredProjects.length < maxProjects) {
        const allProjectsFlat = [
            ...allProjects.embedded,
            ...allProjects.gaming,
            ...allProjects.pcb,
            ...allProjects.vision
        ];

        // Remove already selected projects
        const remainingProjects = allProjectsFlat.filter(project => 
            !featuredProjects.some(featured => 
                featured.title === project.title && featured.image === project.image
            )
        );

        // Fill remaining slots
        while (featuredProjects.length < maxProjects && remainingProjects.length > 0) {
            const randomIndex = Math.floor(Math.random() * remainingProjects.length);
            featuredProjects.push(remainingProjects.splice(randomIndex, 1)[0]);
        }
    }

    return featuredProjects;
}

// Function to populate featured projects in the DOM
function populateFeaturedProjects() {
    const featuredProjectsContainer = document.getElementById('featured-projects-scroll');
    if (!featuredProjectsContainer) return;
    
    const featuredProjects = generateFeaturedProjects();

    // Clear existing content
    featuredProjectsContainer.innerHTML = '';

    // If no visible projects, show a message
    if (featuredProjects.length === 0) {
        const noProjectsMsg = document.createElement('div');
        noProjectsMsg.className = 'no-projects-message';
        noProjectsMsg.style.cssText = `
            text-align: center;
            padding: 2rem;
            color: rgba(255, 255, 255, 0.8);
            font-style: italic;
            width: 100%;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 15px;
            backdrop-filter: blur(10px);
        `;
        noProjectsMsg.innerHTML = '<p>Featured projects will appear here as they become available.</p>';
        featuredProjectsContainer.appendChild(noProjectsMsg);
        return;
    }

    // Create project cards
    featuredProjects.forEach(project => {
        const projectCard = createProjectCard(project);
        featuredProjectsContainer.appendChild(projectCard);
    });

    // Duplicate projects for smooth scrolling effect only if we have projects
    if (featuredProjects.length > 0) {
        featuredProjects.forEach(project => {
            const projectCard = createProjectCard(project);
            featuredProjectsContainer.appendChild(projectCard);
        });
    }
    
    // Add status badges to featured projects after they're created
    if (window.ProjectStatusManager) {
        setTimeout(() => {
            window.ProjectStatusManager.addStatusBadgesToFeaturedProjects();
        }, 100);
    }
    
    // Make featured cards clickable after they're created
    if (window.ProjectClickHandler) {
        setTimeout(() => {
            window.ProjectClickHandler.makeProjectCardsClickable();
        }, 200);
    }
}

// Helper function to create project card element
function createProjectCard(project) {
    const projectCard = document.createElement('div');
    projectCard.className = 'project-card';
    
    // Truncate description for featured view
    const shortDescription = project.description && project.description.length > 80 
        ? project.description.substring(0, 80) + '...' 
        : project.description || 'Project description coming soon...';

    // Create image path from project title
    const imagePath = project.image ? 
        `images/projects/${project.image.toLowerCase().replace(/\s+/g, '-')}.jpg` : 
        'images/projects/placeholder.jpg';

    projectCard.innerHTML = `
        <div class="project-image">
            <img src="${imagePath}" alt="${project.title}" onerror="this.style.display='none'">
            <div class="project-title">${project.image || project.title}</div>
        </div>
        <div class="project-info">
            <h4>${project.title}</h4>
            <p>${shortDescription}</p>
        </div>
    `;

    return projectCard;
}

// Add navbar scroll effects
function addNavbarScrollEffects() {
    window.addEventListener('scroll', function() {
        const nav = document.querySelector('nav');
        if (!nav) return;
        
        if (window.scrollY > 100) {
            nav.style.background = 'rgba(255, 255, 255, 0.98)';
        } else {
            nav.style.background = 'rgba(255, 255, 255, 0.95)';
        }
    });
}

// Add project scroll animation controls
function addProjectScrollControls() {
    const projectsScroll = document.querySelector('.projects-scroll');
    if (!projectsScroll) return;
    
    // Pause animation on hover
    projectsScroll.addEventListener('mouseenter', function() {
        this.style.animationPlayState = 'paused';
    });
    
    projectsScroll.addEventListener('mouseleave', function() {
        this.style.animationPlayState = 'running';
    });
}

// Add scroll effects for cards
function addScrollEffects() {
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe cards for animation (updated to skip hidden cards)
    const cards = document.querySelectorAll('.expertise-card, .project-card-detailed, .contact-card');
    cards.forEach(card => {
        // Skip hidden cards
        if (card.style.display === 'none') return;
        
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// Add animation effects
function addAnimationEffects() {
    // Smooth scroll for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#') && href.length > 1) {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.btn, .contact-link, .submit-btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Utility function to debounce function calls
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Handle window resize events
window.addEventListener('resize', debounce(function() {
    // Recalculate layouts on resize and refresh project visibility
    if (window.ProjectVisibilityManager) {
        window.ProjectVisibilityManager.manageProjectVisibility();
    }
    populateFeaturedProjects();
    
    // Refresh status badges after resize
    if (window.ProjectStatusManager) {
        setTimeout(() => {
            window.ProjectStatusManager.refreshAllBadges();
        }, 300);
    }
    
    // Refresh clickable cards after resize
    if (window.ProjectClickHandler) {
        setTimeout(() => {
            window.ProjectClickHandler.refreshClickableCards();
        }, 400);
    }
}, 250));

// Integration with project visibility manager
window.addEventListener('load', function() {
    if (window.ProjectVisibilityManager) {
        setTimeout(() => {
            window.ProjectVisibilityManager.manageProjectVisibility();
            populateFeaturedProjects();
            
            // Add status badges after everything is loaded
            if (window.ProjectStatusManager) {
                setTimeout(() => {
                    window.ProjectStatusManager.addStatusBadgesToProjects();
                    window.ProjectStatusManager.addStatusBadgesToFeaturedProjects();
                }, 500);
            }
            
            // Make cards clickable after everything is loaded
            if (window.ProjectClickHandler) {
                setTimeout(() => {
                    window.ProjectClickHandler.makeProjectCardsClickable();
                }, 600);
            }
        }, 1000);
    }
});

// Add navigation event listener to refresh everything when switching to portfolio
document.addEventListener('click', function(e) {
    const link = e.target.closest('a');
    if (link && (link.getAttribute('href') === '#portfolio' || link.textContent.includes('Portfolio'))) {
        setTimeout(() => {
            if (window.ProjectStatusManager) {
                window.ProjectStatusManager.addStatusBadgesToProjects();
            }
            if (window.ProjectClickHandler) {
                window.ProjectClickHandler.makeProjectCardsClickable();
            }
        }, 300);
    }
});

// Add ripple effect CSS dynamically
const rippleCSS = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .no-projects-message {
        animation: fade-in 0.5s ease-in-out;
    }
    
    @keyframes fade-in {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;

// Inject ripple CSS into the document
const style = document.createElement('style');
style.textContent = rippleCSS;
document.head.appendChild(style);

// Error handling for images
function handleImageErrors() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            this.style.display = 'none';
            console.warn(`Failed to load image: ${this.src}`);
        });
    });
}

// Call image error handling
handleImageErrors();

// Export functions for use in other modules
window.PortfolioUtils = {
    extractProjectsFromSections,
    generateFeaturedProjects,
    populateFeaturedProjects,
    debounce,
    // Add project management functions
    refreshProjectVisibility: function() {
        if (window.ProjectVisibilityManager) {
            window.ProjectVisibilityManager.manageProjectVisibility();
            populateFeaturedProjects();
        }
        
        // Also refresh status badges and click handlers
        if (window.ProjectStatusManager) {
            setTimeout(() => {
                window.ProjectStatusManager.refreshAllBadges();
            }, 200);
        }
        
        if (window.ProjectClickHandler) {
            setTimeout(() => {
                window.ProjectClickHandler.refreshClickableCards();
            }, 300);
        }
    }
};