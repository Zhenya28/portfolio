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
    default: "Pomysł jest twój. Dowiezienie — moje. | Yevhen Kapush, freelance developer",
    template: "%s — Yevhen Kapush",
  },
  description:
    "Aplikacje webowe, mobilne i automatyzacje — od pierwszej rozmowy do wdrożenia na produkcję. Stała cena, działające demo co tydzień, kod w 100% twój. Freelance developer, Warszawa.",
  openGraph: {
    title: "Pomysł jest twój. Dowiezienie — moje.",
    description:
      "Aplikacje webowe, mobilne i automatyzacje — od rozmowy do produkcji. Stała cena, demo co tydzień, kod w 100% twój.",
    url: SITE.url,
    siteName: "Yevhen Kapush — freelance developer",
    locale: "pl_PL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pomysł jest twój. Dowiezienie — moje.",
    description:
      "Aplikacje webowe, mobilne i automatyzacje — od rozmowy do produkcji. Stała cena, demo co tydzień, kod w 100% twój.",
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
