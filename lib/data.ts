export const SITE = {
  name: "Yevhen Kapush",
  role: "Freelance Developer · Web & Mobile Apps · Automation",
  location: "Warsaw, Poland",
  email: "jeka.kapush@gmail.com",
  github: "https://github.com/Zhenya28",
  linkedin: "https://www.linkedin.com/", // TODO: real profile URL
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://yevhenkapush.vercel.app",
};

export type Project = {
  no: string;
  path: string;
  title: string;
  kind: string;
  description: string;
  stack: string[];
  metrics: string[];
  href: string;
};

export const PROJECTS: Project[] = [
  {
    no: "01",
    path: "~/projekty/flashly",
    title: "Flashly",
    kind: "Mobilna aplikacja do nauki",
    description:
      "Aplikacja do fiszek oparta o algorytm powtórek SM-2 — ta sama matematyka, co w Anki, przepisana natywnie na mobile. Kolekcje, śledzenie postępów i statystyki sesji, z synchronizacją przez Supabase.",
    stack: ["react-native", "expo", "typescript", "supabase"],
    metrics: ["algorytm SM-2", "offline-first", "praca inżynierska"],
    href: "https://github.com/Zhenya28",
  },
  {
    no: "02",
    path: "~/projekty/myfinance",
    title: "MyFinance",
    kind: "Finanse osobiste (PWA)",
    description:
      "Dashboard finansowy, który importuje wyciągi CSV z mBanku, kategoryzuje transakcje przez Gemini API i śledzi ETF-y oraz waluty z Yahoo Finance — wszystko na interaktywnych wykresach. Powstał, bo arkusze przestały wystarczać.",
    stack: ["next.js", "typescript", "prisma", "postgresql", "recharts", "gemini-api"],
    metrics: ["kategoryzacja AI", "import CSV", "śledzenie ETF i walut"],
    href: "https://github.com/Zhenya28",
  },
  {
    no: "03",
    path: "~/projekty/pyszne-slots-monitor",
    title: "Pyszne.pl Slot Monitor",
    kind: "Bot automatyzujący (Telegram)",
    description:
      "Bot, który w czasie rzeczywistym pilnuje dostępności zmian w dostawach jedzenia, wysyła alert na Telegramie, gdy slot się pojawi, i sam akceptuje te preferowane. Działa bez nadzoru na 5-minutowym cronie w GitHub Actions — zero serwerów, zero kosztów.",
    stack: ["python", "playwright", "github-actions", "telegram-bot-api"],
    metrics: ["cron */5", "działa na produkcji", "zero kosztów infra"],
    href: "https://github.com/Zhenya28/pyszne-slots-monitor",
  },
];

export const LANGUAGES = [
  { code: "uk-UA", name: "ukraiński", level: "ojczysty", value: 1 },
  { code: "ru-RU", name: "rosyjski", level: "ojczysty", value: 1 },
  { code: "pl-PL", name: "polski", level: "C1", value: 0.85 },
  { code: "en-GB", name: "angielski", level: "B2/C1", value: 0.75 },
];

export const TOOLKIT: { group: string; items: { name: string; level: number }[] }[] = [
  {
    group: "frontend",
    items: [
      { name: "React", level: 0.95 },
      { name: "TypeScript", level: 0.95 },
      { name: "React Native", level: 0.85 },
      { name: "Next.js", level: 0.85 },
      { name: "Tailwind CSS", level: 0.8 },
      { name: "Vite", level: 0.75 },
    ],
  },
  {
    group: "backend i dane",
    items: [
      { name: "Python", level: 0.95 },
      { name: "Node.js", level: 0.85 },
      { name: "PostgreSQL", level: 0.8 },
      { name: "Supabase", level: 0.8 },
      { name: "Prisma", level: 0.75 },
    ],
  },
  {
    group: "automatyzacja i ops",
    items: [
      { name: "Playwright", level: 0.95 },
      { name: "GitHub Actions", level: 0.95 },
      { name: "Telegram Bot API", level: 0.9 },
      { name: "Git", level: 0.9 },
      { name: "Expo", level: 0.8 },
    ],
  },
];
