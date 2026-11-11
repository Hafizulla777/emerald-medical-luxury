/*
 * ============================================================================
 * EMERALD MEDICAL LUXURY — app.js
 * Interactive behavior for the hospital website (demo project).
 * ============================================================================
 */

(function () {
  'use strict';

  // ------------------------------------------------------------------
  // State
  // ------------------------------------------------------------------
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileClose = document.querySelector('.mobile-nav__close');
  const mobileOverlay = document.querySelector('.mobile-overlay');
  const header = document.querySelector('.header');
  const contactForm = document.getElementById('contactForm');
  const successMessage = document.getElementById('successMessage');

  // ------------------------------------------------------------------
  // Mobile navigation
  // ------------------------------------------------------------------
  function openMobileNav() {
    if (!mobileNav || !mobileOverlay) return;
    mobileNav.classList.add('mobile-nav--open');
    mobileOverlay.classList.add('mobile-overlay--open');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileNav() {
    if (!mobileNav || !mobileOverlay) return;
    mobileNav.classList.remove('mobile-nav--open');
    mobileOverlay.classList.remove('mobile-overlay--open');
    document.body.style.overflow = '';
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', openMobileNav);
  }
  if (mobileClose) {
    mobileClose.addEventListener('click', closeMobileNav);
  }
  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', closeMobileNav);
  }

  // Close mobile nav when clicking a nav link
  document.querySelectorAll('.mobile-nav__link').forEach((link) => {
    link.addEventListener('click', closeMobileNav);
  });

  // ------------------------------------------------------------------
  // Header scroll effect
  // ------------------------------------------------------------------
  function handleScroll() {
    if (!header) return;
    if (window.scrollY > 20) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // ------------------------------------------------------------------
  // Smooth scroll for anchor links
  // ------------------------------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        closeMobileNav();
      }
    });
  });

  // ------------------------------------------------------------------
  // Department filter buttons (departments.html)
  // ------------------------------------------------------------------
  const filterBtns = document.querySelectorAll('.filter-btn');
  const deptCards = document.querySelectorAll('.dept-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', function () {
      // Update active state
      filterBtns.forEach((b) => b.classList.remove('filter-btn--active'));
      this.classList.add('filter-btn--active');

      const filter = this.getAttribute('data-filter');

      deptCards.forEach((card) => {
        if (filter === 'all') {
          card.style.display = 'flex';
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          requestAnimationFrame(() => {
            card.style.transition = 'all 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          });
        } else {
          const match = card.getAttribute('data-dept') === filter;
          if (match) {
            card.style.display = 'flex';
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            requestAnimationFrame(() => {
              card.style.transition = 'all 0.4s ease';
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            });
          } else {
            card.style.display = 'none';
          }
        }
      });
    });
  });

  // ------------------------------------------------------------------
  // Doctor search + department filter (doctors.html)
  // ------------------------------------------------------------------
  const doctorSearchInput = document.getElementById('doctorSearch');
  const doctorCards = document.querySelectorAll('.doctor-card');

  if (doctorSearchInput) {
    doctorSearchInput.addEventListener('input', function () {
      const query = this.value.toLowerCase().trim();
      doctorCards.forEach((card) => {
        const name = card.querySelector('h3')?.textContent.toLowerCase() || '';
        const spec = card.querySelector('.doctor-card__spec')?.textContent.toLowerCase() || '';
        const match = name.includes(query) || spec.includes(query);
        card.style.display = match ? 'flex' : 'none';
        if (match) {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          requestAnimationFrame(() => {
            card.style.transition = 'all 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          });
        }
      });
    });
  }

  // ------------------------------------------------------------------
  // Contact form validation & submission (contact.html)
  // ------------------------------------------------------------------
  if (contactForm) {
    const fields = {
      name: document.getElementById('patientName'),
      phone: document.getElementById('patientPhone'),
      email: document.getElementById('patientEmail'),
      department: document.getElementById('department'),
      date: document.getElementById('appointmentDate'),
      message: document.getElementById('message'),
    };

    // Real-time validation on blur
    Object.values(fields).forEach((field) => {
      if (!field) return;
      field.addEventListener('blur', () => validateField(field));
      field.addEventListener('input', () => {
        if (field.classList.contains('error')) {
          validateField(field);
        }
      });
    });

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      let isValid = true;

      Object.values(fields).forEach((field) => {
        if (!field) return;
        if (!validateField(field)) {
          isValid = false;
        }
      });

      if (!isValid) {
        // Focus first invalid field
        const firstInvalid = contactForm.querySelector('.error');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      // Simulate submission (demo only — no backend)
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending…';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        contactForm.reset();
        contactForm.style.display = 'none';
        if (successMessage) {
          successMessage.style.display = 'block';
          successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 1400);
    });
  }

  function validateField(field) {
    if (!field) return true;
    const value = field.value.trim();
    const type = field.type;
    const tag = field.tagName.toLowerCase();
    let errorMsg = '';

    // Clear previous error state
    field.classList.remove('error');
    const parent = field.closest('.form-group');
    const errorEl = parent?.querySelector('.error-message');
    if (errorEl) errorEl.style.display = 'none';

    if (!value) {
      errorMsg = 'This field is required.';
    } else if (type === 'email') {
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRe.test(value)) {
        errorMsg = 'Please enter a valid email address.';
      }
    } else if (type === 'tel') {
      const phoneRe = /^[\d\s\+\-\(\)]{8,}$/;
      if (!phoneRe.test(value)) {
        errorMsg = 'Please enter a valid phone number.';
      }
    } else if (tag === 'select' && value === '') {
      errorMsg = 'Please select an option.';
    }

    if (errorMsg) {
      field.classList.add('error');
      if (errorEl) {
        errorEl.textContent = errorMsg;
        errorEl.style.display = 'block';
      }
      return false;
    }
    return true;
  }

  // ------------------------------------------------------------------
  // WhatsApp button handler
  // ------------------------------------------------------------------
  const whatsappBtn = document.querySelector('.whatsapp-btn');
  if (whatsappBtn) {
    whatsappBtn.addEventListener('click', function () {
      const phone = this.getAttribute('data-phone') || '919876543210';
      const message = encodeURIComponent(
        'Hello Emerald Medical Luxury, I would like to book an appointment.'
      );
      window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
    });
  }

  // ------------------------------------------------------------------
  // Intersection Observer for fade-in animations
  // ------------------------------------------------------------------
  const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.card, .dept-card, .doctor-card, .facility-card, .value-card, .leader-card, .info-card, .stat-card').forEach((el) => {
    observer.observe(el);
  });

  // ------------------------------------------------------------------
// FAQ toggle (contact.html)
// ------------------------------------------------------------------
window.toggleFaq = function (button) {
  const faqItem = button.closest('.faq-item');
  const isActive = faqItem.classList.contains('active');

  // Close all other FAQ items
  document.querySelectorAll('.faq-item.active').forEach((item) => {
    item.classList.remove('active');
  });

  // Toggle current item
  if (!isActive) {
    faqItem.classList.add('active');
  }
};

// ------------------------------------------------------------------
// Newsletter form (contact.html)
// ------------------------------------------------------------------
const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const emailInput = document.getElementById('newsletterEmail');
    const email = emailInput.value.trim();
    const btn = newsletterForm.querySelector('button[type="submit"]');
    const originalText = btn.textContent;

    if (!email) return;

    btn.textContent = 'Subscribing…';
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = 'Subscribed!';
      btn.style.backgroundColor = 'var(--color-success)';
      emailInput.value = '';
      setTimeout(() => {
        btn.textContent = originalText;
        btn.disabled = false;
        btn.style.backgroundColor = '';
      }, 2000);
    }, 1000);
  });
}

// ------------------------------------------------------------------
// Current year for footer
// ------------------------------------------------------------------
const yearEl = document.getElementById('currentYear');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}
})();