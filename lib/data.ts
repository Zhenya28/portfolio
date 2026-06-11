export const SITE = {
  name: "Yevhen Kapush",
  role: "Freelance Developer · Web & Mobile Apps · Automation",
  location: "Warszawa, Polska",
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
  tag: string;
  problem: string;
  built: string;
  result: string;
  stack: string[];
  href: string;
};

export const PROJECTS: Project[] = [
  {
    no: "01",
    path: "~/projekty/flashly",
    title: "Flashly",
    kind: "Aplikacja mobilna do nauki",
    tag: "aplikacja mobilna",
    problem:
      "Nauka do egzaminów pożera godziny, a zwykłe fiszki nie wiedzą, kiedy powtórka ma sens — powtarzasz albo za często, albo za późno.",
    built:
      "Mobilna aplikacja z algorytmem powtórek SM-2 (ta sama matematyka, co w Anki), kolekcjami i statystykami sesji. Działa offline, synchronizuje się sama przez Supabase.",
    result: "Gotowy produkt — i obroniona na nim praca inżynierska.",
    stack: ["react-native", "expo", "typescript", "supabase"],
    href: "https://github.com/Zhenya28",
  },
  {
    no: "02",
    path: "~/projekty/myfinance",
    title: "MyFinance",
    kind: "Dashboard finansów osobistych",
    tag: "aplikacja webowa",
    problem:
      "Domowy budżet w arkuszu kalkulacyjnym: ręczne przepisywanie wyciągów, zero obrazu całości, inwestycje w osobnej karcie.",
    built:
      "PWA, która importuje wyciągi CSV z banku, AI kategoryzuje transakcje, a ETF-y i waluty aktualizują się same z Yahoo Finance — wszystko na interaktywnych wykresach.",
    result: "Pełny obraz finansów w 30 sekund zamiast godziny z arkuszem.",
    stack: ["next.js", "typescript", "prisma", "postgresql", "recharts", "gemini-api"],
    href: "https://github.com/Zhenya28",
  },
  {
    no: "03",
    path: "~/projekty/pyszne-slots-monitor",
    title: "Pyszne.pl Slot Monitor",
    kind: "Bot automatyzujący",
    tag: "automatyzacja",
    problem:
      "Najlepsze zmiany w dostawach znikały w kilka sekund — pracował ten, kto akurat siedział z telefonem w ręce i klikał szybciej.",
    built:
      "Bot, który co 5 minut sprawdza dostępność, wysyła alert na Telegramie i sam akceptuje preferowane sloty. Działa na GitHub Actions — bez serwera.",
    result: "412 uruchomień miesięcznie, 0 przegapionych slotów, 0 zł za infrastrukturę.",
    stack: ["python", "playwright", "github-actions", "telegram-bot-api"],
    href: "https://github.com/Zhenya28/pyszne-slots-monitor",
  },
];

export const PROCESS = [
  {
    no: "01",
    title: "Mówisz, co boli",
    desc: "Piszesz wiadomość — bez formalności i bez zobowiązań. W 24 godziny wracam z konkretnymi pytaniami, nie z ofertą kopiuj-wklej.",
    note: "koszt: 0 zł",
  },
  {
    no: "02",
    title: "Dostajesz plan i stałą cenę",
    desc: "Zakres, terminy i cena na piśmie, zanim powstanie pierwsza linijka kodu. Jeśli czegoś nie warto budować — usłyszysz to ode mnie wprost.",
    note: "zero niespodzianek na fakturze",
  },
  {
    no: "03",
    title: "Widzisz postępy co tydzień",
    desc: "Pokazuję działającą wersję, nie prezentację. Feedback wdrażam na bieżąco — po polsku, angielsku, ukraińsku albo rosyjsku.",
    note: "demo zamiast raportu",
  },
  {
    no: "04",
    title: "Odbierasz działający produkt",
    desc: "Wdrożony na produkcję, z dokumentacją i dostępami. Kod w 100% należy do ciebie — repo, domena, wszystko.",
    note: "bez vendor lock-in",
  },
  {
    no: "05",
    title: "Nie znikam po starcie",
    desc: "Automatyzacje monitoruję, błędy naprawiam, a kolejne pomysły… wracają do kroku 01 — już bez poznawania się od zera.",
    note: "wsparcie po wdrożeniu",
  },
];

/* Ceny "od" — kotwica do rozmowy; finalna wycena zawsze stała, w 48 h. */
export const SERVICES = [
  {
    no: "01",
    name: "Automatyzacja",
    tagline: "dla firm i ludzi, którzy tracą godziny na klikanie",
    price: "od 1 500 zł",
    time: "gotowe w 3–10 dni",
    pitch: "Bot, scraper albo integracja, która robi nudną robotę za ciebie — non stop.",
    includes: [
      "analiza procesu przed wyceną",
      "bot / skrypt działający na produkcji",
      "monitoring i alerty 24/7",
      "instrukcja obsługi po ludzku",
    ],
    featured: false,
    cta: "wyceń automatyzację",
  },
  {
    no: "02",
    name: "Aplikacja webowa / MVP",
    tagline: "dla founderów i firm, które chcą zweryfikować pomysł",
    price: "od 6 000 zł",
    time: "MVP w 2–6 tygodni",
    pitch: "Działający produkt z jedną dopracowaną ścieżką użytkownika — gotowy na prawdziwych ludzi.",
    includes: [
      "projekt interfejsu + frontend i backend",
      "wdrożenie na produkcję od pierwszego tygodnia",
      "kod gotowy do rozwoju, nie do wyrzucenia",
      "dokumentacja + 30 dni wsparcia w cenie",
    ],
    featured: true,
    cta: "wyceń swój produkt",
  },
  {
    no: "03",
    name: "Aplikacja mobilna",
    tagline: "dla biznesów, które chcą być w kieszeni klienta",
    price: "od 9 000 zł",
    time: "w sklepach w 4–8 tygodni",
    pitch: "iOS i Android z jednego kodu — szybciej i taniej niż dwa osobne zespoły.",
    includes: [
      "jedna baza kodu: iOS + Android",
      "tryb offline i synchronizacja danych",
      "publikacja w App Store i Google Play",
      "dokumentacja + 30 dni wsparcia w cenie",
    ],
    featured: false,
    cta: "wyceń aplikację",
  },
];

export const STATS = [
  { value: "3", label: "produkty na produkcji" },
  { value: "99,9%", label: "uptime automatyzacji" },
  { value: "<24h", label: "czas odpowiedzi" },
  { value: "100%", label: "kodu należy do ciebie" },
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
