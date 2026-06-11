"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import { useDict, useLocale } from "./LocaleProvider";

export function TopBar() {
  const dict = useDict();
  const locale = useLocale();
  const pathname = usePathname();
  const [offerOpen, setOfferOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  const otherLocale = locale === "pl" ? "en" : "pl";
  const switchedPath = pathname.replace(/^\/(pl|en)/, `/${otherLocale}`);
  const home = `/${locale}`;

  return (
    <header className="section-pad fixed inset-x-0 top-0 z-50 flex items-center justify-between border-b py-3.5 hairline-strong backdrop-blur-md [background:color-mix(in_srgb,var(--color-bg)_82%,transparent)]">
      <motion.span
        aria-hidden
        className="absolute inset-x-0 bottom-[-1px] h-[2px] origin-left bg-signal"
        style={{ scaleX: progress }}
      />
      <Link href={home} className="mono text-[0.8125rem] text-muted">
        <span className="text-signal">yevhen</span>@warsaw<span className="text-faint">:~$</span>
      </Link>

      <nav className="flex items-center gap-[clamp(12px,2.5vw,28px)]" aria-label="Main">
        {/* offer dropdown */}
        <div
          className="relative"
          onMouseEnter={() => setOfferOpen(true)}
          onMouseLeave={() => setOfferOpen(false)}
        >
          <button
            className="nav-link flex items-center gap-1.5"
            aria-expanded={offerOpen}
            onClick={() => setOfferOpen((o) => !o)}
          >
            {dict.nav.offerLabel} <span className="text-[0.6rem]">▾</span>
          </button>
          <AnimatePresence>
            {offerOpen && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                className="absolute right-0 top-full w-72 pt-3"
              >
                <div className="overflow-hidden rounded-xl border bg-panel hairline-strong shadow-[0_16px_50px_rgba(0,0,0,0.5)]">
                  {dict.offer.pillars.map((pillar) => (
                    <Link
                      key={pillar.slug}
                      href={`${home}/uslugi/${pillar.slug}`}
                      onClick={() => setOfferOpen(false)}
                      className="flex items-baseline justify-between gap-3 border-b px-4 py-3 hairline transition-colors last:border-b-0 hover:bg-panel-2"
                    >
                      <span className="text-[0.875rem] font-semibold">{pillar.name}</span>
                      <span className="mono shrink-0 text-[0.6875rem] text-signal">{pillar.priceFrom}</span>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Link className="nav-link hidden sm:block" href={`${home}#work`}>
          {dict.nav.projects}
        </Link>
        <Link className="nav-link hidden sm:block" href={`${home}#contact`}>
          {dict.nav.contact}
        </Link>

        {/* locale switch */}
        <Link
          href={switchedPath || `/${otherLocale}`}
          className="mono rounded border border-(--line-strong) px-2 py-1 text-[0.6875rem] uppercase tracking-wide text-muted transition-colors hover:border-signal hover:text-signal"
          aria-label={otherLocale === "en" ? "Switch to English" : "Przełącz na polski"}
        >
          {otherLocale}
        </Link>

        <Link href={`${home}#contact`} className="btn btn--signal hidden !px-4 !py-2 md:inline-flex">
          {dict.nav.quote}
        </Link>
      </nav>
    </header>
  );
}
