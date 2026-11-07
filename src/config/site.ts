/**
 * LEOVAN — single source of truth for every piece of content on the site.
 * Edit this file to change profile data, projects, tech stack or contact links.
 */
import {
  siHtml5, siCss, siJavascript, siTypescript, siPython, siOpenjdk, siKotlin, siPhp,
  siC, siCplusplus, siGo, siRust, siDart, siSwift, siReact, siNextdotjs, siVite,
  siTailwindcss, siBootstrap, siSass, siNodedotjs, siExpress, siLaravel, siFastapi,
  siMysql, siPostgresql, siMongodb, siFirebase, siSupabase, siRedis, siGit, siGithub,
  siAndroidstudio, siVercel, siNetlify, siCloudflare, siFigma, siWhatsapp,
} from "simple-icons";

export type BrandIcon = { title: string; path: string; hex: string };

export const profile = {
  name: "LEOVAN",
  knownAs: "Mohammad Sofandi",
  age: 14,
  status: "DEV",
  focus: "APP & WEB",
  location: "Sukagumiwang, Indramayu, Jawa Barat, Indonesia",
  locationShort: "SUKAGUMIWANG, INDONESIA",
  identity: "Independent Web & App Developer",
  tagline: "CREATING BEYOND THE SCREEN.",
  secondaryTagline: "FROM CURIOSITY TO CREATION.",
  characterImage: "/assets/aistudio/Picsart_26-11-07_12-37-25-519_7283776c.png",
  domain: "leovankt.web.id",
  siteUrl: "https://leovankt.web.id",
  game: "Mobile Legends: Bang Bang",
  rank: "IMMORTAL",
  favoriteFood: "MIE AYAM",
  favoriteDrink: "ES TEH",
  favoriteCharacter: "SPIDER-MAN",
};

export const sections = [
  { id: "home", label: "HOME", code: "00" },
  { id: "about", label: "ABOUT", code: "01" },
  { id: "tech", label: "TECH STACK", code: "02" },
  { id: "projects", label: "PROJECTS", code: "03" },
  { id: "achievements", label: "ACHIEVEMENTS", code: "04" },
  { id: "personality", label: "OFF THE GRID", code: "05", hiddenInNav: true },
  { id: "contact", label: "CONTACT", code: "06" },
] as const;

export type SectionId = (typeof sections)[number]["id"];

/* ------------------------------------------------------------------ */
/* CONTACT CONFIGURATION                                               */
/* Only real, verified channels. Add a new entry to `socials` to show  */
/* another button — entries that are not listed are never rendered.    */
/* ------------------------------------------------------------------ */
export const contact = {
  email: "vannn626@gmail.com",
  socials: [
    {
      id: "github",
      label: "GITHUB",
      action: "LIHAT PROFIL",
      handle: "vannn626-afk",
      url: "https://github.com/vannn626-afk",
      icon: siGithub as BrandIcon,
    },
    {
      id: "whatsapp",
      label: "WHATSAPP CHANNEL",
      action: "JOIN MY CHANNEL",
      handle: "LEOVAN Channel",
      url: "https://whatsapp.com/channel/0029VbEFmPM6buMLQgdlie1J",
      icon: siWhatsapp as BrandIcon,
    },
  ],
};

export const projects = [
  {
    number: "01",
    name: "LEOVAN | TOOLS",
    codename: "TOOLS",
    category: "WEB / DIGITAL TOOLS",
    description:
      "Platform digital tools yang menghadirkan React Tools, AM Premium, dan Preset Finder dalam satu tempat.",
    features: ["React Tools", "AM Premium", "Preset Finder"],
    url: "https://leovan.my.id",
    domain: "leovan.my.id",
  },
  {
    number: "02",
    name: "LEOVAN | AI",
    codename: "AI",
    category: "AI / WEB APPLICATION",
    description:
      "Platform AI untuk membantu pengguna memahami berbagai pertanyaan, menemukan informasi, dan mencari solusi.",
    features: ["Tanya Jawab", "Pencarian Informasi", "Cari Solusi"],
    url: "https://leovandyz.web.id",
    domain: "leovandyz.web.id",
  },
];

/* ------------------------------------------------------------------ */
/* TECH ARSENAL                                                         */
/* `icon` = official Simple Icons brand mark. `fallback` = Lucide icon  */
/* name, used where the brand is not published by Simple Icons.         */
/* ------------------------------------------------------------------ */
export type Tech = {
  name: string;
  note: string;
  icon?: BrandIcon;
  fallback?: "csharp" | "sql" | "vscode" | "api";
};

