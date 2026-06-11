"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { PROJECTS } from "@/lib/data";
import { Reveal, SectionHead } from "./Reveal";
import { GitHubIcon } from "./icons";

const EASE = [0.22, 1, 0.36, 1] as const;

/* the three beats every case is told in */
const BEATS = [
  { key: "problem", label: "wyzwanie", tone: "text-amber" },
  { key: "built", label: "co zbudowałem", tone: "text-muted" },
  { key: "result", label: "efekt", tone: "text-signal" },
] as const;

export function Work() {
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const project = PROJECTS[active];

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      setActive((a) => (a + 1) % PROJECTS.length);
    }
    if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      setActive((a) => (a - 1 + PROJECTS.length) % PROJECTS.length);
    }
  }

  return (
    <section id="work" className="section-pad pt-[clamp(72px,12vh,140px)]">
      <SectionHead
        no="02"
        slug="dowiezione_projekty"
        title="Dowiezione projekty"
        note="wybierz case — wyzwanie, rozwiązanie, efekt"
      />

      <Reveal>
        <div className="mt-[clamp(28px,5vh,48px)] grid gap-4 lg:grid-cols-[minmax(0,36%)_1fr] lg:gap-5">
          {/* selector — a monitor-style list */}
          <div
            role="tablist"
            aria-label="Projekty"
            aria-orientation="vertical"
            onKeyDown={onKeyDown}
            className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0"
          >
            {PROJECTS.map((p, i) => {
              const selected = i === active;
              return (
                <button
                  key={p.no}
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setActive(i)}
                  className={`group relative flex min-w-[230px] shrink-0 items-center gap-3.5 rounded-xl border px-4 py-3.5 text-left transition-colors duration-300 lg:min-w-0 lg:px-5 lg:py-4 ${
                    selected
                      ? "border-signal/60 bg-panel"
                      : "border-(--line) bg-panel/40 hover:border-(--line-strong)"
                  }`}
                >
                  <span
                    className={`mono text-[0.8125rem] ${selected ? "text-signal" : "text-faint"}`}
                  >
                    {p.no}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[1rem] font-bold leading-tight tracking-tight">
                      {p.title}
                    </span>
                    <span className="label mt-0.5 block truncate">{p.tag}</span>
                  </span>
                  <span className="ml-auto flex shrink-0 items-center gap-1.5">
                    <span
                      className={`size-1.5 rounded-full ${
                        selected
                          ? "bg-signal [animation:pulse_2.4s_ease-in-out_infinite]"
                          : "bg-(--line-strong)"
                      }`}
                    />
                    <span className={`mono text-[0.65rem] ${selected ? "text-signal" : "text-faint"}`}>
                      live
                    </span>
                  </span>
                </button>
              );
            })}
            <p className="mono hidden pt-2 text-[0.6875rem] text-faint lg:block">
              ↑ ↓ działają też strzałki
            </p>
          </div>

          {/* case panel */}
          <div className="relative min-h-[460px] overflow-hidden rounded-xl border bg-panel hairline-strong">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active}
                role="tabpanel"
                initial={reduced ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="flex h-full flex-col p-5 sm:p-7"
              >
                <div className="mono flex items-baseline justify-between gap-3 text-[0.6875rem] text-faint">
                  <span className="truncate">{project.path}</span>
                  <span className="shrink-0 text-signal">[{project.no}]</span>
                </div>

                <h3 className="mt-3 text-[clamp(1.6rem,3vw,2.3rem)] font-bold leading-tight tracking-tight">
                  {project.title}
                </h3>
                <span className="label label--signal mt-1 block">{project.kind}</span>

                <div className="mt-6 flex flex-col gap-5">
                  {BEATS.map((beat, i) => (
                    <motion.div
                      key={beat.key}
                      initial={reduced ? false : { opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, ease: EASE, delay: 0.1 + i * 0.09 }}
                      className="grid gap-1.5 sm:grid-cols-[130px_1fr] sm:gap-5"
                    >
                      <span className={`mono pt-0.5 text-[0.6875rem] uppercase tracking-[0.1em] ${beat.tone}`}>
                        {beat.label}
                      </span>
                      <p
                        className={
                          beat.key === "result"
                            ? "text-[1.05rem] font-semibold leading-snug"
                            : "text-[0.9375rem] text-muted"
                        }
                      >
                        {project[beat.key]}
                      </p>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-7">
                  <div className="flex flex-wrap gap-1.5">
                    {project.stack.map((tech) => (
                      <span key={tech} className="tag">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <a
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mono inline-flex shrink-0 items-center gap-2 text-[0.6875rem] uppercase tracking-[0.08em] text-muted transition-colors hover:text-signal"
                  >
                    <GitHubIcon className="size-3.5" /> zobacz kod
                  </a>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
