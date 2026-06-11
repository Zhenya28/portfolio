"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "motion/react";
import { SectionHead } from "./Reveal";

type Token = { w: string; tone?: "signal" | "violet" };

const SENTENCE: Token[] = [
  { w: "Nie" }, { w: "jestem" }, { w: "agencją." },
  { w: "Jestem" }, { w: "człowiekiem," }, { w: "który" },
  { w: "naprawdę", tone: "signal" }, { w: "kończy", tone: "signal" }, { w: "projekty.", tone: "signal" },
  { w: "Prowadzę" }, { w: "je" }, { w: "od", tone: "violet" }, { w: "pomysłu", tone: "violet" },
  { w: "do", tone: "violet" }, { w: "produkcji,", tone: "violet" }, { w: "a" }, { w: "mój" },
  { w: "kod" }, { w: "codziennie" }, { w: "robi" }, { w: "swoją" }, { w: "robotę" },
  { w: "dla" }, { w: "prawdziwych" }, { w: "użytkowników." },
  { w: "Ty" }, { w: "wiesz," }, { w: "co" }, { w: "boli." },
  { w: "Ja" }, { w: "sprawiam,", tone: "signal" }, { w: "że", tone: "signal" }, { w: "przestaje.", tone: "signal" },
];

const FACTS = ["Warszawa, PL", "4 języki", "odpowiedź < 24 h", "stała wycena", "— Yevhen Kapush"];

const toneClass = { signal: "text-signal", violet: "text-violet" } as const;

/* Each word brightens over its own slice of the pinned scroll. */
function Word({
  token,
  index,
  total,
  progress,
}: {
  token: Token;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const start = (index / total) * 0.82;
  const opacity = useTransform(progress, [start, start + 0.09], [0.13, 1]);
  return (
    <motion.span style={{ opacity }} className={token.tone ? toneClass[token.tone] : undefined}>
      {token.w}{" "}
    </motion.span>
  );
}

export function About() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  /* own scroll → progress mapping: 0 when the track pins, 1 when it unpins */
  const scrollYProgress = useMotionValue(0);
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    let raf: number | null = null;
    const update = () => {
      raf = null;
      const total = el.offsetHeight - window.innerHeight;
      if (total <= 0) return;
      const p = Math.min(1, Math.max(0, -el.getBoundingClientRect().top / total));
      scrollYProgress.set(p);
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
  }, [scrollYProgress, reduced]);

  const factsOpacity = useTransform(scrollYProgress, [0.84, 0.96], [0, 1]);
  const factsY = useTransform(scrollYProgress, [0.84, 0.96], [14, 0]);

  /* reduced motion: same content, no pinning, no scrub */
  if (reduced) {
    return (
      <section id="about" className="section-pad pt-[clamp(72px,12vh,140px)]">
        <SectionHead no="03" slug="o_mnie" title="O mnie" note="krótka wersja" />
        <p className="mt-10 max-w-5xl text-[clamp(1.5rem,3.4vw,2.8rem)] font-semibold leading-[1.35] tracking-tight">
          {SENTENCE.map((t, i) => (
            <span key={i} className={t.tone ? toneClass[t.tone] : undefined}>
              {t.w}{" "}
            </span>
          ))}
        </p>
        <div className="mono mt-10 flex flex-wrap gap-x-6 gap-y-2 text-[0.8125rem] text-muted">
          {FACTS.map((f) => (
            <span key={f}>
              <span className="text-signal">▸</span> {f}
            </span>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id="about" className="relative">
      {/* tall track = the read happens while the viewport stays pinned */}
      <div ref={ref} className="h-[280vh]">
        <div className="section-pad sticky top-0 flex h-svh flex-col justify-center">
          <SectionHead no="03" slug="o_mnie" title="O mnie" note="scrolluj — tekst czyta się sam" />
          <p className="mt-[clamp(28px,6vh,56px)] max-w-5xl text-[clamp(1.5rem,3.4vw,2.8rem)] font-semibold leading-[1.35] tracking-tight">
            {SENTENCE.map((t, i) => (
              <Word key={i} token={t} index={i} total={SENTENCE.length} progress={scrollYProgress} />
            ))}
          </p>
          <motion.div
            style={{ opacity: factsOpacity, y: factsY }}
            className="mono mt-[clamp(28px,5vh,48px)] flex flex-wrap gap-x-6 gap-y-2 text-[0.8125rem] text-muted"
          >
            {FACTS.map((f) => (
              <span key={f}>
                <span className="text-signal">▸</span> {f}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
