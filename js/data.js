/* ==========================================================================
   data.js — all site content and configuration.
   Edit text, projects, pricing and the Cal.com link here; no other file
   needs to change for content updates.
   ========================================================================== */

const SITE = {
  name: 'ARCEAUS',
  email: 'hello@arceaus.com',

  /* Cal.com booking used by the Contact page.
     `link` is "<your-cal-username>/<event-type-slug>". */
  cal: {
    link: 'arceaus-studios-30mvqy/15min',
    namespace: 'arceaus',
    origin: 'https://app.cal.com',
    brandColor: '#222222',
    layout: 'month_view', // "month_view" | "week_view" | "column_view"
  },
};

const PROJECTS = [
  {
    slug: 'ad-enterprise',
    title: 'AD-Enterprise',
    category: 'Enterprise',
    year: "'22",
    color: '#d3d6e6',
    url: 'https://ad-enterprise.framer.website',
    description: 'A website for an enterprise brand, designed and built by ARCEAUS.',
    images: [
      'projects/AD-enterprise/head.webp',
      'projects/AD-enterprise/Screenshot%202026-09-27%20162958.webp',
      'projects/AD-enterprise/Screenshot%202026-09-27%20163243.webp',
      'projects/AD-enterprise/Screenshot%202026-09-27%20163316.webp',
      'projects/AD-enterprise/Screenshot%202026-09-27%20163417.webp',
    ],
  },
  {
    slug: 'nekro-ai',
    title: 'Nekro AI',
    category: 'AI Assistant',
    year: "'26",
    color: '#dcdcc8',
    url: 'https://nekro-site.vercel.app',
    description: 'A site and interface for an AI assistant product.',
    images: [
      'projects/Nekro/head.webp',
      'projects/Nekro/Screenshot%202026-09-27%20163627.webp',
      'projects/Nekro/Screenshot%202026-09-27%20163828.webp',
      'projects/Nekro/Screenshot%202026-09-27%20163909.webp',
      'projects/Nekro/Screenshot%202026-09-27%20164013.webp',
    ],
  },
  {
    slug: 'wrappdelights',
    title: 'Wrappdelights',
    category: 'B2B Bulk gifting',
    year: "'26",
    color: '#c2b0b5',
    url: '',
    description: 'A web presence for a B2B bulk gifting business.',
    images: [
      'projects/Wrappdelights/head.webp',
      'projects/Wrappdelights/Screenshot%202026-09-27%20164140.webp',
      'projects/Wrappdelights/Screenshot%202026-09-27%20170329.webp',
      'projects/Wrappdelights/Screenshot%202026-09-27%20170406.webp',
      'projects/Wrappdelights/Screenshot%202026-09-27%20170508.webp',
    ],
  },
  {
    slug: 'monotone',
    title: 'Monotone',
    category: 'Figma Designs',
    year: "'24",
    color: '#d9d3ea',
    url: '',
    description: 'A set of Figma designs, from interface to prototype.',
    images: [
      'projects/Monotone/head.webp',
      'projects/Monotone/Screenshot%202026-09-27%20170705.webp',
    ],
  },
  {
    slug: 'theblackrat',
    title: 'TheBlackRat',
    category: 'Creative Studio',
    year: "'26",
    color: '#e3d0d2',
    url: '',
    description: 'A website for a creative studio.',
    images: [
      'projects/Creative%20studio/head.webp',
      'projects/Creative%20studio/Screenshot%202026-09-27%20171606.webp',
    ],
  },
  {
    slug: 'blackrat',
    title: 'Blackrat',
    category: 'Creative interactive',
    year: "'23",
    color: '#cfd8d3',
    url: '',
    description: 'An interactive, creative web experience.',
    images: [
      'projects/Blackrat/head.webp',
      'projects/Blackrat/Screenshot%202026-09-27%20171803.webp',
      'projects/Blackrat/Screenshot%202026-09-27%20172445.webp',
    ],
  },
];

