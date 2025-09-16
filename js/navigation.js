// Navigation and section management functionality

// Main navigation function
function showSection(sectionId) {
    console.log(`Switching to section: ${sectionId}`);
    
    // Hide all sections first
    hideAllSections();
    
    // Show the requested section
    switch(sectionId) {
        case 'home':
            showHomeSection();
            break;
        case 'portfolio':
            showPortfolioSection();
            break;
        case 'contact-page':
            showContactSection();
            break;
        default:
            console.warn(`Unknown section: ${sectionId}`);
            showHomeSection(); // fallback to home
    }
    
    // Update navigation active state
    updateNavigationState(sectionId);
    
    // Scroll to top smoothly
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Hide all sections
function hideAllSections() {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.display = 'none';
    });
}

// Show home section and all its components
function showHomeSection() {
    const homeSections = [
        '.hero',
        '.showreel',
        '.expertise',
        '.projects-preview',
        '.cta'
    ];
    
    homeSections.forEach(sectionClass => {
        const section = document.querySelector(sectionClass);
        if (section) {
            section.style.display = sectionClass === '.hero' ? 'flex' : 'block';
        }
    });
    
    // Repopulate featured projects when showing home
    if (window.PortfolioUtils && window.PortfolioUtils.populateFeaturedProjects) {
        window.PortfolioUtils.populateFeaturedProjects();
    }
}

// Show portfolio section
function showPortfolioSection() {
    const portfolioSection = document.querySelector('.portfolio-sections');
    if (portfolioSection) {
        portfolioSection.style.display = 'block';
    }
}

// Show contact section
function showContactSection() {
    const contactSection = document.querySelector('.contact-page');
    if (contactSection) {
        contactSection.style.display = 'block';
    }
}

// Update navigation active state
function updateNavigationState(activeSection) {
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        
        const href = link.getAttribute('href');
        if (
            (activeSection === 'home' && href === '#home') ||
            (activeSection === 'portfolio' && href === '#portfolio') ||
            (activeSection === 'contact-page' && href === '#contact')
        ) {
            link.classList.add('active');
        }
    });
}

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Set up navigation event listeners
    setupNavigationEventListeners();
    
    // Initialize home view
    showSection('home');
    
    // Handle browser back/forward buttons
    setupHistoryNavigation();
});

// Setup navigation event listeners
function setupNavigationEventListeners() {
    // Navigation links
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', handleNavigationClick);
    });
    
    // CTA button
    const ctaButton = document.querySelector('.cta .btn');
    if (ctaButton) {
        ctaButton.addEventListener('click', handleCTAClick);
    }
    
    // Any other navigation buttons
    document.querySelectorAll('a[onclick*="showSection"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const match = this.getAttribute('onclick').match(/showSection\('([^']+)'\)/);
            if (match) {
                showSection(match[1]);
            }
        });
    });
}

// Handle navigation link clicks
function handleNavigationClick(e) {
    e.preventDefault();
    
    const href = this.getAttribute('href');
    let sectionId;
    
    switch(href) {
        case '#home':
            sectionId = 'home';
            break;
        case '#portfolio':
            sectionId = 'portfolio';
            break;
        case '#contact':
            sectionId = 'contact-page';
            break;
        default:
            console.warn(`Unknown navigation href: ${href}`);
            return;
    }
    
    showSection(sectionId);
    
    // Update URL without page reload
    updateURL(sectionId);
}

// Handle CTA button click
function handleCTAClick(e) {
    e.preventDefault();
    showSection('contact-page');
    updateURL('contact-page');
}

// Update URL for better user experience
function updateURL(sectionId) {
    const newURL = sectionId === 'home' ? '/' : `/#${sectionId}`;
    
    if (history.pushState) {
        history.pushState({ section: sectionId }, '', newURL);
    }
}

// Setup browser history navigation
function setupHistoryNavigation() {
    window.addEventListener('popstate', function(e) {
        if (e.state && e.state.section) {
            showSection(e.state.section);
        } else {
            // Handle initial page load or direct URL access
            const hash = window.location.hash;
            if (hash === '#portfolio') {
                showSection('portfolio');
            } else if (hash === '#contact' || hash === '#contact-page') {
                showSection('contact-page');
            } else {
                showSection('home');
            }
        }
    });
    
    // Handle initial page load
    window.addEventListener('load', function() {
        const hash = window.location.hash;
        if (hash === '#portfolio') {
            showSection('portfolio');
        } else if (hash === '#contact' || hash === '#contact-page') {
            showSection('contact-page');
        } else {
            showSection('home');
        }
    });
}

// Smooth scrolling utility for internal page navigation
function smoothScrollTo(targetId, offset = 0) {
    const target = document.getElementById(targetId);
    if (!target) return;
    
    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
    
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
}

// Navigation utilities for mobile
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
        navLinks.classList.toggle('mobile-open');
    }
}

// Add mobile menu button functionality (if needed)
function addMobileMenuButton() {
    const nav = document.querySelector('nav .nav-container');
    if (!nav || nav.querySelector('.mobile-menu-btn')) return;
    
    const mobileMenuBtn = document.createElement('button');
    mobileMenuBtn.className = 'mobile-menu-btn';
    mobileMenuBtn.innerHTML = '☰';
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    
    nav.appendChild(mobileMenuBtn);
}

// Initialize mobile menu if screen is small
function initializeMobileMenu() {
    if (window.innerWidth <= 768) {
        addMobileMenuButton();
    }
}

// Handle window resize for mobile menu
window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        if (mobileMenuBtn) {
            mobileMenuBtn.remove();
        }
        const navLinks = document.querySelector('.nav-links');
        if (navLinks) {
            navLinks.classList.remove('mobile-open');
        }
    } else {
        addMobileMenuButton();
    }
});

// Call mobile menu initialization
initializeMobileMenu();

// Export navigation functions for global use
window.NavigationManager = {
    showSection,
    smoothScrollTo,
    toggleMobileMenu,
    updateNavigationState
};

// Make showSection globally available for onclick handlers
window.showSection = showSection;