(() => {
const $ = (s, c = document) => c.querySelector(s), $$ = (s, c = document) => [...c.querySelectorAll(s)];
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const RM = matchMedia('(prefers-reduced-motion:reduce)').matches;
const EASE = 'easeOutExpo';

/* ---------- Lenis smooth scroll ---------- */
const lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.95 });
let bigTarget = 0, bigCur = 0, bigPT = 0, bigP = 0, drawT = 0, drawCur = 0;
const sqm = $('#sqm'), sqh = $('#sqh'), sqLen = sqm.getTotalLength();
sqm.style.strokeDasharray = sqLen; sqm.style.strokeDashoffset = sqLen;
const row = $('#row'), big = $('#big');
$('#wc').textContent = `Selected work (${String(PROJECTS.length).padStart(2, '0')})`;
$('#cases').innerHTML = PROJECTS.map((p, i) => `<article class="case" style="background:${p.bg};top:${60 + i * 22}px"><div class="c1">${p.c}</div><div class="c2"><h4>${p.t}</h4><span>(${p.y})</span></div><div class="c3"><p>${p.d}</p></div><a class="btn" href="project.html?p=${p.s}"><i></i>View project</a><div class="lg">${p.t}</div><div class="pv"><img src="${p.img}" alt="${p.t}" loading="lazy" onerror="this.style.display='none'"></div></article>`).join('');
const cases = $$('.case'), scn = $('#hero-slides'), cta = $('#contact'), gs = $$('.g', row);
const mixc = (a, b, t) => 'rgb(' + a.map((v, i) => Math.round(v + (b[i] - v) * t)).join() + ')';
const GR = [220, 220, 215], DK = [34, 34, 34], ramp = (p, a, b) => clamp((p - a) / (b - a), 0, 1);
requestAnimationFrame(function loop(t) {
  lenis.raf(t);
  bigCur += (bigTarget - bigCur) * 0.14; bigP += (bigPT - bigP) * 0.14;
  row.style.transform = `translate3d(${bigCur}px,0,0)`;
  gs[0].style.color = mixc(GR, DK, ramp(bigP, 0.1, 0.5));
  gs[1].style.color = mixc(GR, DK, ramp(bigP, 0.35, 0.8));
  drawCur += (drawT - drawCur) * 0.12;
  sqm.style.strokeDashoffset = sqLen * (1 - drawCur);
  sqh.style.opacity = drawCur > 0.97 ? 1 : 0;
  followTick();
  requestAnimationFrame(loop);
});

$$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
  const h = a.getAttribute('href');
  e.preventDefault();
  if (h === '#' ) return;
  lenis.scrollTo(h === '#top' ? 0 : h, { offset: h === '#top' ? 0 : -60, duration: 1.6 });
}));

