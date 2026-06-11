"use client";

import { createContext, useContext, useEffect, type ReactNode } from "react";
import type { Dict, Locale } from "@/lib/i18n";

const LocaleContext = createContext<{ dict: Dict; locale: Locale } | null>(null);

export function LocaleProvider({
  dict,
  locale,
  children,
}: {
  dict: Dict;
  locale: Locale;
  children: ReactNode;
}) {
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  return <LocaleContext.Provider value={{ dict, locale }}>{children}</LocaleContext.Provider>;
}

export function useDict(): Dict {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useDict must be used inside LocaleProvider");
  return ctx.dict;
}

export function useLocale(): Locale {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used inside LocaleProvider");
  return ctx.locale;
}
