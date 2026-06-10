"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

const EASE = [0.22, 1, 0.36, 1] as const;

type Line = {
  text: string;
  tone?: "signal" | "amber" | "faint" | "text";
  /** show a braille spinner while this is the newest visible line */
  pending?: boolean;
};

type Scene = {
  path: string;
  command: string;
  lines: Line[];
  footer: string;
};

/* Jedna scena na każdą rzecz, którą klient realnie dostaje — proste słowa, skórka terminala. */
const SCENES: Scene[] = [
  {
    path: "~/co-dostajesz/aplikacje",
    command: './zbuduj-aplikacje "twój pomysł"',
    lines: [
      { text: "zamieniam pomysł w konkretny plan…", pending: true, tone: "faint" },
      { text: "✓ projekt + kod — jedna osoba, bez agencji", tone: "text" },
      { text: "✓ działa na web i mobile w kilka tygodni", tone: "signal" },
      { text: "kod w 100% należy do ciebie", tone: "amber" },
    ],
    footer: "aplikacje webowe i mobilne",
  },
  {
    path: "~/co-dostajesz/automatyzacja",
    command: './zautomatyzuj "nudne zadania"',
    lines: [
      { text: "szukam tego, co pożera twój czas…", pending: true, tone: "faint" },
      { text: "✓ raporty, maile i dane na autopilocie", tone: "text" },
      { text: "✓ działa 24/7, nie bierze urlopu", tone: "signal" },
      { text: "odzyskane godziny w każdym tygodniu", tone: "amber" },
    ],
    footer: "automatyzacja procesów",
  },
  {
    path: "~/jak-pracujemy",
    command: "./wspolpraca",
    lines: [
      { text: "czytam twój brief…", pending: true, tone: "faint" },
      { text: "✓ jasne aktualizacje, zero żargonu", tone: "text" },
      { text: "✓ uczciwy plan i cena przed startem", tone: "signal" },
      { text: "4 języki · odpowiedź poniżej 24h", tone: "amber" },
    ],
    footer: "prosta współpraca",
  },
];

const TYPE_MS = 58; // per character
const LINE_MS = 850; // per output line
const HOLD_MS = 4200; // pause on finished scene
const FADE_MS = 650; // crossfade between scenes

const SPINNER = ["⠋", "⠙", "⠸", "⠴", "⠦", "⠇"];

const toneClass: Record<NonNullable<Line["tone"]>, string> = {
  signal: "text-signal",
  amber: "text-amber",
  faint: "text-faint",
  text: "text-muted",
};

export function TerminalLoop() {
  const reduced = useReducedMotion();
  const [scene, setScene] = useState(0);
  const [typed, setTyped] = useState(0);
  const [shown, setShown] = useState(0);
  const [fading, setFading] = useState(false);
  const [spin, setSpin] = useState(0);

  const current = SCENES[scene];
  const typingDone = typed >= current.command.length;
  const allShown = shown >= current.lines.length;

  /* one scheduled timeline per scene; everything cleans up on unmount/skip */
  useEffect(() => {
    if (reduced) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const cmd = SCENES[scene].command;
    const lines = SCENES[scene].lines;

    for (let i = 1; i <= cmd.length; i++) {
      timers.push(setTimeout(() => setTyped(i), i * TYPE_MS));
    }
    const outputStart = cmd.length * TYPE_MS + 300;
    for (let j = 1; j <= lines.length; j++) {
      timers.push(setTimeout(() => setShown(j), outputStart + j * LINE_MS));
    }
    const sceneEnd = outputStart + lines.length * LINE_MS + HOLD_MS;
    timers.push(setTimeout(() => setFading(true), sceneEnd));
    timers.push(
      setTimeout(() => {
        setScene((s) => (s + 1) % SCENES.length);
        setTyped(0);
        setShown(0);
        setFading(false);
      }, sceneEnd + FADE_MS),
    );

    return () => timers.forEach(clearTimeout);
  }, [scene, reduced]);

  /* braille spinner for the newest pending line */
  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setSpin((s) => (s + 1) % SPINNER.length), 120);
    return () => clearInterval(id);
  }, [reduced]);

  /* reduced motion: render the first scene fully, static */
  const staticMode = !!reduced;
  const visibleTyped = staticMode ? current.command.length : typed;
  const visibleShown = staticMode ? current.lines.length : shown;

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: EASE, delay: 0.35 }}
      className="panel w-full overflow-hidden"
    >
      <div className="panel__bar">
        <span className="panel__dot" />
        <span className="panel__dot" />
        <span className="panel__dot bg-signal/60" />
        <span className="ml-2 transition-opacity duration-500" style={{ opacity: fading ? 0 : 1 }}>
          {current.path}
        </span>
        <span className="ml-auto hidden items-center gap-1.5 text-signal sm:flex">
          <span className="inline-block size-1.5 rounded-full bg-signal [animation:pulse_2s_ease-in-out_infinite]" />
          live
        </span>
      </div>

      <div
        className="mono min-h-[260px] overflow-x-auto p-5 text-[0.8125rem] leading-[1.95] transition-opacity duration-500 ease-out sm:min-h-[292px] sm:p-6 sm:text-[0.9375rem]"
        style={{ opacity: fading ? 0 : 1 }}
        aria-label="Animacja terminala pokazująca, co dostajesz: aplikacje, automatyzację i prostą współpracę"
      >
        <div className="flex gap-3 whitespace-nowrap">
          <span className="shrink-0 text-signal">$</span>
          <span className="text-text">
            {current.command.slice(0, visibleTyped)}
            {!staticMode && !allShown && (
              <span className="ml-px inline-block w-[0.55em] translate-y-px bg-signal [animation:blink_1.1s_steps(1)_infinite]">
                &nbsp;
              </span>
            )}
          </span>
        </div>

        {current.lines.map((line, i) => {
          const visible = i < visibleShown;
          const isNewest = visible && i === visibleShown - 1 && !allShown;
          const spinning = !staticMode && line.pending && isNewest;
          return (
            <div
              key={`${scene}-${i}`}
              className="flex gap-3 whitespace-nowrap transition-[opacity,transform] duration-700 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(8px)",
              }}
            >
              <span className="shrink-0 text-faint">{spinning ? SPINNER[spin] : "·"}</span>
              <span className={toneClass[line.tone ?? "text"]}>{line.text}</span>
            </div>
          );
        })}

        <div
          className="mt-1 flex gap-3 whitespace-nowrap border-t pt-2 hairline transition-opacity duration-700 ease-out"
          style={{ opacity: staticMode || allShown ? 1 : 0 }}
        >
          <span className="text-faint">{current.footer}</span>
        </div>
      </div>
    </motion.div>
  );
}
