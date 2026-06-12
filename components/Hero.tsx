"use client";

import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "motion/react";
import { ArrowDownIcon } from "./icons";
import { useDict } from "./LocaleProvider";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

const EASE = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const reduced = useReducedMotion();
  const dict = useDict();
  const t = dict.hero;

  return (
    <section id="top" className="section-pad relative flex min-h-svh flex-col justify-center overflow-hidden pb-12 pt-28">
      <div className="grid-bg" aria-hidden />
      <HeroScene />

      <div className="relative grid items-center gap-x-[clamp(32px,5vw,80px)] gap-y-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        <div>
          <motion.p
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="mono text-[0.8125rem] text-muted"
          >
            <span className="text-signal">$</span> {t.prompt.slice(2)}
          </motion.p>

          <h1 className="mt-5 text-[clamp(2.7rem,6.8vw,5.4rem)] font-extrabold leading-[1.02] tracking-[-0.03em]">
            <motion.span
              className="block"
              initial={reduced ? false : { opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
            >
              {t.h1a}
            </motion.span>
            <motion.span
              className="block text-muted"
              initial={reduced ? false : { opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.22 }}
            >
              {t.h1b} <span className="text-signal">{t.h1bAccent}</span>
            </motion.span>
          </h1>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.4 }}
            className="mt-6 max-w-[54ch]"
          >
            <p className="text-[clamp(0.95rem,1.2vw,1.1rem)] text-muted">{t.sub}</p>
            <p className="mono mt-3 text-[0.75rem] text-faint">{t.sign}</p>
          </motion.div>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.52 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <a className="btn btn--signal" href="#contact">
              {t.ctaPrimary}
            </a>
            <a className="btn" href="#process">
              {t.ctaSecondary} <ArrowDownIcon />
            </a>
          </motion.div>
        </div>

        <div aria-hidden className="relative hidden lg:block">
          <div className="absolute left-1/2 top-1/2 size-[34rem] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(closest-side,rgba(159,239,0,0.1),rgba(141,123,255,0.07),transparent)] blur-2xl" />
        </div>
      </div>
    </section>
  );
}
