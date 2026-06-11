import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LOCALES, SITE_URL, getDictionary, isLocale, type Locale } from "@/lib/i18n";
import { LocaleProvider } from "@/components/LocaleProvider";
import { TopBar } from "@/components/TopBar";
import { Footer } from "@/components/Footer";
import { ScrollTop } from "@/components/ScrollTop";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return {
    title: { default: dict.meta.title, template: "%s — Yevhen Kapush" },
    description: dict.meta.description,
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      languages: { pl: `${SITE_URL}/pl`, en: `${SITE_URL}/en` },
    },
    openGraph: {
      title: dict.meta.ogTitle,
      description: dict.meta.description,
      url: `${SITE_URL}/${locale}`,
      siteName: "Yevhen Kapush — freelance developer",
      locale: locale === "pl" ? "pl_PL" : "en_GB",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.ogTitle,
      description: dict.meta.description,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale as Locale);
  return (
    <LocaleProvider dict={dict} locale={locale as Locale}>
      <TopBar />
      {children}
      <Footer />
      <ScrollTop />
    </LocaleProvider>
  );
}
