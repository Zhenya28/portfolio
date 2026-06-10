"use client";

import { motion, useReducedMotion } from "motion/react";
import { LANGUAGES, TOOLKIT } from "@/lib/data";
import { Reveal, SectionHead } from "./Reveal";

const EASE = [0.22, 1, 0.36, 1] as const;
const CELLS = 10;

/* dark bar on lime — inverted htop */
function InvertBar({ level, delay }: { level: number; delay: number }) {
  const reduced = useReducedMotion();
  return (
    <span className="relative block h-1.5 w-24 overflow-hidden rounded bg-bg/15 sm:w-28">
      <motion.i
        className="absolute inset-0 origin-left rounded bg-bg"
        initial={reduced ? false : { scaleX: 0 }}
        whileInView={{ scaleX: level }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: EASE, delay }}
      />
    </span>
  );
}

/* segmented signal-strength gauge, dark cells on lime */
function LanguageGauge({ value, baseDelay }: { value: number; baseDelay: number }) {
  const reduced = useReducedMotion();
  const filled = Math.round(value * CELLS);
  return (
    <div className="mt-3 flex gap-1" aria-hidden>
      {Array.from({ length: CELLS }, (_, i) =>
        i < filled ? (
          <motion.span
            key={i}
            className="h-1.5 flex-1 rounded-[2px] bg-bg"
            initial={reduced ? false : { opacity: 0, scaleY: 0.3 }}
            whileInView={{ opacity: 1, scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, ease: EASE, delay: baseDelay + i * 0.05 }}
          />
        ) : (
          <span key={i} className="h-1.5 flex-1 rounded-[2px] bg-bg/15" />
        ),
      )}
    </div>
  );
}

export function Toolkit() {
  return (
    <section id="toolkit" className="section-pad pt-[clamp(72px,12vh,140px)]">
      <SectionHead no="03" slug="narzedzia" title="Narzędzia" note="głębia, nie chmura tagów" />

      {/* inverted block — the loudest surface on the page, on purpose */}
      <Reveal>
        <div className="mt-[clamp(28px,5vh,48px)] rounded-2xl bg-signal px-[clamp(22px,4vw,56px)] py-[clamp(28px,5vh,56px)] text-bg">
          <div className="grid gap-x-12 gap-y-10 md:grid-cols-3">
            {TOOLKIT.map((col, colIndex) => (
              <div key={col.group}>
                <span className="mono text-[0.6875rem] uppercase tracking-[0.1em] text-bg/55">
                  {col.group}
                </span>
                <div className="mt-4 flex flex-col gap-2.5">
                  {col.items.map((item, itemIndex) => (
                    <div key={item.name} className="flex items-center justify-between gap-4">
                      <span className="text-[0.95rem] font-semibold">{item.name}</span>
                      <InvertBar level={item.level} delay={colIndex * 0.1 + itemIndex * 0.05} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* human languages — a competence like any other */}
          <div className="mt-[clamp(32px,5vh,52px)] border-t border-bg/20 pt-[clamp(24px,4vh,36px)]">
            <div className="mono flex items-baseline justify-between text-[0.6875rem] uppercase tracking-[0.1em] text-bg/55">
              <span>języki · komunikacja bez tłumacza</span>
              <span>4/4</span>
            </div>
            <div
              className="mt-6 grid gap-x-10 gap-y-7 sm:grid-cols-2 lg:grid-cols-4"
              aria-label="Języki, którymi mówię"
            >
              {LANGUAGES.map((lang, i) => (
                <div key={lang.code}>
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="mono text-[0.9375rem] font-semibold">{lang.code}</span>
                    <span className="mono rounded border border-bg/35 px-2 py-0.5 text-[0.6875rem]">
                      {lang.level}
                    </span>
                  </div>
                  <span className="mono mt-1.5 block text-[0.6875rem] uppercase tracking-[0.1em] text-bg/55">
                    {lang.name}
                  </span>
                  <LanguageGauge value={lang.value} baseDelay={0.15 + i * 0.1} />
                </div>
              ))}
            </div>
          </div>
        </div>
        <p className="mono pt-4 text-[0.75rem] text-faint">
          długość paska = przebieg na produkcji
        </p>
      </Reveal>
    </section>
  );
}
