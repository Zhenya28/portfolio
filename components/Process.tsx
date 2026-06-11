"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { Reveal, SectionHead } from "./Reveal";
import { ArrowRightIcon } from "./icons";

/*
  Step content distilled from how the best PL agencies sell:
  explicit timeframes, deliverables per stage, selectivity as credibility,
  ownership language and response-time SLAs.
*/
const STEPS = [
  {
    no: "01",
    title: "Mówisz, co boli",
    time: "dzień 0 · koszt: 0 zł",
    desc: "Piszesz wiadomość — bez formalności i bez zobowiązań. Wracam z konkretnymi pytaniami, nie z ofertą kopiuj-wklej.",
    gets: [
      "odpowiedź w 24 godziny",
      "bezpłatna konsultacja — online albo na piśmie",
      "szczera ocena, czy to w ogóle warto budować",
    ],
  },
  {
    no: "02",
    title: "Dostajesz plan i stałą cenę",
    time: "wycena w 48 h",
    desc: "Zakres, harmonogram i cena na piśmie, zanim powstanie pierwsza linijka kodu. Rozliczam efekt, nie godziny.",
    gets: [
      "zakres + harmonogram na piśmie",
      "stała cena — zero niespodzianek na fakturze",
      "jeśli projekt się nie spina, odradzę go wprost",
    ],
  },
  {
    no: "03",
    title: "Widzisz postępy co tydzień",
    time: "moduły co 1–2 tygodnie",
    desc: "Pokazuję działającą wersję, nie prezentację. Feedback wdrażam na bieżąco — po polsku, angielsku, ukraińsku albo rosyjsku.",
    gets: [
      "działające demo w każdym tygodniu",
      "stały kontakt bez pośredników",
      "zmiany zakresu omawiane od razu, nie na końcu",
    ],
  },
  {
    no: "04",
    title: "Odbierasz działający produkt",
    time: "MVP w 2–6 tygodni",
    desc: "Wdrożony na produkcję, przetestowany, z dokumentacją. Bez vendor lock-in — wszystko zostaje u ciebie.",
    gets: [
      "wdrożenie na produkcję + dokumentacja",
      "kod, repo i dostępy w 100% na własność",
      "przeszkolenie z obsługi, jeśli go potrzebujesz",
    ],
  },
  {
    no: "05",
    title: "Nie znikam po starcie",
    time: "wsparcie po wdrożeniu",
    desc: "Automatyzacje monitoruję, błędy naprawiam. Kolejne pomysły wracają do kroku 01 — już bez poznawania się od zera.",
    gets: [
      "monitoring automatyzacji 24/7",
      "reakcja na zgłoszenia w 24 godziny",
      "rozwój produktu bez ponownego wdrażania się",
    ],
  },
];

const EASE = [0.22, 1, 0.36, 1] as const;

