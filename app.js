// DOM Elements
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const contactForm = document.getElementById('contact-form');
const navLinks = document.querySelectorAll('.nav-link');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initScrollEffects();
    initFormValidation();
    initAnimations();
});

// Navigation functionality
function initNavigation() {
    // Mobile menu toggle
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        
        // Animate hamburger menu
        const bars = navToggle.querySelectorAll('.bar');
        bars.forEach((bar, index) => {
            if (navMenu.classList.contains('active')) {
                if (index === 0) bar.style.transform = 'rotate(-45deg) translate(-5px, 6px)';
                if (index === 1) bar.style.opacity = '0';
                if (index === 2) bar.style.transform = 'rotate(45deg) translate(-5px, -6px)';
            } else {
                bar.style.transform = '';
                bar.style.opacity = '1';
            }
        });
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Close mobile menu
            navMenu.classList.remove('active');
            const bars = navToggle.querySelectorAll('.bar');
            bars.forEach(bar => {
                bar.style.transform = '';
                bar.style.opacity = '1';
            });

            // Smooth scroll to section
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }

            // Update active nav link
            updateActiveNavLink(this);
        });
    });

    // Handle smooth scrolling for hero button
    const heroBtn = document.querySelector('.btn-hero');
    if (heroBtn) {
        heroBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSection = document.querySelector('#portfolio');
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    }
}

// Scroll effects
function initScrollEffects() {
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Navbar background effect
        if (scrollTop > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Update active navigation based on scroll position
        updateActiveNavOnScroll();
        
        lastScrollTop = scrollTop;
    });
}

// Update active navigation link based on scroll position
function updateActiveNavOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            // Remove active class from all links
            navLinks.forEach(link => link.classList.remove('active'));
            // Add active class to current section link
            if (navLink) {
                navLink.classList.add('active');
            }
        }
    });
}

// Update active nav link
function updateActiveNavLink(activeLink) {
    navLinks.forEach(link => link.classList.remove('active'));
    activeLink.classList.add('active');
}

