# Website Reconstruction Brief

## Purpose

Rebuild the website shown in the supplied screen recording as a new implementation while preserving the **existing project content/copy already added by the owner**.

This is a reconstruction of the *experience principles* visible in the reference, not a request to disguise an exact clone. Do not copy the original site's logo, brand name, proprietary illustrations, exact assets, exact typography, or distinctive section geometry. Preserve the project's own text, case-study information, people, links, and contact information wherever they already exist.

---

## 1. Reference Experience Observed

The recording shows a minimal creative/product-design studio website with these major characteristics:

- Large amount of whitespace.
- Warm off-white/light neutral page background.
- Very restrained black/dark-gray typography.
- Compact header fixed near the top of the viewport.
- Rounded black primary CTA in the header.
- A small centered pill/indicator in the header.
- Large oversized display typography in the opening hero.
- Small decorative line/arrow motifs integrated into the typography.
- A persistent rounded bottom navigation control with sections resembling:
  - Home
  - Services
  - Process
  - Cases
- Content is presented as large editorial blocks rather than conventional marketing cards.
- Case-study sections use oversized rounded media panels.
- A team section uses image cards with supporting descriptions.
- The final CTA/contact section switches to a dark background with light typography.
- Page transitions appear to be highly animated and scroll-driven.

Use these observations as design direction only.

---

## 2. Required Site Architecture

Implement a responsive single-page experience with the following content order:

### A. Header

Create a compact editorial header containing:

- Project/brand wordmark from the current project.
- Centered status/gesture indicator.
- Secondary action such as a call/meeting link when present in the current project content.
- Primary contact CTA.

Requirements:

- Header remains visually light and unobtrusive.
- Use rounded controls.
- Preserve the project's actual brand identity.
- Do not reproduce the reference wordmark or branding.

### B. Hero / Opening Statement

Create an oversized introductory statement using the **current project's existing headline and supporting content**.

Interaction direction:

- Headline should enter progressively rather than appearing as a static block.
- Use large-scale typography and generous vertical spacing.
- Add one original abstract graphic/line motif related to the project's identity.
- The graphic should not reproduce the reference site's exact asterisk/star/arrow artwork.

The hero should immediately communicate:

1. Who the studio/company is.
2. What it creates.
3. Why the visitor should continue scrolling.

### C. Services / Capabilities

Retain the project's existing service names and descriptions.

Present services as an interactive editorial system rather than a generic 3-column card grid.

Suggested behavior:

- Service list on one axis.
- Selected service expands into a larger content area.
- Associated visual changes when the active service changes.
- Progress/status indicator can be used, but should have a different visual treatment from the reference.
- Keyboard and touch interaction must work.

Use the project's existing service copy verbatim where it is already written.

### D. Featured Case Study

The recording contains a case-study treatment for a product called **Miro**. Preserve the project's existing case-study content rather than replacing it with reference copy.

Required fields:

- Case-study label/category.
- Project/client name.
- Short project descriptor.
- Existing project narrative.
- Existing CTA/link.
- Existing project image(s)/screenshots if legally owned/licensed.

Visual direction:

- Use one dominant rounded media composition.
- Separate metadata from narrative.
- Allow the image/media to move slightly during scroll.
- Keep generous negative space.
- Avoid reproducing the reference section's exact measurements, alignment, or artwork.

### E. Team / People

Preserve the project's current team content.

For every person already included in the project, preserve:

- Name.
- Role.
- Existing biography.
- Existing portrait/image.
- Existing website/social link where applicable.

Layout direction:

- Use an editorial horizontal or staggered arrangement.
- Give each portrait a large visual footprint.
- Use subtle motion on hover/scroll.
- Avoid copying the reference site's exact three-card arrangement.

### F. Closing CTA / Contact

Create the closing contact section using the project's current:

- Headline.
- Introductory copy.
- Email.
- Phone, if present.
- Form fields.
- Submission CTA.

Visual direction:

- Dark high-contrast section.
- Large statement typography.
- Original abstract graphic system.
- Contact form integrated into the composition rather than presented as a generic form card.
- Large rounded container or curved boundary is acceptable, but do not reproduce the exact reference geometry.

---

## 3. Preserve Existing Project Content

This requirement has priority over placeholder content.

Before changing copy, inspect the current source/project and preserve all content that has already been added by the project owner.

Preserve where present:

- Brand name
- Headlines
- Subheadlines
- Service names
- Service descriptions
- Case-study names
- Case-study descriptions
- Team names
- Team biographies
- Contact details
- External links
- Existing image assets

Do **not** overwrite current project copy with generic marketing text.

Do **not** invent replacement copy merely to make the implementation easier.

---

