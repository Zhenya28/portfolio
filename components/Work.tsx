"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Reveal, SectionHead } from "./Reveal";
import { ArrowRightIcon, GitHubIcon } from "./icons";
import { useDict, useLocale } from "./LocaleProvider";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Work() {
  const dict = useDict();
  const locale = useLocale();
  const t = dict.work;
  const PROJECTS = t.items;

  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const project = PROJECTS[active];

  const beats = [
    { key: "problem" as const, label: t.beats.problem, tone: "text-amber" },
    { key: "built" as const, label: t.beats.built, tone: "text-muted" },
    { key: "result" as const, label: t.beats.result, tone: "text-signal" },
  ];

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
      <SectionHead title={t.title} />

      <Reveal>
        <div className="mt-[clamp(28px,5vh,48px)] grid gap-4 lg:grid-cols-[minmax(0,36%)_1fr] lg:gap-5">
          {/* u1core-style selector: bare rows, the active one becomes a solid signal pill */}
          <div
            role="tablist"
            aria-orientation="vertical"
            onKeyDown={onKeyDown}
            className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:gap-0 lg:overflow-visible lg:pb-0"
          >
            {PROJECTS.map((p, i) => {
              const selected = i === active;
              return (
                <button
                  key={p.slug}
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setActive(i)}
                  className={`flex min-w-[230px] shrink-0 items-center gap-3.5 text-left transition-all duration-300 lg:min-w-0 ${
                    selected
                      ? "rounded-2xl bg-signal px-4 py-3.5 text-bg shadow-[0_10px_40px_rgba(159,239,0,0.2)] lg:-mx-4 lg:px-6 lg:py-5"
                      : "rounded-2xl px-4 py-3.5 opacity-60 hover:opacity-100 lg:mx-0 lg:rounded-none lg:border-b lg:px-2 lg:py-5 lg:hairline"
                  }`}
                >
                  <span className={`mono text-[0.8125rem] ${selected ? "font-bold text-bg/70" : "text-faint"}`}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[1.05rem] font-bold leading-tight tracking-tight">
                      {p.title}
                    </span>
                    <span className={`mono mt-0.5 block truncate text-[0.65rem] uppercase tracking-[0.1em] ${selected ? "text-bg/70" : "text-faint"}`}>
                      {p.tag}
                    </span>
                  </span>
                  <span className="ml-auto flex shrink-0 items-center gap-1.5">
                    <span
                      className={`size-1.5 rounded-full ${
                        selected ? "bg-bg [animation:pulse_2.4s_ease-in-out_infinite]" : "bg-(--line-strong)"
                      }`}
                    />
                    <span className={`mono text-[0.65rem] ${selected ? "text-bg/80" : "text-faint"}`}>
                      {t.live}
                    </span>
                  </span>
                </button>
              );
            })}
            <p className="mono hidden pt-4 text-[0.6875rem] text-faint lg:block">{t.hint}</p>
          </div>

          {/* open dossier — no box, a giant ghost index and hairline rows */}
          <div className="relative min-h-[460px] lg:pl-10">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active}
                role="tabpanel"
                initial={reduced ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="flex h-full flex-col"
              >
                <div className="mono text-[0.6875rem] text-faint">{project.path}</div>

                <h3 className="mt-3 text-[clamp(1.8rem,3.4vw,2.7rem)] font-bold leading-tight tracking-tight">
                  {project.title}
                </h3>
                <span className="label label--signal mt-1 block">{project.kind}</span>

                <div className="mt-7 flex flex-col">
                  {beats.map((beat, i) => (
                    <motion.div
                      key={beat.key}
                      initial={reduced ? false : { opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, ease: EASE, delay: 0.1 + i * 0.09 }}
                      className="grid gap-1.5 border-t py-5 hairline sm:grid-cols-[130px_1fr] sm:gap-5"
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

                <div className="mt-auto flex flex-wrap items-end justify-between gap-4 border-t pt-6 hairline">
                  <div className="flex flex-wrap gap-1.5">
                    {project.stack.map((tech) => (
                      <span key={tech} className="tag">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex shrink-0 items-center gap-5">
                    <a
                      href={project.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mono inline-flex items-center gap-2 text-[0.6875rem] uppercase tracking-[0.08em] text-muted transition-colors hover:text-signal"
                    >
                      <GitHubIcon className="size-3.5" /> {t.codeCta}
                    </a>
                    <Link
                      href={`/${locale}/projekty/${project.slug}`}
                      className="mono inline-flex items-center gap-1.5 text-[0.6875rem] uppercase tracking-[0.08em] text-signal transition-colors hover:text-text"
                    >
                      {t.caseCta} <ArrowRightIcon className="size-3" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
