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
const row = $('#row');
const cases = $$('.case'), scn = $('.scene svg'), cta = $('#contact'), gs = $$('.g', row);
const mixc = (a, b, t) => 'rgb(' + a.map((v, i) => Math.round(v + (b[i] - v) * t)).join() + ')';
const GR = [220, 220, 215], DK = [34, 34, 34], ramp = (p, a, b) => clamp((p - a) / (b - a), 0, 1);
const big = $('#big');
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
const ITEMS = ['Innovation', 'Analytics', 'Healthcare', 'Efficiency'];
const AST = '<svg class="as"><use href="#ast"/></svg>';
const group = ITEMS.map((w, i) => `<span${w === 'Analytics' ? ' class="on"' : ''}>${w}</span>${i < 3 ? AST : '<i class="ar"></i>'}`).join('');
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
  .add({ targets: '.hero .ln>span', translateY: ['112%', '0%'], duration: 1400, delay: anime.stagger(140) })
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
  const k = clamp(1 - (cases[1].getBoundingClientRect().top - 84) / innerHeight, 0, 1);
  cases[0].style.transform = `scale(${1 - k * 0.05})`; cases[0].style.filter = `brightness(${1 - k * 0.1})`;
  const cr = cta.getBoundingClientRect(); drawT = clamp((innerHeight * 0.85 - cr.top - 120) / (cr.height * 0.55), 0, 1);
  procScroll();
}
lenis.on('scroll', onScroll);
addEventListener('resize', onScroll);

/* ---------- Services accordion + cursor follower ---------- */
const SV = [
  ['Product design', 'ARCEAUS specializes in SaaS design, enhancing Product Design with expert insights, innovative solutions, improved UI/UX, design audits, design systems, testing, optimization, increased conversion, and growth support.'],
  ['UI/UX design', 'Clear, consistent interfaces that new users learn quickly and power users move through fast.'],
  ['Growth design', 'Onboarding, activation and upgrade flows, tested with experiments until the numbers move.'],
  ['Mobile apps design', 'Native-feeling iOS and Android experiences that match your web product.'],
  ['Design systems', 'Component libraries and tokens that keep your design and engineering teams in sync.'],
  ['Design audits', 'A detailed review of your product with a prioritized list of fixes.'],
  ['User research', 'Interviews and usability tests that show what your customers actually need.'],
  ['Website design for your SaaS', 'Marketing sites that explain your product and convert visitors into trials.']
];
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

/* ---------- Process (scroll-driven steps) ---------- */
const PR = [
  { p: 33.33, c: '#9aa5ab', l: 'We craft intuitive and tailored SaaS experiences that people love. From your idea to a complete design.', t: ['Design an MVP based on your SaaS idea', 'Transform a service business into SaaS', 'Design SaaS for your internal needs', 'Quickly test the business idea with potential customers', 'Craft stunning UI'],
    g: '<rect x="560" y="60" width="40" height="320" fill="#222"/><path d="M420 90h260l-20 40H440z" fill="#222"/><rect x="60" y="210" width="290" height="190" rx="8" fill="#2a2a2a" stroke="#555"/><g fill="#444"><rect x="80" y="280" width="30" height="90"/><rect x="130" y="250" width="30" height="120"/><rect x="180" y="300" width="30" height="70"/></g><circle cx="290" cy="290" r="36" fill="none" stroke="#777" stroke-width="10"/>' },
  { p: 66.66, c: '#c2b0b5', l: 'We make sure your SaaS attracts people, solves their real needs, and converts them into paying customers.', t: ['Understand why the product is not hitting targets', 'Make your product easier to use', 'Add new features and test them fast', 'Test the hypotheses faster', 'Uplift the look and feel of the product', 'Incorporate AI into our product'],
    g: '<path d="M90 120 250 60l40 40h-30l-70 40z" fill="#222"/><circle cx="270" cy="230" r="60" fill="#222" stroke="#555" stroke-width="6"/><path d="M40 420c100-80 240-70 400-50l30 50z" fill="#262626"/><circle cx="170" cy="395" r="36" fill="#1a1a1a"/>' },
  { p: 100, c: '#8f8f8e', l: 'You get a dedicated SaaS designer through a monthly subscription.', t: ['Add an extra pair of hands for your project', 'Bring in a designer to execute a predetermined roadmap', 'Get the designer started really fast', 'Hire without recruitment costs'],
    g: '<rect x="90" y="110" width="200" height="300" rx="14" fill="#2b2b2b" stroke="#666"/><rect x="330" y="110" width="200" height="300" rx="14" fill="#2b2b2b" stroke="#666"/><circle cx="190" cy="230" r="34" fill="none" stroke="#999" stroke-width="3"/><circle cx="430" cy="230" r="34" fill="none" stroke="#999" stroke-width="3"/>' }
];
$('#ill').innerHTML = PR.map(s => `<svg viewBox="0 0 640 480" preserveAspectRatio="xMidYMid slice" style="opacity:0"><rect width="640" height="480" fill="${s.c}"/>${s.g}<use href="#star" x="210" y="56" width="24" height="24" color="#ddd"/></svg>`).join('');
const layers = $$('#ill svg'), proc = $('#process'), pv = { v: 0 }, btns = $$('#stp button');
let step = -1;
function go(i) {
  const first = step < 0; step = i;
  const s = PR[i];
  anime({ targets: '#fill', width: s.p + '%', duration: first ? 0 : 1100, easing: 'easeInOutExpo' });
  anime({ targets: pv, v: s.p, round: 1, duration: first ? 0 : 1100, easing: 'easeInOutExpo', update: () => $('#pct').textContent = pv.v + '%' });
  btns.forEach((b, k) => { b.classList.toggle('on', k === i); b.textContent = k === i ? `STEP /0${k + 1}/` : `/0${k + 1}/`; });
  layers.forEach((l, k) => anime({ targets: l, opacity: k === i ? 1 : 0, scale: k === i ? [1.06, 1] : 1, duration: first ? 0 : 1000, easing: EASE }));
  anime({ targets: '#ptx', opacity: [1, 0], translateY: [0, -10], duration: first ? 0 : 250, easing: 'easeInQuad', complete: () => {
    $('#lead').textContent = s.l;
    $('#lst').innerHTML = s.t.map(x => `<li>${x}</li>`).join('');
    anime({ targets: ['#ptx'], opacity: [0, 1], translateY: [14, 0], duration: 800, easing: EASE });
    anime({ targets: '#lst li', opacity: [0, 1], translateY: [10, 0], delay: anime.stagger(60), duration: 700, easing: EASE });
  } });
}
function procScroll() {
  const r = proc.getBoundingClientRect();
  const p = clamp(-r.top / (r.height - innerHeight), 0, 0.999);
  const i = Math.floor(p * 3);
  if (i !== step) go(i);
}
btns.forEach(b => b.addEventListener('click', () => {
  const y = proc.offsetTop + (proc.offsetHeight - innerHeight) * ((+b.dataset.i + 0.5) / 3);
  lenis.scrollTo(y, { duration: 1.4 });
}));
go(0);

