import { pl, type Dict } from "./pl";
import { en } from "./en";

export type { Dict };
export const LOCALES = ["pl", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "pl";

const dictionaries: Record<Locale, Dict> = { pl, en };

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export function getDictionary(locale: Locale): Dict {
  return dictionaries[locale];
}

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://yevhenkapush.vercel.app";

export const SERVICE_SLUGS = [
  "strony-www-e-commerce",
  "aplikacje-webowe",
  "automatyzacje-ai",
  "digital-marketing",
] as const;
export type ServiceSlug = (typeof SERVICE_SLUGS)[number];

export const CASE_SLUGS = ["flashly", "myfinance", "pyszne-slots-monitor"] as const;
export type CaseSlug = (typeof CASE_SLUGS)[number];
