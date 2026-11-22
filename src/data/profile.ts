export const profile = {
  handle: "RIDHO WAHYU DARMAWAN",
  operatorCode: "RWD-1122",
  role: "WEB DEVELOPER // SYSTEMS & SUPPORT",
  location: "BANJARMASIN, ID",
  email: "wahyuriidho@gmail.com",
  discord: "ridho7610",
  github: "https://github.com/Porterfrag",
  heroLine:
    "Web developer building school systems, internship platforms, and the IT support tooling that keeps them running.",
  bio: [
    "Ridho Wahyu Darmawan is a web developer focused on school information systems, internship management, and IT support operations. He builds practical, dependable software that turns messy real-world workflows into tools people can actually use — from tracking student internships and school data to shipping lightweight, static support sites for local businesses.",
    "His work spans typed front-end code in TypeScript, server-side systems in Laravel, relational data in MySQL, and day-to-day engineering workflow on GitHub. He cares about clean structure, fast interfaces, and software that survives contact with real users.",
  ],
  note: "I like systems that make complicated things feel simple. Most of what I build lives somewhere between a school office, a support ticket, and a browser tab — and that's exactly where I like it.",
  stats: [
    { value: "04", label: "PUBLIC REPOSITORIES" },
    { value: "02", label: "LIVE DEPLOYMENTS" },
    { value: "03", label: "CORE DOMAINS" },
    { value: "ID", label: "OPERATOR CLASS" },
  ],
};

export const sections = [
  { id: "top", code: "001", name: "RUNNER PROFILE" },
  { id: "dossier", code: "002", name: "IDENTIFICATION" },
  { id: "loadout", code: "003", name: "CAPABILITIES" },
  { id: "artifacts", code: "004", name: "SELECTED WORK" },
  { id: "channel", code: "005", name: "TRANSMISSION" },
];

export const loadout = [
  {
    id: "01",
    tag: "LANGUAGE",
    name: "TypeScript",
    detail: "Typed front-end logic and resilient interfaces that hold up under real data.",
    status: "OPERATIONAL",
    level: 94,
  },
  {
    id: "02",
    tag: "LANGUAGE",
    name: "JavaScript",
    detail: "Browser-side interactivity, DOM scripting, and the everyday glue of the web.",
    status: "OPERATIONAL",
    level: 92,
  },
  {
    id: "03",
    tag: "LANGUAGE",
    name: "Native PHP",
    detail: "Direct, dependency-light server logic for scripts, utilities, and quick fixes.",
    status: "OPERATIONAL",
    level: 89,
  },
  {
    id: "04",
    tag: "FRAMEWORK",
    name: "Laravel",
    detail: "Server-side systems, APIs, and the business rules behind school operations.",
    status: "DEPLOYED",
    level: 88,
  },
  {
    id: "05",
    tag: "DATABASE",
    name: "MySQL",
    detail: "Schema design, queries, and data integrity for records that matter.",
    status: "OPERATIONAL",
    level: 85,
  },
  {
    id: "06",
    tag: "WORKFLOW",
    name: "GitHub",
    detail: "Version control, collaboration, and a delivery loop that stays clean.",
    status: "ALWAYS ON",
    level: 91,
  },
];

export const projects = [
  {
    id: "01",
    name: "IT Support PIAN!",
    repo: "itsupportpian-",
    description:
      "A single-page, static website for a Banjarmasin IT support service. Astro + Tailwind v4, dedicated SEO service pages, and a WhatsApp-first quoting flow — no server, no database.",
    stack: ["ASTRO", "TAILWIND", "SEO"],
    status: "DEPLOYED",
    href: "https://github.com/Porterfrag/itsupportpian-",
    live: "https://itsupportpian.my.id",
  },
  {
    id: "02",
    name: "SIM PKL SMKTab v2",
    repo: "simpkl_smktab_v2",
    description:
      "Web application for managing student internship (PKL / PRakerin) activities — placement, monitoring, and reporting for a vocational school.",
    stack: ["PHP", "LARAVEL", "MYSQL"],
    status: "ACTIVE",
    href: "https://github.com/Porterfrag/simpkl_smktab_v2",
    live: null,
  },
  {
    id: "03",
    name: "Danfeed",
    repo: "danfeed",
    description:
      "A TikTok-style vertical feed for Danbooru. Swipe through photos, videos, GIFs and ugoira in a touch-first, endlessly scrolling interface.",
    stack: ["TYPESCRIPT", "FRONTEND"],
    status: "LIVE",
    href: "https://github.com/Porterfrag/danfeed",
    live: "https://danfeed.porterfrag.workers.dev/",
  },
  {
    id: "04",
    name: "Chaos on Front",
    repo: "chaos_on_front",
    description:
      "Chaos Monkey for the frontend. Randomly injects network delays, API errors, garbage responses, corrupted data, and component crashes into a React app during development.",
    stack: ["TYPESCRIPT", "REACT", "TESTING"],
    status: "EXPERIMENT",
    href: "https://github.com/Porterfrag/chaos_on_front",
    live: null,
  },
];