/* ---------- Seamless marquee (anime.js) ---------- */
const tr = $('#tr');
const HERO_IMAGES = ['Assets/hero-imgs/2.webp', 'Assets/hero-imgs/ChatGPT%20Image%20Sep%2027,%202026,%2003_47_36%20PM.webp', 'Assets/hero-imgs/ChatGPT%20Image%20Sep%2027,%202026,%2003_56_06%20PM.webp', 'Assets/hero-imgs/ChatGPT%20Image%20Sep%2027,%202026,%2003_58_20%20PM.webp', 'Assets/hero-imgs/ChatGPT%20Image%20Sep%2027,%202026,%2004_02_38%20PM%201.webp', 'Assets/hero-imgs/Frame%202147239316.webp', 'Assets/hero-imgs/Frame%202147239317.webp', 'Assets/hero-imgs/Frame%202147239319.webp'];
const heroDots = $('#hero-dots');
HERO_IMAGES.forEach((src, index) => {
  const image = document.createElement('img'); image.className = 'hero-slide'; image.src = src; image.alt = `ARCEAUS project visual ${index + 1}`; image.loading = index ? 'lazy' : 'eager'; scn.append(image);
  const dot = document.createElement('button'); dot.type = 'button'; dot.ariaLabel = `Show hero image ${index + 1}`; dot.addEventListener('click', () => showHero(index)); heroDots.append(dot);
});
const heroSlides = $$('.hero-slide', scn), heroButtons = $$('button', heroDots); let heroIndex = 0;
heroSlides[0].classList.add('active'); heroButtons[0].classList.add('active');
function showHero(index) {
  if (index === heroIndex || !heroSlides[index]) return;
  const current = heroSlides[heroIndex], next = heroSlides[index]; heroIndex = index;
  heroButtons.forEach((button, i) => button.classList.toggle('active', i === index));
  anime.remove([current, next]);
  anime({ targets: current, opacity: 0, duration: 850, easing: 'easeInOutQuad' });
  anime({ targets: next, opacity: 1, duration: 850, easing: 'easeInOutQuad' });
}
if (!RM) setInterval(() => { if (document.hasFocus()) showHero((heroIndex + 1) % heroSlides.length); }, 5000);
const ITEMS = ['Visual Identity', 'Web design', 'Graphic design'];
const AST = '<svg class="as"><use href="#ast"/></svg>';
const group = ITEMS.map((w, i) => `<span${w === 'Web design' ? ' class="on"' : ''}>${w}</span>${i < ITEMS.length - 1 ? AST : '<i class="ar"></i>'}`).join('');
let mq;
function buildMarquee() {
  if (mq) mq.pause();
  tr.innerHTML = `<div class="tg">${group}</div>`;
  const w = tr.firstElementChild.getBoundingClientRect().width;
  const copies = Math.ceil(innerWidth / w) + 1;
  for (let i = 0; i < copies; i++) tr.insertAdjacentHTML('beforeend', `<div class="tg">${group}</div>`);
  // translate by exactly one group width, then loop -> no visible jump
  mq = anime({ targets: tr, translateX: [0, -w], duration: w * 26, easing: 'linear', loop: true });
  if (RM) mq.pause();
}
document.fonts.ready.then(buildMarquee);
let rz, lw = innerWidth; addEventListener('resize', () => { if (innerWidth === lw) return; lw = innerWidth; clearTimeout(rz); rz = setTimeout(buildMarquee, 200); });

/* ---------- Intro ---------- */
anime.set('header', { opacity: 1 });
anime.timeline({ easing: EASE })
  .add({ targets: '.hero .ln>span', translateY: ['112%', '0%'], duration: 1400, delay: anime.stagger(140, { start: 700 }) })
  .add({ targets: '.hero .bd', scale: [0, 1], rotate: [-200, 0], duration: 1300 }, '-=1000')
  .add({ targets: ['.hero aside', '.tk', '.scene'], opacity: [0, 1], translateY: [34, 0], duration: 1300, delay: anime.stagger(140) }, '-=1100');

/* ---------- Scroll reveals ---------- */
const io = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  io.unobserve(e.target);
  anime({ targets: e.target, opacity: [0, 1], translateY: [30, 0], duration: 1200, easing: EASE });
}), { threshold: 0.15 });
$$('[data-r]').forEach(el => io.observe(el));

/* ---------- Horizontal statement ---------- */
function onScroll() {
  const r = big.getBoundingClientRect();
  const p = clamp(-r.top / (r.height - innerHeight), 0, 1);
  bigTarget = RM ? 0 : -p * (row.scrollWidth - innerWidth * 0.86); bigPT = p;
  scn.style.transform = `translate3d(0,${lenis.scroll * 0.05}px,0) scale(${1 + Math.min(lenis.scroll, 900) * 0.00006})`;
  if (innerWidth > 820) cases.forEach((c, i) => { if (i < cases.length - 1) { const k = clamp(1 - (cases[i + 1].getBoundingClientRect().top - (84 + i * 22)) / innerHeight, 0, 1); c.style.transform = `scale(${1 - k * 0.05})`; c.style.filter = `brightness(${1 - k * 0.1})`; } });
  const cr = cta.getBoundingClientRect(); drawT = clamp((innerHeight * 0.85 - cr.top - 120) / (cr.height * 0.55), 0, 1);
}
lenis.on('scroll', onScroll);
addEventListener('resize', onScroll);

