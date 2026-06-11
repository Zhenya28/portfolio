"use client";

import { useDict } from "./LocaleProvider";

export function Footer() {
  const dict = useDict();
  return (
    <footer className="mx-(--pad) mono flex flex-wrap justify-between gap-3.5 border-t pb-7 pt-5 text-[0.75rem] text-faint hairline-strong">
      <span>{dict.footer.rights}</span>
      <span>
        {dict.footer.made} <span className="text-signal">exit 0</span>
      </span>
    </footer>
  );
}
