"use client";

import { motion, useReducedMotion } from "motion/react";
import { STATS } from "@/lib/data";
import { ArrowDownIcon } from "./icons";
import { TerminalLoop } from "./TerminalLoop";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const reduced = useReducedMotion();

  return (
    <section id="top" className="section-pad relative flex min-h-svh flex-col justify-center overflow-hidden pb-12 pt-28">
      <div className="grid-bg" aria-hidden />

      <div className="relative grid items-center gap-x-[clamp(32px,5vw,80px)] gap-y-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        <div>
          <motion.p
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="mono text-[0.8125rem] text-muted"
          >
            <span className="text-signal">$</span> ./pomysl --na "aplikację, dashboard, bota"
          </motion.p>

          <h1 className="mt-5 text-[clamp(2.7rem,6.8vw,5.4rem)] font-extrabold leading-[1.02] tracking-[-0.03em]">
            <motion.span
              className="block"
              initial={reduced ? false : { opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
            >
              Pomysł jest twój.
            </motion.span>
            <motion.span
              className="block text-muted"
              initial={reduced ? false : { opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.22 }}
            >
              Dowiezienie — <span className="text-signal">moje.</span>
            </motion.span>
          </h1>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.4 }}
            className="mt-6 max-w-[54ch]"
          >
            <p className="text-[clamp(0.95rem,1.2vw,1.1rem)] text-muted">
              Aplikacje webowe, mobilne i automatyzacje — od pierwszej rozmowy do wdrożenia
              na produkcję. Stała cena, działające demo co tydzień, kod w 100% twój.
            </p>
            <p className="mono mt-3 text-[0.75rem] text-faint">
              — Yevhen Kapush · freelance developer · Warszawa
            </p>
          </motion.div>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.52 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <a className="btn btn--signal" href="#contact">
              ./omów-projekt
            </a>
            <a className="btn" href="#process">
              ./jak-pracuję <ArrowDownIcon />
            </a>
          </motion.div>
        </div>

        {/* looping terminal — what you get, in plain words */}
        <div className="relative">
          <div
            aria-hidden
            className="absolute -inset-12 -z-10 bg-[radial-gradient(closest-side,rgba(159,239,0,0.13),rgba(141,123,255,0.09),transparent)] blur-2xl"
          />
          <TerminalLoop />
        </div>
      </div>

      {/* hard numbers — proof over promises */}
      <motion.div
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: EASE, delay: 0.9 }}
        className="relative mt-[clamp(40px,8vh,80px)] grid grid-cols-2 gap-px overflow-hidden rounded-lg border hairline-strong bg-(--line) md:grid-cols-4"
        aria-label="Liczby"
      >
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={reduced ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 1 + i * 0.1 }}
            className="bg-panel p-4 sm:p-5"
          >
            <span className="mono block text-[clamp(1.4rem,2.4vw,2rem)] font-bold text-signal">
              {stat.value}
            </span>
            <span className="label mt-1 block">{stat.label}</span>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
