"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Reveal, SectionHead } from "./Reveal";
import { ArrowRightIcon, GitHubIcon, LinkedInIcon, MailIcon } from "./icons";
import { useDict } from "./LocaleProvider";

type FormState = "idle" | "sending" | "done" | "error";

export function Contact() {
  const dict = useDict();
  const t = dict.contact;
  const [state, setState] = useState<FormState>("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    setState("sending");
    try {
      const data = Object.fromEntries(new FormData(form).entries());
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setState(res.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  }

  return (
    <section id="contact" className="section-pad overflow-x-clip pb-[clamp(72px,10vh,120px)] pt-[clamp(72px,12vh,140px)]">
      <SectionHead title={t.title} />
      <div className="grid gap-[clamp(28px,6vw,96px)] pt-[clamp(32px,6vh,56px)] lg:grid-cols-2">
        <Reveal>
          <h3 className="text-[clamp(1.8rem,3.6vw,2.8rem)] font-bold leading-[1.08] tracking-tight">
            {t.h3a}{" "}
            <span className="bg-linear-to-r from-signal to-violet bg-clip-text text-transparent">
              {t.h3Accent}
            </span>
          </h3>
          <p className="mt-4 max-w-[44ch] text-muted">{t.p}</p>
          <div className="mono mt-5 flex flex-wrap gap-x-5 gap-y-1.5 text-[0.75rem] text-faint">
            {t.trust.map((item) => (
              <span key={item}>
                <span className="text-signal">✓</span> {item}
              </span>
            ))}
          </div>
          <div className="mono mt-8 flex flex-col gap-3 text-[0.875rem]">
            <a href={`mailto:${dict.site.email}`} className="flex w-fit items-center gap-3 text-muted transition-colors hover:text-signal">
              <MailIcon className="size-4 flex-none" /> {dict.site.email}
            </a>
            <a href={dict.site.github} target="_blank" rel="noopener noreferrer" className="flex w-fit items-center gap-3 text-muted transition-colors hover:text-signal">
              <GitHubIcon className="size-4 flex-none" /> github.com/Zhenya28
            </a>
            <a href={dict.site.linkedin} target="_blank" rel="noopener noreferrer" className="flex w-fit items-center gap-3 text-muted transition-colors hover:text-signal">
              <LinkedInIcon className="size-4 flex-none" /> linkedin
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          {/* the second terminal on the site: hero shows output, this one takes input */}
          <div className="relative">
            <div
              aria-hidden
              className="absolute -inset-10 -z-10 bg-[radial-gradient(closest-side,rgba(159,239,0,0.12),rgba(141,123,255,0.08),transparent)] blur-2xl"
            />
            <div className="panel overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
              <div className="panel__bar">
                <span className="panel__dot" />
                <span className="panel__dot" />
                <span className="panel__dot bg-signal/60" />
                <span className="ml-2">{t.formTitle}</span>
                <span className="ml-auto text-signal">{t.formFlag}</span>
              </div>

              {state === "done" ? (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  role="status"
                  className="mono flex flex-col gap-2 p-6 text-[0.875rem] sm:p-8"
                >
                  <span className="text-signal">{t.doneTitle}</span>
                  <span className="text-muted">{t.doneEta}</span>
                  <span className="text-faint">{t.doneBye}</span>
                </motion.div>
              ) : (
                <form className="flex flex-col p-5 sm:p-7" onSubmit={onSubmit} noValidate>
                <div className="field">
                  <label className="label mb-1.5 block" htmlFor="f-name">{t.name}</label>
                  <input id="f-name" name="name" type="text" autoComplete="name" required maxLength={100} placeholder={t.namePh} />
                </div>
                <div className="field">
                  <label className="label mb-1.5 block" htmlFor="f-email">--email</label>
                  <input id="f-email" name="email" type="email" autoComplete="email" required maxLength={200} placeholder={t.emailPh} />
                </div>
                <div className="field">
                  <label className="label mb-1.5 block" htmlFor="f-msg">{t.msg}</label>
                  <textarea id="f-msg" name="message" rows={4} required maxLength={5000} placeholder={t.msgPh} />
                </div>
                {/* honeypot — hidden from humans, irresistible to bots */}
                <input
                  type="text"
                  name="company"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="absolute -left-[9999px] size-px opacity-0"
                />
                <button className="btn btn--signal mt-6 self-start" type="submit" disabled={state === "sending"}>
                  {state === "sending" ? t.sending : t.send} <ArrowRightIcon />
                </button>
                {state === "error" && (
                  <p role="alert" className="mono mt-3 text-[0.8125rem] text-amber">
                    {t.error} {dict.site.email}
                  </p>
                )}
                </form>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
