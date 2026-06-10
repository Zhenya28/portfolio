import type { Metadata, Viewport } from "next";
import { Inter_Tight, JetBrains_Mono } from "next/font/google";
import { SITE } from "@/lib/data";
import "./globals.css";

const inter = Inter_Tight({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Yevhen Kapush — Freelance Developer, Warszawa",
    template: "%s — Yevhen Kapush",
  },
  description:
    "Freelance developer w Warszawie. Aplikacje webowe i mobilne, automatyzacje — działające na produkcji, nie w szufladzie. Cztery języki, dwa kraje, jedna zasada: dokończyć.",
  openGraph: {
    title: "Yevhen Kapush — tworzy i automatyzuje software, który działa",
    description: "Freelance developer w Warszawie. Aplikacje webowe i mobilne, automatyzacje.",
    url: SITE.url,
    siteName: "Yevhen Kapush",
    locale: "pl_PL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Yevhen Kapush — tworzy i automatyzuje software, który działa",
    description: "Freelance developer w Warszawie. Aplikacje webowe i mobilne, automatyzacje.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0a0d10",
  width: "device-width",
  initialScale: 1,
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: SITE.name,
  jobTitle: "Freelance Developer",
  email: `mailto:${SITE.email}`,
  url: SITE.url,
  address: { "@type": "PostalAddress", addressLocality: "Warsaw", addressCountry: "PL" },
  sameAs: [SITE.github],
  knowsLanguage: ["uk", "ru", "pl", "en"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl" className={`${inter.variable} ${jetbrains.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