// Form validation and submission
function initFormValidation() {
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data directly from form elements to avoid FormData issues
            const nameInput = contactForm.querySelector('#name');
            const emailInput = contactForm.querySelector('#email');
            const projectInput = contactForm.querySelector('#project');
            const messageInput = contactForm.querySelector('#message');
            
            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const project = projectInput.value;
            const message = messageInput.value.trim();

            // Validation
            const errors = [];
            
            if (!name) {
                errors.push('Full name is required');
            }
            
            if (!email) {
                errors.push('Email address is required');
            } else if (!isValidEmail(email)) {
                errors.push('Please enter a valid email address');
            }
            
            if (!project) {
                errors.push('Please select a project type');
            }
            
            if (!message) {
                errors.push('Project details are required');
            } else if (message.length < 10) {
                errors.push('Please provide more details about your project (minimum 10 characters)');
            }

            // Display errors or process form
            if (errors.length > 0) {
                showFormErrors(errors);
            } else {
                processFormSubmission(name, email, project, message);
            }
        });

        // Real-time validation with improved handling
        const inputs = contactForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('focus', function() {
                clearFieldError(this);
            });
            
            // Clear errors on input for better UX
            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    clearFieldError(this);
                }
            });
        });
    }
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validate individual field
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.getAttribute('name');
    
    // Remove existing error styling
    field.classList.remove('error');
    
    let isValid = true;
    let errorMessage = '';
    
    switch (fieldName) {
        case 'name':
            if (!value) {
                isValid = false;
                errorMessage = 'Full name is required';
            }
            break;
        case 'email':
            if (!value) {
                isValid = false;
                errorMessage = 'Email address is required';
            } else if (!isValidEmail(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
            break;
        case 'project':
            if (!value) {
                isValid = false;
                errorMessage = 'Please select a project type';
            }
            break;
        case 'message':
            if (!value) {
                isValid = false;
                errorMessage = 'Project details are required';
            } else if (value.length < 10) {
                isValid = false;
                errorMessage = 'Please provide more details (minimum 10 characters)';
            }
            break;
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

// Show field error
function showFieldError(field, message) {
    field.classList.add('error');
    
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add new error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.color = '#ff6b35';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '0.25rem';
    field.parentNode.appendChild(errorDiv);
}

// Clear field error
function clearFieldError(field) {
    field.classList.remove('error');
    const errorMessage = field.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

// Show form errors
function showFormErrors(errors) {
    // Remove existing error display
    const existingErrorDiv = contactForm.querySelector('.form-errors');
    if (existingErrorDiv) {
        existingErrorDiv.remove();
    }
    
    // Create error display
    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-errors';
    errorDiv.innerHTML = `
        <h4 style="color: #ff6b35; margin-bottom: 0.5rem;">Please correct the following errors:</h4>
        <ul style="color: #ff6b35; margin: 0; padding-left: 1.5rem;">
            ${errors.map(error => `<li>${error}</li>`).join('')}
        </ul>
    `;
    errorDiv.style.background = 'rgba(255, 107, 53, 0.1)';
    errorDiv.style.border = '1px solid rgba(255, 107, 53, 0.3)';
    errorDiv.style.borderRadius = '8px';
    errorDiv.style.padding = '1rem';
    errorDiv.style.marginBottom = '1rem';
    
    contactForm.insertBefore(errorDiv, contactForm.firstChild);
    
    // Scroll to errors
    errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Process form submission
function processFormSubmission(name, email, project, message) {
    const submitBtn = contactForm.querySelector('.btn-submit');
    const originalText = submitBtn.textContent;
    
    // Show loading state
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';
    
    // Remove any existing messages
    const existingMessages = contactForm.querySelectorAll('.form-errors, .form-success');
    existingMessages.forEach(msg => msg.remove());
    
    // Simulate form processing
    setTimeout(() => {
        // Create mailto link with form data
        const subject = encodeURIComponent(`New Project Inquiry - ${project}`);
        const body = encodeURIComponent(
            `Name: ${name}\n` +
            `Email: ${email}\n` +
            `Project Type: ${project}\n\n` +
            `Project Details:\n${message}\n\n` +
            `---\n` +
            `This message was sent from the SS EDITING STUDIO website contact form.`
        );
        
        const mailtoLink = `mailto:editswithssedits@gmail.com?subject=${subject}&body=${body}`;
        
        // Open email client
        window.location.href = mailtoLink;
        
        // Show success message
        showSuccessMessage();
        
        // Reset form after successful submission
        setTimeout(() => {
            contactForm.reset();
        }, 100);
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
        
    }, 1000);
}

// Show success message
function showSuccessMessage() {
    const successDiv = document.createElement('div');
    successDiv.className = 'form-success';
    successDiv.innerHTML = `
        <h4 style="color: #00d4aa; margin-bottom: 0.5rem;">✓ Message Sent Successfully!</h4>
        <p style="color: #cccccc; margin: 0;">Thank you for your interest. Your email client should open shortly with your message. We'll respond within 24 hours.</p>
    `;
    successDiv.style.background = 'rgba(0, 212, 170, 0.1)';
    successDiv.style.border = '1px solid rgba(0, 212, 170, 0.3)';
    successDiv.style.borderRadius = '8px';
    successDiv.style.padding = '1rem';
    successDiv.style.marginBottom = '1rem';
    
    contactForm.insertBefore(successDiv, contactForm.firstChild);
    
    // Auto-remove success message after 5 seconds
    setTimeout(() => {
        if (successDiv.parentNode) {
            successDiv.remove();
        }
    }, 5000);
}

// Animations and intersection observer
function initAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll(
        '.service-card, .portfolio-item, .testimonial-card, .section-header'
    );
    
    animateElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });

    // Add CSS for animations
    addAnimationStyles();
}

// Add animation styles dynamically
function addAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .animate-on-scroll {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease-out;
        }
        
        .animate-on-scroll.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        .form-control.error {
            border-color: #ff6b35 !important;
            box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.2) !important;
        }
        
        .nav-link.active {
            color: #ff6b35 !important;
        }
        
        .nav-link.active::after {
            width: 100% !important;
        }
        
        /* Demo reel interactions */
        .demo-placeholder:hover {
            background: linear-gradient(135deg, #1a1a1a, #0a0a0a);
            border-color: rgba(255, 107, 53, 0.5);
        }
        
        .demo-placeholder:hover .play-button {
            transform: scale(1.1);
            background: #ff8c42;
        }
        
        /* Portfolio item stagger animation */
        .portfolio-item:nth-child(1) { transition-delay: 0.1s; }
        .portfolio-item:nth-child(2) { transition-delay: 0.2s; }
        .portfolio-item:nth-child(3) { transition-delay: 0.3s; }
        .portfolio-item:nth-child(4) { transition-delay: 0.4s; }
        
        /* Service card stagger animation */
        .service-card:nth-child(1) { transition-delay: 0.1s; }
        .service-card:nth-child(2) { transition-delay: 0.2s; }
        .service-card:nth-child(3) { transition-delay: 0.3s; }
        .service-card:nth-child(4) { transition-delay: 0.4s; }
        
        /* Testimonial card stagger animation */
        .testimonial-card:nth-child(1) { transition-delay: 0.1s; }
        .testimonial-card:nth-child(2) { transition-delay: 0.2s; }
        .testimonial-card:nth-child(3) { transition-delay: 0.3s; }
        .testimonial-card:nth-child(4) { transition-delay: 0.4s; }
        .testimonial-card:nth-child(5) { transition-delay: 0.5s; }
    `;
    document.head.appendChild(style);
}

// Handle demo reel placeholder click
document.addEventListener('click', function(e) {
    if (e.target.closest('.demo-placeholder')) {
        // Add click effect
        const placeholder = e.target.closest('.demo-placeholder');
        placeholder.style.transform = 'scale(0.98)';
        setTimeout(() => {
            placeholder.style.transform = '';
        }, 200);
        
        // Placeholder feedback for demo reel
        const playButton = placeholder.querySelector('.play-button');
        const originalText = playButton.textContent;
        playButton.textContent = '⏸';
        setTimeout(() => {
            playButton.textContent = originalText;
        }, 1000);
    }
});

// Add loading effect for hero section
window.addEventListener('load', function() {
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.classList.add('loaded');
    }
});

// Performance optimization: Lazy load background images
function initLazyLoading() {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
initLazyLoading();