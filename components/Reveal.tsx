"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

/** One-time fade + 24px rise when the element scrolls into view. */
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.8, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Section header — just the title over a hairline. */
export function SectionHead({ title }: { title: string }) {
  return (
    <Reveal>
      <div className="border-b pb-5 hairline-strong">
        <h2 className="text-[clamp(1.8rem,4vw,3rem)] font-bold leading-none tracking-tight">
          {title}
        </h2>
      </div>
    </Reveal>
  );
}
