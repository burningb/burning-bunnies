// Burning Bunnies site interactions

// preloader — runs immediately, not gated on full DOMContentLoaded wait
(() => {
  document.documentElement.classList.add('is-loading-html');
  const start = () => {
    const pre = document.querySelector('.preloader');
    if (!pre) return;
    document.body.classList.add('is-loading');
    const countEl = pre.querySelector('.preloader-count');
    const bar = pre.querySelector('.preloader-bar');
    let n = 0;
    const finish = () => {
      pre.classList.add('done');
      document.body.classList.remove('is-loading');
    };
    const tick = () => {
      n += Math.random() * 18 + 6;
      if (n >= 100) {
        n = 100;
        if (countEl) countEl.textContent = '100';
        if (bar) bar.style.setProperty('--p', '100%');
        setTimeout(finish, 350);
        return;
      }
      if (countEl) countEl.textContent = Math.floor(n);
      if (bar) bar.style.setProperty('--p', n + '%');
      setTimeout(tick, 90 + Math.random() * 90);
    };
    tick();
    window.addEventListener('load', () => { n = 100; });
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();

document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  const navLinks = document.querySelectorAll('.main-nav a');

  // header scroll state
  const onScroll = () => {
    if (window.scrollY > 40) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll);
  onScroll();

  // mobile nav toggle
  if (toggle) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('open');
      toggle.textContent = nav.classList.contains('open') ? '✕' : '☰';
    });
  }
  navLinks.forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open');
    if (toggle) toggle.textContent = '☰';
  }));

  // reveal on scroll
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => io.observe(el));

  // lightbox for images with data-lightbox
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = lightbox ? lightbox.querySelector('img') : null;
  document.querySelectorAll('[data-lightbox]').forEach(el => {
    el.addEventListener('click', () => {
      const src = el.getAttribute('data-lightbox');
      lightboxImg.src = src;
      lightbox.classList.add('open');
    });
  });
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
        lightbox.classList.remove('open');
        lightboxImg.src = '';
      }
    });
  }

  // current year in footer
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // career list expand/collapse
  document.querySelectorAll('.career-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const wrap = document.getElementById(btn.getAttribute('data-target'));
      if (!wrap) return;
      const isExpanded = wrap.classList.toggle('expanded');
      btn.textContent = isExpanded ? '접기 ↑' : btn.getAttribute('data-label') + ' ↓';
    });
  });

  // scroll-reactive nav indicator (Cyphr Studio style: current → next section)
  const scrollNav = document.querySelector('.scroll-nav');
  if (scrollNav) {
    const snArrow = scrollNav.querySelector('.sn-arrow');
    const snLabel = scrollNav.querySelector('.sn-label');
    const navSections = Array.from(document.querySelectorAll('main section[data-label]'));
    const updateScrollNav = () => {
      if (window.scrollY < window.innerHeight * 0.6) {
        scrollNav.classList.remove('show', 'transitioning');
        return;
      }
      scrollNav.classList.add('show');
      let current = navSections[0];
      let currentIndex = 0;
      navSections.forEach((sec, i) => {
        const rect = sec.getBoundingClientRect();
        if (rect.top <= 140) { current = sec; currentIndex = i; }
      });
      const next = navSections[currentIndex + 1];
      if (next && next.getBoundingClientRect().top <= 420) {
        scrollNav.classList.add('transitioning');
        if (snArrow) snArrow.textContent = '→';
        if (snLabel) snLabel.textContent = next.getAttribute('data-label');
      } else {
        scrollNav.classList.remove('transitioning');
        if (snLabel) snLabel.textContent = current.getAttribute('data-label');
      }
    };
    window.addEventListener('scroll', updateScrollNav);
    updateScrollNav();
  }

  // featured list — cursor-follow image preview (Refik Anadol Studio style)
  const featuredList = document.querySelector('.featured-list');
  const featuredPreview = document.querySelector('.featured-preview');
  if (featuredList && featuredPreview) {
    const previewImg = featuredPreview.querySelector('img');
    featuredList.addEventListener('mousemove', (e) => {
      featuredPreview.style.left = e.clientX + 'px';
      featuredPreview.style.top = e.clientY + 'px';
    });
    featuredList.querySelectorAll('.featured-item').forEach(item => {
      item.addEventListener('mouseenter', () => {
        const src = item.getAttribute('data-img');
        if (src && previewImg) previewImg.src = src;
        featuredPreview.classList.add('show');
      });
      item.addEventListener('mouseleave', () => {
        featuredPreview.classList.remove('show');
      });
      item.addEventListener('click', () => {
        const target = item.getAttribute('data-target');
        if (target) document.getElementById(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  // custom cursor (desktop / fine-pointer only)
  if (window.matchMedia && window.matchMedia('(pointer: fine)').matches) {
    const cursor = document.querySelector('.cursor-dot');
    if (cursor) {
      document.body.classList.add('has-cursor');
      let shown = false;
      window.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        if (!shown) { cursor.classList.add('show'); shown = true; }
      });
      document.querySelectorAll('a, button, .project-card, .mv-gallery img, [data-lightbox]').forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('active'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
      });
      document.addEventListener('mouseleave', () => cursor.classList.remove('show'));
      document.addEventListener('mouseenter', () => cursor.classList.add('show'));
    }
  }
});