## 4. Originalization Requirements

The implementation should be visibly independent from the reference.

Change at least these systems:

### Typography

- Use the project's chosen fonts or a different licensed font pairing.
- Create a new type scale.
- Do not match the reference font sizes line-for-line.

### Layout

- Recompose the section grids.
- Change column relationships.
- Change the vertical rhythm.
- Do not reproduce exact spacing values from the recording.

### Color

- Use the project's own palette.
- Do not simply reproduce the reference's neutral + black palette.
- Dark contact section may remain conceptually, but use the project's color system.

### Shape Language

- Keep rounded interfaces only where they fit the new brand.
- Create original border-radius, framing, and container relationships.

### Motion

Retain the general principle of a cinematic interactive site, but implement original motion behavior.

Possible system:

- Hero text reveals by line/block.
- Service content crossfades with vertical movement.
- Case-study media has independent scroll depth.
- Team portraits shift subtly according to scroll velocity.
- Closing CTA elements draw into position as the section enters the viewport.

Do not copy animation timings frame-for-frame.

### Graphics

Create a new graphic language from the project's own identity.

Use:

- Abstract paths.
- Custom geometric marks.
- Simple SVG shapes.
- Project-specific symbols.

Do not trace or recreate distinctive reference artwork.

---

## 5. Navigation Behavior

Use a persistent navigation system inspired by the concept of the recording but implemented independently.

Suggested structure:

`Overview / Services / Work / Studio / Contact`

Behavior:

- Floating navigation on desktop.
- Compact sticky navigation on mobile.
- Active section indicator updates while scrolling.
- Clicking a navigation item smoothly scrolls to the section.
- Current section remains visually obvious.

---

## 6. Responsive Behavior

### Desktop

- Large editorial compositions.
- Wide content areas.
- Large display headings.
- Scroll-linked motion.
- Floating navigation.

### Tablet

- Reduce oversized typography.
- Collapse complex multi-column compositions when necessary.
- Preserve motion without creating excessive horizontal overflow.

### Mobile

- Single-column content flow.
- Navigation becomes compact.
- Disable or simplify heavy scroll effects when they harm usability.
- Keep every CTA and form easily reachable.
- Images must remain visually dominant without causing layout shifts.

---

## 7. Technical Implementation

Use the existing project's framework and build system unless there is a concrete reason to change it.

Recommended implementation principles:

- Componentize each major section.
- Keep content/data separate from presentation where practical.
- Use reusable motion primitives.
- Prefer CSS transforms and opacity for performant animation.
- Avoid layout-triggering animations when possible.
- Respect `prefers-reduced-motion`.
- Lazy-load below-the-fold media.
- Prevent cumulative layout shift by reserving media dimensions.
- Ensure keyboard navigation works.
- Use semantic HTML.
- Keep interactive controls accessible.

Suggested component structure:

```text
src/
  components/
    Header
    SectionNav
    Hero
    Services
    CaseStudy
    Team
    Contact
    Motion/
  data/
    content
    services
    cases
    team
  styles/
    tokens
    global
    typography
```

---

## 8. Motion System

Define a consistent motion language instead of adding random animations.

Example categories:

```text
ENTER
- fade + translate
- clip reveal

HOVER
- subtle scale
- underline/indicator movement

SCROLL
- parallax within a controlled range
- section progress
- image depth shift

TRANSITION
- short crossfade
- directional content replacement
```

Keep movement subtle enough that the content remains usable.

---

## 9. Visual Quality Checklist

Before considering the reconstruction complete:

- The first viewport establishes a strong visual identity immediately.
- Typography is consistent throughout.
- The spacing system feels deliberate rather than template-generated.
- Every section has a clear hierarchy.
- Motion supports the composition rather than distracting from it.
- No element overlaps accidentally at intermediate widths.
- Mobile does not look like a shrunk desktop.
- Existing project copy is preserved.
- Existing project assets are not replaced without reason.
- The resulting implementation has its own typography, composition, graphic language, and motion behavior.

---

## 10. Build Priority

Implement in this order:

1. Existing content/data integration.
2. Global design tokens.
3. Header + section navigation.
4. Hero.
5. Services interaction.
6. Case study.
7. Team.
8. Contact section.
9. Responsive adaptation.
10. Motion polish.
11. Performance/accessibility pass.

Do not spend time polishing animation before the underlying content hierarchy and layout are correct.

---

## 11. Final Instruction to the Implementer

Treat the screen recording as a **reference for information architecture, pacing, editorial minimalism, and interaction quality**.

Treat the current project source as the **source of truth for all existing content**.

The final website must feel like a new design built from the same class of creative-web principles, not a renamed/personalized copy of the reference.
