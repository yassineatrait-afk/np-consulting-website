/**
 * Contact Form Handler
 * Handles form validation and submission
 */

(function () {
    'use strict';

    const form = document.getElementById('contact-form');
    if (!form) return;

    const submitBtn = form.querySelector('[type="submit"]');
    const successMessage = document.getElementById('form-success');
    const errorMessage = document.getElementById('form-error');

    // Form validation rules
    const validators = {
        name: {
            required: true,
            minLength: 2,
            maxLength: 100,
            message: 'Please enter your full name'
        },
        organization: {
            required: true,
            minLength: 2,
            maxLength: 200,
            message: 'Please enter your organization name'
        },
        role: {
            required: true,
            minLength: 2,
            maxLength: 100,
            message: 'Please enter your role or title'
        },
        email: {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Please enter a valid email address'
        },
        phone: {
            required: false,
            pattern: /^[\d\s\-\+\(\)]*$/,
            maxLength: 20,
            message: 'Please enter a valid phone number'
        },
        message: {
            required: true,
            minLength: 10,
            maxLength: 2000,
            message: 'Please enter your message (at least 10 characters)'
        },
        consent: {
            required: true,
            type: 'checkbox',
            message: 'Please acknowledge that you understand this is B2B only'
        }
    };

    /**
     * Initialize form handling
     */
    function init() {
        // Add real-time validation
        Object.keys(validators).forEach(fieldName => {
            const field = form.elements[fieldName];
            if (field && field.type !== 'checkbox') {
                field.addEventListener('blur', () => validateField(fieldName));
                field.addEventListener('input', () => clearFieldError(fieldName));
            }
        });

        // Handle form submission
        form.addEventListener('submit', handleSubmit);
    }

    /**
     * Handle form submission
     */
    async function handleSubmit(e) {
        e.preventDefault();

        // Hide previous messages
        hideMessages();

        // Validate all fields
        const isValid = validateForm();
        if (!isValid) {
            // Focus first invalid field
            const firstError = form.querySelector('.error');
            if (firstError) {
                firstError.focus();
            }
            return;
        }

        // Check honeypot
        const honeypot = form.elements['website'];
        if (honeypot && honeypot.value) {
            // Silently fail for bots
            showSuccess();
            return;
        }

        // Disable submit button
        setLoading(true);

        // DEMO MODE: Simulate successful submission
        // In production, uncomment the fetch code below and remove this block
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
        showSuccess();
        form.reset();
        setLoading(false);

        /* PRODUCTION CODE - Uncomment when deployed:
        try {
            const formData = new FormData(form);

            const response = await fetch('server/send-contact.php', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                showSuccess();
                form.reset();
            } else {
                showError(result.message || 'Something went wrong. Please try again.');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            showError('Unable to send message. Please try again or email us directly.');
        } finally {
            setLoading(false);
        }
        */
    }

    /**
     * Validate entire form
     */
    function validateForm() {
        let isValid = true;

        Object.keys(validators).forEach(fieldName => {
            if (!validateField(fieldName)) {
                isValid = false;
            }
        });

        return isValid;
    }

    /**
     * Validate single field
     */
    function validateField(fieldName) {
        const field = form.elements[fieldName];
        const rules = validators[fieldName];

        if (!field || !rules) return true;

        const value = rules.type === 'checkbox' ? field.checked : field.value.trim();
        let isValid = true;
        let errorMsg = '';

        // Required check
        if (rules.required) {
            if (rules.type === 'checkbox' && !value) {
                isValid = false;
                errorMsg = rules.message;
            } else if (!value) {
                isValid = false;
                errorMsg = rules.message;
            }
        }

        // Only continue validation if field has value
        if (value && rules.type !== 'checkbox') {
            // Min length
            if (rules.minLength && value.length < rules.minLength) {
                isValid = false;
                errorMsg = rules.message;
            }

            // Max length
            if (rules.maxLength && value.length > rules.maxLength) {
                isValid = false;
                errorMsg = `Maximum ${rules.maxLength} characters allowed`;
            }

            // Pattern
            if (rules.pattern && !rules.pattern.test(value)) {
                isValid = false;
                errorMsg = rules.message;
            }
        }

        // Show/hide error
        if (!isValid) {
            showFieldError(fieldName, errorMsg);
        } else {
            clearFieldError(fieldName);
        }

        return isValid;
    }

    /**
     * Show field error
     */
    function showFieldError(fieldName, message) {
        const field = form.elements[fieldName];
        if (!field) return;

        // Add error class to input
        if (field.classList) {
            field.classList.add('error');
        }

        // Find or create error element
        let errorEl = document.getElementById(`${fieldName}-error`);
        if (!errorEl) {
            errorEl = document.createElement('span');
            errorEl.id = `${fieldName}-error`;
            errorEl.className = 'form-error';
            errorEl.role = 'alert';

            // Insert after field or its parent (for checkboxes)
            const parent = field.closest('.form-group') || field.parentElement;
            parent.appendChild(errorEl);
        }

        errorEl.textContent = message;
        field.setAttribute('aria-invalid', 'true');
        field.setAttribute('aria-describedby', errorEl.id);
    }

    /**
     * Clear field error
     */
    function clearFieldError(fieldName) {
        const field = form.elements[fieldName];
        if (!field) return;

        if (field.classList) {
            field.classList.remove('error');
        }

        const errorEl = document.getElementById(`${fieldName}-error`);
        if (errorEl) {
            errorEl.textContent = '';
        }

        field.removeAttribute('aria-invalid');
        field.removeAttribute('aria-describedby');
    }

    /**
     * Show success message
     */
    function showSuccess() {
        if (successMessage) {
            successMessage.classList.remove('hidden');
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    /**
     * Show error message
     */
    function showError(message) {
        if (errorMessage) {
            errorMessage.textContent = message;
            errorMessage.classList.remove('hidden');
            errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    /**
     * Hide all messages
     */
    function hideMessages() {
        if (successMessage) successMessage.classList.add('hidden');
        if (errorMessage) errorMessage.classList.add('hidden');
    }

    /**
     * Set loading state
     */
    function setLoading(loading) {
        if (submitBtn) {
            submitBtn.disabled = loading;
            submitBtn.textContent = loading ? 'Sending...' : 'Send Message';
        }
    }

    // Initialize
    init();
})();
