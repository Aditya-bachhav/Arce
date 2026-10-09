/* ==========================================================================
   home.js — the home page.

     1. Hero (intro, slideshow, parallax, ticker)
     2. Lead paragraph
     3. Horizontal "We develop with purpose" statement
     4. Services accordion + cursor preview
     5. Selected-work card stack
     6. Contact panel
   ========================================================================== */
(() => {
  'use strict';

  if (!window.ARC) return;
  const { $, $$, motion, EASE, observe } = window.ARC;

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const hasScrollTrigger = motion && Boolean(window.ScrollTrigger);

  /* ---------- 1. Hero ---------- */

  // Intro: headline lines, then the intro copy / ticker / image rise in.
  if (motion) {
    gsap
      .timeline({ defaults: { ease: EASE.out } })
      .fromTo(
        '.hero .line > span',
        { y: 0, yPercent: 112 },
        { yPercent: 0, duration: 1.4, stagger: 0.14 },
        0.7,
      )
      .fromTo(
        ['.hero__intro', '.ticker', '.hero__scene'],
        { opacity: 0, y: 34 },
        { opacity: 1, y: 0, duration: 1.3, stagger: 0.14 },
        1.44,
      );
  }

  // Slideshow: crossfades are CSS (.is-active); this only picks the slide.
  const slides = $$('.hero-slide');
  const dotsHost = $('#hero-dots');

  if (slides.length && dotsHost) {
    let current = 0;
    let timer;

    const dots = slides.map((_, index) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('aria-label', `Show hero image ${index + 1}`);
      dot.addEventListener('click', () => {
        show(index);
        autoplay();
      });
      dotsHost.append(dot);
      return dot;
    });

    const show = (index) => {
      if (index === current) return;
      slides[current].classList.remove('is-active');
      slides[index].classList.add('is-active');
      dots[current].classList.remove('active');
      dots[current].removeAttribute('aria-current');
      dots[index].classList.add('active');
      dots[index].setAttribute('aria-current', 'true');
      current = index;
    };

    dots[0].classList.add('active');
    dots[0].setAttribute('aria-current', 'true');

    const autoplay = () => {
      clearInterval(timer);
      if (!motion) return;
      timer = setInterval(() => {
        if (!document.hidden && document.hasFocus()) show((current + 1) % slides.length);
      }, 5000);
    };
    autoplay();
  }

  // Slow parallax on the hero image over the first 900px of scrolling.
  if (hasScrollTrigger) {
    gsap.fromTo(
      '#hero-slides',
      { y: 0, scale: 1 },
      { y: 45, scale: 1.054, ease: 'none', scrollTrigger: { start: 0, end: 900, scrub: true } },
    );
  }

  // Seamless ticker: clone the first group until it spans the viewport, then loop it.
  const track = $('#ticker-track');

  if (track && motion) {
    let loop;

    const buildTicker = () => {
      loop?.kill();
      gsap.set(track, { x: 0 });
      $$('[data-clone]', track).forEach((clone) => clone.remove());

      const group = track.firstElementChild;
      const width = group.getBoundingClientRect().width;
      const copies = Math.ceil(innerWidth / width) + 1;

      for (let i = 0; i < copies; i++) {
        const clone = group.cloneNode(true);
        clone.dataset.clone = '';
        track.append(clone);
      }
      loop = gsap.to(track, { x: -width, duration: width * 0.026, ease: 'none', repeat: -1 });
    };

    document.fonts.ready.then(buildTicker);

    let lastWidth = innerWidth;
    let resizeTimer;
    addEventListener('resize', () => {
      if (innerWidth === lastWidth) return;
      lastWidth = innerWidth;
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(buildTicker, 200);
    });
  }

  /* ---------- 2. Lead paragraph ---------- */

  if (hasScrollTrigger) {
    gsap.fromTo(
      '.lead p',
      { opacity: 0, y: 30, color: '#b3b3ae' },
      {
        opacity: 1,
        y: 0,
        color: '#222',
        duration: 1.4,
        ease: EASE.out,
        scrollTrigger: { trigger: '.lead', start: 'top 85%', once: true },
      },
    );
  }

  /* ---------- 3. Horizontal statement ----------
     The row of giant words slides left while the page scrolls, and each word
     "fills" with ink as it crosses the screen.

     Everything runs on ONE timeline whose total duration is exactly 1, scrubbed
     by scroll. Progress 0→1 is the row's full travel, and the word fills are
     positioned inside that same 0→1 range, so the movement can never finish
     before the scroll does. The section is as tall as the viewport plus
     SCROLL_PER_TRAVEL × the horizontal distance, with the CSS `sticky` stage
     holding the text on screen. */

  const statement = $('#statement');
  const row = $('#statement-row');

  if (hasScrollTrigger && statement && row) {
    const SCROLL_PER_TRAVEL = 0.6; // px of page scroll per px the row moves. Raise = slower.
    const RESTING_GAP = 0.86; // the row stops with its right edge at 86% of the viewport

    const words = $$('.statement__word', row);
    const travel = () => Math.max(1, row.scrollWidth - innerWidth * RESTING_GAP);
    const scrollLength = () => Math.round(travel() * SCROLL_PER_TRAVEL);

    const timeline = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: statement,
        start: 'top top',
        end: () => `+=${scrollLength()}`,
        scrub: true,
        invalidateOnRefresh: true,
      },
    });

    // Rebuilt on every ScrollTrigger refresh (resize, font load, layout change),
    // so the section height and every fill timing always match the current layout.
    const build = () => {
      const distance = travel();
      statement.style.setProperty('--statement-scroll', `${scrollLength()}px`);

      timeline.clear();
      timeline.fromTo(row, { x: 0 }, { x: -distance, duration: 1 }, 0);

      // Fill words in sequence rather than letting their viewport positions
      // create overlapping fill animations.
      const fillStart = 0.08;
      const fillEnd = 0.9;
      const fillGap = 0.015;
      const availableFill = fillEnd - fillStart - fillGap * (words.length - 1);
      const totalWordWidth = words.reduce((total, word) => total + word.offsetWidth, 0);
      let cursor = fillStart;

      words.forEach((word) => {
        const duration = availableFill * (word.offsetWidth / totalWordWidth);
        timeline.fromTo(
          word,
          { backgroundPosition: '100% 0' },
          { backgroundPosition: '0% 0', duration },
          cursor,
        );
        cursor += duration + fillGap;
      });
    };

    ScrollTrigger.addEventListener('refreshInit', build);
    build();
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }

  /* ---------- 4. Services ---------- */

  const serviceList = $('#service-list');

  if (serviceList) {
    serviceList.innerHTML = SERVICES.map(
      (service, i) => `
        <li class="service" data-reveal>
          <div class="service__row">
            <span class="service__num" aria-hidden="true"></span>
            <span class="service__toggle" aria-hidden="true">( + )</span>
            <div>
              <h3 class="service__title">
                <button type="button" id="service-button-${i}" aria-expanded="false" aria-controls="service-body-${i}">${service.title}</button>
              </h3>
              <div class="service__body" id="service-body-${i}" role="region" aria-labelledby="service-button-${i}">
                <p>${service.text}</p>
              </div>
            </div>
          </div>
        </li>`,
    ).join('');

    const items = $$('.service', serviceList);
    let openIndex = -1;
    let refreshTimer;

    const label = (item, index, open) => {
      $('.service__num', item).textContent = open
        ? `/ ${String(index + 1).padStart(2, '0')} /`
        : String(index + 1).padStart(2, '0');
      $('.service__toggle', item).textContent = open ? '( − )' : '( + )';
      $('button', item).setAttribute('aria-expanded', String(open));
    };

    // The `is-open` class is the source of truth (CSS shows/hides the body);
    // GSAP only animates the height between the two states.
    const setOpen = (index, open, animate = true) => {
      const item = items[index];
      const body = $('.service__body', item);
      const from = open ? { height: 0, autoAlpha: 0 } : { height: body.offsetHeight, autoAlpha: 1 };
      const to = open ? { height: 'auto', autoAlpha: 1 } : { height: 0, autoAlpha: 0 };

      item.classList.toggle('is-open', open);
      label(item, index, open);

      if (animate && motion) {
        gsap.fromTo(body, from, {
          ...to,
          duration: open ? 0.8 : 0.7,
          ease: EASE.inOut,
          overwrite: true,
          clearProps: 'height,opacity,visibility',
        });
      }
    };

    const toggle = (index) => {
      if (openIndex === index) {
        setOpen(index, false);
        openIndex = -1;
      } else {
        if (openIndex > -1) setOpen(openIndex, false);
        setOpen(index, true);
        openIndex = index;
      }

      // The page just got taller/shorter: re-measure scroll triggers once the motion settles.
      if (hasScrollTrigger) {
        clearTimeout(refreshTimer);
        refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 900);
      }
    };

    items.forEach((item, index) => {
      label(item, index, false);
      item.addEventListener('click', () => toggle(index));
    });

    setOpen(0, true, false);
    openIndex = 0;

    observe(serviceList);

    // Cursor-following image preview (pointer devices only).
    const preview = $('#service-preview');

    if (preview && motion && matchMedia('(hover: hover)').matches) {
      const halfWidth = 90;
      const halfHeight = 65;

      gsap.set(preview, { scale: 0, opacity: 0 });
      const moveX = gsap.quickTo(preview, 'x', { duration: 0.35, ease: 'power3' });
      const moveY = gsap.quickTo(preview, 'y', { duration: 0.35, ease: 'power3' });

      items.forEach((item, index) => {
        item.addEventListener('mouseenter', (event) => {
          const { color, image } = SERVICE_PREVIEWS[index % SERVICE_PREVIEWS.length];
          preview.style.background = color;
          preview.innerHTML = `<img src="${image}" alt="" loading="lazy">`;

          gsap.set(preview, { x: event.clientX - halfWidth, y: event.clientY - halfHeight });
          gsap.to(preview, { scale: 1, opacity: 1, duration: 0.35, ease: 'power1.out', overwrite: 'auto' });
          gsap.fromTo($('img', preview), { scale: 1.12 }, { scale: 1, duration: 0.7, ease: EASE.out });
        });

        item.addEventListener('mousemove', (event) => {
          moveX(event.clientX - halfWidth);
          moveY(event.clientY - halfHeight);
        });

        item.addEventListener('mouseleave', () => {
          gsap.to(preview, { scale: 0, opacity: 0, duration: 0.25, ease: 'power1.in', overwrite: 'auto' });
        });
      });
    }
  }

  /* ---------- 5. Selected work ---------- */

  const workTitle = $('#work-title');
  if (workTitle) workTitle.textContent = `Selected work (${String(PROJECTS.length).padStart(2, '0')})`;

  const cases = $('#cases');

  if (cases) {
    cases.innerHTML = PROJECTS.map(
      (project, i) => `
        <article class="case" style="--i:${i};--bg:${project.color}">
          <p class="case__type">${project.category}</p>
          <div class="case__title"><h3>${project.title}</h3><span>(${project.year})</span></div>
          <div class="case__desc"><p>${project.description}</p></div>
          <a class="btn" href="project.html?p=${project.slug}"><i></i>View project<span class="visually-hidden">: ${project.title}</span></a>
          <div class="case__preview">
            <img src="${project.images[0]}" alt="${project.title}" width="400" height="225" loading="lazy" data-hide-on-error>
          </div>
        </article>`,
    ).join('');

    // As the next card slides up over a card, that card shrinks and dims slightly.
    if (hasScrollTrigger) {
      const STICKY_TOP = 76; // must match `top` in .case (css)
      const STICKY_STEP = 26;

      gsap.matchMedia().add('(min-width: 821px)', () => {
        const cards = $$('.case', cases);

        cards.forEach((card, i) => {
          const next = cards[i + 1];
          if (!next) return;
          const stuckAt = () => STICKY_TOP + i * STICKY_STEP;

          gsap.fromTo(
            card,
            { scale: 1, filter: 'brightness(1)' },
            {
              scale: 0.95,
              filter: 'brightness(0.9)',
              ease: 'none',
              scrollTrigger: {
                trigger: next,
                start: () => `top ${stuckAt() + innerHeight}px`,
                end: () => `top ${stuckAt()}px`,
                scrub: true,
                invalidateOnRefresh: true,
              },
            },
          );
        });
      });
    }
  }

  /* ---------- 6. Contact panel ---------- */

  const contact = $('#contact');
  const path = $('#contact-path');
  const arrow = $('#contact-arrow');

  if (contact && motion && hasScrollTrigger) {
    // Heading + dots pop in the first time the panel is reached.
    gsap.set('.contact__dot', { scale: 0 });
    ScrollTrigger.create({
      trigger: contact,
      start: 'top 75%',
      once: true,
      onEnter: () => {
        gsap.fromTo(
          '.contact .line > span',
          { y: 0, yPercent: 112 },
          { yPercent: 0, stagger: 0.14, duration: 1.3, ease: EASE.out },
        );
        gsap.fromTo(
          '.contact__dot',
          { scale: 0, rotate: -120 },
          { scale: 1, rotate: 0, stagger: 0.15, delay: 0.3, duration: 1.1, ease: EASE.out },
        );
      },
    });

    // The squiggly line draws itself as the panel scrolls into view.
    if (path && arrow) {
      const length = path.getTotalLength();
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });

      gsap.to(path, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: contact,
          start: () => `top ${innerHeight * 0.85 - 120}px`,
          end: () => `top ${innerHeight * 0.85 - 120 - contact.offsetHeight * 0.55}px`,
          scrub: 0.6,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            arrow.style.opacity = self.progress > 0.97 ? 1 : 0;
          },
        },
      });
    }
  }
})();
