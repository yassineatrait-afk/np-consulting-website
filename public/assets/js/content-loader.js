/**
 * Content Loader - Loads and renders content from content.json
 * This enables easy editing of website text without touching HTML
 */

(function() {
  'use strict';

  const CONTENT_PATH = 'content/content.json';
  let contentData = null;

  /**
   * Initialize the content loader
   */
  async function init() {
    try {
      contentData = await loadContent();
      renderContent();
      console.log('Content loaded successfully');
    } catch (error) {
      console.error('Error loading content:', error);
      showContentError();
    }
  }

  /**
   * Load content from JSON file
   */
  async function loadContent() {
    const response = await fetch(CONTENT_PATH);
    if (!response.ok) {
      throw new Error(`Failed to load content: ${response.status}`);
    }
    return response.json();
  }

  /**
   * Render all content to the page
   */
  function renderContent() {
    // Render simple text bindings
    renderTextBindings();
    
    // Render dynamic lists based on page
    renderDynamicContent();
    
    // Update meta tags
    renderMetaTags();
  }

  /**
   * Render simple text content using data-content attributes
   * Usage: <span data-content="business.name"></span>
   */
  function renderTextBindings() {
    const elements = document.querySelectorAll('[data-content]');
    
    elements.forEach(el => {
      const path = el.getAttribute('data-content');
      const value = getNestedValue(contentData, path);
      
      if (value !== undefined) {
        // Check if element should use innerHTML (for formatted text)
        if (el.hasAttribute('data-content-html')) {
          el.innerHTML = value;
        } else {
          el.textContent = value;
        }
      }
    });
  }

  /**
   * Render dynamic content like service cards, FAQs, etc.
   */
  function renderDynamicContent() {
    // Services grid
    const servicesGrid = document.getElementById('services-grid');
    if (servicesGrid && contentData.services?.items) {
      servicesGrid.innerHTML = contentData.services.items.map(service => `
        <div class="card fade-in">
          <div class="card-header">
            <div class="card-icon">
              ${getIcon(service.icon)}
            </div>
          </div>
          <h3 class="card-title">${escapeHtml(service.title)}</h3>
          <p class="card-description">${escapeHtml(service.description)}</p>
        </div>
      `).join('');
    }

    // Who we help
    const audienceGrid = document.getElementById('audience-grid');
    if (audienceGrid && contentData.whoWeHelp?.audiences) {
      audienceGrid.innerHTML = contentData.whoWeHelp.audiences.map(audience => `
        <div class="audience-card fade-in">
          <div class="audience-icon">
            ${getIcon(audience.icon)}
          </div>
          <div>
            <div class="audience-title">${escapeHtml(audience.title)}</div>
            <p class="text-sm text-secondary">${escapeHtml(audience.description)}</p>
          </div>
        </div>
      `).join('');
    }

    // How it works steps
    const stepsContainer = document.getElementById('steps-container');
    if (stepsContainer && contentData.howItWorks?.steps) {
      stepsContainer.innerHTML = contentData.howItWorks.steps.map(step => `
        <div class="step fade-in">
          <div class="step-number">${escapeHtml(step.number)}</div>
          <h3 class="step-title">${escapeHtml(step.title)}</h3>
          <p class="step-description">${escapeHtml(step.description)}</p>
        </div>
      `).join('');
    }

    // Credibility items
    const credibilityGrid = document.getElementById('credibility-grid');
    if (credibilityGrid && contentData.credibility?.items) {
      credibilityGrid.innerHTML = contentData.credibility.items.map(item => `
        <div class="credibility-item fade-in">
          <div class="credibility-icon">
            ${getIcon(item.icon)}
          </div>
          <h3 class="credibility-title">${escapeHtml(item.title)}</h3>
          <p class="credibility-text">${escapeHtml(item.description)}</p>
        </div>
      `).join('');
    }

    // Partner expectations
    const expectationsList = document.getElementById('expectations-list');
    if (expectationsList && contentData.partnerExpectations?.items) {
      expectationsList.innerHTML = contentData.partnerExpectations.items.map(item => `
        <li class="package-feature">
          ${getIcon('check')}
          <span>${escapeHtml(item)}</span>
        </li>
      `).join('');
    }

    // Packages
    const packagesGrid = document.getElementById('packages-grid');
    if (packagesGrid && contentData.packages?.items) {
      packagesGrid.innerHTML = contentData.packages.items.map(pkg => `
        <div class="package-card ${pkg.featured ? 'featured' : ''} fade-in">
          <h3 class="package-title">${escapeHtml(pkg.name)}</h3>
          <p class="package-description">${escapeHtml(pkg.description)}</p>
          
          <div class="mb-4">
            <p class="text-sm font-semibold text-primary mb-2">Who it's for:</p>
            <p class="text-sm text-secondary">${escapeHtml(pkg.whoFor)}</p>
          </div>
          
          <div class="mb-4">
            <p class="text-sm font-semibold text-primary mb-2">Timeline:</p>
            <p class="text-sm text-secondary">${escapeHtml(pkg.timeline)}</p>
          </div>
          
          <div class="package-features">
            <p class="text-sm font-semibold text-primary mb-2">What's included:</p>
            <ul>
              ${pkg.includes.map(item => `
                <li class="package-feature">
                  ${getIcon('check')}
                  <span>${escapeHtml(item)}</span>
                </li>
              `).join('')}
            </ul>
          </div>
          
          <a href="contact.html" class="btn ${pkg.featured ? 'btn-primary' : 'btn-secondary'} package-cta">
            Get Started
          </a>
        </div>
      `).join('');
    }

    // FAQs
    const faqContainer = document.getElementById('faq-container');
    if (faqContainer && contentData.faqs?.items) {
      faqContainer.innerHTML = contentData.faqs.items.map((faq, index) => `
        <div class="faq-item fade-in" data-faq-index="${index}">
          <button class="faq-question" aria-expanded="false" aria-controls="faq-answer-${index}">
            <span>${escapeHtml(faq.question)}</span>
            <svg class="faq-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
          <div class="faq-answer" id="faq-answer-${index}">
            <div class="faq-answer-content">${escapeHtml(faq.answer)}</div>
          </div>
        </div>
      `).join('');

      // Add FAQ click handlers
      initFAQs();
    }

    // Footer nav
    const footerNav = document.getElementById('footer-nav');
    if (footerNav && contentData.footer?.navigation?.links) {
      footerNav.innerHTML = contentData.footer.navigation.links.map(link => `
        <a href="${escapeHtml(link.url)}" class="footer-link">${escapeHtml(link.label)}</a>
      `).join('');
    }

    // About page credentials
    const credentialsList = document.getElementById('credentials-list');
    if (credentialsList && contentData.about?.credentials?.items) {
      credentialsList.innerHTML = contentData.about.credentials.items.map(item => `
        <li class="package-feature">
          ${getIcon('check')}
          <span>${escapeHtml(item)}</span>
        </li>
      `).join('');
    }

    // Privacy sections
    const privacySections = document.getElementById('privacy-sections');
    if (privacySections && contentData.privacy?.sections) {
      privacySections.innerHTML = contentData.privacy.sections.map(section => `
        <div class="mb-8">
          <h2 class="text-xl font-semibold mb-4">${escapeHtml(section.heading)}</h2>
          <p class="text-secondary">${escapeHtml(section.content).replace('[Email]', contentData.business?.email || '[Email]')}</p>
        </div>
      `).join('');
    }
  }

  /**
   * Render meta tags based on current page
   */
  function renderMetaTags() {
    const path = window.location.pathname;
    let pageName = 'home';
    
    if (path.includes('services')) pageName = 'services';
    else if (path.includes('about')) pageName = 'about';
    else if (path.includes('contact')) pageName = 'contact';
    else if (path.includes('privacy')) pageName = 'privacy';

    const meta = contentData.meta?.[pageName];
    if (meta) {
      // Update title
      const title = meta.title.replace('[Business Name]', contentData.business?.name || '');
      document.title = title;

      // Update meta description
      const descMeta = document.querySelector('meta[name="description"]');
      if (descMeta) {
        descMeta.setAttribute('content', meta.description);
      }

      // Update OG tags
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute('content', title);
      
      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute('content', meta.description);
    }
  }

  /**
   * Initialize FAQ accordion functionality
   */
  function initFAQs() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close all other FAQs
        faqItems.forEach(otherItem => {
          otherItem.classList.remove('active');
          otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        });
        
        // Toggle current FAQ
        if (!isActive) {
          item.classList.add('active');
          question.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  /**
   * Get nested value from object using dot notation
   * e.g., getNestedValue(obj, 'business.name')
   */
  function getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : undefined;
    }, obj);
  }

  /**
   * Escape HTML to prevent XSS
   */
  function escapeHtml(str) {
    if (typeof str !== 'string') return str;
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /**
   * Show error message if content fails to load
   */
  function showContentError() {
    const body = document.body;
    const errorBanner = document.createElement('div');
    errorBanner.className = 'alert alert-error';
    errorBanner.style.cssText = 'position: fixed; top: 80px; left: 50%; transform: translateX(-50%); z-index: 9999; max-width: 500px;';
    errorBanner.innerHTML = `
      <svg class="alert-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <span>Content failed to load. Please refresh the page or check that content.json exists.</span>
    `;
    body.insertBefore(errorBanner, body.firstChild);
  }

  /**
   * Get SVG icon by name
   */
  function getIcon(name) {
    const icons = {
      'clipboard-check': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"></path><rect x="9" y="3" width="6" height="4" rx="2"></rect><path d="m9 14 2 2 4-4"></path></svg>',
      'file-text': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>',
      'book-open': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>',
      'refresh': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>',
      'arrow-right-circle': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 16 16 12 12 8"></polyline><line x1="8" y1="12" x2="16" y2="12"></line></svg>',
      'bar-chart': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="20" x2="12" y2="10"></line><line x1="18" y1="20" x2="18" y2="4"></line><line x1="6" y1="20" x2="6" y2="16"></line></svg>',
      'building': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><path d="M9 22v-4h6v4"></path><path d="M8 6h.01"></path><path d="M16 6h.01"></path><path d="M12 6h.01"></path><path d="M12 10h.01"></path><path d="M12 14h.01"></path><path d="M16 10h.01"></path><path d="M16 14h.01"></path><path d="M8 10h.01"></path><path d="M8 14h.01"></path></svg>',
      'shield': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>',
      'users': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>',
      'award': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>',
      'shield-check': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="m9 12 2 2 4-4"></path></svg>',
      'message-circle': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>',
      'check': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>',
      'phone': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>',
      'mail': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>',
      'map-pin': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>',
      'heart': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>',
      'lock': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>'
    };
    
    return icons[name] || icons['check'];
  }

  // Export for use in other scripts
  window.ContentLoader = {
    init,
    getContent: () => contentData,
    getNestedValue
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
