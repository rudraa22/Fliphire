// ============================================
// FLIPHIRE LANDING PAGE - ENHANCED JAVASCRIPT
// ============================================

// ============================================
// SCROLL PROGRESS BAR
// ============================================
function updateScrollProgress() {
  const scrollProgress = document.querySelector('.scroll-progress');
  const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (window.scrollY / windowHeight) * 100;
  scrollProgress.style.width = scrolled + '%';
}

window.addEventListener('scroll', updateScrollProgress);

// ============================================
// ANIMATED COUNTER
// ============================================
function animateCounter(element, target, duration = 2000) {
  let start = 0;
  const increment = target / (duration / 16);
  
  const timer = setInterval(() => {
    start += increment;
    if (start >= target) {
      element.textContent = formatNumber(target);
      clearInterval(timer);
    } else {
      element.textContent = formatNumber(Math.floor(start));
    }
  }, 16);
}

function formatNumber(num) {
  if (num >= 1000) {
    return (num / 1000).toFixed(0) + 'K+';
  }
  return Math.floor(num).toString();
}

function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  const observerOptions = {
    threshold: 0.5
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
        entry.target.classList.add('counted');
        const target = parseInt(entry.target.getAttribute('data-target'));
        animateCounter(entry.target, target);
      }
    });
  }, observerOptions);

  counters.forEach(counter => {
    counterObserver.observe(counter);
  });
}

// ============================================
// SEARCH FUNCTIONALITY
// ============================================
function performSearch() {
  const searchTerm = document.getElementById('talentSearch').value.toLowerCase();
  const roleFilter = document.getElementById('roleFilter').value;
  const locationFilter = document.getElementById('locationFilter').value;
  const experienceFilter = document.getElementById('experienceFilter').value;
  
  const categoryCards = document.querySelectorAll('.category-card');
  let visibleCount = 0;

  categoryCards.forEach(card => {
    const cardText = card.textContent.toLowerCase();
    const cardRole = card.querySelector('h3').textContent.toLowerCase();
    
    let matches = true;

    // Text search
    if (searchTerm && !cardText.includes(searchTerm)) {
      matches = false;
    }

    // Role filter
    if (roleFilter && !cardRole.includes(roleFilter)) {
      matches = false;
    }

    if (matches) {
      card.classList.remove('hidden');
      card.classList.add('fade-in');
      visibleCount++;
    } else {
      card.classList.add('hidden');
      card.classList.remove('fade-in');
    }
  });

  showToast(visibleCount > 0 ? `Found ${visibleCount} results` : 'No results found', visibleCount > 0 ? 'success' : 'error');
}

// Search on Enter key
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('talentSearch');
  if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        performSearch();
      }
    });

    // Real-time search
    searchInput.addEventListener('input', () => {
      if (searchInput.value.length > 2 || searchInput.value.length === 0) {
        performSearch();
      }
    });
  }

  // Filter change handlers
  ['roleFilter', 'locationFilter', 'experienceFilter'].forEach(id => {
    const filter = document.getElementById(id);
    if (filter) {
      filter.addEventListener('change', performSearch);
    }
  });
});

