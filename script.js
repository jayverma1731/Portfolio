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

  // ─── VECTOR FIELD GRAVITY BACKDROP (Canvas) ───
  const canvas = document.getElementById('hero-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      createGrid();
      drawField();
    }, { passive: true });

    // Grid nodes config
    let gridNodes = [];
    const spacing = 45; // grid cell size

    function createGrid() {
      gridNodes = [];
      const cols = Math.ceil(width / spacing) + 1;
      const rows = Math.ceil(height / spacing) + 1;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          gridNodes.push({
            x: c * spacing,
            y: r * spacing,
            baseSize: 1.5,
          });
        }
      }
    }
    createGrid();

    function drawField() {
      ctx.clearRect(0, 0, width, height);

      gridNodes.forEach(node => {
        // Default idle subtle tick
        ctx.save();
        ctx.translate(node.x, node.y);
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.035)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-3, 0);
        ctx.lineTo(3, 0);
        ctx.stroke();
        ctx.restore();
      });
    }
    drawField();
  }

  // ─── 3D TILT & METALLIC SHINE ───
  const interactiveCards = document.querySelectorAll('.service-card, .feature-card, .about-card');
  
  interactiveCards.forEach(card => {
    let rect = card.getBoundingClientRect();
    const updateRect = () => { rect = card.getBoundingClientRect(); };
    
    window.addEventListener('resize', updateRect, { passive: true });
    window.addEventListener('scroll', updateRect, { passive: true });
    card.addEventListener('mouseenter', updateRect);

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

  // ─── NAVBAR SCROLL STYLING ───
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  }

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

  // ─── FORM SUBMISSION ───
  const form = document.getElementById('booking-form');
  const success = document.getElementById('form-success');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const btn = form.querySelector('button[type="submit"]');
      const name = form.querySelector('#fullName').value.trim();
      const email = form.querySelector('#email').value.trim();

      if (!name || !email) {
        form.querySelectorAll('.form-input').forEach((inp) => {
          if (!inp.value.trim() && inp.hasAttribute('required')) {
            inp.style.borderColor = '#e53e3e';
            setTimeout(() => (inp.style.borderColor = ''), 2000);
          }
        });
        return;
      }

      const origHTML = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = '<span>Sending...</span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="spinner"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>';

      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            access_key: '2bc6e4cb-54ff-4aeb-bd7f-08ce73b9c29e',
            name: name,
            email: email,
            phone: form.querySelector('#phone').value.trim(),
            subject: 'New Appointment Booking from ' + name
          })
        });

        if (response.ok) {
          form.style.display = 'none';
          success.classList.add('show');
        } else {
          throw new Error('Web3Forms returned an error');
        }
      } catch (err) {
        console.error('Submission error:', err);
        btn.disabled = false;
        btn.innerHTML = origHTML;
        alert('Something went wrong. Please try again or email directly.');
      }
    });
  }
});