/* ---------- Testimonials ---------- */
const T = [
  ["It's a big headache to manage compliance everywhere where we have employees.", "Keeping track of requirements and coordinating who needs to do what was all manual. Mossy helps us bring the back-office together so we're on the same page across HR-ops, legal, and tax.", 'Kenny Mendes', 'Head of Product Design, Mossy'],
  ['We finally shipped onboarding that people complete.', 'Activation went up after ARCEAUS segmented new users and rewrote the first-run flow. The team worked like part of ours.', 'Anna Kowalska', 'VP Product, Competera'],
  ['A designer on call changed how we plan releases.', 'The monthly subscription gave us a senior designer in days, with no recruiting and no ramp-up.', 'Luis Ortega', 'CEO, Northbeam Labs']
];
let ti = 0;
function show(d, first) {
  ti = (ti + d + T.length) % T.length; const t = T[ti];
  const paint = () => { $('#q').textContent = t[0]; $('#qp').textContent = t[1]; $('#qw').innerHTML = `${t[2]}<small>${t[3]}</small>`; anime({ targets: '#tb>*', opacity: [0, 1], translateY: [22 * (d || 1), 0], delay: anime.stagger(90), duration: 900, easing: EASE }); };
  first ? paint() : anime({ targets: '#tb>*', opacity: 0, translateY: -16 * (d || 1), duration: 300, easing: 'easeInQuad', complete: paint });
}
$('#pv').onclick = () => show(-1); $('#nx').onclick = () => show(1);
show(0, true);

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
  ok.textContent = `Thanks, ${f.n.value.trim().split(' ')[0]}. We will reply within one business day.`; f.reset();
});

/* ---------- Team drag scroller ---------- */
const cd = $('.cards'); let dn = false, sx = 0, sl = 0;
cd.addEventListener('pointerdown', e => { dn = true; sx = e.clientX; sl = cd.scrollLeft; cd.style.cursor = 'grabbing'; });
addEventListener('pointerup', () => { dn = false; cd.style.cursor = ''; });
addEventListener('pointermove', e => { if (dn) cd.scrollLeft = sl - (e.clientX - sx); });

/* ---------- Header + nav switch to dark-panel style over the contact section ---------- */
new IntersectionObserver(es => es.forEach(e => document.body.classList.toggle('dk', e.isIntersecting)), { rootMargin: '0px 0px -92% 0px' }).observe($('#contact'));

/* ---------- Floating nav highlight ---------- */
const links = $$('nav.fl a');
const fl = $('nav.fl');
function syncNavPill() {
  const active = links.find(a => a.classList.contains('on'));
  if (!active) return;
  fl.style.setProperty('--nav-x', active.offsetLeft + 'px');
  fl.style.setProperty('--nav-w', active.offsetWidth + 'px');
}
const nio = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) {
    links.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id));
    syncNavPill();
  }
}), { rootMargin: '-45% 0px -50% 0px' });
['home', 'services', 'process', 'cases'].forEach(id => nio.observe($('#' + id)));
addEventListener('resize', syncNavPill);
syncNavPill();
onScroll();
})();
