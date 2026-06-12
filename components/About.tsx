"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "motion/react";
import { SectionHead } from "./Reveal";
import { useDict } from "./LocaleProvider";
import me from "@/public/me.jpg";

type Token = { w: string; tone?: string };

const toneClass: Record<string, string> = { signal: "text-signal", violet: "text-violet" };

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

/* frameless portrait — a feathered vignette melts the photo into the page */
function Portrait() {
  const dict = useDict();
  return (
    <div className="mx-auto w-full max-w-[250px] lg:mx-0 lg:max-w-none">
      <Image
        src={me}
        alt="Yevhen Kapush"
        placeholder="blur"
        sizes="(min-width: 1024px) 26vw, 250px"
        className="block w-full [mask-image:radial-gradient(ellipse_72%_72%_at_50%_46%,black_55%,transparent_99%)]"
      />
      <p className="mt-2 text-[1.35rem] font-bold tracking-tight">{dict.site.name}</p>
      <p className="mono mt-0.5 text-[0.75rem] text-muted">freelance developer</p>
    </div>
  );
}

export function About() {
  const dict = useDict();
  const t = dict.about;
  const SENTENCE = t.sentence as Token[];

  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

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

  if (reduced) {
    return (
      <section id="about" className="section-pad pt-[clamp(72px,12vh,140px)]">
        <SectionHead title={t.title} />
        <div className="mt-10 grid items-center gap-12 lg:grid-cols-[minmax(0,26%)_1fr]">
          <Portrait />
          <p className="max-w-[26ch] text-[clamp(1.4rem,3vw,2.4rem)] font-semibold leading-[1.35] tracking-tight lg:justify-self-end">
            {SENTENCE.map((token, i) => (
              <span key={i} className={token.tone ? toneClass[token.tone] : undefined}>
                {token.w}{" "}
              </span>
            ))}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="about" className="relative">
      <div ref={ref} className="h-[280vh]">
        <div className="section-pad sticky top-0 flex h-svh flex-col justify-center">
          <SectionHead title={t.title} />
          <div className="mt-[clamp(24px,5vh,48px)] grid items-center gap-x-16 gap-y-10 lg:grid-cols-[minmax(0,26%)_1fr]">
            <Portrait />
            <p className="max-w-[28ch] text-[clamp(1.3rem,2.9vw,2.4rem)] font-semibold leading-[1.4] tracking-tight lg:justify-self-end lg:pr-[clamp(0px,3vw,56px)]">
              {SENTENCE.map((token, i) => (
                <Word key={i} token={token} index={i} total={SENTENCE.length} progress={scrollYProgress} />
              ))}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
