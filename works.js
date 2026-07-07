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

  // ─── SCROLL INTERACTIONS (Navbar, Progress Bar, 3D Tilt & Background Shapes) ───
  const navbar = document.getElementById('w-navbar');
  const progressBar = document.getElementById('scroll-progress');
  const scrollCards = document.querySelectorAll('.project-card, .timeline-card');
  const shape1 = document.querySelector('.bg-shape-1');
  const shape2 = document.querySelector('.bg-shape-2');
  const shape3 = document.querySelector('.bg-shape-3');
  const shape4 = document.querySelector('.bg-shape-4');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    if (navbar) {
      navbar.classList.toggle('scrolled', scrollY > 60);
    }

    if (progressBar) {
      const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = windowHeight > 0 ? (scrollY / windowHeight) * 100 : 0;
      progressBar.style.width = scrollPercent + '%';
    }

    // Background shapes complex animations on scroll
    if (shape1) {
      const transX = scrollY * 0.22;
      const transY = scrollY * -0.4;
      const rot = scrollY * 0.04;
      shape1.style.transform = `translate3d(${transX}px, ${transY}px, 0) rotate(${rot}deg)`;
    }
    if (shape2) {
      const transX = scrollY * -0.15;
      const transY = scrollY * -0.65;
      const scale = 1 + Math.sin(scrollY * 0.0018) * 0.12;
      const rot = scrollY * -0.03;
      shape2.style.transform = `translate3d(${transX}px, ${transY}px, 0) rotate(${rot}deg) scale(${scale})`;
    }
    if (shape3) {
      const transX = Math.sin(scrollY * 0.0012) * 70;
      const transY = scrollY * -0.85;
      const scale = 1 + Math.cos(scrollY * 0.0008) * 0.08;
      shape3.style.transform = `translate3d(${transX}px, ${transY}px, 0) scale(${scale})`;
    }
    if (shape4) {
      const transX = scrollY * 0.08;
      const transY = scrollY * -0.95;
      const rot = scrollY * 0.05;
      const scale = 0.95 + Math.sin(scrollY * 0.0008) * 0.1;
      shape4.style.transform = `translate3d(${transX}px, ${transY}px, 0) rotate(${rot}deg) scale(${scale})`;
    }

    // Continuous 3D scroll-linked tilt for visible cards (PC only)
    if (!isTouchDevice) {
      const vh = window.innerHeight;
      scrollCards.forEach(card => {
        const cardRect = card.getBoundingClientRect();
        const cardCenterY = cardRect.top + cardRect.height / 2;
        const normalizedY = (cardCenterY - vh / 2) / (vh / 2);

        if (cardRect.top < vh && cardRect.bottom > 0) {
          const tiltAngle = normalizedY * -10;
          const translateY = normalizedY * 20;
          card.style.transform = `perspective(1000px) rotateX(${tiltAngle}deg) translateY(${translateY}px) scale(1)`;
        } else {
          card.style.transform = '';
        }
      });
    }
  }, { passive: true });

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
