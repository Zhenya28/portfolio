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
      <SectionHead title={t.title} />

      {/* quadrant sheet: open cells split by hairlines — no boxes, no chrome */}
      <div className="mt-[clamp(28px,5vh,48px)] grid border-b hairline md:grid-cols-2">
        {t.pillars.map((pillar, i) => {
          const Wire = WIREFRAMES[pillar.slug as ServiceSlug];
          return (
            <Link
              key={pillar.slug}
              href={`/${locale}/uslugi/${pillar.slug}`}
              className={`group flex h-full flex-col border-t px-1 py-8 transition-colors duration-300 hairline hover:bg-panel/40 sm:px-8 sm:py-10 ${
                i % 2 === 0 ? "md:border-r" : ""
              }`}
            >
              <Reveal delay={i * 0.06} className="flex h-full flex-col">
                <div className="mono flex items-baseline justify-between gap-3 text-[0.6875rem] text-faint">
                  <span>{pillar.tagline}</span>
                  <span className="shrink-0 text-signal">{pillar.priceFrom}</span>
                </div>
                <h3 className="mt-4 text-[clamp(1.6rem,2.8vw,2.2rem)] font-bold leading-tight tracking-tight transition-colors group-hover:text-signal">
                  {pillar.name}
                </h3>
                <p className="mt-3 max-w-[52ch] text-[0.9375rem] text-muted">{pillar.desc}</p>
                <span className="mono mt-4 inline-flex items-center gap-2 text-[0.6875rem] uppercase tracking-[0.08em] text-signal">
                  {t.moreCta}
                  <ArrowRightIcon className="size-3 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
                {/* illustration floats free on the page background */}
                <div className="mt-auto h-48 pt-8 transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1.5 sm:h-56">
                  <Wire />
                </div>
              </Reveal>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
