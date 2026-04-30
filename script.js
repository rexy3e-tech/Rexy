/* =========================================================
   ALEX VEIN — Portfolio
   Vanilla JS only. Each block is small and self-contained.
   ========================================================= */

(() => {
  'use strict';

  /* ---------- 1. STICKY NAVBAR — blur on scroll ---------- */
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 24);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- 2. MOBILE MENU (hamburger) ---------- */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const closeMenu = () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  };
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
  // Close on link click (mobile)
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

  /* ---------- 3. SMOOTH SCROLL on anchor links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href');
      if (id.length > 1) {
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  /* ---------- 4. TYPEWRITER effect in hero ---------- */
  const typewriterEl = document.getElementById('typewriter');
  const roles = [
    'YouTubers',
    'Brands',
    'Filmmakers',
    'Creators',
    'Wedding Couples',
    'Studios'
  ];
  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const tick = () => {
    const current = roles[roleIndex];
    if (!deleting) {
      typewriterEl.textContent = current.slice(0, ++charIndex);
      if (charIndex === current.length) {
        deleting = true;
        return setTimeout(tick, 1600);
      }
    } else {
      typewriterEl.textContent = current.slice(0, --charIndex);
      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }
    setTimeout(tick, deleting ? 45 : 90);
  };
  tick();

  /* ---------- 5. SCROLL REVEAL via IntersectionObserver ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger entries within the same batch for a nicer feel
        setTimeout(() => entry.target.classList.add('in-view'), i * 80);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------- 6. ANIMATED COUNTERS in stats section ---------- */
  const counters = document.querySelectorAll('.stat-num');
  const animateCounter = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const duration = 1800;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      // easeOutQuart for satisfying deceleration
      const eased = 1 - Math.pow(1 - progress, 4);
      const value = Math.floor(eased * target);
      el.textContent = value.toLocaleString() + (progress === 1 && target >= 100 ? '+' : '');
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  counters.forEach(c => counterObserver.observe(c));

  /* ---------- 7. PORTFOLIO FILTER (All / Cinematic / AMV / Bikes / Cars) ---------- */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const workCards = document.querySelectorAll('.video-card, .work-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      // Active state
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Show/hide cards
      workCards.forEach(card => {
        const matches = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('is-hidden', !matches);
      });
    });
  });

  /* ---------- 7b. PROTECT WORK SECTION (no right-click / save) ---------- */
  const workSection = document.querySelector('#work');
  if (workSection) {
    workSection.addEventListener('contextmenu', e => e.preventDefault());
    workSection.addEventListener('dragstart', e => e.preventDefault());
  }

  /* ---------- 8. CONTACT FORM — friendly fake submit ---------- */
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    status.textContent = 'Sending...';
    status.style.color = 'var(--text-muted)';

    setTimeout(() => {
      status.textContent = 'Message sent. I\'ll be in touch within 24 hours.';
      status.style.color = 'var(--neon-cyan)';
      form.reset();
    }, 900);
  });

  /* ---------- 9. FOOTER YEAR ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();
})();

/* =========================================================
   ADDITIONS: Before/After slider, UPI copy-to-clipboard
   ========================================================= */

(() => {
  'use strict';

  /* ---------- 10. CLICK-TO-LOAD VIDEO PLAYERS ---------- */
  // Each .video-frame has a play button + a data-src on the frame.
  // On first click, swap the placeholder for the real Drive iframe.
  document.querySelectorAll('.video-frame[data-src]').forEach(frame => {
    const playBtn = frame.querySelector('.play-btn');
    const loadVideo = (e) => {
      if (e) e.preventDefault();
      if (frame.classList.contains('is-loaded')) return;
      const src = frame.dataset.src;
      if (!src) return;

      const iframe = document.createElement('iframe');
      iframe.src = src;
      iframe.setAttribute('allow', 'autoplay; encrypted-media');
      iframe.setAttribute('allowfullscreen', '');
      iframe.setAttribute('referrerpolicy', 'no-referrer');
      iframe.loading = 'eager';
      frame.appendChild(iframe);
      frame.classList.add('is-loaded');
    };

    if (playBtn) playBtn.addEventListener('click', loadVideo);
    frame.addEventListener('click', loadVideo);
  });

  /* ---------- 11. UPI COPY-TO-CLIPBOARD ---------- */
  const copyBtn = document.getElementById('copyUpiBtn');
  const upiInput = document.getElementById('upiId');

  if (copyBtn && upiInput) {
    copyBtn.addEventListener('click', async () => {
      const value = upiInput.value;
      try {
        await navigator.clipboard.writeText(value);
      } catch (_) {
        // Fallback for older browsers
        upiInput.select();
        document.execCommand('copy');
        upiInput.blur();
      }

      copyBtn.classList.add('is-copied');
      copyBtn.querySelector('span').textContent = 'Copied!';
      copyBtn.querySelector('i').className = 'fa-solid fa-check';

      setTimeout(() => {
        copyBtn.classList.remove('is-copied');
        copyBtn.querySelector('span').textContent = 'Copy';
        copyBtn.querySelector('i').className = 'fa-regular fa-copy';
      }, 1800);
    });
  }
})();
