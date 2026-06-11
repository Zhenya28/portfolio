import type { Metadata, Viewport } from "next";
import { Inter_Tight, JetBrains_Mono } from "next/font/google";
import { SITE_URL } from "@/lib/i18n";
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
  metadataBase: new URL(SITE_URL),
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
  name: "Yevhen Kapush",
  jobTitle: "Freelance Developer",
  email: "mailto:jeka.kapush@gmail.com",
  url: SITE_URL,
  address: { "@type": "PostalAddress", addressLocality: "Warsaw", addressCountry: "PL" },
  sameAs: ["https://github.com/Zhenya28"],
  knowsLanguage: ["uk", "ru", "pl", "en"],
};

/*
  The locale lives in the [locale] segment; <html lang> defaults to "pl" and is
  corrected client-side by LocaleProvider. Per-page metadata carries hreflang.
*/
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
