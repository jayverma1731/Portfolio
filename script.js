/* ═══════════════════════════════════════════════════════════
   V UDAY — PREMIUM PORTFOLIO
   Ultimate Shockwave Interactions & Animations
   ═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // Prevent image dragging and ghost image behaviors
  document.querySelectorAll('img').forEach(img => {
    img.setAttribute('draggable', 'false');
    img.addEventListener('dragstart', (e) => e.preventDefault());
  });

  // ─── CLEAN URL PATHS & LOCAL PROTOCOL FALLBACK ───
  try {
    if (window.location.protocol === 'file:') {
      document.querySelectorAll('a[href="./"], a[href^="./#"]').forEach(link => {
        const href = link.getAttribute('href');
        if (href === './') {
          link.setAttribute('href', 'index.html');
        } else if (href.startsWith('./#')) {
          link.setAttribute('href', 'index.html' + href.substring(2));
        }
      });
    } else {
      if (window.location.pathname.endsWith('/index.html')) {
        const cleanPath = window.location.pathname.substring(0, window.location.pathname.length - 10);
        window.history.replaceState(null, '', cleanPath + window.location.hash);
      } else if (window.location.pathname.endsWith('index.html')) {
        window.history.replaceState(null, '', '/' + window.location.hash);
      }
    }
  } catch (e) {
    console.warn("URL cleaner error:", e);
  }

  // ─── LOCK PINCH-ZOOM AND DOUBLE-TAP ZOOM (Mobile Safari/Android) ───
  document.addEventListener('gesturestart', (e) => e.preventDefault(), { passive: false });
  document.addEventListener('touchstart', (e) => {
    if (e.touches.length > 1) {
      e.preventDefault();
    }
  }, { passive: false });

  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // ─── SCROLL REVEAL (Clip wipe reveal) ───
  const revealElements = document.querySelectorAll('[data-reveal]');
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = parseInt(entry.target.dataset.delay) || 0;
          setTimeout(() => entry.target.classList.add('revealed'), delay);
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );
  revealElements.forEach((el) => revealObserver.observe(el));

  // ─── CYBER TEXT SCRAMBLE DECRYPT EFFECT ───
  class TextScramble {
    constructor(el) {
      this.el = el;
      this.chars = '!<>-_\\/[]{}—=+*^?#________';
      this.update = this.update.bind(this);
    }
    setText(newText) {
      const oldText = this.el.innerText;
      const length = Math.max(oldText.length, newText.length);
      const promise = new Promise((resolve) => this.resolve = resolve);
      this.queue = [];
      for (let i = 0; i < length; i++) {
        const from = oldText[i] || '';
        const to = newText[i] || '';
        const start = Math.floor(Math.random() * 20);
        const end = start + Math.floor(Math.random() * 20);
        this.queue.push({ from, to, start, end, char: '' });
      }
      cancelAnimationFrame(this.frameId);
      this.frame = 0;
      this.update();
      return promise;
    }
    update() {
      let output = '';
      let complete = 0;
      for (let i = 0, n = this.queue.length; i < n; i++) {
        let { from, to, start, end, char } = this.queue[i];
        if (this.frame >= end) {
          complete++;
          output += to;
        } else if (this.frame >= start) {
          if (!char || Math.random() < 0.28) {
            char = this.randomChar();
            this.queue[i].char = char;
          }
          output += `<span class="scramble-char">${char}</span>`;
        } else {
          output += from;
        }
      }
      this.el.innerHTML = output;
      if (complete === this.queue.length) {
        this.resolve();
      } else {
        this.frameId = requestAnimationFrame(this.update);
        this.frame++;
      }
    }
    randomChar() {
      return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
  }

  // Hook scramble effect to nav links
  const scrambleElements = document.querySelectorAll('.nav-link:not(.nav-cta)');
  scrambleElements.forEach(el => {
    const originalText = el.innerText;
    const fx = new TextScramble(el);
    let isAnimating = false;

    el.addEventListener('mouseenter', () => {
      if (isAnimating) return;
      isAnimating = true;
      fx.setText(originalText).then(() => {
        isAnimating = false;
      });
    });
  });

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
      // Lerp positioning
      currentX += (mouseX - currentX) * 0.16;
      currentY += (mouseY - currentY) * 0.16;

      // Calculate speed and angle for organic stretch
      const dx = currentX - lastX;
      const dy = currentY - lastY;
      speed = Math.min(Math.hypot(dx, dy) * 1.8, 110); // clamp stretch factor
      angle = Math.atan2(dy, dx) * 180 / Math.PI;

      lastX = currentX;
      lastY = currentY;

      // Stretch scales: stretch X-axis with speed, squeeze Y-axis
      const scaleX = isHovered ? 1.8 : 1 + (speed / 120);
      const scaleY = isHovered ? 1.8 : 1 - (speed / 200);

      // Render mercury stretch transform
      cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) rotate(${angle}deg) scale3d(${scaleX}, ${scaleY}, 1)`;

      requestAnimationFrame(updateCursor);
    };
    requestAnimationFrame(updateCursor);

    // Interactive Hover Snap classes
    const interactiveElements = document.querySelectorAll('a, button, .service-card, .feature-card, .about-card, input, textarea');
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

  // ─── DYNAMIC SCROLL-LINKED VECTOR FLUID FIELD (Canvas Backdrop) ───
  const canvas = document.getElementById('hero-canvas');
  if (canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }, { passive: true });
  }

  // ─── 3D TILT & METALLIC SHINE ───
  const interactiveCards = document.querySelectorAll('.service-card, .feature-card, .about-card');
  
  interactiveCards.forEach(card => {
    let rect = card.getBoundingClientRect();
    const updateRect = () => { rect = card.getBoundingClientRect(); };
    
    window.addEventListener('resize', updateRect, { passive: true });
    window.addEventListener('scroll', updateRect, { passive: true });
    card.addEventListener('mouseenter', () => {
      updateRect();
      card.dataset.hovered = "true";
    });

    card.addEventListener('mousemove', (e) => {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      card.style.setProperty('--mx', `${x}px`);
      card.style.setProperty('--my', `${y}px`);

      if (!isTouchDevice) {
        const xc = rect.width / 2;
        const yc = rect.height / 2;
        // Elastic organic tilt angles
        const tiltX = -(y - yc) / (rect.height / 7);
        const tiltY = (x - xc) / (rect.width / 7);
        
        card.style.transform = `perspective(1200px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.025, 1.025, 1.025)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      card.dataset.hovered = "false";
      card.style.transform = '';
      card.style.setProperty('--mx', `-999px`);
      card.style.setProperty('--my', `-999px`);
    });
  });

  // ─── SMOOTH SCROLL ───
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id === '#') return;
      const el = document.querySelector(id);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ─── MAGNETIC SNAP ELEMENTS ───
  document.querySelectorAll('.magnetic').forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      btn.style.transform = `translate(${x * 0.35}px, ${y * 0.35}px) scale(1.04)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

  // ─── ANIMATED COUNTERS ───
  const counters = document.querySelectorAll('[data-count]');
  let counted = false;
  const statsSection = document.getElementById('stats');

  function runCounters() {
    counters.forEach((el) => {
      const target = parseInt(el.dataset.count);
      const duration = 2000;
      const start = performance.now();

      function ease(t) { return t === 1 ? 1 : 1 - Math.pow(2, -10 * t); }

      function tick(now) {
        const p = Math.min((now - start) / duration, 1);
        el.textContent = Math.round(ease(p) * target);
        if (p < 1) requestAnimationFrame(tick);
      }

      requestAnimationFrame(tick);
    });
  }

  if (statsSection) {
    const counterObs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !counted) {
          counted = true;
          runCounters();
          counterObs.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    counterObs.observe(statsSection);
  }

  // ─── ACTIVE NAV LINK ───
  const sections = document.querySelectorAll('section[id]');
  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          document.querySelectorAll('.nav-link').forEach((l) => {
            l.classList.toggle('active', l.getAttribute('href') === '#' + id);
          });
        }
      });
    },
    { threshold: 0.1, rootMargin: '-80px 0px -50% 0px' }
  );
  sections.forEach((s) => navObserver.observe(s));

  // ─── SCROLL INTERACTIONS (Navbar, Progress Bar, Parallax & Background Shapes) ───
  const navbar = document.getElementById('navbar');
  const progressBar = document.getElementById('scroll-progress');
  const heroGlow = document.querySelector('.hero-glow');
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

    if (heroGlow && !isTouchDevice && scrollY < window.innerHeight) {
      heroGlow.style.transform = `translate3d(-50%, calc(-55% + ${scrollY * 0.18}px), 0) scale(1)`;
    }

    // Background shapes complex animations on scroll (Active on mobile/tablet too!)
    if (shape1) {
      const transX = scrollY * 0.22;
      const transY = scrollY * 0.12;
      const rot = scrollY * 0.04;
      shape1.style.transform = `translate3d(${transX}px, ${transY}px, 0) rotate(${rot}deg)`;
    }
    if (shape2) {
      const transX = scrollY * -0.18;
      const transY = scrollY * 0.06;
      const scale = 1 + Math.sin(scrollY * 0.0018) * 0.12;
      const rot = scrollY * -0.03;
      shape2.style.transform = `translate3d(${transX}px, ${transY}px, 0) rotate(${rot}deg) scale(${scale})`;
    }
    if (shape3) {
      const transX = Math.sin(scrollY * 0.0012) * 70;
      const transY = scrollY * 0.04;
      const scale = 1 + Math.cos(scrollY * 0.0008) * 0.08;
      shape3.style.transform = `translate3d(${transX}px, ${transY}px, 0) scale(${scale})`;
    }
    if (shape4) {
      const transX = scrollY * 0.1;
      const transY = scrollY * -0.04;
      const rot = scrollY * 0.05;
      const scale = 0.95 + Math.sin(scrollY * 0.0008) * 0.1;
      shape4.style.transform = `translate3d(${transX}px, ${transY}px, 0) rotate(${rot}deg) scale(${scale})`;
    }

    // Continuous 3D scroll-linked tilt for visible cards (PC only)
    if (!isTouchDevice) {
      const vh = window.innerHeight;
      interactiveCards.forEach(card => {
        if (card.dataset.hovered === "true") return;

        const cardRect = card.getBoundingClientRect();
        const cardCenterY = cardRect.top + cardRect.height / 2;
        const normalizedY = (cardCenterY - vh / 2) / (vh / 2);

        if (cardRect.top < vh && cardRect.bottom > 0) {
          const tiltAngle = normalizedY * -12;
          const translateY = normalizedY * 25;
          card.style.transform = `perspective(1000px) rotateX(${tiltAngle}deg) translateY(${translateY}px) scale(1)`;
        } else {
          card.style.transform = '';
        }
      });
    }
  }, { passive: true });

  // ─── MOBILE NAV ───
  const toggle = document.getElementById('nav-toggle');
  const links = document.getElementById('nav-links');

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.classList.toggle('active');
      toggle.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });

    links.querySelectorAll('.nav-link').forEach((a) => {
      a.addEventListener('click', () => {
        links.classList.remove('open');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close menu when logo is clicked
    const logo = document.querySelector('.nav-logo');
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


});