export function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);

  /* pinned-track progress, same mechanics as the manifesto */
  const raw = useMotionValue(0);
  const progress = useSpring(raw, { stiffness: 80, damping: 24, mass: 0.5 });
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    let raf: number | null = null;
    const update = () => {
      raf = null;
      const total = el.offsetHeight - window.innerHeight;
      if (total <= 0) return;
      const p = Math.min(1, Math.max(0, -el.getBoundingClientRect().top / total));
      raw.set(p);
    };
    const onScroll = () => {
      if (raf === null) raf = requestAnimationFrame(update);
    };
    update();
    progress.jump(raw.get());
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, [raw, progress, reduced]);

  useMotionValueEvent(raw, "change", (p) => {
    setActive(Math.min(STEPS.length - 1, Math.floor(p * STEPS.length)));
  });

  const railScale = useTransform(progress, [0, 0.92], [0, 1]);
  const markerTop = useTransform(progress, (p) => `${Math.min(p / 0.92, 1) * 100}%`);
  const step = STEPS[active];

  /* reduced motion: plain stacked list, no pinning */
  if (reduced) {
    return (
      <section id="process" className="section-pad pt-[clamp(72px,12vh,140px)]">
        <SectionHead no="01" slug="jak_pracujemy" title="Jak wygląda współpraca" note="pięć kroków" />
        <div className="mt-10 flex flex-col gap-10">
          {STEPS.map((s) => (
            <div key={s.no}>
              <span className="mono text-[0.8125rem] text-signal">krok {s.no} · {s.time}</span>
              <h3 className="mt-1.5 text-2xl font-bold tracking-tight">{s.title}</h3>
              <p className="mt-2 max-w-[58ch] text-muted">{s.desc}</p>
              <ul className="mono mt-3 flex flex-col gap-1 text-[0.8125rem] text-muted">
                {s.gets.map((g) => (
                  <li key={g}><span className="text-signal">✓</span> {g}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <ClosingCta />
      </section>
    );
  }

  return (
    <section id="process">
      {/* tall track: the walkthrough happens while the viewport stays pinned */}
      <div ref={ref} className="relative h-[340vh]">
        <div className="section-pad sticky top-0 flex h-svh flex-col justify-center">
          <SectionHead
            no="01"
            slug="jak_pracujemy"
            title="Jak wygląda współpraca"
            note="scroll przeprowadzi cię przez 5 kroków"
          />

          <div className="mt-[clamp(24px,4vh,48px)] grid items-stretch gap-6 lg:grid-cols-[minmax(0,38%)_1fr] lg:gap-12">
            {/* rail — all steps at a glance, marker shows where you are */}
            <div className="relative hidden lg:block">
              <div className="absolute bottom-2 left-[5px] top-2 w-px bg-(--line)" aria-hidden />
              <motion.div
                style={{ scaleY: railScale }}
                className="absolute bottom-2 left-[5px] top-2 w-px origin-top bg-linear-to-b from-signal to-violet"
                aria-hidden
              />
              <motion.span
                style={{ top: markerTop }}
                className="absolute left-[5px] z-10 -translate-x-1/2 -translate-y-1/2"
                aria-hidden
              >
                <span className="relative block size-3.5 rounded-full bg-signal shadow-[0_0_16px_rgba(159,239,0,0.8)]">
                  <span className="absolute inset-0 rounded-full bg-signal/60 blur-[5px] [animation:pulse_2.4s_ease-in-out_infinite]" />
                </span>
              </motion.span>

              <div className="flex h-full flex-col justify-between gap-4 py-2 pl-8">
                {STEPS.map((s, i) => {
                  const isDone = i < active;
                  const isActive = i === active;
                  return (
                    <div key={s.no} className="transition-opacity duration-300" style={{ opacity: isActive ? 1 : isDone ? 0.7 : 0.35 }}>
                      <span className={`mono text-[0.75rem] ${isActive ? "text-signal" : isDone ? "text-signal/70" : "text-faint"}`}>
                        {isDone ? "✓" : "krok"} {s.no}
                      </span>
                      <span className={`block text-[1.05rem] font-bold leading-snug tracking-tight ${isActive ? "text-text" : "text-muted"}`}>
                        {s.title}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* mobile: compact position indicator */}
            <div className="flex items-center gap-3 lg:hidden">
              <span className="mono text-[0.8125rem] text-signal">krok {step.no} / 05</span>
              <div className="flex gap-1.5">
                {STEPS.map((s, i) => (
                  <span
                    key={s.no}
                    className={`h-1 w-7 rounded transition-colors duration-300 ${i <= active ? "bg-signal" : "bg-(--line)"}`}
                  />
                ))}
              </div>
            </div>

            {/* detail card of the active step */}
            <div className="relative min-h-[380px] overflow-hidden rounded-xl border bg-panel hairline-strong sm:min-h-[400px]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="flex h-full flex-col p-6 sm:p-8"
                >
                  <span aria-hidden className="mono pointer-events-none absolute -right-3 -top-7 text-[7rem] font-bold leading-none text-text/[0.05] sm:text-[9rem]">
                    {step.no}
                  </span>

                  <div className="mono flex flex-wrap items-baseline gap-x-4 gap-y-1.5 text-[0.75rem]">
                    <span className="text-signal">krok {step.no}</span>
                    <span className="rounded border border-(--line-strong) px-2 py-0.5 text-muted">{step.time}</span>
                  </div>
                  <h3 className="mt-3 text-[clamp(1.5rem,2.8vw,2.2rem)] font-bold leading-tight tracking-tight">
                    {step.title}
                  </h3>
                  <p className="mt-3 max-w-[56ch] text-[0.9375rem] text-muted">{step.desc}</p>

                  <div className="mt-auto pt-6">
                    <span className="label label--signal block">co dostajesz</span>
                    <ul className="mt-2.5 flex flex-col gap-1.5">
                      {step.gets.map((g, i) => (
                        <motion.li
                          key={g}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.35, ease: EASE, delay: 0.12 + i * 0.07 }}
                          className="text-[0.9375rem]"
                        >
                          <span className="text-signal">✓</span> {g}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <div className="section-pad">
        <ClosingCta />
      </div>
    </section>
  );
}

function ClosingCta() {
  return (
    <Reveal>
      <div className="mt-[clamp(20px,4vh,40px)] flex flex-wrap items-center justify-between gap-x-10 gap-y-5 rounded-xl border border-dashed border-violet/50 bg-panel/40 px-6 py-6 sm:px-8">
        <div>
          <span className="mono text-[0.8125rem] text-violet">krok 00 — twój ruch</span>
          <h3 className="mt-1.5 text-[clamp(1.3rem,2.4vw,1.8rem)] font-bold leading-tight tracking-tight">
            Cała ta oś zaczyna się od{" "}
            <span className="bg-linear-to-r from-signal to-violet bg-clip-text text-transparent">
              jednej wiadomości.
            </span>
          </h3>
        </div>
        <a className="btn btn--signal" href="#contact">
          napisz, co boli <ArrowRightIcon />
        </a>
      </div>
    </Reveal>
  );
}
