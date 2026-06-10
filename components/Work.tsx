"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "motion/react";
import { PROJECTS, type Project } from "@/lib/data";
import { SectionHead } from "./Reveal";
import { ArrowRightIcon, GitHubIcon } from "./icons";

/* commit metadata layered on top of the projects */
const COMMITS = [
  { hash: "a3f9c1e", branch: "feat/flashly" },
  { hash: "7d2e9b4", branch: "feat/myfinance" },
  { hash: "f41c803", branch: "bot/pyszne-monitor" },
];

const TOTAL_STOPS = PROJECTS.length + 1; // + the dashed CTA commit

/** activation point of commit i along the scroll progress */
const stop = (i: number) => (i + 0.55) / TOTAL_STOPS;

function CardBody({ project }: { project: Project }) {
  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-xl border bg-panel hairline-strong transition-colors duration-300 hover:border-signal/50">
      <div className="mono flex items-baseline justify-between gap-3 px-5 pt-5 text-[0.6875rem] text-faint sm:px-6">
        <span className="truncate">{project.path}</span>
        <span className="shrink-0 text-signal">[{project.no}]</span>
      </div>
      <div className="flex grow flex-col p-5 pt-3.5 sm:p-6 sm:pt-4">
        <h3 className="text-[1.45rem] font-bold leading-tight tracking-tight">
          <a
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-baseline gap-2 transition-colors group-hover:text-signal"
          >
            {project.title}
            <span className="mono text-[0.8em] opacity-0 transition-all duration-300 -translate-x-1 group-hover:translate-x-0 group-hover:opacity-100">
              ↗
            </span>
          </a>
        </h3>
        <span className="label label--signal mt-1 block">{project.kind}</span>
        <p className="mt-4 text-[0.9375rem] text-muted">{project.description}</p>
        <ul className="mono mt-5 flex flex-col gap-1 text-[0.75rem] text-faint">
          {project.metrics.map((metric) => (
            <li key={metric}>
              <span className="text-signal">▸</span> {metric}
            </li>
          ))}
        </ul>
        <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-6">
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
            <GitHubIcon className="size-3.5" /> kod
          </a>
        </div>
      </div>
    </div>
  );
}

function CommitRow({
  project,
  index,
  progress,
}: {
  project: Project;
  index: number;
  progress: MotionValue<number>;
}) {
  const t = stop(index);
  const left = index % 2 === 0; // desktop: even commits on the left of the spine

  const cardOpacity = useTransform(progress, [t - 0.14, t], [0.25, 1]);
  const cardX = useTransform(progress, [t - 0.14, t], [left ? -28 : 28, 0]);
  const nodeScale = useTransform(progress, [t - 0.05, t], [0.4, 1]);
  const nodeOpacity = useTransform(progress, [t - 0.05, t], [0.25, 1]);
  const metaOpacity = useTransform(progress, [t - 0.1, t], [0.2, 1]);

  const { hash, branch } = COMMITS[index];

  const meta = (
    <motion.div
      style={{ opacity: metaOpacity }}
      className={`mono hidden flex-col gap-1.5 self-start pt-7 text-[0.8125rem] lg:flex ${
        left ? "items-start pl-12" : "items-end pr-12 text-right"
      }`}
    >
      <span className="text-faint">
        commit <span className="text-text">{hash}</span>
      </span>
      <span className="w-fit rounded border border-signal/40 px-2 py-0.5 text-[0.6875rem] text-signal">
        {branch}
      </span>
      <span className="text-faint">✓ build passed · deployed</span>
    </motion.div>
  );

  return (
    <div className="relative lg:grid lg:grid-cols-2">
      {/* commit node on the spine */}
      <motion.span
        style={{ scale: nodeScale, opacity: nodeOpacity }}
        className="absolute left-[11px] top-7 z-10 -translate-x-1/2 lg:left-1/2"
        aria-hidden
      >
        <span className="block size-3 rounded-full border-2 border-signal bg-bg" />
      </motion.span>

      {!left && meta}
      <motion.div
        style={{ opacity: cardOpacity, x: cardX }}
        className={`ml-9 lg:ml-0 ${left ? "lg:pr-12" : "lg:pl-12"}`}
      >
        {/* mobile commit meta */}
        <div className="mono mb-2 flex items-center gap-2.5 text-[0.75rem] text-faint lg:hidden">
          <span>{hash}</span>
          <span className="rounded border border-signal/40 px-1.5 py-px text-[0.65rem] text-signal">
            {branch}
          </span>
        </div>
        <CardBody project={project} />
      </motion.div>
      {left && meta}
    </div>
  );
}

