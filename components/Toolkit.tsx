"use client";

import {
  siExpo,
  siGit,
  siGithubactions,
  siNextdotjs,
  siNodedotjs,
  siPostgresql,
  siPrisma,
  siPython,
  siReact,
  siSupabase,
  siTailwindcss,
  siTelegram,
  siTypescript,
  siVite,
} from "simple-icons";
import { motion, useReducedMotion } from "motion/react";
import { Reveal, SectionHead } from "./Reveal";
import { useDict } from "./LocaleProvider";

const EASE = [0.22, 1, 0.36, 1] as const;
const CELLS = 10;

type Brand = { path: string; hex: string };

/* Playwright isn't in simple-icons (brand policy) — minimal custom mark in its green */
const playwright: Brand = {
  hex: "2EAD33",
  path: "M12 1.8C6.4 1.8 1.8 6.4 1.8 12S6.4 22.2 12 22.2 22.2 17.6 22.2 12 17.6 1.8 12 1.8zm0 2c4.5 0 8.2 3.7 8.2 8.2s-3.7 8.2-8.2 8.2S3.8 16.5 3.8 12 7.5 3.8 12 3.8zM8.6 9.2a1.3 1.3 0 100 2.6 1.3 1.3 0 000-2.6zm6.8 0a1.3 1.3 0 100 2.6 1.3 1.3 0 000-2.6zM7.8 14.2c.9 1.7 2.4 2.8 4.2 2.8s3.3-1.1 4.2-2.8l-1.6-.8c-.6 1.1-1.5 1.8-2.6 1.8s-2-.7-2.6-1.8l-1.6.8z",
};

const BRANDS: Record<string, Brand> = {
  React: siReact,
  TypeScript: siTypescript,
  "React Native": siReact,
  "Next.js": siNextdotjs,
  "Tailwind CSS": siTailwindcss,
  Vite: siVite,
  Python: siPython,
  "Node.js": siNodedotjs,
  PostgreSQL: siPostgresql,
  Supabase: siSupabase,
  Prisma: siPrisma,
  Playwright: playwright,
  "GitHub Actions": siGithubactions,
  "Telegram Bot API": siTelegram,
  Git: siGit,
  Expo: siExpo,
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
      className="flex items-center gap-2.5 rounded-lg border bg-panel/60 px-3 py-2.5 transition-colors duration-300 hairline hover:border-(--line-strong) hover:bg-panel"
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

function LanguageGauge({ value, baseDelay }: { value: number; baseDelay: number }) {
  const reduced = useReducedMotion();
  const filled = Math.round(value * CELLS);
  return (
    <div className="mt-3 flex gap-1" aria-hidden>
      {Array.from({ length: CELLS }, (_, i) =>
        i < filled ? (
          <motion.span
            key={i}
            className="h-1.5 flex-1 rounded-[2px] bg-violet"
            initial={reduced ? false : { opacity: 0, scaleY: 0.3 }}
            whileInView={{ opacity: 1, scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, ease: EASE, delay: baseDelay + i * 0.05 }}
          />
        ) : (
          <span key={i} className="h-1.5 flex-1 rounded-[2px] bg-(--line)" />
        ),
      )}
    </div>
  );
}

export function Toolkit() {
  const dict = useDict();
  const t = dict.toolkit;

  return (
    <section id="toolkit" className="section-pad pt-[clamp(72px,12vh,140px)]">
      <SectionHead no={t.no} slug={t.slug} title={t.title} note={t.note} />

      <div className="mt-[clamp(28px,5vh,48px)] grid gap-x-10 gap-y-9 lg:grid-cols-3">
        {t.groups.map((col, colIndex) => (
          <Reveal key={col.group} delay={colIndex * 0.08}>
            <div>
              <span className="mono block text-[0.6875rem] uppercase tracking-[0.1em] text-signal">
                {"//"} {col.group}
              </span>
              <div className="mt-4 flex flex-wrap gap-2">
                {col.items.map((item, itemIndex) => (
                  <TechChip key={item.name} name={item.name} index={itemIndex} />
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      {/* human languages — violet chapter */}
      <Reveal delay={0.15}>
        <div className="mt-10 rounded-2xl border border-violet/25 bg-violet/[0.06] p-6 sm:p-7">
          <div className="mono flex items-baseline justify-between text-[0.6875rem] uppercase tracking-[0.1em] text-violet">
            <span>{t.langsLabel}</span>
            <span>{t.langsCount}</span>
          </div>
          <div className="mt-6 grid gap-x-10 gap-y-7 sm:grid-cols-2 lg:grid-cols-4">
            {t.languages.map((lang, i) => (
              <div key={lang.code}>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="mono text-[0.9375rem] font-semibold">{lang.code}</span>
                  <span className="mono rounded border border-violet/40 px-2 py-0.5 text-[0.6875rem] text-violet">
                    {lang.level}
                  </span>
                </div>
                <span className="label mt-1.5 block">{lang.name}</span>
                <LanguageGauge value={lang.value} baseDelay={0.15 + i * 0.1} />
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
