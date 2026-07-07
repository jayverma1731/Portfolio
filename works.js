/* ═══════════════════════════════════════════════════════════
   V UDAY — MY WORKS PAGE
   Interactions & Animations
   ═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // Prevent image dragging and ghost image behaviors
  document.querySelectorAll('img').forEach(img => {
    img.setAttribute('draggable', 'false');
    img.addEventListener('dragstart', (e) => e.preventDefault());
  });

  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // ─── SCROLL REVEAL ───
  const revealElements = document.querySelectorAll('[data-wreveal]');
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = parseInt(entry.target.dataset.delay) || 0;
          setTimeout(() => entry.target.classList.add('w-revealed'), delay);
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );
  revealElements.forEach((el) => revealObserver.observe(el));

  // ─── NAVBAR SCROLL ───
  const navbar = document.getElementById('w-navbar');
  if (navbar) {
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const currentScroll = window.scrollY;
      navbar.classList.toggle('scrolled', currentScroll > 60);
      lastScroll = currentScroll;
    }, { passive: true });
  }

  // ─── MOBILE NAV ───
  const toggle = document.getElementById('w-nav-toggle');
  const links = document.getElementById('w-nav-links');

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.classList.toggle('active');
      toggle.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });

    links.querySelectorAll('.w-nav-link').forEach((a) => {
      a.addEventListener('click', () => {
        links.classList.remove('open');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close menu when logo is clicked
    const logo = document.querySelector('.w-nav-logo');
    if (logo) {
      logo.addEventListener('click', () => {
        links.classList.remove('open');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    }

    // Reset lock when viewport resizes above mobile break
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        links.classList.remove('open');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    }, { passive: true });
  }

  // ─── VELOCITY-SENSITIVE ORGANIC MERCURY CURSOR (PC Only) ───
  if (!isTouchDevice) {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor-fluid';
    document.body.appendChild(cursor);

    let mouseX = 0, mouseY = 0;
    let currentX = 0, currentY = 0;
    let lastX = 0, lastY = 0;
    let speed = 0;
    let angle = 0;
    let isHovered = false;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, { passive: true });

    const updateCursor = () => {
      currentX += (mouseX - currentX) * 0.16;
      currentY += (mouseY - currentY) * 0.16;

      const dx = currentX - lastX;
      const dy = currentY - lastY;
      speed = Math.min(Math.hypot(dx, dy) * 1.8, 110);
      angle = Math.atan2(dy, dx) * 180 / Math.PI;

      lastX = currentX;
      lastY = currentY;

      const scaleX = isHovered ? 1.8 : 1 + (speed / 120);
      const scaleY = isHovered ? 1.8 : 1 - (speed / 200);

      cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) rotate(${angle}deg) scale3d(${scaleX}, ${scaleY}, 1)`;

      requestAnimationFrame(updateCursor);
    };
    requestAnimationFrame(updateCursor);

    // Interactive Hover Snap
    const interactiveElements = document.querySelectorAll('a, button, .project-card');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        isHovered = true;
        cursor.classList.add('hovered');
      });
      el.addEventListener('mouseleave', () => {
        isHovered = false;
        cursor.classList.remove('hovered');
      });
    });
  }

  // ─── TIMELINE CARD MOUSE TRACKING ───
  if (!isTouchDevice) {
    document.querySelectorAll('.timeline-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
        card.style.setProperty('--my', `${e.clientY - rect.top}px`);
      });

      card.addEventListener('mouseleave', () => {
        card.style.setProperty('--mx', '50%');
        card.style.setProperty('--my', '50%');
      });
    });
  }

  // ─── PROJECT MODALS ───
  const projectCards = document.querySelectorAll('.project-card[data-project]');
  const modals = document.querySelectorAll('.modal-backdrop');

  function openModal(projectId) {
    const modal = document.getElementById(`modal-${projectId}`);
    if (!modal) return;

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Trap focus
    const focusable = modal.querySelectorAll('button, [href], [tabindex]:not([tabindex="-1"])');
    if (focusable.length) focusable[0].focus();
  }

  function closeModal(modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Card click → open modal
  projectCards.forEach(card => {
    card.addEventListener('click', () => {
      const projectId = card.dataset.project;
      openModal(projectId);
    });
  });

  // Close button
  modals.forEach(modal => {
    const closeBtn = modal.querySelector('.modal-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeModal(modal);
      });
    }

    // Click backdrop to close
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
  });

  // Escape key to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modals.forEach(modal => {
        if (modal.classList.contains('open')) {
          closeModal(modal);
        }
      });
    }
  });
});
