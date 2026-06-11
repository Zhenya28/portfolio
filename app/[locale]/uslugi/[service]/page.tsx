import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  SERVICE_SLUGS,
  SITE_URL,
  getDictionary,
  isLocale,
  type Locale,
  type ServiceSlug,
} from "@/lib/i18n";
import { Reveal } from "@/components/Reveal";
import { ArrowRightIcon } from "@/components/icons";
import { ServiceWire } from "@/components/ServiceWire";

export function generateStaticParams() {
  return SERVICE_SLUGS.map((service) => ({ service }));
}

type Params = { locale: string; service: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale, service } = await params;
  if (!isLocale(locale) || !(SERVICE_SLUGS as readonly string[]).includes(service)) return {};
  const page = getDictionary(locale).servicePages[service as ServiceSlug];
  return {
    title: page.metaTitle,
    description: page.metaDesc,
    alternates: {
      canonical: `${SITE_URL}/${locale}/uslugi/${service}`,
      languages: {
        pl: `${SITE_URL}/pl/uslugi/${service}`,
        en: `${SITE_URL}/en/uslugi/${service}`,
      },
    },
  };
}

export default async function ServicePage({ params }: { params: Promise<Params> }) {
  const { locale, service } = await params;
  if (!isLocale(locale) || !(SERVICE_SLUGS as readonly string[]).includes(service)) notFound();
  const dict = getDictionary(locale as Locale);
  const page = dict.servicePages[service as ServiceSlug];
  const common = dict.servicesCommon;
  const caseStudy = dict.caseStudies[page.caseSlug as keyof typeof dict.caseStudies];
  const caseProject = dict.work.items.find((p) => p.slug === page.caseSlug);
  const home = `/${locale}`;

  return (
    <main className="pt-24">
      {/* hero */}
      <section className="section-pad relative overflow-hidden pb-[clamp(40px,7vh,72px)] pt-[clamp(32px,6vh,64px)]">
        <div className="grid-bg" aria-hidden />
        <div className="relative grid items-center gap-x-[clamp(32px,5vw,72px)] gap-y-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <div>
            <div className="mono flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.75rem] text-faint">
              <Link href={home} className="transition-colors hover:text-signal">
                {common.backHome}
              </Link>
              <span className="text-signal">{"//"}</span>
              <span>{page.eyebrow}</span>
            </div>
            <h1 className="mt-6 text-[clamp(2.4rem,5.6vw,4.4rem)] font-extrabold leading-[1.04] tracking-[-0.03em]">
              {page.h1} <span className="text-signal">{page.h1Accent}</span>
            </h1>
            <p className="mt-6 max-w-[64ch] text-[clamp(0.95rem,1.2vw,1.1rem)] text-muted">
              {page.intro}
            </p>
            <div className="mono mt-6 flex flex-wrap gap-2">
              {page.pains.map((pain) => (
                <span key={pain} className="rounded border border-amber/30 px-2.5 py-1 text-[0.75rem] text-amber/90">
                  ✗ {pain}
                </span>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <a className="btn btn--signal" href="#wycena">
                {common.ctaButton} <ArrowRightIcon />
              </a>
              <a className="btn" href="#pakiety">
                {common.packagesTitle.toLowerCase()}
              </a>
            </div>
          </div>

          {/* skeleton illustration of this pillar */}
          <div className="relative hidden h-72 lg:block">
            <div
              aria-hidden
              className="absolute -inset-10 -z-10 bg-[radial-gradient(closest-side,rgba(159,239,0,0.1),rgba(141,123,255,0.07),transparent)] blur-2xl"
            />
            <ServiceWire slug={service as ServiceSlug} />
          </div>
        </div>
      </section>

      {/* what exactly I do */}
      <section className="section-pad pt-[clamp(48px,8vh,96px)]">
        <Reveal>
          <div className="flex items-end justify-between gap-4 border-b pb-5 hairline-strong">
            <h2 className="text-[clamp(1.6rem,3.4vw,2.6rem)] font-bold leading-none tracking-tight">
              {common.includesTitle}
            </h2>
          </div>
        </Reveal>
        <div className="mt-[clamp(24px,4vh,40px)] grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {page.includes.map((item, i) => (
            <Reveal key={item.name} delay={i * 0.06} className="h-full">
              <div className="flex h-full flex-col rounded-xl border bg-panel/50 p-5 hairline-strong sm:p-6">
                <span className="mono text-[0.6875rem] text-signal">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-2 text-[1.05rem] font-bold leading-snug tracking-tight">{item.name}</h3>
                <p className="mt-2 text-[0.875rem] text-muted">{item.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* packages */}
      <section id="pakiety" className="section-pad scroll-mt-24 pt-[clamp(48px,8vh,96px)]">
        <Reveal>
          <div className="flex items-end justify-between gap-4 border-b pb-5 hairline-strong">
            <h2 className="text-[clamp(1.6rem,3.4vw,2.6rem)] font-bold leading-none tracking-tight">
              {common.packagesTitle}
            </h2>
            <span className="label hidden pb-1 text-right sm:block">{common.packagesNote}</span>
          </div>
        </Reveal>
        <div className="mt-[clamp(24px,4vh,40px)] grid gap-5 lg:grid-cols-3 lg:items-stretch">
          {page.packages.map((pkg, i) => (
            <Reveal key={pkg.name} delay={i * 0.08} className="h-full">
              <article
                className={`relative flex h-full flex-col rounded-xl border p-6 transition-transform duration-300 will-change-transform hover:-translate-y-1 sm:p-7 ${
                  pkg.featured
                    ? "border-signal/60 bg-panel shadow-[0_0_50px_rgba(159,239,0,0.07)]"
                    : "border-(--line-strong) bg-panel/50"
                }`}
              >
                {pkg.featured && (
                  <span className="mono absolute -top-3 left-6 rounded border border-signal/60 bg-bg px-2.5 py-0.5 text-[0.65rem] uppercase tracking-[0.1em] text-signal">
                    {common.featured}
                  </span>
                )}
                <span className="mono w-fit rounded border border-(--line-strong) px-2 py-0.5 text-[0.6875rem] text-faint">
                  {pkg.time}
                </span>
                <h3 className="mt-4 text-[1.3rem] font-bold leading-tight tracking-tight">{pkg.name}</h3>
                <span className={`mono mt-4 block text-[clamp(1.6rem,2.4vw,2rem)] font-bold ${pkg.featured ? "text-signal" : "text-text"}`}>
                  {pkg.price}
                </span>
                <span className="mono mt-1 block text-[0.6875rem] text-faint">{common.fixedNote}</span>
                <ul className="mt-5 flex flex-col gap-2 border-t pt-5 hairline">
                  {pkg.includes.map((item) => (
                    <li key={item} className="text-[0.875rem] text-muted">
                      <span className="text-signal">✓</span> {item}
                    </li>
                  ))}
                </ul>
                <a
                  className={`btn mt-7 w-full justify-center ${pkg.featured ? "btn--signal" : ""}`}
                  href="#wycena"
                >
                  {pkg.cta} <ArrowRightIcon />
                </a>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* proof: related case study */}
      {caseProject && (
        <section className="section-pad pt-[clamp(48px,8vh,96px)]">
          <Reveal>
            <div className="grid gap-6 rounded-2xl border bg-panel/40 p-6 hairline-strong sm:p-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
              <div>
                <span className="label label--signal">{common.caseTitle}</span>
                <h3 className="mt-2 text-[clamp(1.4rem,2.8vw,2rem)] font-bold leading-tight tracking-tight">
                  {caseProject.title} — {caseProject.kind.toLowerCase()}
                </h3>
                <p className="mt-3 max-w-[64ch] text-[0.9375rem] text-muted">{caseStudy.summary}</p>
                <p className="mt-3 text-[1rem] font-semibold text-signal">{caseProject.result}</p>
              </div>
              <Link href={`${home}/projekty/${page.caseSlug}`} className="btn w-fit">
                {common.caseCta} <ArrowRightIcon />
              </Link>
            </div>
          </Reveal>
        </section>
      )}

      {/* FAQ */}
      <section className="section-pad pt-[clamp(48px,8vh,96px)]">
        <Reveal>
          <div className="flex items-end justify-between gap-4 border-b pb-5 hairline-strong">
            <h2 className="text-[clamp(1.6rem,3.4vw,2.6rem)] font-bold leading-none tracking-tight">
              {common.faqTitle}
            </h2>
          </div>
        </Reveal>
        <div className="mt-[clamp(20px,3vh,32px)] flex flex-col">
          {page.faq.map((item, i) => (
            <Reveal key={item.q} delay={i * 0.05}>
              <details className="group border-b hairline">
                <summary className="flex cursor-pointer items-baseline justify-between gap-4 py-5 text-[1.05rem] font-semibold tracking-tight transition-colors hover:text-signal [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <span className="mono text-signal transition-transform duration-300 group-open:rotate-45">+</span>
                </summary>
                <p className="max-w-[72ch] pb-6 text-[0.9375rem] text-muted">{item.a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </section>

      {/* final CTA */}
      <section id="wycena" className="section-pad scroll-mt-24 py-[clamp(56px,10vh,120px)]">
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl border border-signal/40 bg-panel p-8 sm:p-12">
            <div
              aria-hidden
              className="absolute -right-20 -top-20 size-72 bg-[radial-gradient(closest-side,rgba(159,239,0,0.12),transparent)] blur-2xl"
            />
            <h2 className="text-[clamp(1.8rem,3.8vw,3rem)] font-extrabold leading-tight tracking-tight">
              {common.ctaTitle}
            </h2>
            <p className="mt-3 max-w-[52ch] text-muted">{common.ctaDesc}</p>
            <Link href={`${home}#contact`} className="btn btn--signal mt-7">
              {common.ctaButton} <ArrowRightIcon />
            </Link>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
