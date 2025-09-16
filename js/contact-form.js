// Contact form functionality

// Initialize contact form when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setupContactForm();
    setupFormValidation();
});

// Setup contact form event listeners
function setupContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', handleFormSubmission);
    
    // Add real-time validation
    const formInputs = contactForm.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
}

// Handle form submission
function handleFormSubmission(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    
    // Validate form before submission
    if (!validateForm(form)) {
        return;
    }
    
    // Show loading state
    setFormLoadingState(true);
    
    // Simulate form submission (replace with actual form handler)
    simulateFormSubmission(formData)
        .then(response => {
            handleFormSuccess(form);
        })
        .catch(error => {
            handleFormError(error);
        })
        .finally(() => {
            setFormLoadingState(false);
        });
}

// Validate entire form
function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!validateField({ target: field })) {
            isValid = false;
        }
    });
    
    // Additional validation
    const emailField = form.querySelector('#email');
    if (emailField && !isValidEmail(emailField.value)) {
        showFieldError(emailField, 'Please enter a valid email address');
        isValid = false;
    }
    
    return isValid;
}

// Validate individual field
function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    let isValid = true;
    
    // Clear previous errors
    clearFieldError(e);
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'This field is required');
        isValid = false;
    }
    
    // Email validation
    if (field.type === 'email' && value && !isValidEmail(value)) {
        showFieldError(field, 'Please enter a valid email address');
        isValid = false;
    }
    
    // Phone validation (basic)
    if (field.type === 'tel' && value && !isValidPhone(value)) {
        showFieldError(field, 'Please enter a valid phone number');
        isValid = false;
    }
    
    // Message length validation
    if (field.name === 'message' && value && value.length < 10) {
        showFieldError(field, 'Message must be at least 10 characters long');
        isValid = false;
    }
    
    return isValid;
}

// Show field error
function showFieldError(field, message) {
    // Remove existing error
    clearFieldError({ target: field });
    
    // Create error element
    const errorElement = document.createElement('span');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.color = '#721c24';
    errorElement.style.fontSize = '0.875rem';
    errorElement.style.marginTop = '0.25rem';
    errorElement.style.display = 'block';
    
    // Add error styling to field
    field.style.borderColor = '#f5c6cb';
    field.style.backgroundColor = '#fff5f5';
    
    // Insert error message
    field.parentNode.appendChild(errorElement);
}

// Clear field error
function clearFieldError(e) {
    const field = e.target;
    const existingError = field.parentNode.querySelector('.field-error');
    
    if (existingError) {
        existingError.remove();
    }
    
    // Reset field styling
    field.style.borderColor = '';
    field.style.backgroundColor = '';
}

// Set form loading state
function setFormLoadingState(isLoading) {
    const submitBtn = document.querySelector('.submit-btn');
    const btnText = submitBtn?.querySelector('.btn-text');
    const btnLoading = submitBtn?.querySelector('.btn-loading');
    
    if (!submitBtn) return;
    
    if (isLoading) {
        submitBtn.disabled = true;
        if (btnText) btnText.style.display = 'none';
        if (btnLoading) btnLoading.style.display = 'inline';
    } else {
        submitBtn.disabled = false;
        if (btnText) btnText.style.display = 'inline';
        if (btnLoading) btnLoading.style.display = 'none';
    }
}

// Handle successful form submission
function handleFormSuccess(form) {
    const formStatus = document.getElementById('form-status');
    
    if (formStatus) {
        formStatus.textContent = 'Thank you! Your message has been sent successfully. I\'ll get back to you soon!';
        formStatus.className = 'form-status success';
        formStatus.style.display = 'block';
        
        // Hide status after 5 seconds
        setTimeout(() => {
            formStatus.style.display = 'none';
        }, 5000);
    }
    
    // Reset form
    form.reset();
    
    // Show success animation
    showSuccessAnimation();
}

// Handle form submission error
function handleFormError(error) {
    const formStatus = document.getElementById('form-status');
    
    if (formStatus) {
        formStatus.textContent = 'Sorry, there was an error sending your message. Please try again or contact me directly.';
        formStatus.className = 'form-status error';
        formStatus.style.display = 'block';
        
        // Hide status after 5 seconds
        setTimeout(() => {
            formStatus.style.display = 'none';
        }, 5000);
    }
    
    console.error('Form submission error:', error);
}

// Simulate form submission (replace with actual backend integration)
function simulateFormSubmission(formData) {
    return new Promise((resolve, reject) => {
        // Log form data for debugging
        console.log('Form submission data:');
        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }
        
        // Simulate network delay
        setTimeout(() => {
            // Simulate success (90% success rate for demo)
            if (Math.random() > 0.1) {
                resolve({ success: true, message: 'Form submitted successfully' });
            } else {
                reject(new Error('Simulated network error'));
            }
        }, 2000);
    });
}

// Show success animation
function showSuccessAnimation() {
    const formContainer = document.querySelector('.form-container');
    if (!formContainer) return;
    
    // Add success animation class
    formContainer.classList.add('form-success');
    
    // Remove class after animation
    setTimeout(() => {
        formContainer.classList.remove('form-success');
    }, 1000);
}

// Setup form validation styling
function setupFormValidation() {
    // Add CSS for validation states
    const validationCSS = `
        .field-error {
            color: #721c24 !important;
            font-size: 0.875rem;
            margin-top: 0.25rem;
            display: block;
        }
        
        .form-success {
            animation: form-success-pulse 1s ease-in-out;
        }
        
        @keyframes form-success-pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.02); }
            100% { transform: scale(1); }
        }
        
        .form-group input:valid,
        .form-group select:valid,
        .form-group textarea:valid {
            border-color: #28a745;
        }
        
        .form-group input:invalid,
        .form-group select:invalid,
        .form-group textarea:invalid {
            border-color: #dc3545;
        }
    `;
    
    // Inject validation CSS
    const style = document.createElement('style');
    style.textContent = validationCSS;
    document.head.appendChild(style);
}

// Utility functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    return phoneRegex.test(cleanPhone);
}

// Export contact form utilities
window.ContactFormManager = {
    validateForm,
    handleFormSubmission,
    setFormLoadingState,
    isValidEmail,
    isValidPhone
};

// Real backend integration example (uncomment and modify as needed)
/*
async function submitFormToBackend(formData) {
    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            body: formData,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Backend submission error:', error);
        throw error;
    }
}
*/