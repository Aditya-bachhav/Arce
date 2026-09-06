/**
 * ARCEAUS — Interactive Scripts
 * Handles modal dialogues, navigation, contact form submission, and micro-interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // Modal System
  // --------------------------------------------------------------------------
  const modals = document.querySelectorAll('.modal-overlay');
  const projectModal = document.getElementById('projectModal');
  const projectButtons = document.querySelectorAll('.open-project-modal');
  const navModalLinks = document.querySelectorAll('[data-modal]');
  const closeButtons = document.querySelectorAll('[data-close-modal]');

  // Function to open specific modal
  function openModal(modal) {
    if (!modal) return;
    // Close any currently active modal
    modals.forEach(m => m.classList.remove('active'));
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Focus first input or close button for accessibility
    const focusable = modal.querySelector('input, textarea, button');
    if (focusable) focusable.focus();
  }

  // Function to close all modals
  function closeModals() {
    modals.forEach(modal => {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
    });
    document.body.style.overflow = '';
  }

  // Attach open handlers for "Start a Project" / "Let's Talk"
  projectButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      closeMobileDrawer();
      openModal(projectModal);
    });
  });

  // Attach open handlers for navigation modals (About, Services, Work, Pricing, Contact)
  navModalLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = link.getAttribute('data-modal');
      const targetModal = document.getElementById(modalId);
      closeMobileDrawer();
      if (targetModal) {
        openModal(targetModal);
      }
    });
  });

  // Close button handlers
  closeButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      closeModals();
    });
  });

  // Close on backdrop click
  modals.forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModals();
      }
    });
  });

  // Close on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModals();
      closeMobileDrawer();
    }
  });

  // --------------------------------------------------------------------------
  // Mobile Navigation Drawer
  // --------------------------------------------------------------------------
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const closeDrawerBtn = document.getElementById('closeDrawerBtn');

  function openMobileDrawer() {
    mobileDrawer.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileDrawer() {
    mobileDrawer.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', openMobileDrawer);
  }

  if (closeDrawerBtn) {
    closeDrawerBtn.addEventListener('click', closeMobileDrawer);
  }

  if (mobileDrawer) {
    mobileDrawer.addEventListener('click', (e) => {
      if (e.target === mobileDrawer) {
        closeMobileDrawer();
      }
    });
  }

  // --------------------------------------------------------------------------
  // Project Form Submission & Toast System
  // --------------------------------------------------------------------------
  const projectForm = document.getElementById('projectForm');
  const toastContainer = document.getElementById('toastContainer');

  function showToast(message, duration = 4000) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#68D391" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      <span>${message}</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  if (projectForm) {
    projectForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = projectForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      
      // Feedback during submission
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Sending inquiry...</span>';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        projectForm.reset();
        closeModals();
        showToast('Thank you! We have received your inquiry and will contact you shortly.');
      }, 700);
    });
  }
});
