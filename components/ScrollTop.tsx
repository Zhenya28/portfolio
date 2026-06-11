"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useDict } from "./LocaleProvider";

export function ScrollTop() {
  const dict = useDict();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let raf: number | null = null;
    const onScroll = () => {
      if (raf !== null) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        setVisible(window.scrollY > 700);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="mono fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full border border-(--line-strong) bg-panel/80 px-4 py-2.5 text-[0.75rem] text-muted backdrop-blur-md transition-colors hover:border-signal hover:text-signal"
        >
          {dict.footer.toTop} <span aria-hidden>↑</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
