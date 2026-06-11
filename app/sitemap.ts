import type { MetadataRoute } from "next";
import { CASE_SLUGS, LOCALES, SERVICE_SLUGS, SITE_URL } from "@/lib/i18n";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];
  for (const locale of LOCALES) {
    entries.push({ url: `${SITE_URL}/${locale}`, lastModified: now, changeFrequency: "monthly", priority: 1 });
    for (const slug of SERVICE_SLUGS) {
      entries.push({ url: `${SITE_URL}/${locale}/uslugi/${slug}`, lastModified: now, changeFrequency: "monthly", priority: 0.9 });
    }
    for (const slug of CASE_SLUGS) {
      entries.push({ url: `${SITE_URL}/${locale}/projekty/${slug}`, lastModified: now, changeFrequency: "yearly", priority: 0.7 });
    }
  }
  return entries;
}