// ============================================
// TOAST NOTIFICATIONS
// ============================================
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast ${type} show`;
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// ============================================
// MODAL HANDLING
// ============================================
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('show');
    document.body.style.overflow = '';
  }
}

// Close modal on outside click
window.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal')) {
    e.target.classList.remove('show');
    document.body.style.overflow = '';
  }
});

// ============================================
// FORM HANDLERS
// ============================================
function handleSignup(event) {
  event.preventDefault();
  showToast('Account created successfully! Welcome to FlipHire.', 'success');
  setTimeout(() => {
    closeModal('signupModal');
  }, 1500);
}

function handleLogin(event) {
  event.preventDefault();
  showToast('Welcome back! Redirecting to dashboard...', 'success');
  setTimeout(() => {
    closeModal('loginModal');
  }, 1500);
}

// ============================================
// DARK MODE TOGGLE
// ============================================
function initDarkMode() {
  const themeToggle = document.getElementById('themeToggle');
  const currentTheme = localStorage.getItem('theme') || 'light';
  
  if (currentTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  }

  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    themeToggle.innerHTML = newTheme === 'dark' 
      ? '<i class="fas fa-sun"></i>' 
      : '<i class="fas fa-moon"></i>';
  });
}

// ============================================
// MOBILE MENU
// ============================================
function initMobileMenu() {
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const navLinks = document.getElementById('navLinks');

  if (mobileMenuToggle && navLinks) {
    mobileMenuToggle.addEventListener('click', () => {
      mobileMenuToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    // Close menu when clicking on a link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenuToggle.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
  }
}

// ============================================
// TESTIMONIALS CAROUSEL
// ============================================
let currentTestimonialIndex = 0;
const testimonials = document.querySelectorAll('.testimonial-card');
const dots = document.querySelectorAll('.dot');

function currentTestimonial(index) {
  testimonials.forEach((testimonial, i) => {
    testimonial.classList.toggle('active', i === index);
  });
  
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });
  
  currentTestimonialIndex = index;
}

// Auto-rotate testimonials
function autoRotateTestimonials() {
  setInterval(() => {
    currentTestimonialIndex = (currentTestimonialIndex + 1) % testimonials.length;
    currentTestimonial(currentTestimonialIndex);
  }, 5000);
}

// Make currentTestimonial available globally
window.currentTestimonial = currentTestimonial;

// ============================================
// FLOATING ACTION BUTTON
// ============================================
function initFAB() {
  const fab = document.getElementById('fab');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      fab.classList.add('show');
    } else {
      fab.classList.remove('show');
    }
  });
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

// Make scrollToTop available globally
window.scrollToTop = scrollToTop;

// ============================================
// SMOOTH SCROLL TO SECTION
// ============================================
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    const offset = 80; // Account for sticky navbar
    const sectionTop = section.offsetTop - offset;
    
    window.scrollTo({
      top: sectionTop,
      behavior: 'smooth'
    });
  }
}

// Make scrollToSection available globally
window.scrollToSection = scrollToSection;

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  
  if (currentScroll > 100) {
    navbar.style.boxShadow = '0 0 0 1px rgba(0,0,0,.08), 0 4px 12px rgba(0,0,0,.15)';
  } else {
    navbar.style.boxShadow = '0 0 0 1px rgba(0,0,0,.08), 0 2px 4px rgba(0,0,0,.08)';
  }
  
  lastScroll = currentScroll;
});

// ============================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ============================================
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// ============================================
// INITIALIZE ON DOM LOAD
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  // Initialize counters
  initCounters();
  
  // Initialize dark mode
  initDarkMode();
  
  // Initialize mobile menu
  initMobileMenu();
  
  // Initialize dropdown menus
  initDropdownMenus();
  
  // Initialize FAB
  initFAB();
  
  // Start testimonial carousel
  if (testimonials.length > 0) {
    autoRotateTestimonials();
  }
  
  // Observe animated elements
  const animatedElements = document.querySelectorAll('.why-card, .step-card, .category-card');
  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
  });
  
  // Handle smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href !== '#' && href !== '#signin' && href !== '#join') {
  e.preventDefault();
        scrollToSection(href.substring(1));
      }
    });
  });
  
  // Logo click to scroll to top
  document.querySelector('.logo')?.addEventListener('click', () => {
    scrollToTop();
  });
  
  // Enhanced category card hover effects
  document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-8px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
    });
  });
});

// ============================================
// HANDLE GET STARTED
// ============================================
function handleGetStarted() {
  openModal('signupModal');
}

// Make handleGetStarted available globally
window.handleGetStarted = handleGetStarted;

// ============================================
// FAQ ACCORDION
// ============================================
function toggleFAQ(element) {
  const faqItem = element.parentElement;
  const isActive = faqItem.classList.contains('active');
  
  // Close all FAQ items
  document.querySelectorAll('.faq-item').forEach(item => {
    item.classList.remove('active');
  });
  
  // Open clicked item if it wasn't active
  if (!isActive) {
    faqItem.classList.add('active');
  }
}

// Make toggleFAQ available globally
window.toggleFAQ = toggleFAQ;

// ============================================
// KEYBOARD NAVIGATION
// ============================================
document.addEventListener('keydown', (e) => {
  // ESC to close modals
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal.show').forEach(modal => {
      modal.classList.remove('show');
      document.body.style.overflow = '';
    });
  }
  
  // Enter key on FAQ questions
  if (e.key === 'Enter' && e.target.classList.contains('faq-question')) {
    toggleFAQ(e.target);
  }
});

// ============================================
// LOADING STATES
// ============================================
function showLoading(element) {
  element.style.opacity = '0.6';
  element.style.pointerEvents = 'none';
  element.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
}

function hideLoading(element, originalContent) {
  element.style.opacity = '1';
  element.style.pointerEvents = 'auto';
  element.innerHTML = originalContent;
}

// ============================================
// PERFORMANCE OPTIMIZATION - LAZY LOADING
// ============================================
function initLazyLoading() {
  const lazyElements = document.querySelectorAll('[data-lazy]');
  const lazyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;
        // Load content here if needed
        element.classList.add('loaded');
        lazyObserver.unobserve(element);
      }
    });
  });
  
  lazyElements.forEach(element => {
    lazyObserver.observe(element);
  });
}

// ============================================
// SMOOTH SCROLL POLYFILL FOR OLDER BROWSERS
// ============================================
if (!('scrollBehavior' in document.documentElement.style)) {
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/gh/cferdinandi/smooth-scroll@15.0.0/dist/smooth-scroll.polyfills.min.js';
  document.head.appendChild(script);
}

// ============================================
// ANALYTICS TRACKING (PLACEHOLDER)
// ============================================
function trackEvent(eventName, eventData = {}) {
  // In production, integrate with Google Analytics, Mixpanel, etc.
  console.log('Event tracked:', eventName, eventData);
  
  // Example: Google Analytics
  // if (typeof gtag !== 'undefined') {
  //   gtag('event', eventName, eventData);
  // }
}

// Track button clicks
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('button, .btn-primary, .btn-secondary').forEach(button => {
    button.addEventListener('click', () => {
      trackEvent('button_click', {
        button_text: button.textContent.trim(),
        button_class: button.className
      });
    });
  });
});

// ============================================
// FORM VALIDATION ENHANCEMENT
// ============================================
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validatePassword(password) {
  return password.length >= 6;
}

// Add real-time validation to forms
document.addEventListener('DOMContentLoaded', () => {
  const emailInputs = document.querySelectorAll('input[type="email"]');
  emailInputs.forEach(input => {
    input.addEventListener('blur', () => {
      if (input.value && !validateEmail(input.value)) {
        input.style.borderColor = '#ef4444';
        showToast('Please enter a valid email address', 'error');
      } else {
        input.style.borderColor = '';
      }
    });
  });
  
  const passwordInputs = document.querySelectorAll('input[type="password"]');
  passwordInputs.forEach(input => {
    input.addEventListener('blur', () => {
      if (input.value && !validatePassword(input.value)) {
        input.style.borderColor = '#ef4444';
        showToast('Password must be at least 6 characters', 'error');
      } else {
        input.style.borderColor = '';
      }
    });
  });
});

// ============================================
// ENHANCED SEARCH WITH DEBOUNCING
// ============================================
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

// Apply debouncing to search
const debouncedSearch = debounce(performSearch, 300);

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('talentSearch');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      if (searchInput.value.length > 2 || searchInput.value.length === 0) {
        debouncedSearch();
      }
    });
  }
});

// ============================================
// ACCESSIBILITY ENHANCEMENTS
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  // Add ARIA labels where missing
  const buttons = document.querySelectorAll('button:not([aria-label])');
  buttons.forEach(button => {
    if (button.textContent) {
      button.setAttribute('aria-label', button.textContent.trim());
    }
  });
  
  // Skip to main content link
  const skipLink = document.createElement('a');
  skipLink.href = '#home';
  skipLink.textContent = 'Skip to main content';
  skipLink.className = 'skip-link';
  skipLink.style.cssText = 'position: absolute; left: -9999px; z-index: 999; padding: 1em; background: var(--primary-color); color: white; text-decoration: none;';
  skipLink.addEventListener('focus', () => {
    skipLink.style.left = '0';
  });
  skipLink.addEventListener('blur', () => {
    skipLink.style.left = '-9999px';
  });
  document.body.insertBefore(skipLink, document.body.firstChild);
});

// ============================================
// PERFORMANCE MONITORING
// ============================================
window.addEventListener('load', () => {
  if ('performance' in window) {
    const perfData = window.performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    console.log(`Page load time: ${pageLoadTime}ms`);
    trackEvent('page_load_time', { load_time: pageLoadTime });
  }
});

// ============================================
// DROPDOWN MENUS
// ============================================
function initDropdownMenus() {
  const dropdowns = document.querySelectorAll('.nav-dropdown');
  
  dropdowns.forEach(dropdown => {
    const trigger = dropdown.querySelector('.dropdown-trigger');
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove('active');
      }
    });
    
    // Toggle dropdown on click (mobile)
    if (window.innerWidth <= 768) {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        dropdown.classList.toggle('active');
      });
    }
  });
}

// ============================================
// INITIALIZE LAZY LOADING
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  initLazyLoading();
});

// ============================================
// MULTI-LANGUAGE SUPPORT (i18n)
// ============================================
const translations = {
  en: {
    heroTitle: "Hire Fresh Talent with",
    heroSubtitle: "The fresher-first hiring platform where companies discover and hire verified students and 0-2 year experience candidates. Access a pool of motivated talent ready to grow with your company.",
    findTalent: "Find Talent",
    postHiring: "Post Hiring Need",
    availableCandidates: "Available Candidates",
    companiesHiring: "Companies Hiring",
    successfulHires: "Successful Hires"
  },
  hi: {
    heroTitle: "ताजा प्रतिभा किराया पर लें",
    heroSubtitle: "फ्रेशर-फर्स्ट हायरिंग प्लेटफॉर्म जहां कंपनियां सत्यापित छात्रों और 0-2 वर्ष के अनुभव वाले उम्मीदवारों को खोजती और किराया पर लेती हैं।",
    findTalent: "प्रतिभा खोजें",
    postHiring: "नौकरी पोस्ट करें",
    availableCandidates: "उपलब्ध उम्मीदवार",
    companiesHiring: "कंपनियां किराया पर ले रही हैं",
    successfulHires: "सफल नियुक्तियां"
  },
  es: {
    heroTitle: "Contrata Talento Fresco con",
    heroSubtitle: "La plataforma de contratación centrada en principiantes donde las empresas descubren y contratan estudiantes verificados y candidatos con 0-2 años de experiencia.",
    findTalent: "Encontrar Talento",
    postHiring: "Publicar Necesidad",
    availableCandidates: "Candidatos Disponibles",
    companiesHiring: "Empresas Contratando",
    successfulHires: "Contrataciones Exitosas"
  },
  fr: {
    heroTitle: "Embauchez des Talents Frais avec",
    heroSubtitle: "La plateforme de recrutement axée sur les débutants où les entreprises découvrent et embauchent des étudiants vérifiés et des candidats avec 0-2 ans d'expérience.",
    findTalent: "Trouver des Talents",
    postHiring: "Publier un Besoin",
    availableCandidates: "Candidats Disponibles",
    companiesHiring: "Entreprises qui Embauchent",
    successfulHires: "Embauches Réussies"
  }
};

let currentLanguage = localStorage.getItem('language') || 'en';

function changeLanguage(lang) {
  currentLanguage = lang;
  localStorage.setItem('language', lang);
  
  const t = translations[lang];
  if (!t) return;
  
  // Update hero section
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    heroTitle.innerHTML = `${t.heroTitle} <span class="highlight">FlipHire</span>`;
  }
  
  const heroSubtitle = document.querySelector('.hero-subtitle');
  if (heroSubtitle) {
    heroSubtitle.textContent = t.heroSubtitle;
  }
  
  // Update buttons
  const findTalentBtn = document.querySelector('.hero-cta .btn-primary');
  if (findTalentBtn) {
    findTalentBtn.textContent = t.findTalent;
  }
  
  const postHiringBtn = document.querySelector('.hero-cta .btn-secondary');
  if (postHiringBtn) {
    postHiringBtn.textContent = t.postHiring;
  }
  
  // Update stats labels
  const statLabels = document.querySelectorAll('.stat-label');
  if (statLabels.length >= 3) {
    statLabels[0].textContent = t.availableCandidates;
    statLabels[1].textContent = t.companiesHiring;
    statLabels[2].textContent = t.successfulHires;
  }
  
  // Update current language indicator
  const currentLangSpan = document.getElementById('currentLang');
  if (currentLangSpan) {
    currentLangSpan.textContent = lang.toUpperCase();
  }
  
  // Update active language option
  document.querySelectorAll('.lang-option').forEach(option => {
    option.classList.remove('active');
    if (option.getAttribute('data-lang') === lang) {
      option.classList.add('active');
    }
  });
  
  // Update document language
  document.documentElement.lang = lang;
  
  toggleLanguageMenu();
  showToast(`Language changed to ${lang.toUpperCase()}`, 'success');
}

function toggleLanguageMenu() {
  const langMenu = document.getElementById('langMenu');
  if (langMenu) {
    langMenu.classList.toggle('show');
  }
}

// Close language menu on outside click
document.addEventListener('click', (e) => {
  const langSwitcher = document.getElementById('languageSwitcher');
  if (langSwitcher && !langSwitcher.contains(e.target)) {
    const langMenu = document.getElementById('langMenu');
    if (langMenu) {
      langMenu.classList.remove('show');
    }
  }
});

// Initialize language on load
document.addEventListener('DOMContentLoaded', () => {
  if (currentLanguage !== 'en') {
    changeLanguage(currentLanguage);
  }
});

// Make functions globally available
window.changeLanguage = changeLanguage;
window.toggleLanguageMenu = toggleLanguageMenu;

// ============================================
// ROI CALCULATOR
// ============================================
function calculateROI() {
  const positions = parseInt(document.getElementById('positions').value) || 0;
  const salary = parseInt(document.getElementById('salary').value) || 0;
  const traditionalCost = parseInt(document.getElementById('traditionalCost').value) || 0;
  const timeToHire = parseInt(document.getElementById('timeToHire').value) || 0;
  
  // FlipHire cost per hire (assumed 10,000)
  const fliphireCostPerHire = 10000;
  
  // Calculate savings
  const traditionalTotal = traditionalCost * positions;
  const fliphireTotal = fliphireCostPerHire * positions;
  const totalSavings = traditionalTotal - fliphireTotal;
  
  // Time saved (FlipHire is 60% faster)
  const industryAvgTime = timeToHire;
  const fliphireTime = Math.round(industryAvgTime * 0.4);
  const timeSaved = industryAvgTime - fliphireTime;
  
  // Update results
  const totalSavingsEl = document.getElementById('totalSavings');
  const timeSavedEl = document.getElementById('timeSaved');
  const costPerHireEl = document.getElementById('costPerHire');
  
  if (totalSavingsEl) {
    totalSavingsEl.textContent = `₹${totalSavings.toLocaleString('en-IN')}`;
  }
  
  if (timeSavedEl) {
    timeSavedEl.textContent = `${timeSaved} days`;
  }
  
  if (costPerHireEl) {
    costPerHireEl.textContent = `₹${fliphireCostPerHire.toLocaleString('en-IN')}`;
  }
  
  // Animate results
  animateValue(totalSavingsEl, 0, totalSavings, 1000);
  animateValue(timeSavedEl, 0, timeSaved, 1000);
}

function animateValue(element, start, end, duration) {
  if (!element) return;
  
  const startTime = performance.now();
  const originalText = element.textContent;
  const isNumber = !isNaN(parseInt(originalText.replace(/[^0-9]/g, '')));
  
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    if (isNumber) {
      const current = Math.floor(start + (end - start) * progress);
      const formatted = originalText.includes('₹') 
        ? `₹${current.toLocaleString('en-IN')}`
        : originalText.includes('days')
        ? `${current} days`
        : current.toString();
      element.textContent = formatted;
    }
    
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }
  
  requestAnimationFrame(update);
}

// Initialize ROI calculator
document.addEventListener('DOMContentLoaded', () => {
  const roiInputs = document.querySelectorAll('#positions, #salary, #traditionalCost, #timeToHire');
  roiInputs.forEach(input => {
    if (input) {
      input.addEventListener('input', calculateROI);
    }
  });
  
  // Calculate initial values
  if (roiInputs.length > 0) {
    calculateROI();
  }
});

// Make calculateROI globally available
window.calculateROI = calculateROI;

// ============================================
// CONSOLE WELCOME MESSAGE
// ============================================
console.log('%cFlipHire - Hire Fresh Talent Platform', 'color: #0a66c2; font-size: 16px; font-weight: bold;');
console.log('%cWhere companies come to discover and hire freshers', 'color: #666; font-size: 12px;');
console.log('%cBuilt with modern web technologies', 'color: #999; font-size: 10px;');