const PRICING = [
  {
    name: 'Basic',
    price: '$200',
    tagline: 'For focused visual direction',
    includes: ['Custom visual design', 'Responsive layouts', 'Design handoff'],
  },
  {
    name: 'Pro',
    price: '$500',
    tagline: 'For design and development',
    featured: true,
    includes: ['Complete visual design', 'Responsive development', 'Interaction and polish'],
  },
  {
    name: 'Complete',
    price: '$800',
    tagline: 'For a complete digital launch',
    includes: ['Design and development', 'SEO and deployment', 'Creative direction'],
  },
];

const SERVICES = [
  {
    title: '1. Brand Identity',
    text: 'Creating distinctive visual identities that give your brand a clear and recognizable presence — from logos and typography to color systems and brand guidelines.',
  },
  {
    title: '2. Web Design',
    text: 'Designing refined, intuitive websites that balance visual impact, usability, and brand personality — from landing pages and portfolios to complete digital experiences.',
  },
  {
    title: '3. Web Development',
    text: 'Turning designs into fast, responsive, and reliable websites using modern technologies, with clean interactions and smooth performance across every device.',
  },
  {
    title: '4. Creative Development',
    text: 'Building digital experiences beyond standard websites — including interactive interfaces, animations, custom components, and immersive web experiences tailored to your brand.',
  },
];

/* Images shown in the cursor-following preview when hovering a service row (matched by index). */
const SERVICE_PREVIEWS = [
  { color: '#c2b0b5', image: 'projects/AD-enterprise/head.webp' },
  { color: '#b9ae8f', image: 'projects/Monotone/head.webp' },
  { color: '#9fb0bd', image: 'projects/Nekro/head.webp' },
  { color: '#a8b89c', image: 'projects/Blackrat/head.webp' },
];

const STACK = [
  { name: 'Framer', text: 'No-code web design.' },
  { name: 'Figma', text: 'UI/UX design & prototyping.' },
  { name: 'React', text: 'Interactive front-end development.' },
  { name: 'Next.js', text: 'Production-grade web applications.' },
  { name: 'GSAP', text: 'Advanced animations & interactions.' },
  { name: 'Spline', text: '3D design' },
];

const EXPERIENCE = [
  {
    role: 'Freelance Digital Designer & Photographer',
    place: 'France & International',
    period: "'13 - present",
    text: 'Working with brands, agencies, and creatives to craft visual identities, design engaging websites, and capture photography that tells authentic stories. Projects range from brand launches to editorial campaigns.',
  },
  {
    role: 'Senior Digital Designer',
    place: 'Creative Agency, Paris',
    period: "'16 - 2018",
    text: 'Led design projects for lifestyle, fashion, and cultural brands. Oversaw concept development, UI/UX design, and visual direction while collaborating closely with copywriters, developers, and photographers.',
  },
  {
    role: 'Graphic Designer & Photographer',
    place: 'Boutique Studio, Lyon',
    period: "'14 - 2016",
    text: 'Created branding, print materials, and social media visuals for small to mid-sized businesses. Handled in-house photography for campaigns, products, and brand content.',
  },
  {
    role: 'Junior Designer',
    place: 'Design Studio, Marseille',
    period: "'13 - 2014",
    text: 'Assisted in the creation of brand assets, editorial layouts, and basic web designs. Supported senior designers and contributed to photography shoots, gaining hands-on experience in multidisciplinary creative work.',
  },
];

const FAQ = [
  {
    question: 'What services does ARCEAUS offer?',
    answer: 'Brand identity, web design, web development and creative development — from logos and design systems to fast, animated websites and custom interactive experiences.',
  },
  {
    question: 'Do you work with international clients?',
    answer: "Yes. We're based in India and work with brands and teams around the world, with calls and updates handled online.",
  },
  {
    question: 'How does the project process work?',
    answer: 'We start with a call to understand your goals, then move through design, development and launch, sharing progress along the way.',
  },
  {
    question: 'Can you handle both design and development?',
    answer: 'Yes. Design and build happen in one team, so what is designed is what gets shipped.',
  },
  {
    question: 'How is your pricing determined?',
    answer: 'Pricing depends on scope, timeline and complexity. Book a call and we will share a clear quote.',
  },
  {
    question: 'Do you take on smaller or one-off projects?',
    answer: 'Yes. We take on one-off work such as a landing page or a brand refresh as well as larger builds.',
  },
];
