(() => {
  /* ---------- Build games / songs / hobbies / boxes from content.js ---------- */
  const SITE = window.SITE || {};
  const el = (tag, props = {}, ...kids) => {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(props)) {
      if (k === 'class') n.className = v;
      else if (k === 'text') n.textContent = v;
      else if (k === 'style') n.style.cssText = v;
      else n.setAttribute(k, v);
    }
    kids.flat().filter(Boolean).forEach((c) => n.append(c));
    return n;
  };
  const moreBlock = (text) => text
    ? [el('div', { class: 'more' }, el('div', { class: 'more-inner' }, el('p', { text }))),
       el('button', { class: 'more-toggle', type: 'button', 'aria-expanded': 'false', 'aria-label': 'Read more' })]
    : [];
  const num = (i) => String(i + 1).padStart(2, '0');

  const gameList = document.getElementById('gameList');
  (SITE.games || []).forEach((g, i) => {
    gameList.append(el('div', { class: 'card tilt game reveal' + (g.text ? ' expandable' : ''), style: `--c1:${g.color || '#ff3df2'}` },
      el('div', { class: 'game-art' }, el('span', { text: g.icon || '🎮' })),
      el('div', { class: 'game-body' },
        el('span', { class: 'num', text: num(i) }),
        el('h3', { text: g.title }),
        el('div', { class: 'tags' }, (g.tags || []).map((t) => el('span', { text: t }))),
        g.text ? moreBlock(g.text)[0] : null,
        g.link ? el('a', { class: 'steam-link', href: g.link, target: '_blank', rel: 'noopener', text: /steampowered|steamcommunity/.test(g.link) ? 'View on Steam ↗' : 'Visit website ↗' }) : null),
      g.text ? moreBlock(g.text)[1] : null));
  });

  const songList = document.getElementById('songList');
  (SITE.songs || []).forEach((s, i) => {
    const id = ((s.spotify || '').match(/track\/([A-Za-z0-9]+)/) || [])[1];
    if (!id) return console.warn('content.js: no Spotify track link for', s.title);
    songList.append(el('div', { class: 'track-item', 'data-track': id },
      el('button', { class: 'track', type: 'button', 'aria-expanded': 'false' },
        el('span', { class: 't-num', text: num(i) }),
        el('span', { class: 'eq' }, el('i'), el('i'), el('i'), el('i')),
        el('span', { class: 't-title', text: s.title }),
        el('span', { class: 't-play', 'aria-hidden': 'true', text: '▶' })),
      el('div', { class: 't-player' }, el('div', { class: 't-player-inner' }))));
  });

  const hobbyList = document.getElementById('hobbyList');
  let terminalLines = null;
  (SITE.hobbies || []).forEach((hb) => {
    const term = Array.isArray(hb.terminal) && hb.terminal.length && !terminalLines;
    if (term) terminalLines = hb.terminal;
    const [more, toggle] = moreBlock(hb.text);
    hobbyList.append(el('article', { class: 'card tilt hobby reveal' + (term ? ' wide' : '') + (hb.text ? ' expandable' : '') },
      el('span', { class: 'h-icon', text: hb.icon || '✨' }),
      el('h3', { text: hb.title }),
      el('p', { text: hb.short || '' }),
      term ? el('code', { class: 'code-line' }, '> ', el('span', { id: 'codeType' }), el('span', { class: 'caret small' })) : null,
      more, toggle));
  });

  /* Random fact box */
  const facts = (SITE.funFacts || []).filter((f) => typeof f === 'string' && f.trim());
  let factCard = null;
  if (facts.length) {
    let factIdx = Math.floor(Math.random() * facts.length);
    const icon = el('span', { class: 'mini-icon', text: '🎲' });
    const factText = el('p', { class: 'fact-text', text: facts[factIdx] });
    factCard = el('article', { class: 'card tilt mini funfact reveal', role: 'button', tabindex: '0', 'aria-label': 'Show another random fact' },
      icon, el('span', { class: 'card-label', text: 'Random fact about me' }), factText,
      facts.length > 1 ? el('span', { class: 'fact-hint', text: 'Click for another one ↻' }) : null);
    const nextFact = () => {
      if (facts.length < 2) return;
      let n;
      do { n = Math.floor(Math.random() * facts.length); } while (n === factIdx);
      factIdx = n;
      factText.textContent = facts[n];
      [factText, icon].forEach((x) => x.classList.remove(x === icon ? 'roll' : 'swap'));
      void factText.offsetWidth; // restart the animations
      factText.classList.add('swap');
      icon.classList.add('roll');
    };
    factCard.addEventListener('click', nextFact);
    factCard.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); nextFact(); }
    });
  }

  const boxSlot = document.getElementById('aboutBoxes');
  if (boxSlot) {
    boxSlot.replaceWith(...(SITE.aboutBoxes || []).map((b) => {
      const [more, toggle] = moreBlock(b.text);
      return el('article', { class: 'card tilt mini reveal' + (b.text ? ' expandable' : '') },
        el('span', { class: 'mini-icon', text: b.icon || '✨' }),
        el('span', { class: 'card-label', text: b.label }),
        el('p', { text: b.value || '' }),
        more, toggle);
    }), ...(factCard ? [factCard] : []));
  }

  /* Galleries: pictures are read from folders in the GitHub repo */
  const GAL = SITE.gallery || {};
  const IMG_RE = /\.(jpe?g|png|gif|webp|avif)$/i;
  const repoInfo = () => {
    const cfg = GAL.github || {};
    if (cfg.user && cfg.repo) return cfg;
    const host = location.hostname;
    if (!host.endsWith('.github.io')) return null;
    const user = host.split('.')[0];
    const seg = location.pathname.split('/').filter(Boolean)[0];
    const repo = seg && !seg.includes('.') ? seg : `${user}.github.io`;
    return { user: cfg.user || user, repo: cfg.repo || repo };
  };
  const imgUrl = (path) => path.split('/').map(encodeURIComponent).join('/');
  const caption = (path) => decodeURIComponent(path.split('/').pop()).replace(/\.[^.]+$/, '').replace(/^\d+[-_ ]+/, '').replace(/[-_]+/g, ' ');
  async function listFolder(sec) {
    if (Array.isArray(sec.images) && sec.images.length) {
      return sec.images.map((f) => (f.includes('/') ? f : `${sec.folder}/${f}`));
    }
    const info = repoInfo();
    if (!info) return [];
    const key = `gal:${info.user}/${info.repo}/${sec.folder}`;
    try { const cached = sessionStorage.getItem(key); if (cached) return JSON.parse(cached); } catch (e) {}
    const res = await fetch(`https://api.github.com/repos/${info.user}/${info.repo}/contents/${sec.folder}`);
    if (!res.ok) return [];
    const files = (await res.json())
      .filter((f) => f.type === 'file' && IMG_RE.test(f.name))
      .map((f) => f.path)
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
    try { sessionStorage.setItem(key, JSON.stringify(files)); } catch (e) {}
    return files;
  }

  let lb = null, lbList = [], lbIdx = 0;
  const showLb = (i) => {
    lbIdx = (i + lbList.length) % lbList.length;
    const img = lb.querySelector('img');
    img.classList.remove('in');
    img.onload = () => img.classList.add('in');
    img.src = imgUrl(lbList[lbIdx]);
    img.alt = caption(lbList[lbIdx]);
    if (img.complete && img.naturalWidth) img.classList.add('in');
    lb.querySelector('figcaption').textContent = `${caption(lbList[lbIdx])} · ${lbIdx + 1} / ${lbList.length}`;
    lb.classList.toggle('single', lbList.length < 2);
  };
  const closeLightbox = () => { lb.classList.remove('open'); document.body.style.overflow = ''; };
  function openLightbox(list, i) {
    if (!lb) {
      lb = el('div', { class: 'lightbox', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Picture viewer' },
        el('button', { class: 'lb-btn lb-close', type: 'button', 'aria-label': 'Close', text: '×' }),
        el('button', { class: 'lb-btn lb-prev', type: 'button', 'aria-label': 'Previous picture', text: '‹' }),
        el('figure', {}, el('img', { alt: '' }), el('figcaption')),
        el('button', { class: 'lb-btn lb-next', type: 'button', 'aria-label': 'Next picture', text: '›' }));
      document.body.append(lb);
      lb.querySelector('.lb-close').addEventListener('click', closeLightbox);
      lb.querySelector('.lb-prev').addEventListener('click', () => showLb(lbIdx - 1));
      lb.querySelector('.lb-next').addEventListener('click', () => showLb(lbIdx + 1));
      lb.addEventListener('click', (e) => { if (e.target === lb) closeLightbox(); });
      addEventListener('keydown', (e) => {
        if (!lb.classList.contains('open')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showLb(lbIdx - 1);
        if (e.key === 'ArrowRight') showLb(lbIdx + 1);
      });
      let touchX = null;
      lb.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; }, { passive: true });
      lb.addEventListener('touchend', (e) => {
        if (touchX === null) return;
        const dx = e.changedTouches[0].clientX - touchX;
        if (Math.abs(dx) > 50) showLb(lbIdx + (dx < 0 ? 1 : -1));
        touchX = null;
      });
    }
    lbList = list;
    showLb(i);
    requestAnimationFrame(() => lb.classList.add('open'));
    document.body.style.overflow = 'hidden';
    lb.querySelector('.lb-close').focus({ preventScroll: true });
  }

  const galleryList = document.getElementById('galleryList');
  (GAL.sections || []).forEach((sec) => {
    const grid = el('div', { class: 'gal-grid' });
    const count = el('span', { class: 'gal-count', text: 'Loading…' });
    const head = el('button', { class: 'gal-head', type: 'button', 'aria-expanded': 'false' },
      el('span', { class: 'h-icon', text: sec.icon || '🖼️' }),
      el('span', { class: 'gal-title' }, el('h3', { text: sec.title }), count),
      el('span', { class: 'gal-chev', 'aria-hidden': 'true' }));
    const card = el('div', { class: 'card gal reveal' }, head, el('div', { class: 'more' }, el('div', { class: 'more-inner' }, grid)));
    galleryList.append(card);

    const loadThumbs = () => grid.querySelectorAll('img[data-src]').forEach((im) => {
      im.onload = () => im.classList.add('loaded');
      im.src = im.dataset.src;
      im.removeAttribute('data-src');
    });
    head.addEventListener('click', () => {
      const open = card.classList.toggle('open');
      head.setAttribute('aria-expanded', String(open));
      if (open) loadThumbs();
    });

    listFolder(sec).catch(() => []).then((files) => {
      count.textContent = files.length ? `${files.length} ${files.length === 1 ? 'picture' : 'pictures'}` : 'Coming soon ✨';
      if (!files.length) {
        grid.append(el('p', { class: 'gal-empty', text: 'Nothing here yet. Stay tuned! ✨' }));
        return;
      }
      files.forEach((path, i) => {
        const btn = el('button', { class: 'gal-thumb', type: 'button', 'aria-label': `Open ${caption(path)}` },
          el('img', { alt: caption(path), 'data-src': imgUrl(path), decoding: 'async' }));
        btn.addEventListener('click', () => openLightbox(files, i));
        grid.append(btn);
      });
      if (card.classList.contains('open')) loadThumbs();
    });
  });
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(pointer: fine)').matches;

  /* ---------- Starfield (pre-rendered layers = smooth) ---------- */
  const canvas = document.getElementById('space');
  const ctx = canvas.getContext('2d', { alpha: false });
  let w, h, dpr, layers = [], shooting = [];
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  const hues = [null, null, 280, 190, 310];
  const DEPTHS = [0.2, 0.45, 0.7, 1];

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    w = canvas.width = Math.round(innerWidth * dpr);
    h = canvas.height = Math.round(innerHeight * dpr);
    const total = Math.min(380, Math.round((innerWidth * innerHeight) / 3600));
    // each depth layer is drawn ONCE into its own canvas, then just moved around
    layers = DEPTHS.map((z, i) => {
      const off = document.createElement('canvas');
      off.width = w; off.height = h;
      const o = off.getContext('2d');
      const n = Math.round(total / DEPTHS.length);
      for (let k = 0; k < n; k++) {
        const hue = hues[(Math.random() * hues.length) | 0];
        o.fillStyle = hue === null ? '#fff' : `hsl(${hue},100%,82%)`;
        o.globalAlpha = 0.35 + Math.random() * 0.65 * z;
        o.beginPath();
        o.arc(Math.random() * w, Math.random() * h, (Math.random() * 1.2 + 0.4) * dpr * (0.45 + z * 0.6), 0, Math.PI * 2);
        o.fill();
      }
      return { canvas: off, z, phase: i * 1.7, speed: 0.6 + Math.random() * 0.8 };
    });
    draw(performance.now());
  }

  const tile = (img, ox, oy, alpha) => {
    ox = ((ox % w) + w) % w;
    oy = ((oy % h) + h) % h;
    ctx.globalAlpha = alpha;
    ctx.drawImage(img, ox - w, oy - h);
    ctx.drawImage(img, ox, oy - h);
    ctx.drawImage(img, ox - w, oy);
    ctx.drawImage(img, ox, oy);
  };

  function draw(now) {
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#07040f';
    ctx.fillRect(0, 0, w, h);
    mouse.x += (mouse.tx - mouse.x) * 0.05;
    mouse.y += (mouse.ty - mouse.y) * 0.05;
    const sy = window.scrollY * dpr;
    const t = now / 1000;
    for (const L of layers) {
      const twinkle = reduce ? 1 : 0.7 + Math.sin(t * L.speed + L.phase) * 0.3;
      tile(L.canvas, -mouse.x * 50 * dpr * L.z, -sy * 0.12 * L.z - mouse.y * 50 * dpr * L.z, twinkle);
    }
    ctx.globalAlpha = 1;

    if (!reduce && Math.random() < 0.006) {
      shooting.push({
        x: Math.random() * w * 0.7 + w * 0.3,
        y: Math.random() * h * 0.4,
        len: (Math.random() * 120 + 80) * dpr,
        v: (Math.random() * 8 + 10) * dpr,
        life: 1,
      });
    }
    shooting = shooting.filter((s) => s.life > 0);
    for (const s of shooting) {
      s.x -= s.v; s.y += s.v * 0.45; s.life -= 0.016;
      const ex = s.x + s.len, ey = s.y - s.len * 0.45;
      const g = ctx.createLinearGradient(s.x, s.y, ex, ey);
      g.addColorStop(0, `rgba(255,255,255,${Math.max(s.life, 0)})`);
      g.addColorStop(1, 'rgba(255,61,242,0)');
      ctx.strokeStyle = g;
      ctx.lineWidth = 1.6 * dpr;
      ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(ex, ey); ctx.stroke();
    }
  }

  let resizeTimer;
  addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(resize, 150); });
  resize();
  if (!reduce) {
    const loop = (now) => { draw(now); requestAnimationFrame(loop); };
    requestAnimationFrame(loop);
  } else {
    addEventListener('scroll', () => draw(performance.now()), { passive: true });
  }

  /* ---------- Pointer: parallax, cursor glow ---------- */
  const glow = document.querySelector('.cursor-glow');
  let glowRaf = 0, gx = 0, gy = 0;
  addEventListener('pointermove', (e) => {
    mouse.tx = e.clientX / innerWidth - 0.5;
    mouse.ty = e.clientY / innerHeight - 0.5;
    if (finePointer && !reduce) {
      gx = e.clientX; gy = e.clientY;
      if (!glowRaf) glowRaf = requestAnimationFrame(() => {
        glowRaf = 0;
        glow.style.opacity = 1;
        glow.style.transform = `translate3d(${gx - 230}px, ${gy - 230}px, 0)`;
      });
    }
  }, { passive: true });
  document.addEventListener('pointerleave', () => (glow.style.opacity = 0));

  /* ---------- Scroll progress ---------- */
  const progress = document.querySelector('.progress');
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
  };
  let progRaf = 0;
  addEventListener('scroll', () => { if (!progRaf) progRaf = requestAnimationFrame(() => { progRaf = 0; onScroll(); }); }, { passive: true });
  onScroll();

  /* ---------- Reveal on scroll (staggered) ---------- */
  const reveals = document.querySelectorAll('.reveal');
  const groups = new Map();
  reveals.forEach((el) => {
    const parent = el.parentElement;
    const i = groups.get(parent) || 0;
    el.style.setProperty('--d', `${Math.min(i * 0.08, 0.5)}s`);
    groups.set(parent, i + 1);
  });
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); revealObs.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  let revealsStarted = false;
  function startReveals() {
    if (revealsStarted) return;
    revealsStarted = true;
    reveals.forEach((el) => revealObs.observe(el));
  }

  /* ---------- Card tilt + spotlight ---------- */
  if (finePointer && !reduce) {
    document.querySelectorAll('.tilt').forEach((card) => {
      let raf = 0, ev = null;
      const apply = () => {
        raf = 0;
        if (!ev) return;
        const r = card.getBoundingClientRect(); // once per frame, only for the hovered card
        const px = (ev.clientX - r.left) / r.width;
        const py = (ev.clientY - r.top) / r.height;
        card.style.setProperty('--mx', `${px * 100}%`);
        card.style.setProperty('--my', `${py * 100}%`);
        card.style.setProperty('--ry', `${(px - 0.5) * 6}deg`);
        card.style.setProperty('--rx', `${(0.5 - py) * 6}deg`);
      };
      card.addEventListener('pointermove', (e) => {
        ev = e;
        if (!raf) raf = requestAnimationFrame(apply);
      }, { passive: true });
      card.addEventListener('pointerleave', () => {
        ev = null;
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
      });
    });

    /* Magnetic buttons */
    document.querySelectorAll('.magnetic').forEach((btn) => {
      btn.addEventListener('pointermove', (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
      });
      btn.addEventListener('pointerleave', () => (btn.style.transform = ''));
    });
  }

  /* ---------- Typewriter ---------- */
  function typewriter(el, words, { type = 70, erase = 35, hold = 1600 } = {}) {
    if (!el) return;
    if (reduce) { el.textContent = words[0]; return; }
    let wi = 0, ci = 0, deleting = false;
    const tick = () => {
      const chars = Array.from(words[wi]); // emoji-safe
      ci += deleting ? -1 : 1;
      el.textContent = chars.slice(0, ci).join('');
      let delay = deleting ? erase : type;
      if (!deleting && ci === chars.length) { deleting = true; delay = hold; }
      else if (deleting && ci === 0) { deleting = false; wi = (wi + 1) % words.length; delay = 350; }
      setTimeout(tick, delay);
    };
    tick();
  }
  typewriter(document.getElementById('typed'), [
    'gamer 🎮', 'artist 🎨', 'coder 💻', 'manga reader 📚', 'music addict 🎧', 'dream chaser ✨',
  ]);
  if (terminalLines) typewriter(document.getElementById('codeType'), terminalLines, { type: 45, erase: 20, hold: 2000 });

  /* ---------- Active nav link ---------- */
  const links = document.querySelectorAll('.nav ul a');
  const navObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        links.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === `#${e.target.id}`));
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  document.querySelectorAll('section[id]').forEach((s) => navObs.observe(s));

  /* ---------- Age from birthday (Dec 20, 2005) ---------- */
  const BIRTH = { year: 2005, month: 11, day: 20 }; // month is 0-based (11 = December)
  const nowD = new Date();
  let age = nowD.getFullYear() - BIRTH.year;
  if (nowD.getMonth() < BIRTH.month || (nowD.getMonth() === BIRTH.month && nowD.getDate() < BIRTH.day)) age--;
  document.querySelectorAll('.age').forEach((el) => (el.textContent = age));

  /* ---------- Birthday countdown (Dec 20) ---------- */
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let next = new Date(today.getFullYear(), 11, 20);
  if (next < today) next = new Date(today.getFullYear() + 1, 11, 20);
  const last = new Date(next.getFullYear() - 1, 11, 20);
  const days = Math.round((next - today) / 86400000);
  const daysEl = document.getElementById('bdayDays');
  const labelEl = document.getElementById('bdayLabel');
  const barEl = document.getElementById('bdayBar');
  if (days === 0) {
    daysEl.textContent = '🎉';
    labelEl.textContent = "it's my birthday!";
  } else {
    daysEl.textContent = days;
    labelEl.textContent = `${days === 1 ? 'day' : 'days'} until I turn ${age + 1}`;
  }
  const pct = days === 0 ? 100 : ((today - last) / (next - last)) * 100;
  const barObs = new IntersectionObserver(([e]) => {
    if (e.isIntersecting) { barEl.style.width = `${pct}%`; barObs.disconnect(); }
  });
  barObs.observe(barEl);


  /* ---------- Intro: warp into space ---------- */
  const root = document.documentElement;
  const intro = document.getElementById('intro');
  function endIntro() {
    if (!root.classList.contains('intro-on') || intro.classList.contains('done')) return;
    try { sessionStorage.setItem('introSeen', '1'); } catch (e) {}
    intro.classList.add('done');
    startReveals(); // hero animates in while the overlay fades out
    setTimeout(() => { root.classList.remove('intro-on'); intro.remove(); }, 900);
  }
  if (root.classList.contains('intro-on')) {
    const wc = document.getElementById('warp');
    const wx = wc.getContext('2d');
    let W, H;
    const sizeWarp = () => {
      const r = Math.min(window.devicePixelRatio || 1, 2);
      W = wc.width = innerWidth * r;
      H = wc.height = innerHeight * r;
    };
    sizeWarp();
    addEventListener('resize', sizeWarp);
    const pts = Array.from({ length: 500 }, () => ({ x: Math.random() * 2 - 1, y: Math.random() * 2 - 1, z: Math.random() }));
    const t0 = performance.now();
    const DURATION = 2300;
    const warp = (now) => {
      if (intro.classList.contains('done')) return;
      const t = Math.min((now - t0) / DURATION, 1);
      const speed = 0.002 + Math.pow(t, 3) * 0.06; // slow drift → hyperspace
      wx.fillStyle = 'rgba(7,4,15,0.35)';
      wx.fillRect(0, 0, W, H);
      const cx = W / 2, cy = H / 2, f = Math.min(W, H) * 0.5;
      for (const p of pts) {
        const z0 = p.z;
        p.z -= speed;
        if (p.z <= 0.02) { p.x = Math.random() * 2 - 1; p.y = Math.random() * 2 - 1; p.z = 1; continue; }
        const near = 1 - p.z;
        wx.strokeStyle = `hsla(${280 + p.x * 60},100%,${75 + near * 25}%,${Math.min(1, near * 1.5)})`;
        wx.lineWidth = near * 3 + 0.5;
        wx.beginPath();
        wx.moveTo(cx + (p.x / z0) * f, cy + (p.y / z0) * f);
        wx.lineTo(cx + (p.x / p.z) * f, cy + (p.y / p.z) * f);
        wx.stroke();
      }
      if (t < 1) requestAnimationFrame(warp); else endIntro();
    };
    requestAnimationFrame(warp);
    intro.addEventListener('click', endIntro);
    addEventListener('keydown', endIntro);
  } else {
    if (intro) intro.remove();
    startReveals();
  }

  /* ---------- Sparkle cursor ---------- */
  if (!reduce) {
    const sc = document.getElementById('sparkle');
    const sx = sc.getContext('2d');
    let SW, SH, sr;
    const sizeSparkle = () => {
      sr = Math.min(window.devicePixelRatio || 1, 1.5);
      SW = sc.width = innerWidth * sr;
      SH = sc.height = innerHeight * sr;
    };
    sizeSparkle();
    addEventListener('resize', sizeSparkle);
    const colors = ['#ff3df2', '#8b5cf6', '#22e4ff', '#ffffff', '#f5a9b8'];
    let parts = [], running = false, lastX = -99, lastY = -99;

    const spawn = (x, y, burst) => {
      if (parts.length > 160) return;
      const spread = burst ? 6 : 1.2;
      parts.push({
        x: x * sr, y: y * sr,
        vx: (Math.random() - 0.5) * spread * sr,
        vy: ((Math.random() - 0.5) * spread - (burst ? 1 : 0.3)) * sr,
        life: 1,
        decay: burst ? 0.018 : 0.025 + Math.random() * 0.02,
        size: (Math.random() * 4 + (burst ? 3 : 2)) * sr,
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.2,
        c: colors[(Math.random() * colors.length) | 0],
      });
      if (!running) { running = true; requestAnimationFrame(tickSparkles); }
    };
    const drawStar = (p) => {
      const s = p.size * p.life + 0.5;
      sx.save();
      sx.translate(p.x, p.y);
      sx.rotate(p.rot);
      sx.globalAlpha = p.life;
      sx.fillStyle = p.c;
      sx.beginPath();
      for (let i = 0; i < 8; i++) {
        const r = i % 2 ? s * 0.35 : s;
        const a = (i * Math.PI) / 4;
        sx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
      }
      sx.closePath();
      sx.fill();
      sx.restore();
    };
    function tickSparkles() {
      sx.clearRect(0, 0, SW, SH);
      sx.globalCompositeOperation = 'lighter';
      parts = parts.filter((p) => p.life > 0);
      for (const p of parts) {
        p.x += p.vx; p.y += p.vy; p.vy += 0.04 * sr; p.vx *= 0.98; p.rot += p.vr; p.life -= p.decay;
        if (p.life > 0) drawStar(p);
      }
      if (parts.length) requestAnimationFrame(tickSparkles);
      else { running = false; sx.clearRect(0, 0, SW, SH); }
    }
    if (finePointer) {
      addEventListener('pointermove', (e) => {
        if (Math.hypot(e.clientX - lastX, e.clientY - lastY) < 10) return;
        lastX = e.clientX; lastY = e.clientY;
        spawn(e.clientX, e.clientY, false);
        if (Math.random() < 0.4) spawn(e.clientX, e.clientY, false);
      });
    }
    addEventListener('pointerdown', (e) => {
      for (let i = 0; i < 14; i++) spawn(e.clientX, e.clientY, true);
    });
  }

  /* ---------- Live Discord status (via Lanyard) ---------- */
  const DISCORD_ID = '494168335391391760';
  const $ = (id) => document.getElementById(id);
  const STATUS = {
    online: ['Online', '#3dff9a'],
    idle: ['Away', '#ffcc4d'],
    dnd: ['Do not disturb', '#ff4d6d'],
    offline: ['Offline', '#7a7590'],
  };
  const VERBS = { 0: 'Playing', 1: 'Streaming', 2: 'Listening to', 3: 'Watching', 5: 'Competing in' };
  let presence = null;

  const pad = (n) => String(n).padStart(2, '0');
  const fmt = (ms) => {
    const s = Math.max(0, Math.floor(ms / 1000));
    const hh = Math.floor(s / 3600), mm = Math.floor((s % 3600) / 60), ss = s % 60;
    return hh ? `${hh}:${pad(mm)}:${pad(ss)}` : `${mm}:${pad(ss)}`;
  };
  const since = (start) => {
    const m = Math.floor((Date.now() - start) / 60000);
    if (m < 1) return 'just started';
    const hh = Math.floor(m / 60);
    return hh ? `for ${hh}h ${m % 60}m` : `for ${m}m`;
  };
  const mainActivity = (p) => (p.activities || []).find((a) => a.type !== 4 && a.name !== 'Spotify');
  const assetUrl = (act) => {
    const img = act.assets && act.assets.large_image;
    if (!img) return null;
    if (img.startsWith('mp:')) return 'https://media.discordapp.net/' + img.slice(3);
    if (img.startsWith('spotify:')) return 'https://i.scdn.co/image/' + img.slice(8);
    if (act.application_id) return `https://cdn.discordapp.com/app-assets/${act.application_id}/${img}.png`;
    return null;
  };
  const setArt = (url, fallback) => {
    const art = $('dlArt');
    art.textContent = '';
    if (!url) { art.textContent = fallback; return; }
    const im = new Image();
    im.alt = '';
    im.src = url;
    im.onerror = () => { art.textContent = fallback; };
    art.appendChild(im);
  };

  function renderPresence() {
    const p = presence;
    if (!p) return;
    const [label, color] = STATUS[p.discord_status] || STATUS.offline;
    root.style.setProperty('--status', color);
    document.querySelector('.status-dot').title = label;
    $('presence').hidden = false;
    $('discordCard').hidden = false;
    $('dlStatusText').textContent = label;

    const custom = (p.activities || []).find((a) => a.type === 4);
    const customText = custom
      ? [custom.emoji && !custom.emoji.id ? custom.emoji.name : '', custom.state || ''].join(' ').trim()
      : '';
    $('dlCustom').textContent = customText ? `“${customText}”` : '';
    $('dlCustom').hidden = !customText;
    $('dlProgress').hidden = true;

    const act = mainActivity(p);
    let pill;
    if (p.listening_to_spotify && p.spotify) {
      const s = p.spotify;
      $('dlType').textContent = 'Listening to Spotify';
      $('dlName').textContent = s.song;
      $('dlDetails').textContent = 'by ' + (s.artist || '').replace(/;/g, ',');
      $('dlState').textContent = s.album || '';
      setArt(s.album_art_url, '🎧');
      $('dlProgress').hidden = false;
      pill = `Listening to ${s.song}`;
    } else if (act) {
      const verb = VERBS[act.type] || 'Doing';
      $('dlType').textContent = verb;
      $('dlName').textContent = act.name;
      $('dlDetails').textContent = act.details || '';
      $('dlState').textContent = act.state || '';
      setArt(assetUrl(act), '🎮');
      pill = `${verb} ${act.name}`;
    } else {
      const off = p.discord_status === 'offline';
      $('dlType').textContent = off ? 'Offline' : 'Chilling';
      $('dlName').textContent = off ? 'Catch you later ✨' : 'Not playing anything right now';
      $('dlDetails').textContent = '';
      $('dlState').textContent = '';
      setArt(null, off ? '🌙' : '💤');
      pill = off ? 'Offline on Discord' : `${label} on Discord`;
    }
    $('presenceText').textContent = pill;
    tickPresence();
  }

  function tickPresence() {
    const p = presence;
    if (!p) return;
    if (p.listening_to_spotify && p.spotify && p.spotify.timestamps) {
      const { start, end } = p.spotify.timestamps;
      const total = end - start;
      const cur = Math.min(Date.now() - start, total);
      $('dlBar').style.width = `${(cur / total) * 100}%`;
      $('dlCur').textContent = fmt(cur);
      $('dlEnd').textContent = fmt(total);
      return;
    }
    const act = mainActivity(p);
    if (act && act.timestamps && act.timestamps.start) {
      const base = act.state || '';
      const time = since(act.timestamps.start);
      $('dlState').textContent = base ? `${base} · ${time}` : time;
    }
  }
  setInterval(tickPresence, 1000);

  function connectLanyard(retry = 1000) {
    let ws, heartbeat;
    try { ws = new WebSocket('wss://api.lanyard.rest/socket'); } catch (e) { return; }
    ws.onmessage = (ev) => {
      let msg;
      try { msg = JSON.parse(ev.data); } catch (e) { return; }
      if (msg.op === 1) {
        ws.send(JSON.stringify({ op: 2, d: { subscribe_to_id: DISCORD_ID } }));
        heartbeat = setInterval(() => ws.readyState === 1 && ws.send(JSON.stringify({ op: 3 })), msg.d.heartbeat_interval);
        retry = 1000;
      } else if (msg.op === 0 && (msg.t === 'INIT_STATE' || msg.t === 'PRESENCE_UPDATE')) {
        if (msg.d && msg.d.discord_status) { presence = msg.d; renderPresence(); }
      }
    };
    ws.onclose = () => {
      clearInterval(heartbeat);
      setTimeout(() => connectLanyard(Math.min(retry * 2, 30000)), retry);
    };
  }

  fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`)
    .then((r) => r.json())
    .then((res) => {
      if (res.success) { presence = res.data; renderPresence(); connectLanyard(); }
      else console.warn('Lanyard: this Discord account is not tracked yet. Join the Lanyard Discord server to enable live status.');
    })
    .catch(() => { /* status card just stays hidden */ });

  /* ---------- Spotify players (open one at a time) ---------- */
  document.querySelectorAll('.track-item').forEach((item) => {
    const btn = item.querySelector('.track');
    const inner = item.querySelector('.t-player-inner');
    btn.addEventListener('click', () => {
      const opening = !item.classList.contains('open');
      document.querySelectorAll('.track-item.open').forEach((o) => {
        o.classList.remove('open');
        o.querySelector('.track').setAttribute('aria-expanded', 'false');
      });
      if (!opening) return;
      if (!inner.querySelector('iframe')) {
        const f = document.createElement('iframe');
        f.src = `https://open.spotify.com/embed/track/${item.dataset.track}?utm_source=generator&theme=0`;
        f.loading = 'lazy';
        f.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
        f.title = btn.querySelector('.t-title').textContent + ' on Spotify';
        inner.appendChild(f);
      }
      item.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    });
  });

  /* ---------- Click-to-expand boxes ---------- */
  document.querySelectorAll('.expandable').forEach((card) => {
    const btn = card.querySelector('.more-toggle');
    const toggle = () => {
      const open = card.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
      btn.setAttribute('aria-label', open ? 'Show less' : 'Read more');
    };
    btn.addEventListener('click', (e) => { e.stopPropagation(); toggle(); });
    card.addEventListener('click', (e) => {
      if (e.target.closest('a, button')) return;          // links keep working
      if (String(window.getSelection()).length) return;   // don't close while selecting text
      toggle();
    });
  });
})();
