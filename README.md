# ARCEAUS site

Static site — no build step. Open `index.html` through any static server.

```
index.html  about.html  work.html  project.html  contact.html
css/style.css          all styles, in labelled sections
js/data.js             ALL content + config (projects, pricing, services, FAQ, Cal link)
js/common.js           shared: smooth scroll, page transitions, reveals, header, Cal modal, form
js/home.js             home page animation
js/inner.js            work / project / about / contact pages
assets/  projects/     images (not included in this package — keep your existing folders)
docs/                  internal notes, not part of the site
```

## Booking
The header “Book a Call” link opens the Contact page. The Contact page embeds
the complete Cal.com scheduler directly in the page. Edit `SITE.cal.link` in
`js/data.js` (e.g. `"yourname/30min"`) to change the booking calendar.

## Horizontal "We develop with purpose" section
`SCROLL_PER_TRAVEL` at the top of that block in `js/home.js` sets how much page-scroll
the sideways movement takes (0.6 = 0.6px of scroll per 1px of travel). Raise to slow it down.

## Editing nav / footer
Header, floating nav and footer are plain HTML in each page (so they render without JS).
A nav change means editing the five HTML files.
