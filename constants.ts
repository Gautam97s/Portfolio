import { Project, ExperienceItem, Skill } from './types';

export const SITE_META = {
  name: "Gautam Sharma",
  role: "multidisciplinary creative frontend engineer",
  tagline: "I design online experiences which are clean, swift and purposeful.",
  email: "sharma.gautam0905@gmail.com",
  socials: {
    github: "https://github.com/Gautam97s",
    twitter: "https://x.com/Gautamsharma905",
    linkedin: "https://www.linkedin.com/in/gautam-sharma-5187b027a/",
  }
};

export const PROJECTS: Project[] = [
  {
    id: 1,
    title: "IGNIS AI",
    description: "A full-stack computer vision system that detects fire and smoke using YOLO, FastAPI, and a modern React dashboard",
    tags: ["React", "YOLO", "Tailwind", "OpenCv"],
    image: "/images/IGNIS_AI.png",
    link: "https://github.com/Gautam97s/IGNIS-AI",
    github: "https://github.com/Gautam97s/IGNIS-AI"
  },
  {
    id: 2,
    title: "TheStore",
    description: "TheStore — a fast, secure Next.js cloud drive where you can save files effortlessly, backed by a simple OTP modal for quick and safe access.",
    tags: ["TypeScript", "Next.ts", "Appwrite", "Tailwind"],
    image: "/images/Thestore.png",
    link: "https://the-store-theta.vercel.app/",
    github: "https://github.com/Gautam97s/TheStore"
  },
  {
    id: 3,
    title: "Zen Task",
    description: "A minimal task management app focusing on accessibility and keyboard navigation, built with a mobile-first approach.",
    tags: ["Next.js", "Framer Motion", "Radix UI"],
    image: "https://picsum.photos/800/600?random=3",
    link: "#",
    github: "#"
  },
  {
    id: 4,
    title: "Crypto Watch",
    description: "Cryptocurrency tracker with live price updates, historical charting, and portfolio management features.",
    tags: ["React", "Chart.js", "CoinGecko API"],
    image: "https://picsum.photos/800/600?random=4",
    link: "#",
    github: "#"
  },
  {
    id: 5,
    title: "Vibes Music",
    description: "A conceptual music streaming interface with spatial audio visualizations and collaborative playlists.",
    tags: ["Vue.js", "Three.js", "Web Audio API"],
    image: "https://picsum.photos/800/600?random=5",
    link: "#",
    github: "#"
  },
  {
    id: 6,
    title: "Botanica",
    description: "E-commerce platform for rare indoor plants featuring AR placement preview and detailed care guides.",
    tags: ["Shopify", "React", "WebXR"],
    image: "https://picsum.photos/800/600?random=6",
    link: "#",
    github: "#"
  },
  {
    id: 7,
    title: "Pixel Editor",
    description: "Browser-based image manipulation tool with layer support, filters, and export capabilities.",
    tags: ["Canvas API", "WebAssembly", "Rust"],
    image: "https://picsum.photos/800/600?random=7",
    link: "#",
    github: "#"
  },
  {
    id: 8,
    title: "Nomad Stay",
    description: "Booking platform for digital nomads offering curated stays with verified internet speeds.",
    tags: ["Next.js", "Supabase", "Stripe"],
    image: "https://picsum.photos/800/600?random=8",
    link: "#",
    github: "#"
  },
  {
    id: 9,
    title: "Nomad Stay",
    description: "Booking platform for digital nomads offering curated stays with verified internet speeds.",
    tags: ["Next.js", "Supabase", "Stripe"],
    image: "https://picsum.photos/800/600?random=8",
    link: "#",
    github: "#"
  }
];

export const EXPERIENCE: ExperienceItem[] = [
  {
    id: 1,
    year: "2023 - Present",
    role: "Student Frontend Engineer",
    company: "TF",
    description: "loading..."
  },
  {
    id: 2,
    year: "2021 - 2023",
    role: "Frontend Developer",
    company: "Creative Agency",
    description: "loading..."
  },
  {
    id: 3,
    year: "2019 - 2021",
    role: "student",
    company: "StartUp Lab",
    description: "loading..."
  }
];

export const SKILLS: Skill[] = [
  { name: "React.js", category: "frontend" },
  { name: "Javascript", category: "frontend" },
  { name: "Tailwind CSS", category: "frontend" },
  { name: "GSAP", category: "frontend" },
  { name: "Node.js", category: "backend" },
  { name: "Express.js", category: "backend" },
  { name: "PostgreSQL", category: "backend" },
  { name: "Figma", category: "tools" },
  { name: "Git", category: "tools" },
  { name: "Tensorflow", category: "Machine Learning" },
  { name: "Ultralytics", category: "Machine Learning" },
  { name: "Pytorch", category: "Machine Learning" },
];