/* the empty commit at the tip of the branch — reserved for the visitor */
function NextCommit({ progress }: { progress: MotionValue<number> }) {
  const t = stop(PROJECTS.length);
  const opacity = useTransform(progress, [t - 0.14, t], [0.2, 1]);
  const y = useTransform(progress, [t - 0.14, t], [20, 0]);
  return (
    <div className="relative lg:grid lg:grid-cols-2">
      <motion.span
        style={{ opacity }}
        className="absolute left-[11px] top-7 z-10 -translate-x-1/2 lg:left-1/2"
        aria-hidden
      >
        <span className="block size-3 rounded-full border-2 border-dashed border-violet bg-bg" />
      </motion.span>
      <motion.div style={{ opacity, y }} className="ml-9 lg:col-start-2 lg:ml-0 lg:pl-12">
        <div className="flex h-full flex-col rounded-xl border border-dashed border-violet/50 bg-panel/40 p-5 sm:p-6">
          <div className="mono flex items-baseline justify-between gap-3 text-[0.6875rem] text-faint">
            <span>???????</span>
            <span className="rounded border border-violet/40 px-1.5 py-px text-[0.65rem] text-violet">
              feat/twoj-projekt
            </span>
          </div>
          <h3 className="mt-3 text-[1.45rem] font-bold leading-tight tracking-tight">
            Następny commit może być{" "}
            <span className="bg-linear-to-r from-signal to-violet bg-clip-text text-transparent">
              twój.
            </span>
          </h3>
          <p className="mt-3 text-[0.9375rem] text-muted">
            Gałąź jest otwarta — aplikacja, dashboard albo bot, który zdejmie ci robotę z głowy.
          </p>
          <a className="btn btn--signal mt-6 self-start" href="#contact">
            git commit -m &quot;start&quot; <ArrowRightIcon />
          </a>
        </div>
      </motion.div>
    </div>
  );
}

export function Work() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  /* HEAD position: 0 when the graph enters, 1 when its end clears the fold */
  const progress = useMotionValue(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced) {
      progress.set(1);
      return;
    }
    let raf: number | null = null;
    const update = () => {
      raf = null;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height - vh * 0.25;
      const p = Math.min(1, Math.max(0, (vh * 0.78 - rect.top) / total));
      progress.set(p);
    };
    const onScroll = () => {
      if (raf === null) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, [progress, reduced]);

  const spineScale = useTransform(progress, [0, 1], [0, 1]);
  const headTop = useTransform(progress, (p) => `${Math.min(p, 0.995) * 100}%`);
  const headOpacity = useTransform(progress, [0, 0.02], [0, 1]);

  return (
    <section id="work" className="section-pad pt-[clamp(72px,12vh,140px)]">
      <SectionHead
        no="01"
        slug="wybrane_projekty"
        title="Wybrane projekty"
        note="git log --graph · scrolluj wzdłuż gałęzi"
      />

      <div ref={ref} className="relative mt-[clamp(36px,7vh,72px)] pb-2">
        {/* spine: faint track + branch drawn by scroll */}
        <div className="absolute bottom-0 left-[11px] top-0 w-px bg-(--line) lg:left-1/2" aria-hidden />
        <motion.div
          style={{ scaleY: spineScale }}
          className="absolute bottom-0 left-[11px] top-0 w-px origin-top bg-linear-to-b from-signal to-violet lg:left-1/2"
          aria-hidden
        />

        {/* HEAD rides the branch as you scroll */}
        <motion.div
          style={{ top: headTop, opacity: headOpacity }}
          className="absolute left-[11px] z-20 -translate-x-1/2 -translate-y-1/2 lg:left-1/2"
          aria-hidden
        >
          <span className="relative block size-4 rounded-full bg-signal shadow-[0_0_18px_rgba(159,239,0,0.8)]" />
          <span className="mono absolute left-6 top-1/2 -translate-y-1/2 rounded border border-signal/50 bg-bg px-1.5 py-px text-[0.65rem] tracking-wide text-signal">
            HEAD
          </span>
        </motion.div>

        <div className="flex flex-col gap-[clamp(44px,9vh,104px)]">
          {PROJECTS.map((project, i) => (
            <CommitRow key={project.no} project={project} index={i} progress={progress} />
          ))}
          <NextCommit progress={progress} />
        </div>
      </div>
    </section>
  );
}
