"use client";

import Link from "next/link";
import { Reveal, SectionHead } from "./Reveal";
import { ArrowRightIcon } from "./icons";
import { useDict, useLocale } from "./LocaleProvider";
import { WIREFRAMES } from "./Wireframes";
import type { ServiceSlug } from "@/lib/i18n";

export function Offer() {
  const dict = useDict();
  const locale = useLocale();
  const t = dict.offer;

  return (
    <section id="services" className="section-pad pt-[clamp(72px,12vh,140px)]">
      <SectionHead no={t.no} slug={t.slug} title={t.title} note={t.note} />

      <div className="mt-[clamp(28px,5vh,48px)] grid gap-5 md:grid-cols-2">
        {t.pillars.map((pillar, i) => {
          const Wire = WIREFRAMES[pillar.slug as ServiceSlug];
          const violet = pillar.slug === "digital-marketing";
          return (
            <Reveal key={pillar.slug} delay={i * 0.08} className="h-full">
              <Link
                href={`/${locale}/uslugi/${pillar.slug}`}
                className={`group flex h-full flex-col overflow-hidden rounded-2xl border bg-panel/50 transition-all duration-300 will-change-transform hairline-strong hover:-translate-y-1 ${
                  violet ? "hover:border-violet/50" : "hover:border-signal/50"
                }`}
              >
                <div className="p-6 pb-0 sm:p-7 sm:pb-0">
                  <div className="mono flex items-baseline justify-between gap-3 text-[0.6875rem] text-faint">
                    <span>{pillar.tagline}</span>
                    <span className={`shrink-0 ${violet ? "text-violet" : "text-signal"}`}>{pillar.priceFrom}</span>
                  </div>
                  <h3
                    className={`mt-3 text-[clamp(1.4rem,2.4vw,1.8rem)] font-bold leading-tight tracking-tight transition-colors ${
                      violet ? "group-hover:text-violet" : "group-hover:text-signal"
                    }`}
                  >
                    {pillar.name}
                  </h3>
                  <p className="mt-3 text-[0.9375rem] text-muted">{pillar.desc}</p>
                  <span className={`mono mt-4 inline-flex items-center gap-2 text-[0.6875rem] uppercase tracking-[0.08em] ${violet ? "text-violet" : "text-signal"}`}>
                    {t.moreCta}
                    <ArrowRightIcon className="size-3 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
                {/* skeleton illustration — the u1core touch */}
                <div className="mt-auto h-48 pt-5 transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1.5 sm:h-52">
                  <Wire />
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>

      <Reveal delay={0.2}>
        <div className="mono mt-6 flex flex-wrap items-center justify-between gap-x-8 gap-y-3 rounded-xl border bg-panel/40 px-6 py-4 text-[0.75rem] text-faint hairline sm:px-7">
          <div className="flex flex-wrap gap-x-6 gap-y-1.5">
            {t.trust.map((item) => (
              <span key={item}>
                <span className="text-signal">✓</span> {item}
              </span>
            ))}
          </div>
          <span className="text-muted">{t.trustTail}</span>
        </div>
      </Reveal>

      <Reveal delay={0.25}>
        <p className="mono mt-4 text-[0.75rem] text-faint">
          {t.customNote}{" "}
          <a href="#contact" className="text-signal underline-offset-4 hover:underline">
            {t.customLink}
          </a>{" "}
          {t.customTail}
        </p>
      </Reveal>
    </section>
  );
}
