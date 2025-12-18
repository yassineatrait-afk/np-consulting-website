/**
 * Animations & UI Interactions
 * Scroll reveal, header scroll effects, mobile menu
 */

(function () {
    'use strict';

    /**
     * Initialize all animations and interactions
     */
    function init() {
        initScrollReveal();
        initHeaderScroll();
        initMobileMenu();
        initSmoothScroll();
    }

    /**
     * Scroll reveal animation for fade-in elements
     */
    function initScrollReveal() {
        const fadeElements = document.querySelectorAll('.fade-in');

        // If no elements, exit early
        if (fadeElements.length === 0) return;

        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -50px 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        // Observe all fade-in elements and immediately check visibility
        fadeElements.forEach(el => {
            observer.observe(el);
            // Check if element is already in viewport
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                el.classList.add('visible');
            }
        });

        // Re-observe when content is dynamically loaded
        window.addEventListener('content-loaded', () => {
            document.querySelectorAll('.fade-in:not(.visible)').forEach(el => {
                observer.observe(el);
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    el.classList.add('visible');
                }
            });
        });
    }

    /**
     * Header scroll effect - add shadow when scrolled
     */
    function initHeaderScroll() {
        const header = document.querySelector('.header');
        if (!header) return;

        let lastScroll = 0;
        let ticking = false;

        function updateHeader() {
            const currentScroll = window.pageYOffset;

            if (currentScroll > 10) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            lastScroll = currentScroll;
            ticking = false;
        }

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(updateHeader);
                ticking = true;
            }
        }, { passive: true });
    }

    /**
     * Mobile menu toggle
     */
    function initMobileMenu() {
        const menuBtn = document.getElementById('mobile-menu-btn');
        const menu = document.getElementById('mobile-menu');

        if (!menuBtn || !menu) return;

        let isOpen = false;

        function toggleMenu() {
            isOpen = !isOpen;
            menu.classList.toggle('active', isOpen);
            menuBtn.setAttribute('aria-expanded', isOpen);

            // Update icon
            const icon = menuBtn.querySelector('svg use');
            if (icon) {
                icon.setAttribute('href', isOpen ? '#icon-close' : '#icon-menu');
            }

            // Prevent body scroll when menu is open
            document.body.style.overflow = isOpen ? 'hidden' : '';
        }

        menuBtn.addEventListener('click', toggleMenu);

        // Close menu when clicking a link
        menu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (isOpen) toggleMenu();
            });
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isOpen) {
                toggleMenu();
                menuBtn.focus();
            }
        });

        // Close menu when clicking outside
        menu.addEventListener('click', (e) => {
            if (e.target === menu) {
                toggleMenu();
            }
        });
    }

    /**
     * Smooth scroll for anchor links
     */
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href === '#') return;

                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();

                    const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    // Update URL without jumping
                    history.pushState(null, null, href);
                }
            });
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
