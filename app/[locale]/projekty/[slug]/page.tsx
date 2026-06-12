import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CASE_SLUGS,
  SITE_URL,
  getDictionary,
  isLocale,
  type CaseSlug,
  type Locale,
} from "@/lib/i18n";
import { Reveal } from "@/components/Reveal";
import { ArrowRightIcon, GitHubIcon } from "@/components/icons";

export function generateStaticParams() {
  return CASE_SLUGS.map((slug) => ({ slug }));
}

type Params = { locale: string; slug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale) || !(CASE_SLUGS as readonly string[]).includes(slug)) return {};
  const dict = getDictionary(locale);
  const caseStudy = dict.caseStudies[slug as CaseSlug];
  return {
    title: caseStudy.metaTitle,
    description: caseStudy.summary,
    alternates: {
      canonical: `${SITE_URL}/${locale}/projekty/${slug}`,
      languages: {
        pl: `${SITE_URL}/pl/projekty/${slug}`,
        en: `${SITE_URL}/en/projekty/${slug}`,
      },
    },
  };
}

export default async function CaseStudyPage({ params }: { params: Promise<Params> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale) || !(CASE_SLUGS as readonly string[]).includes(slug)) notFound();
  const dict = getDictionary(locale as Locale);
  const caseStudy = dict.caseStudies[slug as CaseSlug];
  const project = dict.work.items.find((p) => p.slug === slug);
  if (!project) notFound();
  const home = `/${locale}`;

  return (
    <main className="pt-24">
      {/* hero */}
      <section className="section-pad relative overflow-hidden pb-[clamp(36px,6vh,64px)] pt-[clamp(32px,6vh,64px)]">
        <div className="grid-bg" aria-hidden />
        <div className="relative">
          <div className="mono text-[0.75rem] text-faint">
            <Link href={`${home}#work`} className="transition-colors hover:text-signal">
              {caseStudy.backCta}
            </Link>
          </div>
          <h1 className="mt-6 max-w-4xl text-[clamp(2.4rem,5.6vw,4.4rem)] font-extrabold leading-[1.04] tracking-[-0.03em]">
            {project.title}
          </h1>
          <p className="mt-5 max-w-[64ch] text-[clamp(0.95rem,1.2vw,1.1rem)] text-muted">
            {caseStudy.summary}
          </p>

          <div className="mono mt-8 grid gap-px overflow-hidden rounded-lg border bg-(--line) hairline-strong sm:grid-cols-3">
            {caseStudy.facts.map(([key, value]) => (
              <div key={key} className="bg-panel p-4">
                <span className="block text-[0.6875rem] uppercase tracking-[0.1em] text-faint">{key}</span>
                <span className="mt-1 block text-[0.8125rem] text-text">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* story */}
      <section className="section-pad pt-[clamp(32px,6vh,64px)]">
        <div className="flex max-w-3xl flex-col gap-[clamp(32px,5vh,56px)]">
          {caseStudy.sections.map((section, i) => (
            <Reveal key={section.h} delay={i * 0.05}>
              <div>
                <span className="mono text-[0.75rem] text-signal">
                  {"//"} {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="mt-2 text-[clamp(1.4rem,2.8vw,2rem)] font-bold leading-tight tracking-tight">
                  {section.h}
                </h2>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">{section.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* results + stack */}
      <section className="section-pad pt-[clamp(40px,7vh,72px)]">
        <Reveal>
          <div className="rounded-2xl bg-signal px-[clamp(22px,4vw,48px)] py-[clamp(24px,4vh,40px)] text-bg">
            <div className="grid gap-6 sm:grid-cols-3">
              {caseStudy.results.map((result) => (
                <div key={result} className="text-[1.05rem] font-bold leading-snug tracking-tight">
                  ✓ {result}
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-1.5 border-t border-bg/20 pt-5">
              {project.stack.map((tech) => (
                <span key={tech} className="mono rounded border border-bg/30 px-2 py-0.5 text-[0.6875rem]">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* CTAs */}
      <section className="section-pad py-[clamp(48px,8vh,96px)]">
        <Reveal>
          <div className="flex flex-wrap items-center gap-3">
            <Link href={`${home}#contact`} className="btn btn--signal">
              {caseStudy.quoteCta} <ArrowRightIcon />
            </Link>
            <a href={project.href} target="_blank" rel="noopener noreferrer" className="btn">
              <GitHubIcon className="size-4" /> GitHub
            </a>
            <Link href={`${home}#work`} className="btn">
              {caseStudy.backCta}
            </Link>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
