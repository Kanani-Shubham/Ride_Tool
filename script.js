// Form handling and Google Sheets integration
class RideBookingForm {
    constructor() {
        this.form = document.getElementById('bookingForm');
        this.submitBtn = this.form.querySelector('.submit-btn');
        this.thankYouMessage = document.getElementById('thankYouMessage');
        this.bookingCard = document.getElementById('bookingCard');
        
        // Google Form configuration - REPLACE THESE WITH YOUR ACTUAL VALUES
        this.googleFormConfig = {
            actionURL: 'https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse',
            fieldMappings: {
                fullName: 'entry.YOUR_NAME_ENTRY_ID',
                mobile: 'entry.YOUR_MOBILE_ENTRY_ID',
                email: 'entry.YOUR_EMAIL_ENTRY_ID',
                address: 'entry.YOUR_ADDRESS_ENTRY_ID'
            }
        };
        
        this.init();
    }
    
    init() {
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        this.setupFormValidation();
        this.setupInputAnimations();
    }
    
    setupFormValidation() {
        const inputs = this.form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', this.validateField.bind(this));
            input.addEventListener('input', this.clearFieldError.bind(this));
        });
    }
    
    setupInputAnimations() {
        const inputs = this.form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('focus', (e) => {
                e.target.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', (e) => {
                if (!e.target.value) {
                    e.target.parentElement.classList.remove('focused');
                }
            });
        });
    }
    
    validateField(e) {
        const field = e.target;
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        // Remove existing error styling
        this.clearFieldError(e);
        
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        } else if (field.type === 'email' && value && !this.isValidEmail(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        } else if (field.type === 'tel' && value && !this.isValidMobile(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid 10-digit mobile number';
        }
        
        if (!isValid) {
            this.showFieldError(field, errorMessage);
        }
        
        return isValid;
    }
    
    clearFieldError(e) {
        const field = e.target;
        const formGroup = field.parentElement;
        const existingError = formGroup.querySelector('.error-message');
        
        if (existingError) {
            existingError.remove();
        }
        
        field.style.borderColor = '#e0e0e0';
        formGroup.classList.remove('has-error');
    }
    
    showFieldError(field, message) {
        const formGroup = field.parentElement;
        
        // Create error message element
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            color: #f44336;
            font-size: 0.8rem;
            margin-top: 0.25rem;
            animation: fadeIn 0.3s ease-out;
        `;
        
        formGroup.appendChild(errorDiv);
        field.style.borderColor = '#f44336';
        formGroup.classList.add('has-error');
    }
    
    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    isValidMobile(mobile) {
        return /^[0-9]{10}$/.test(mobile.replace(/\D/g, ''));
    }
    
    validateForm() {
        const inputs = this.form.querySelectorAll('input[required], textarea[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            const fieldValid = this.validateField({ target: input });
            if (!fieldValid) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        if (!this.validateForm()) {
            this.showNotification('Please correct the errors and try again.', 'error');
            return;
        }
        
        this.setLoadingState(true);
        
        try {
            await this.submitToGoogleForm();
            this.showThankYouMessage();
        } catch (error) {
            console.error('Submission error:', error);
            this.showNotification('There was an error submitting your booking. Please try again.', 'error');
        } finally {
            this.setLoadingState(false);
        }
    }
    
    async submitToGoogleForm() {
        const formData = new FormData();
        
        // Map form fields to Google Form entries
        const fieldMapping = this.googleFormConfig.fieldMappings;
        
        Object.keys(fieldMapping).forEach(fieldName => {
            const input = this.form.querySelector(`[name="${fieldName}"]`);
            if (input && fieldMapping[fieldName]) {
                formData.append(fieldMapping[fieldName], input.value);
            }
        });
        
        // For demo purposes, we'll simulate the submission
        // In production, replace this with actual Google Form submission
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate successful submission
                if (Math.random() > 0.1) { // 90% success rate for demo
                    resolve();
                } else {
                    reject(new Error('Submission failed'));
                }
            }, 1500);
        });
        
        /* 
        // Uncomment this for actual Google Form submission:
        
        const response = await fetch(this.googleFormConfig.actionURL, {
            method: 'POST',
            body: formData,
            mode: 'no-cors'
        });
        
        // Note: Due to CORS restrictions, we can't check the response status
        // We assume the submission was successful if no error was thrown
        return response;
        */
    }
    
    setLoadingState(loading) {
        if (loading) {
            this.submitBtn.classList.add('loading');
            this.submitBtn.disabled = true;
        } else {
            this.submitBtn.classList.remove('loading');
            this.submitBtn.disabled = false;
        }
    }
    
    showThankYouMessage() {
        // Hide form with animation
        this.form.style.opacity = '0';
        this.form.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            this.form.classList.add('hidden');
            this.thankYouMessage.classList.remove('hidden');
        }, 300);
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#f44336' : '#4CAF50'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            animation: slideInRight 0.3s ease-out;
            max-width: 300px;
            font-family: 'Poppins', sans-serif;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out forwards';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }
}

// Reset form function (called by "Book Another Ride" button)
function resetForm() {
    const form = document.getElementById('bookingForm');
    const thankYouMessage = document.getElementById('thankYouMessage');
    
    // Hide thank you message
    thankYouMessage.classList.add('hidden');
    
    // Show form with animation
    form.classList.remove('hidden');
    form.style.opacity = '0';
    form.style.transform = 'translateY(-20px)';
    
    setTimeout(() => {
        form.style.opacity = '1';
        form.style.transform = 'translateY(0)';
        form.reset();
        
        // Clear any existing errors
        const errors = form.querySelectorAll('.error-message');
        errors.forEach(error => error.remove());
        
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.style.borderColor = '#e0e0e0';
            input.parentElement.classList.remove('has-error', 'focused');
        });
    }, 100);
}

// Add notification animations to CSS
const notificationStyles = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
`;

// Inject notification styles
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);

// Initialize the form when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new RideBookingForm();
});

// Add smooth scrolling for better UX
document.documentElement.style.scrollBehavior = 'smooth';

// Progressive enhancement - add intersection observer for animations
if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    });
    
    document.addEventListener('DOMContentLoaded', () => {
        const animatedElements = document.querySelectorAll('.booking-card');
        animatedElements.forEach(el => {
            el.style.animationPlayState = 'paused';
            observer.observe(el);
        });
    });
}