export type TechCategory = { id: string; label: string; short: string; items: Tech[] };

export const techCategories: TechCategory[] = [
  {
    id: "lang",
    label: "PROGRAMMING LANGUAGES",
    short: "LANG",
    items: [
      { name: "HTML5", icon: siHtml5, note: "Struktur halaman web" },
      { name: "CSS3", icon: siCss, note: "Styling & layout" },
      { name: "JavaScript", icon: siJavascript, note: "Bahasa utama web" },
      { name: "TypeScript", icon: siTypescript, note: "JavaScript dengan tipe" },
      { name: "Python", icon: siPython, note: "Scripting & backend" },
      { name: "Java", icon: siOpenjdk, note: "OOP & Android klasik" },
      { name: "Kotlin", icon: siKotlin, note: "Android modern" },
      { name: "PHP", icon: siPhp, note: "Server-side web" },
      { name: "C", icon: siC, note: "Dasar pemrograman sistem" },
      { name: "C++", icon: siCplusplus, note: "Performa & algoritma" },
      { name: "C#", fallback: "csharp", note: "Ekosistem .NET" },
      { name: "Go", icon: siGo, note: "Service yang ringan" },
      { name: "Rust", icon: siRust, note: "Aman & cepat" },
      { name: "Dart", icon: siDart, note: "Bahasa di balik Flutter" },
      { name: "Swift", icon: siSwift, note: "Ekosistem Apple" },
      { name: "SQL", fallback: "sql", note: "Query database" },
    ],
  },
  {
    id: "frontend",
    label: "FRONTEND",
    short: "FRONT",
    items: [
      { name: "React", icon: siReact, note: "Library UI berbasis komponen" },
      { name: "Next.js", icon: siNextdotjs, note: "Framework React full-stack" },
      { name: "Vite", icon: siVite, note: "Build tool super cepat" },
      { name: "Tailwind CSS", icon: siTailwindcss, note: "Utility-first CSS" },
      { name: "Bootstrap", icon: siBootstrap, note: "Komponen UI siap pakai" },
      { name: "Sass", icon: siSass, note: "CSS dengan superpower" },
    ],
  },
  {
    id: "backend",
    label: "BACKEND",
    short: "BACK",
    items: [
      { name: "Node.js", icon: siNodedotjs, note: "JavaScript di server" },
      { name: "Express.js", icon: siExpress, note: "Server HTTP minimalis" },
      { name: "Laravel", icon: siLaravel, note: "Framework PHP" },
      { name: "FastAPI", icon: siFastapi, note: "API Python modern" },
      { name: "REST API", fallback: "api", note: "Arsitektur komunikasi data" },
    ],
  },
  {
    id: "database",
    label: "DATABASE",
    short: "DATA",
    items: [
      { name: "MySQL", icon: siMysql, note: "Database relasional" },
      { name: "PostgreSQL", icon: siPostgresql, note: "Relasional tingkat lanjut" },
      { name: "MongoDB", icon: siMongodb, note: "Database dokumen" },
      { name: "Firebase", icon: siFirebase, note: "Backend-as-a-service" },
      { name: "Supabase", icon: siSupabase, note: "Postgres + auth" },
      { name: "Redis", icon: siRedis, note: "Cache in-memory" },
    ],
  },
  {
    id: "tools",
    label: "TOOLS",
    short: "TOOLS",
    items: [
      { name: "Git", icon: siGit, note: "Version control" },
      { name: "GitHub", icon: siGithub, note: "Hosting kode" },
      { name: "VS Code", fallback: "vscode", note: "Code editor utama" },
      { name: "Android Studio", icon: siAndroidstudio, note: "IDE aplikasi Android" },
      { name: "Vercel", icon: siVercel, note: "Deploy frontend" },
      { name: "Netlify", icon: siNetlify, note: "Deploy & hosting" },
      { name: "Cloudflare", icon: siCloudflare, note: "DNS & edge" },
      { name: "Figma", icon: siFigma, note: "Desain UI" },
    ],
  },
];

/** Logos shown on the rotating 3D arsenal carousel inside the WebGL scene. */
export const carouselIcons: BrandIcon[] = [
  siReact, siTypescript, siJavascript, siNodedotjs, siTailwindcss, siVite,
  siPython, siKotlin, siNextdotjs, siFirebase, siGit, siFigma,
];
