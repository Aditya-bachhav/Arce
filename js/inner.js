/* ==========================================================================
   inner.js — work, project, info (about) and contact pages.

   Each block runs only if its mount point exists on the current page.
     1. Work grid + pricing        (work.html)
     2. Project detail             (project.html)
     3. Info sections              (about.html)
     4. Page intro + contact art   (all inner pages)
   ========================================================================== */
(() => {
  'use strict';

  if (!window.ARC) return;
  const { $, $$, motion, EASE, observe } = window.ARC;

  const mount = (selector, html) => {
    const element = $(selector);
    if (element) element.innerHTML = html;
    return element;
  };

  /* ---------- 1. Work grid + pricing ---------- */

  mount(
    '#work-grid',
    PROJECTS.map(
      (project) => `
        <a class="work-card" href="project.html?p=${project.slug}" data-reveal>
          <div class="work-card__media" style="background:${project.color}">
            <img src="${project.images[0]}" alt="${project.title}" loading="lazy" data-hide-on-error>
          </div>
          <div class="work-card__meta">
            <h2>${project.title}</h2>
            <span>(${project.category})</span>
            <em>${project.year}</em>
          </div>
        </a>`,
    ).join(''),
  );

  const workCount = $('#work-count');
  if (workCount) {
    workCount.textContent = `(${String(PROJECTS.length).padStart(2, '0')}) projects — design and development for brands and businesses.`;
  }

  mount(
    '#pricing',
    `
    <div class="section-head">
      <span class="label">/ Pricing /</span>
      <h2>Choose the right level for your project.</h2>
    </div>
    <div class="price-grid">
      ${PRICING.map(
        (plan) => `
        <article class="price-card${plan.featured ? ' price-card--featured' : ''}">
          ${plan.featured ? '<span class="price-badge">Most popular</span>' : ''}
          <h3 class="label">${plan.name}</h3>
          <span class="price-amount">${plan.price}</span>
          <p>${plan.tagline}</p>
          <a class="btn price-btn" href="contact.html"><i></i>Get started<span class="visually-hidden"> with the ${plan.name} plan</span></a>
          <div class="price-includes">
            <strong>Includes</strong>
            <ul>${plan.includes.map((item) => `<li>${item}</li>`).join('')}</ul>
          </div>
        </article>`,
      ).join('')}
    </div>
    <p class="price-note">Final pricing depends on the project scope, timeline, and requirements.</p>`,
  );

  /* ---------- 2. Project detail ---------- */

  const projectMount = $('#project');

  if (projectMount) {
    const slug = new URLSearchParams(location.search).get('p');
    const index = PROJECTS.findIndex((project) => project.slug === slug);

    if (index < 0) {
      location.replace('work.html');
    } else {
      const project = PROJECTS[index];
      const next = PROJECTS[(index + 1) % PROJECTS.length];
      const [cover, ...gallery] = project.images;

      // Keep the document metadata in step with the project being shown.
      const setMeta = (selector, attribute, value) => $(selector)?.setAttribute(attribute, value);
      const pageUrl = `https://arceaus.com/project.html?p=${project.slug}`;
      document.title = `${project.title}: ARCEAUS Project Case Study`;
      setMeta('meta[name="description"]', 'content', `${project.title}: ${project.description}`);
      setMeta('link[rel="canonical"]', 'href', pageUrl);
      setMeta('meta[property="og:title"]', 'content', document.title);
      setMeta('meta[property="og:url"]', 'content', pageUrl);
      setMeta('meta[name="twitter:title"]', 'content', document.title);

      projectMount.innerHTML = `
        <span class="label">/ Project ${String(index + 1).padStart(2, '0')} /</span>
        <h1><span class="line"><span>${project.title}</span></span></h1>

        <div class="project-meta">
          <dl class="project-meta__list">
            <div><dt class="label">Type</dt><dd>${project.category}</dd></div>
            <div><dt class="label">Year</dt><dd>${project.year}</dd></div>
            <div><dt class="label">Studio</dt><dd>ARCEAUS</dd></div>
          </dl>
          ${
            project.url
              ? `<a class="btn" href="${project.url}" target="_blank" rel="noopener"><i></i>Visit live site<span class="visually-hidden"> (opens in a new tab)</span></a>`
              : ''
          }
        </div>

        <div class="project-hero" data-reveal style="background:${project.color}">
          <img src="${cover}" alt="${project.title}" data-hide-on-error>
        </div>

        <div class="split">
          <span class="label">/ Overview /</span>
          <h2>${project.title}</h2>
          <p class="lede">${project.description}</p>
        </div>

        ${
          gallery.length
            ? `<div class="project-gallery" data-reveal>
                ${gallery
                  .map(
                    (image, i) =>
                      `<img src="${image}" alt="${project.title} project view ${i + 2}" loading="lazy" data-hide-on-error>`,
                  )
                  .join('')}
              </div>`
            : ''
        }

        <a class="next-project" href="project.html?p=${next.slug}">
          <span class="label">Next project</span>
          <span class="next-project__title">${next.title}</span>
          <span class="next-project__arrow" aria-hidden="true">→</span>
        </a>`;
    }
  }

  /* ---------- 3. Info sections ---------- */

  mount(
    '#info-services',
    SERVICES.map(
      (service) => `
        <div class="info-row" data-reveal>
          <h3 class="info-row__title">${service.title}</h3>
          <p>${service.text}</p>
        </div>`,
    ).join(''),
  );

  mount(
    '#info-stack',
    STACK.map(
      (tool) => `
        <div class="info-row" data-reveal>
          <h3 class="info-row__title">${tool.name}</h3>
          <p>${tool.text}</p>
        </div>`,
    ).join(''),
  );

  mount(
    '#info-experience',
    EXPERIENCE.map(
      (job) => `
        <div class="info-row" data-reveal>
          <div>
            <h3 class="info-row__title">${job.role}</h3>
            <span class="info-row__meta">${job.place}</span>
          </div>
          <div>
            <span class="info-row__meta">${job.period}</span>
            <p>${job.text}</p>
          </div>
        </div>`,
    ).join(''),
  );

  mount(
    '#info-faq',
    FAQ.map(
      (item) => `
        <details class="info-row info-row--faq" data-reveal>
          <summary>${item.question}</summary>
          <p>${item.answer}</p>
        </details>`,
    ).join(''),
  );

  observe();

  /* ---------- 4. Page intro + contact artwork ---------- */

  if (motion) {
    const lines = $$('.page-head .line > span, .contact .line > span');
    if (lines.length) {
      gsap.fromTo(
        lines,
        { y: 0, yPercent: 112 },
        { yPercent: 0, duration: 1.4, stagger: 0.14, delay: 0.7, ease: EASE.out },
      );
    }

    // Contact page: the squiggly line draws itself on load.
    const path = $('#contact-path');
    const arrow = $('#contact-arrow');

    if (path && arrow) {
      const length = path.getTotalLength();
      gsap.fromTo(
        path,
        { strokeDasharray: length, strokeDashoffset: length },
        {
          strokeDashoffset: 0,
          duration: 2.4,
          delay: 1.1,
          ease: 'sine.inOut',
          onComplete: () => {
            arrow.style.opacity = 1;
          },
        },
      );
      gsap.fromTo(
        '.contact__dot',
        { scale: 0, rotate: -120 },
        { scale: 1, rotate: 0, stagger: 0.15, delay: 0.9, duration: 1.1, ease: EASE.out },
      );
    }
  }
})();