/* ---------- Services accordion + cursor follower ---------- */
const SV = SERVICES;
const ul = $('#svc');
ul.innerHTML = SV.map((s, i) => `<li data-r><div class="r"><span class="n">${i === 0 ? '/ 01 /' : '0' + (i + 1)}</span><span class="p">${i === 0 ? '( − )' : '( + )'}</span><div><h3>${s[0]}</h3><div class="d"><span>${s[1]}</span></div></div></div></li>`).join('');
const lis = $$('li', ul); lis.forEach(li => io.observe(li));
let openI = -1;
function toggle(i) {
  const close = k => { const li = lis[k]; $('.p', li).textContent = '( + )'; anime({ targets: $('.d', li), height: 0, opacity: 0, duration: 700, easing: 'easeInOutExpo' }); };
  if (openI === i) { close(i); openI = -1; return; }
  if (openI > -1) close(openI);
  const d = $('.d', lis[i]); $('.p', lis[i]).textContent = '( − )';
  anime({ targets: d, height: d.scrollHeight, opacity: 1, duration: 800, easing: 'easeInOutExpo', complete: () => lenis.resize && lenis.resize() });
  openI = i;
}
lis.forEach((li, i) => li.addEventListener('click', () => toggle(i)));
toggle(0);

const fo = $('#fo');
const FS = [
  ['#c2b0b5', '<svg viewBox="0 0 70 70"><path fill="#222" d="M35 4l14 14-14 14-14-14zM18 21l14 14-14 14L4 35zM52 21l14 14-14 14-14-14zM35 38l14 14-14 14-14-14z"/></svg>'],
  ['#b9ae8f', '<svg viewBox="0 0 70 70"><path fill="#222" d="M35 8 64 60H6z"/></svg>'],
  ['#9fb0bd', '<svg><use href="#ast" color="#222"/></svg>'],
  ['#a8b89c', '<svg><use href="#star" color="#222"/></svg>']
];
let mx = 0, my = 0, fx = 0, fy = 0, fin = false;
addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
function followTick() {
  fx += (mx - fx) * 0.14; fy += (my - fy) * 0.14;
  fo.style.left = fx - 75 + 'px'; fo.style.top = fy - 75 + 'px';
}
ul.addEventListener('mouseenter', () => { if (!fin) { fin = true; fx = mx; fy = my; } anime({ targets: fo, scale: 1, opacity: 1, duration: 600, easing: 'easeOutBack' }); });
ul.addEventListener('mouseleave', () => { fin = false; anime({ targets: fo, scale: 0, opacity: 0, duration: 400, easing: 'easeInQuad' }); });
lis.forEach((li, i) => li.addEventListener('mouseenter', () => {
  const f = FS[i % FS.length]; fo.style.background = f[0]; fo.innerHTML = f[1];
  anime({ targets: $('svg', fo), rotate: [-25, 0], scale: [0.6, 1], duration: 700, easing: EASE });
}));

/* ---------- Contact ---------- */
let drawn = false;
const cio = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting || drawn) return; drawn = true;
  anime({ targets: '.cta .ln>span', translateY: ['112%', '0%'], delay: anime.stagger(140), duration: 1300, easing: EASE });
  anime({ targets: '.cta .dot', scale: [0, 1], rotate: [-120, 0], delay: anime.stagger(150, { start: 300 }), duration: 1100, easing: EASE });
}), { threshold: 0.25 });
cio.observe($('#contact'));
$('#fm').addEventListener('submit', e => {
  e.preventDefault(); const f = e.target, ok = $('#ok');
  if (!f.n.value.trim() || !/^\S+@\S+\.\S+$/.test(f.e.value)) { ok.textContent = 'Add your name and a valid email to send the message.'; return; }
  location.href = 'mailto:' + SITE.email + '?subject=' + encodeURIComponent('Project enquiry from ' + f.n.value.trim()) + '&body=' + encodeURIComponent(f.m.value + '\n\n' + f.n.value.trim() + ' (' + f.e.value + ')'); ok.textContent = 'Opening your email app…';
});

/* ---------- Header + nav switch to dark-panel style over the contact section ---------- */
new IntersectionObserver(es => es.forEach(e => document.body.classList.toggle('dk', e.isIntersecting)), { rootMargin: '0px 0px -92% 0px' }).observe($('#contact'));

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
onScroll();
})();
