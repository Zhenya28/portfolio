"use client";

import { motion, useScroll, useSpring } from "motion/react";

export function TopBar() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  return (
    <header className="section-pad fixed inset-x-0 top-0 z-50 flex items-center justify-between border-b py-3.5 hairline-strong backdrop-blur-md [background:color-mix(in_srgb,var(--color-bg)_82%,transparent)]">
      {/* reading progress — signal hairline along the bar's bottom edge */}
      <motion.span
        aria-hidden
        className="absolute inset-x-0 bottom-[-1px] h-[2px] origin-left bg-signal"
        style={{ scaleX: progress }}
      />
      <a href="#top" className="mono text-[0.8125rem] text-muted">
        <span className="text-signal">yevhen</span>@warsaw<span className="text-faint">:~$</span>
      </a>
      <nav className="flex items-center gap-[clamp(14px,3vw,32px)]" aria-label="Główna nawigacja">
        <a className="nav-link hidden sm:block" href="#process">./współpraca</a>
        <a className="nav-link" href="#work">./projekty</a>
        <a className="nav-link" href="#contact">./kontakt</a>
      </nav>
    </header>
  );
}
