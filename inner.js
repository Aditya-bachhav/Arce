(() => {
const $ = (s, c = document) => c.querySelector(s), $$ = (s, c = document) => [...c.querySelectorAll(s)];
const EASE = 'easeOutExpo';
const lenis = new Lenis({ lerp: 0.12, wheelMultiplier: 1, smoothWheel: true });
requestAnimationFrame(function l(t) { lenis.raf(t); requestAnimationFrame(l); });
$$('a[href^="#"]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); const h = a.getAttribute('href'); if (h === '#top') lenis.scrollTo(0, { duration: 1.5 }); else if (h.length > 1) lenis.scrollTo(h, { duration: 1.5 }); }));
/* page transitions + nav state */
const pt = $('.pt'), file = location.pathname.split('/').pop() || 'index.html';
$$('nav.fl a').forEach(a => { const h = a.getAttribute('href'); a.classList.toggle('on', h === file || (file === 'project.html' && h === 'work.html')); });
if (pt) {
  setTimeout(() => pt.style.display = 'none', 3200);
  anime({ targets: pt, translateY: ['0%', '-100%'], duration: 1000, delay: 150, easing: 'easeInOutExpo', complete: () => pt.style.display = 'none' });
  addEventListener('pageshow', e => { if (e.persisted) pt.style.display = 'none'; });
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href*=".html"]');
    if (!a || e.metaKey || e.ctrlKey || a.target === '_blank') return;
    e.preventDefault(); pt.style.display = 'block';
    anime({ targets: pt, translateY: ['100%', '0%'], duration: 750, easing: 'easeInOutExpo', complete: () => location.href = a.href });
  });
}

/* ---- Work grid ---- */
const W = $('#wk');
if (W) {
  $('#wn').textContent = `(${String(PROJECTS.length).padStart(2, '0')}) projects — design and development for brands and businesses.`;
  W.innerHTML = PROJECTS.map(p => `<a class="wc" href="project.html?p=${p.s}" data-r><div class="wi" style="background:${p.bg}"><img src="${p.img}" alt="${p.t}" loading="lazy" onerror="this.style.display='none'"></div><div class="wm"><h3>${p.t}</h3><span>(${p.c})</span><em>${p.y}</em></div></a>`).join('');
}
const pricing = $('#pricing');
if (pricing) pricing.innerHTML = `<div class="hd"><span class="lab">/ Pricing /</span><h2>Choose the right level for your project.</h2></div><div class="price-grid">${PRICING.map((plan, index) => `<article class="price-card${index === 1 ? ' featured' : ''}">${index === 1 ? '<span class="price-badge">Most popular</span>' : ''}<span class="lab">${plan[0]}</span><b>${plan[1]}</b><p>${plan[2]}</p><a class="btn price-btn" href="contact.html"><i></i>Get started</a><div class="price-includes"><strong>Includes</strong><ul>${plan[3].map(item => `<li>${item}</li>`).join('')}</ul></div></article>`).join('')}</div><p class="price-note">Final pricing depends on the project scope, timeline, and requirements.</p>`;

/* ---- Project page ---- */
const PJ = $('#pj');
if (PJ) {
  const i = PROJECTS.findIndex(p => p.s === new URLSearchParams(location.search).get('p'));
  if (i < 0) location.replace('work.html');
  else {
    const p = PROJECTS[i], n = PROJECTS[(i + 1) % PROJECTS.length];
    const gallery = (p.images || [p.img]).slice(1);
    document.title = p.t + ' — ARCEAUS';
    PJ.innerHTML = `<span class="lab">/ Project ${String(i + 1).padStart(2, '0')} /</span><h1 style="margin-top:18px"><span class="ln"><span>${p.t}</span></span></h1>
    <div class="meta"><div><span class="lab">Type</span><b>${p.c}</b></div><div><span class="lab">Year</span><b>${p.y}</b></div><div><span class="lab">Studio</span><b>ARCEAUS</b></div>${p.url ? `<a class="btn" href="${p.url}" target="_blank" rel="noopener"><i></i>Visit live site</a>` : ''}</div>
    <div class="wide" data-r style="background:${p.bg}"><img src="${p.img}" alt="${p.t}" onerror="this.style.display='none'"></div>
    <div class="two"><span class="lab">/ Overview /</span><h2>${p.t}</h2><p class="lede" style="margin:0">${p.d}</p></div>
    <div class="project-gallery" data-r>${gallery.map((image, index) => `<img src="${image}" alt="${p.t} project view ${index + 2}" loading="lazy">`).join('')}</div>
    <a class="nxt" href="project.html?p=${n.s}"><span class="lab">Next project</span><b>${n.t}</b><i>→</i></a>`;
  }
}

/* ---- Info page ---- */
const rows = (id, arr, fn) => { const el = $('#' + id); if (el) el.innerHTML = arr.map(fn).join(''); };
rows('svcs', SERVICES, s => `<div class="rw" data-r><b>${s[0]}</b><p>${s[1]}</p></div>`);
rows('stack', STACK, s => `<div class="rw" data-r><b>${s[0]}</b><p>${s[1]}</p></div>`);
rows('exp', EXP, s => `<div class="rw" data-r><div><b>${s[0]}</b><span>${s[1]}</span></div><div><em>${s[2]}</em><p>${s[3]}</p></div></div>`);
rows('faq', FAQ, s => `<details class="rw fq" data-r><summary>${s[0]}</summary><p>${s[1]}</p></details>`);

/* ---- reveals + intro ---- */
anime({ targets: '.ph .ln>span, .cta .ln>span', translateY: ['112%', '0%'], duration: 1400, delay: anime.stagger(140, { start: 700 }), easing: EASE });
const io = new IntersectionObserver(es => es.forEach(e => { if (!e.isIntersecting) return; io.unobserve(e.target); anime({ targets: e.target, opacity: [0, 1], translateY: [30, 0], duration: 1200, easing: EASE }); }), { threshold: 0.12 });
$$('[data-r]').forEach(el => io.observe(el));

/* ---- header/nav light again once the dark contact panel scrolls away ---- */
const panel = $('.cta.full');
if (panel) new IntersectionObserver(es => es.forEach(e => document.body.classList.toggle('dk', e.isIntersecting)), { rootMargin: '0px 0px -92% 0px' }).observe(panel);

/* ---- contact ---- */
const sqm = $('#sqm');
if (sqm) {
  anime.set(sqm, { strokeDashoffset: anime.setDashoffset });
  anime({ targets: sqm, strokeDashoffset: [anime.setDashoffset, 0], duration: 2400, delay: 1100, easing: 'easeInOutSine', complete: () => $('#sqh').style.opacity = 1 });
  anime({ targets: '.dot', scale: [0, 1], rotate: [-120, 0], delay: anime.stagger(150, { start: 900 }), duration: 1100, easing: EASE });
  $('#fm').addEventListener('submit', e => { e.preventDefault(); const f = e.target, ok = $('#ok');
    if (!f.n.value.trim() || !/^\S+@\S+\.\S+$/.test(f.e.value)) { ok.textContent = 'Add your name and a valid email to send the message.'; return; }
    location.href = 'mailto:' + SITE.email + '?subject=' + encodeURIComponent('Project enquiry from ' + f.n.value.trim()) + '&body=' + encodeURIComponent(f.m.value + '\n\n' + f.n.value.trim() + ' (' + f.e.value + ')'); ok.textContent = 'Opening your email app…'; });
}
})();
