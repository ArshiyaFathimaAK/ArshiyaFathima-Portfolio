/* ============================================================
   ARSHIYA · PORTFOLIO 2026 — interactions (vanilla JS)
   ============================================================ */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  /* ---------- SPLIT TEXT (hero letters) ---------- */
  $$('[data-split]').forEach((el, li) => {
    const t = el.textContent;
    el.textContent = '';
    [...t].forEach((c, i) => {
      const s = document.createElement('span');
      s.className = 'ch';
      s.textContent = c;
      s.style.transitionDelay = `${(li * 7 + i) * 0.045}s`;
      el.appendChild(s);
    });
  });

  /* ---------- LOADER ---------- */
  const loader = $('#loader'), num = $('#loaderNum'), bar = $('#loaderBar');
  let pct = 0;
  const boot = setInterval(() => {
    pct = Math.min(100, pct + Math.ceil(Math.random() * 9));
    num.textContent = String(pct).padStart(3, '0');
    bar.style.width = pct + '%';
    if (pct >= 100) {
      clearInterval(boot);
      setTimeout(() => {
        loader.classList.add('done');
        $('.hero').classList.add('in');
        $$('.hero .reveal').forEach(r => r.classList.add('in'));
        setTimeout(() => loader.remove(), 1000);
      }, 250);
    }
  }, 55);

  /* ---------- SCROLL REVEAL ---------- */
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        if (e.target.classList.contains('stat')) countUp($('b', e.target));
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });

  // stagger siblings
  $$('.stats, .awards, .vol').forEach(group => {
    $$('.reveal', group).forEach((el, i) => el.style.setProperty('--d', `${i * 0.08}s`));
  });
  $$('.reveal').forEach(el => { if (!el.closest('.hero')) io.observe(el); });

  /* ---------- COUNT UP ---------- */
  function countUp(el) {
    if (!el || el.dataset.done) return;
    el.dataset.done = 1;
    const end = parseFloat(el.dataset.count), dec = +el.dataset.dec || 0, suf = el.dataset.suffix || '';
    const start = performance.now(), dur = 1600;
    const tick = now => {
      const p = clamp((now - start) / dur, 0, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      el.textContent = (end * eased).toFixed(dec) + suf;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  /* ---------- CURSOR ---------- */
  if (fine) {
    const dot = $('#cDot'), ring = $('#cRing'), label = $('#cLabel');
    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
    addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + 'px'; dot.style.top = my + 'px';
    });
    (function loop() {
      rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16;
      ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
      requestAnimationFrame(loop);
    })();
    document.addEventListener('mouseover', e => {
      const t = e.target.closest('[data-cursor]');
      if (t) { label.textContent = t.dataset.cursor; ring.classList.add('hover'); }
      else if (e.target.closest('a, button, .pill, .tl-card, .award')) { ring.classList.remove('hover'); ring.classList.add('small'); }
      else { ring.classList.remove('hover', 'small'); }
    });
  } else {
    $('#cDot')?.remove(); $('#cRing')?.remove();
  }

  /* ---------- MAGNETIC ELEMENTS ---------- */
  if (fine && !reduce) {
    $$('.magnetic').forEach(el => {
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.3;
        const y = (e.clientY - r.top - r.height / 2) * 0.3;
        el.style.transform = `translate(${x}px, ${y}px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transition = 'transform .5s cubic-bezier(.2,.8,.2,1)';
        el.style.transform = '';
        setTimeout(() => (el.style.transition = ''), 500);
      });
    });
  }

  /* ---------- SPOTLIGHT (cards follow the pointer) ---------- */
  $$('[data-spot]').forEach(el => {
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', e.clientX - r.left + 'px');
      el.style.setProperty('--my', e.clientY - r.top + 'px');
    });
  });

  /* ---------- 3D TILT ---------- */
  if (fine && !reduce) {
    $$('[data-tilt]').forEach(el => {
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transition = 'transform .1s';
        el.style.transform = `perspective(900px) rotateY(${px * 10}deg) rotateX(${-py * 10}deg) translateY(-4px)`;
      });
      el.addEventListener('pointerleave', () => {
        el.style.transition = 'transform .6s cubic-bezier(.2,.8,.2,1)';
        el.style.transform = '';
      });
    });
  }

  /* ---------- NAV: progress, hide-on-scroll, active link, burger ---------- */
  const nav = $('#nav'), prog = $('#progress'), links = $$('.nav-links a');
  const secs = links.map(a => $(a.getAttribute('href'))).filter(Boolean);
  let lastY = 0;
  $('#burger').addEventListener('click', () => nav.classList.toggle('open'));
  links.forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));

  /* ---------- HORIZONTAL SCROLL SECTION ---------- */
  const hs = $('#projects'), track = $('#hsTrack'), hsBar = $('#hsBar');
  const mobileMQ = matchMedia('(max-width: 860px)');
  function sizeHS() {
    if (mobileMQ.matches) { hs.style.height = ''; return; }
    const dist = track.scrollWidth - innerWidth + 40;
    hs.style.height = (dist + innerHeight) + 'px';
    hs.dataset.dist = dist;
  }
  addEventListener('resize', sizeHS);
  addEventListener('load', sizeHS);
  sizeHS();

  /* ---------- TIMELINE FILL ---------- */
  const tl = $('#timeline'), tlFill = $('#tlFill');

  /* ---------- MAIN SCROLL LOOP ---------- */
  const orbA = $('.orb-a'), orbB = $('.orb-b'), heroTitle = $('.hero-title');
  let ticking = false;
  function onScroll() {
    const y = scrollY, h = document.documentElement.scrollHeight - innerHeight;
    prog.style.width = (y / h) * 100 + '%';

    nav.classList.toggle('scrolled', y > 40);
    nav.classList.toggle('hide', y > lastY && y > 400 && !nav.classList.contains('open'));
    lastY = y;

    // active nav link
    let cur = null;
    secs.forEach(s => { if (s.getBoundingClientRect().top < innerHeight * 0.45) cur = s.id; });
    links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + cur));

    // hero parallax
    if (!reduce && y < innerHeight * 1.2) {
      orbA.style.transform = `translate(${y * -0.08}px, ${y * 0.25}px)`;
      orbB.style.transform = `translate(${y * 0.1}px, ${y * -0.15}px)`;
      heroTitle.style.transform = `translateY(${y * 0.12}px)`;
    }

    // horizontal scroll
    if (!mobileMQ.matches) {
      const r = hs.getBoundingClientRect();
      const dist = +hs.dataset.dist || 0;
      const p = clamp(-r.top / (hs.offsetHeight - innerHeight || 1), 0, 1);
      track.style.transform = `translateX(${-p * dist}px)`;
      hsBar.style.width = p * 100 + '%';
    }

    // timeline
    const tr = tl.getBoundingClientRect();
    const tp = clamp((innerHeight * 0.6 - tr.top) / tr.height, 0, 1);
    tlFill.style.height = tp * 100 + '%';
    $$('.tl-item', tl).forEach(it => it.classList.toggle('in', it.getBoundingClientRect().top < innerHeight * 0.6));

    // marquee speed reacts to scroll
    ticking = false;
  }
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  /* ---------- ROLE ROTATOR ---------- */
  const roles = ['Developer', 'Designer', 'IoT Builder', 'AI Explorer', 'Problem Solver', 'Dreamer'];
  const rot = $('#rotator'); let ri = 0;
  setInterval(() => {
    ri = (ri + 1) % roles.length;
    const b = document.createElement('b'); b.textContent = roles[ri];
    rot.replaceChildren(b);
  }, 2400);

  /* ---------- GALLERY FILTER (mix & match) ---------- */
  const items = $$('.g-item');
  $('#filters').addEventListener('click', e => {
    const btn = e.target.closest('.f'); if (!btn) return;
    $$('#filters .f').forEach(b => b.classList.toggle('active', b === btn));
    const f = btn.dataset.f;
    let n = 0;
    items.forEach(it => {
      const show = f === 'all' || it.dataset.cat === f;
      it.classList.toggle('hidden', !show);
      it.classList.remove('pop');
      if (show) { void it.offsetWidth; it.style.animationDelay = (n++ * 0.05) + 's'; it.classList.add('pop'); }
    });
  });

  // fullscreen preview for posters + motion
  items.filter(i => i.dataset.type).forEach(it => {
    it.addEventListener('click', () => {
      const isVid = it.dataset.type === 'video';
      const src = (isVid ? $('video', it) : $('img', it)).src;
      const o = document.createElement('div');
      o.className = 'preview';
      o.innerHTML = isVid ? `<video src="${src}" controls autoplay loop></video>` : `<img src="${src}" alt="">`;
      o.addEventListener('click', () => o.remove());
      document.body.appendChild(o);
    });
  });
  addEventListener('keydown', e => { if (e.key === 'Escape') $('.preview')?.remove(); });
  $$('.g-item video').forEach(v => v.play().catch(() => {}));

  /* ---------- STACK: filter + FLIP shuffle ---------- */
  const cloud = $('#stackCloud'), pills = $$('.pill', cloud);
  $$('.stack-controls .f[data-s]').forEach(btn => btn.addEventListener('click', () => {
    $$('.stack-controls .f[data-s]').forEach(b => b.classList.toggle('active', b === btn));
    const s = btn.dataset.s;
    pills.forEach(p => p.classList.toggle('dim', s !== 'all' && p.dataset.s !== s));
  }));

  $('#shuffle').addEventListener('click', () => {
    const first = new Map(pills.map(p => [p, p.getBoundingClientRect()]));
    const order = [...pills].sort(() => Math.random() - 0.5);
    order.forEach(p => cloud.appendChild(p));
    pills.forEach(p => {
      const a = first.get(p), b = p.getBoundingClientRect();
      p.style.transition = 'none';
      p.style.transform = `translate(${a.left - b.left}px, ${a.top - b.top}px)`;
      requestAnimationFrame(() => requestAnimationFrame(() => {
        p.style.transition = 'transform .8s cubic-bezier(.2,.8,.2,1), background .3s, color .3s, border-color .3s, opacity .4s';
        p.style.transform = '';
      }));
    });
  });

  // pills drift away from the cursor (and keep working with filter)
  if (fine && !reduce) {
    cloud.addEventListener('mousemove', e => {
      pills.forEach(p => {
        if (p.classList.contains('dim')) return;
        const r = p.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
        const d = Math.hypot(dx, dy);
        if (d < 140) { const f = (1 - d / 140) * 14; p.style.transition = 'transform .15s'; p.style.transform = `translate(${-dx / d * f}px, ${-dy / d * f}px)`; }
        else if (p.style.transform) { p.style.transform = ''; }
      });
    });
    cloud.addEventListener('mouseleave', () => pills.forEach(p => (p.style.transform = '')));
  }

  /* ---------- CLOCK (Dallas time) ---------- */
  const clock = $('#clock');
  const tick = () => {
    const t = new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'America/Chicago' }).format(new Date());
    clock.textContent = `${t} CT · DALLAS, TX`;
  };
  tick(); setInterval(tick, 20000);
})();
