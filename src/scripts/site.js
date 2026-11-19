(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

  // Flou du bas : disparaît en arrivant tout en bas de la page, pour garder le footer net
  const edge = document.querySelector('.edge-blur');
  if (edge) {
    const edgeCheck = () => edge.classList.toggle('off', innerHeight + scrollY >= document.documentElement.scrollHeight - 8);
    addEventListener('scroll', edgeCheck, { passive: true }); addEventListener('resize', edgeCheck); edgeCheck();
  }

  // Footer : hauteur réservée sous la page, logo qui monte pendant la révélation
  const ftWrap = document.querySelector('.ft-wrap'), ft = document.querySelector('.ft'), ftLogo = document.querySelector('.ft-logo span');
  if (ftWrap && ft && ftLogo) {
  const ftSize = () => { ftWrap.style.setProperty('--fh', ft.offsetHeight + 'px'); ft.classList.toggle('flat', ft.offsetHeight > innerHeight - 40); };
  addEventListener('resize', ftSize);
  new ResizeObserver(ftSize).observe(ft); ftSize();
  const ftMove = () => { const r = ftWrap.getBoundingClientRect(); const p = Math.min(Math.max((innerHeight - r.top) / r.height, 0), 1); ftLogo.style.setProperty('--ly', (18 * (1 - p)).toFixed(2) + '%'); };
  if (!reduce) { addEventListener('scroll', () => requestAnimationFrame(ftMove), { passive: true }); ftMove(); } else ftLogo.style.setProperty('--ly', '0%');
  }

  // Footer : calendrier Cal.com, chargé seulement quand on approche du bas de page
  const calBox = document.getElementById('cal-zedzed');
  const loadCal = () => {
    (function (C, A, L) { let p = function (a, ar) { a.q.push(ar); }; let d = C.document; C.Cal = C.Cal || function () { let cal = C.Cal; let ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement('script')).src = A; cal.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); }; const namespace = ar[1]; api.q = api.q || []; if (typeof namespace === 'string') { cal.ns[namespace] = cal.ns[namespace] || api; p(cal.ns[namespace], ar); p(cal, ['initNamespace', namespace]); } else p(cal, ar); return; } p(cal, ar); }; })(window, 'https://app.cal.com/embed/embed.js', 'init');
    Cal('init', 'zedzed', { origin: 'https://cal.com' });
    // la carte ne s'agrandit que quand le calendrier est vraiment là ; sinon le lien « Voir les créneaux » reste
    new MutationObserver((m, o) => { if (calBox.querySelector('iframe')) { calBox.classList.add('live'); o.disconnect(); } }).observe(calBox, { childList: true, subtree: true });
    Cal.ns.zedzed('inline', { elementOrSelector: '#cal-zedzed', calLink: calBox.dataset.cal, layout: 'month_view', config: { theme: 'light' } });
    Cal.ns.zedzed('ui', { theme: 'light', layout: 'month_view', hideEventTypeDetails: true,
      cssVarsPerTheme: { light: { 'cal-brand': '#2836D9', 'cal-brand-emphasis': '#141B6E', 'cal-brand-text': '#F3F2FF', 'cal-bg': '#F3F2FF', 'cal-bg-muted': '#FFFFFF', 'cal-text': '#0D1240', 'cal-text-subtle': '#3B4280' } } });
  };
  if (calBox) {
    const calIo = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { calIo.disconnect(); loadCal(); } }, { rootMargin: '600px 0px' });
    calIo.observe(document.querySelector('.ft-wrap'));
  }

  // 1. Hero : chaque projet glisse à sa vitesse au défilement
  const hzTiles = [...document.querySelectorAll('.hz-ln .hz-tile')];
  let hzRaf = 0;
  const hzRender = () => { hzRaf = 0; if (scrollY > innerHeight * 1.5) return; hzTiles.forEach(t => t.style.setProperty('--py', (-scrollY * parseFloat(t.style.getPropertyValue('--k'))).toFixed(1) + 'px')); };
  if (!reduce) addEventListener('scroll', () => { if (!hzRaf) hzRaf = requestAnimationFrame(hzRender); }, { passive: true });

  // Système de mouvement : révélations à l'entrée + manifeste lié au défilement
  document.documentElement.classList.add('js');
  if (reduce) {
    document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('in'));
  } else {
    const io = new IntersectionObserver(entries => entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    }), { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
    document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));
  }
  if (document.querySelector('.manifesto .big')) {
  const big = document.querySelector('.manifesto .big');
  const wrapWords = (node) => {
    [...node.childNodes].forEach(n => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(t => {
          if (!t) return;
          if (/^\s+$/.test(t)) frag.appendChild(document.createTextNode(t));
          else { const sp = document.createElement('span'); sp.className = 'w'; sp.textContent = t; frag.appendChild(sp); }
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1) wrapWords(n);
    });
  };
  wrapWords(big);
  const words = [...big.querySelectorAll('.w')];
  const paint = () => {
    const r = big.getBoundingClientRect();
    const p = Math.min(Math.max((innerHeight * 0.82 - r.top) / (r.height + innerHeight * 0.35), 0), 1);
    const n = Math.round(p * words.length);
    words.forEach((w, i) => w.classList.toggle('on', i < n));
  };
  if (!reduce) { addEventListener('scroll', () => requestAnimationFrame(paint), { passive: true }); paint(); }
  }

  // Méthode : l'image suit l'étape active
  if (document.querySelector('.method ol')) {
  const steps = [...document.querySelectorAll('[data-step]')];
  const frames = [...document.querySelectorAll('.story-media .frame')];
  let stepCur = 0;
  const pick = () => {
    const mid = innerHeight / 2; let best = 0, dist = Infinity;
    steps.forEach((li, i) => { const r = li.getBoundingClientRect(); const d = Math.abs(r.top + r.height / 2 - mid); if (d < dist) { dist = d; best = i; } });
    if (best === stepCur) return; stepCur = best;
    steps.forEach((li, i) => li.classList.toggle('active', i === stepCur));
    frames.forEach((f, i) => f.classList.toggle('on', i === stepCur));
  };
  const ol = document.querySelector('.method ol');
  const prog = () => {
    const r = ol.getBoundingClientRect();
    ol.style.setProperty('--p', Math.min(Math.max((innerHeight / 2 - r.top) / r.height, 0), 1).toFixed(4));
  };
  addEventListener('scroll', () => requestAnimationFrame(() => { pick(); prog(); }), { passive: true }); pick(); prog();

  }

  // Listes dépliables : une seule ouverte à la fois par liste
  document.querySelectorAll('details.acc').forEach(d => d.addEventListener('toggle', () => {
    if (!d.open) return;
    document.querySelectorAll(`details.acc[name="${d.getAttribute('name')}"]`).forEach(o => { if (o !== d) o.open = false; });
  }));


  // Services : le bleu part de l'entrée de la souris et se rétracte vers la sortie
  if (fine) document.querySelectorAll('.svc-row').forEach(row => {
    const fill = row.querySelector('.svc-fill');
    const at = e => {
      const r = row.getBoundingClientRect();
      const x = Math.min(Math.max(e.clientX - r.left, 0), r.width);
      const y = (e.clientY - r.top) < r.height / 2 ? 0 : r.height;      // le cercle naît sur le bord franchi
      row.style.setProperty('--x', x + 'px'); row.style.setProperty('--y', y + 'px');
      row.style.setProperty('--d', (2 * Math.hypot(Math.max(x, r.width - x), r.height)) + 'px');
    };
    row.addEventListener('pointerenter', e => { at(e); fill.getBoundingClientRect(); row.classList.add('on'); });
    row.addEventListener('pointerleave', e => { at(e); row.classList.remove('on'); });
  });

  // 3. Echo cursor
  if (fine) {
    document.body.classList.add('has-cursor');
    const dot = document.querySelector('.cur-dot'), echo = document.querySelector('.cur-echo'), label = dot.querySelector('em');
    let mx = -100, my = -100, ex = -100, ey = -100, size = 14, seen = false;
    addEventListener('pointermove', e => {
      mx = e.clientX; my = e.clientY;
      if (!seen) { ex = mx; ey = my; seen = true; }
      const t = e.target.closest('[data-cursor]');
      const big = !!t;
      dot.classList.toggle('big', big); echo.classList.toggle('big', big);
      if (t) label.textContent = t.dataset.cursor;
      size = big ? 84 : 14;
      dot.classList.remove('hidden'); echo.classList.remove('hidden');
    }, { passive: true });
    document.addEventListener('pointerleave', () => { dot.classList.add('hidden'); echo.classList.add('hidden'); });
    const tick = () => {
      const k = reduce ? 1 : 0.16;
      ex += (mx - ex) * k; ey += (my - ey) * k;
      const off = reduce ? 0 : 4;
      dot.style.transform = `translate3d(${mx - size / 2}px, ${my - size / 2}px, 0)`;
      echo.style.transform = `translate3d(${ex - size / 2 + off}px, ${ey - size / 2 + off}px, 0)`;
      requestAnimationFrame(tick);
    };
    tick();
  }

})();
