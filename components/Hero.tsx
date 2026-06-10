"use client";

import { motion, useReducedMotion } from "motion/react";
import { ArrowDownIcon } from "./icons";
import { TerminalLoop } from "./TerminalLoop";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const reduced = useReducedMotion();

  return (
    <section id="top" className="section-pad relative flex min-h-svh flex-col justify-center overflow-hidden pb-12 pt-28">
      <div className="grid-bg" aria-hidden />

      <div className="relative grid items-center gap-x-[clamp(32px,5vw,80px)] gap-y-12 lg:grid-cols-[minmax(0,1fr)_minmax(420px,1.1fr)]">
        <div>
          <motion.p
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="mono text-[0.8125rem] text-muted"
          >
            <span className="text-signal">$</span> whoami
            <span className="mx-3 text-faint">→</span>
            freelance developer · warszawa, pl
          </motion.p>

          <h1 className="mt-5 text-[clamp(2.6rem,6.5vw,5.2rem)] font-extrabold leading-[1.02] tracking-[-0.03em]">
            <motion.span
              className="block"
              initial={reduced ? false : { opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
            >
              Yevhen Kapush
            </motion.span>
            <motion.span
              className="block text-muted"
              initial={reduced ? false : { opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.22 }}
            >
              tworzy i automatyzuje{" "}
              <span className="text-signal">software, który działa.</span>
            </motion.span>
          </h1>

          <motion.p
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.4 }}
            className="mt-6 max-w-[54ch] text-[clamp(0.95rem,1.2vw,1.1rem)] text-muted"
          >
            Aplikacje webowe, mobilne i boty automatyzujące — działające na produkcji, nie leżące
            w szufladzie. Cztery języki, dwa kraje i jedna zasada: jeśli coś jest warte zbudowania,
            zostaje dokończone.
          </motion.p>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.52 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <a className="btn btn--signal" href="#work">
              ./zobacz-projekty <ArrowDownIcon />
            </a>
            <a className="btn" href="#contact">
              ./rozpocznij-projekt
            </a>
          </motion.div>
        </div>

        {/* looping terminal — web → mobile → automation scenes */}
        <div className="relative w-full">
          <div
            aria-hidden
            className="absolute -inset-12 -z-10 bg-[radial-gradient(closest-side,rgba(159,239,0,0.13),rgba(141,123,255,0.09),transparent)] blur-2xl"
          />
          <TerminalLoop />
        </div>
      </div>
    </section>
  );
}
