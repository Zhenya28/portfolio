"use client";

import {
  siExpo,
  siGit,
  siGithubactions,
  siGoogleads,
  siGoogleanalytics,
  siGooglegemini,
  siGooglesearchconsole,
  siGoogletagmanager,
  siMeta,
  siNextdotjs,
  siNodedotjs,
  siPostgresql,
  siPrisma,
  siPython,
  siReact,
  siStripe,
  siSupabase,
  siTailwindcss,
  siTelegram,
  siTypescript,
  siVercel,
  siVite,
} from "simple-icons";
import { motion, useReducedMotion } from "motion/react";
import { Reveal, SectionHead } from "./Reveal";
import { useDict } from "./LocaleProvider";

const EASE = [0.22, 1, 0.36, 1] as const;

type Brand = { path: string; hex: string };

/* Playwright isn't in simple-icons (brand policy) — minimal custom mark in its green */
const playwright: Brand = {
  hex: "2EAD33",
  path: "M12 1.8C6.4 1.8 1.8 6.4 1.8 12S6.4 22.2 12 22.2 22.2 17.6 22.2 12 17.6 1.8 12 1.8zm0 2c4.5 0 8.2 3.7 8.2 8.2s-3.7 8.2-8.2 8.2S3.8 16.5 3.8 12 7.5 3.8 12 3.8zM8.6 9.2a1.3 1.3 0 100 2.6 1.3 1.3 0 000-2.6zm6.8 0a1.3 1.3 0 100 2.6 1.3 1.3 0 000-2.6zM7.8 14.2c.9 1.7 2.4 2.8 4.2 2.8s3.3-1.1 4.2-2.8l-1.6-.8c-.6 1.1-1.5 1.8-2.6 1.8s-2-.7-2.6-1.8l-1.6.8z",
};

const BRANDS: Record<string, Brand> = {
  React: siReact,
  "Next.js": siNextdotjs,
  "React Native": siReact,
  TypeScript: siTypescript,
  "Tailwind CSS": siTailwindcss,
  Vite: siVite,
  Expo: siExpo,
  "Node.js": siNodedotjs,
  Python: siPython,
  PostgreSQL: siPostgresql,
  Supabase: siSupabase,
  Prisma: siPrisma,
  Stripe: siStripe,
  Vercel: siVercel,
  Playwright: playwright,
  "GitHub Actions": siGithubactions,
  "Telegram Bot API": siTelegram,
  "Google Gemini": siGooglegemini,
  Git: siGit,
  "Google Ads": siGoogleads,
  "Meta Ads": siMeta,
  "Google Analytics": siGoogleanalytics,
  "Search Console": siGooglesearchconsole,
  "Tag Manager": siGoogletagmanager,
};

/* dark brand colors disappear on a dark background — lift them to text color */
function brandColor(hex: string): string {
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return luminance < 0.22 ? "#e8edf2" : `#${hex}`;
}

function TechChip({ name, index }: { name: string; index: number }) {
  const reduced = useReducedMotion();
  const brand = BRANDS[name];
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: EASE, delay: index * 0.04 }}
      className="flex items-center gap-2.5 rounded-full bg-panel-2 px-4 py-2.5 transition-transform duration-300 hover:-translate-y-0.5"
    >
      {brand ? (
        <svg viewBox="0 0 24 24" className="size-[18px] shrink-0" fill={brandColor(brand.hex)} aria-hidden>
          <path d={brand.path} />
        </svg>
      ) : (
        <span className="size-[18px] shrink-0 rounded bg-(--line-strong)" />
      )}
      <span className="text-[0.875rem] font-semibold">{name}</span>
    </motion.div>
  );
}

export function Toolkit() {
  const dict = useDict();
  const t = dict.toolkit;

  return (
    <section id="toolkit" className="section-pad pt-[clamp(72px,12vh,140px)]">
      <SectionHead title={t.title} />

      {/* ledger bands: label column left, icon pills right, hairlines between rows */}
      <div className="border-b hairline">
        {t.groups.map((col, colIndex) => (
          <Reveal key={col.group} delay={colIndex * 0.06}>
            <div className="grid gap-y-4 border-t py-8 hairline md:grid-cols-[minmax(0,32%)_1fr] md:gap-x-12 md:py-10">
              <div>
                <span className="mono text-[0.6875rem] uppercase tracking-[0.1em] text-signal">
                  {"//"} {col.group}
                </span>
                <p className="mt-2.5 max-w-[34ch] text-[0.9375rem] text-muted">{col.desc}</p>
              </div>
              <div className="flex flex-wrap content-start items-start gap-2.5">
                {col.items.map((item, itemIndex) => (
                  <TechChip key={item} name={item} index={itemIndex} />
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
