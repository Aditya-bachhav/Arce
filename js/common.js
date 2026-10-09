/* ==========================================================================
   common.js — behaviour shared by every page.

   Loaded after GSAP, Lenis and data.js. Exposes `window.ARC`, which the
   page scripts (home.js, inner.js) build on:

     ARC.motion        true when GSAP is available and the visitor has not
                       asked for reduced motion
     ARC.lenis         the Lenis instance (null when motion is off)
     ARC.scrollTo()    smooth scroll that works with or without Lenis
     ARC.observe()     register [data-reveal] elements for scroll reveals

   Sections:
     1. Environment
     2. Smooth scroll (Lenis driven by GSAP's ticker)
     3. Page transitions
     4. Scroll reveals
     5. Header (clock, dark-panel state)
     6. Image fallbacks
     7. Cal.com booking modal (Contact page only)
     8. Contact form
   ========================================================================== */
(() => {
  'use strict';

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  /* ---------- 1. Environment ---------- */

  const root = document.documentElement;
  const hasGsap = Boolean(window.gsap);
  const prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const motion = hasGsap && !prefersReducedMotion;

  // If GSAP failed to load, drop the .js flag so every "hidden until animated"
  // state in the CSS falls back to visible content instead of a blank page.
  if (!hasGsap) root.classList.remove('js');

  const EASE = { out: 'expo.out', inOut: 'expo.inOut' };

  /* ---------- 2. Smooth scroll ----------
     Lenis is advanced by GSAP's ticker, and ScrollTrigger is updated from
     Lenis' scroll event. One clock drives both, so scroll position and every
     scrubbed animation always agree on the same frame. */

  let lenis = null;

  if (hasGsap && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  if (motion && window.Lenis) {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
      prevent: (node) => Boolean(node.closest('.contact__cal')),
    });

    if (window.ScrollTrigger) lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  /** Scroll to a pixel position or an element, smoothly when motion is allowed. */
  const scrollTo = (target, { offset = 0, duration = 1.4 } = {}) => {
    if (lenis) {
      lenis.scrollTo(target, { offset, duration });
      return;
    }
    const top =
      typeof target === 'number'
        ? target
        : target.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  };

  // In-page anchors (e.g. the footer's "back to top" arrow).
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (!link || link.classList.contains('skip-link')) return;

    event.preventDefault();
    const hash = link.getAttribute('href');
    if (hash === '#' || hash === '#top') return scrollTo(0);

    const target = document.getElementById(hash.slice(1));
    if (target) scrollTo(target, { offset: -60 });
  });

  /* ---------- 3. Page transitions ---------- */

  const curtain = $('.page-curtain');

  if (curtain) {
    if (!motion) {
      curtain.style.display = 'none';
    } else {
      const hideCurtain = () => {
        curtain.style.display = 'none';
      };

      gsap.fromTo(
        curtain,
        { yPercent: 0 },
        { yPercent: -100, duration: 1, delay: 0.15, ease: EASE.inOut, onComplete: hideCurtain },
      );
      setTimeout(hideCurtain, 3200); // safety net

      // Coming back via the browser's back/forward cache.
      addEventListener('pageshow', (event) => {
        if (event.persisted) hideCurtain();
      });

      document.addEventListener('click', (event) => {
        if (event.defaultPrevented || event.button !== 0) return;
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

        const link = event.target.closest('a[href]');
        if (!link || link.target === '_blank' || link.hasAttribute('download')) return;
        const url = new URL(link.href, location.href);
        const isInternalPage = url.origin === location.origin && /\.html$/.test(url.pathname);
        if (!isInternalPage) return;

        const samePage = url.pathname === location.pathname;
        if (samePage && url.hash) return; // let the browser handle in-page hashes

        event.preventDefault();
        if (samePage && url.search === location.search) return scrollTo(0);

        curtain.style.display = 'block';
        gsap.fromTo(
          curtain,
          { yPercent: 100 },
          {
            yPercent: 0,
            duration: 0.75,
            ease: EASE.inOut,
            onComplete: () => {
              location.href = url.href;
            },
          },
        );
      });
    }
  }

  /* ---------- 4. Scroll reveals ----------
     Any element with [data-reveal] fades/slides in the first time it
     enters the viewport. Call ARC.observe() after injecting new markup. */

  let revealObserver = null;

  const observe = (scope = document) => {
    if (!motion) return;

    revealObserver ??= new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          revealObserver.unobserve(entry.target);
          gsap.fromTo(
            entry.target,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 1.2, ease: EASE.out },
          );
        });
      },
      { threshold: 0.12 },
    );

    $$('[data-reveal]', scope).forEach((element) => revealObserver.observe(element));
  };

  /* ---------- 5. Header ---------- */

  // Live clock (India time).
  const clock = $('#clock');
  if (clock) {
    const format = new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZone: 'Asia/Kolkata',
    });
    const tick = () => {
      clock.textContent = format.format(new Date());
    };
    tick();
    setInterval(tick, 30000);
  }

  // The header and floating nav switch to their "on dark" style while a
  // [data-dark-panel] section sits under the top of the viewport.
  const darkPanel = $('[data-dark-panel]');
  if (darkPanel) {
    new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => document.body.classList.toggle('dk', entry.isIntersecting)),
      { rootMargin: '0px 0px -92% 0px' },
    ).observe(darkPanel);
  }

  /* ---------- 6. Image fallbacks ----------
     <img data-hide-on-error> disappears if its file is missing, leaving the
     coloured card behind it instead of a broken-image icon. */

  document.addEventListener(
    'error',
    (event) => {
      const image = event.target;
      if (image instanceof HTMLImageElement && image.hasAttribute('data-hide-on-error')) {
        image.hidden = true;
      }
    },
    true,
  );

  /* ---------- 7. Cal.com inline scheduler ----------
     The Contact page renders the complete scheduler directly in the page. */

  const bookingLinks = $$('[data-cal-inline]');

  if (bookingLinks.length) {
    const cal = SITE.cal;
    let started = false;

    // Official Cal.com loader snippet (https://cal.com/docs/embeds), formatted.
    const loadCalLoader = () => {
      (function (C, A, L) {
        const queue = (api, args) => api.q.push(args);
        const doc = C.document;
        C.Cal =
          C.Cal ||
          function () {
            const calApi = C.Cal;
            const args = arguments;
            if (!calApi.loaded) {
              calApi.ns = {};
              calApi.q = calApi.q || [];
              doc.head.appendChild(doc.createElement('script')).src = A;
              calApi.loaded = true;
            }
            if (args[0] === L) {
              const api = function () {
                queue(api, arguments);
              };
              const namespace = args[1];
              api.q = api.q || [];
              if (typeof namespace === 'string') {
                calApi.ns[namespace] = calApi.ns[namespace] || api;
                queue(calApi.ns[namespace], args);
                queue(calApi, ['initNamespace', namespace]);
              } else {
                queue(calApi, args);
              }
              return;
            }
            queue(calApi, args);
          };
      })(window, `${cal.origin}/embed/embed.js`, 'init');
    };

    const startCal = () => {
      if (started) return;
      started = true;

      loadCalLoader();
      Cal('init', cal.namespace, { origin: cal.origin });
      Cal.ns[cal.namespace]('ui', {
        theme: 'light',
        styles: { branding: { brandColor: cal.brandColor } },
        hideEventTypeDetails: false,
        layout: cal.layout,
      });
      Cal.ns[cal.namespace]('inline', {
        elementOrSelector: '#cal-inline',
        calLink: cal.link,
        config: { layout: cal.layout, theme: 'light' },
      });
    };

    startCal();
  }

  window.ARC = { $, $$, hasGsap, motion, EASE, lenis, scrollTo, observe };
})();
