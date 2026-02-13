(() => {
  const on = (s, c = document) => c.querySelector(s);
  const all = (s, c = document) => [...c.querySelectorAll(s)];

  const langTrigger = on('[data-lang-trigger]');
  const langPanel = on('[data-lang-panel]');
  if (langTrigger && langPanel) {
    langTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      langPanel.classList.toggle('open');
      langTrigger.setAttribute('aria-expanded', String(langPanel.classList.contains('open')));
    });
  }

  const drawer = on('[data-drawer]');
  const overlay = on('[data-overlay]');
  on('[data-open-drawer]')?.addEventListener('click', () => {
    drawer?.classList.add('open');
    overlay?.classList.add('open');
  });
  const closeDrawer = () => {
    drawer?.classList.remove('open');
    overlay?.classList.remove('open');
  };
  on('[data-close-drawer]')?.addEventListener('click', closeDrawer);
  overlay?.addEventListener('click', (e) => {
    if (e.target === overlay) closeDrawer();
  });

  document.addEventListener('click', (e) => {
    if (langPanel?.classList.contains('open') && !e.target.closest('.lang-menu')) {
      langPanel.classList.remove('open');
      langTrigger?.setAttribute('aria-expanded', 'false');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      langPanel?.classList.remove('open');
      on('[data-privacy-modal]')?.style.setProperty('display', 'none');
      closeDrawer();
    }
  });

  all('.faq-item').forEach((item) => {
    const btn = on('.faq-q', item);
    btn?.addEventListener('click', () => item.classList.toggle('open'));
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('show');
    });
  }, { threshold: 0.15 });
  all('.reveal').forEach((el) => observer.observe(el));

  const metrics = all('[data-counter]');
  const metricObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const end = Number(el.dataset.counter || 0);
      const suffix = el.dataset.suffix || '';
      let n = 0;
      const inc = Math.max(1, Math.ceil(end / 60));
      const tick = () => {
        n += inc;
        if (n >= end) {
          el.textContent = `${end}${suffix}`;
        } else {
          el.textContent = `${n}${suffix}`;
          requestAnimationFrame(tick);
        }
      };
      tick();
      obs.unobserve(el);
    });
  }, { threshold: 0.4 });
  metrics.forEach((m) => metricObserver.observe(m));

  const modal = on('[data-privacy-modal]');
  const openModal = () => modal && (modal.style.display = 'block');
  const closeModal = () => modal && (modal.style.display = 'none');
  on('[data-open-privacy]')?.addEventListener('click', (e) => { e.preventDefault(); openModal(); });
  on('[data-close-privacy]')?.addEventListener('click', closeModal);
  on('[data-close-privacy-bottom]')?.addEventListener('click', closeModal);
  modal?.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
})();
