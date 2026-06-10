"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { SITE } from "@/lib/data";
import { Reveal, SectionHead } from "./Reveal";
import { ArrowRightIcon, GitHubIcon, LinkedInIcon, MailIcon } from "./icons";

type FormState = "idle" | "sending" | "done" | "error";

export function Contact() {
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
    <section id="contact" className="section-pad pb-[clamp(72px,10vh,120px)] pt-[clamp(72px,12vh,140px)]">
      <SectionHead no="04" slug="kontakt" title="Kontakt" note="odpowiedź w 24h" />
      <div className="grid gap-[clamp(28px,6vw,96px)] pt-[clamp(32px,6vh,56px)] lg:grid-cols-2">
        <Reveal>
          <h3 className="text-[clamp(1.8rem,3.6vw,2.8rem)] font-bold leading-[1.08] tracking-tight">
            Masz coś{" "}
            <span className="bg-linear-to-r from-signal to-violet bg-clip-text text-transparent">
              wartego zbudowania?
            </span>
          </h3>
          <p className="mt-4 max-w-[44ch] text-muted">
            Napisz, co to jest i co boli. Jeśli to dobry fit, dostaniesz plan i cenę — nie telefon
            od handlowca.
          </p>
          <div className="mono mt-8 flex flex-col gap-3 text-[0.875rem]">
            <a href={`mailto:${SITE.email}`} className="flex w-fit items-center gap-3 text-muted transition-colors hover:text-signal">
              <MailIcon className="size-4 flex-none" /> {SITE.email}
            </a>
            <a href={SITE.github} target="_blank" rel="noopener noreferrer" className="flex w-fit items-center gap-3 text-muted transition-colors hover:text-signal">
              <GitHubIcon className="size-4 flex-none" /> github.com/Zhenya28
            </a>
            <a href={SITE.linkedin} target="_blank" rel="noopener noreferrer" className="flex w-fit items-center gap-3 text-muted transition-colors hover:text-signal">
              <LinkedInIcon className="size-4 flex-none" /> linkedin
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="overflow-hidden rounded-xl border bg-panel hairline-strong">
            <div className="mono flex items-baseline justify-between gap-3 border-b px-5 py-3.5 text-[0.6875rem] text-faint hairline sm:px-6">
              <span>./rozpocznij-projekt</span>
              <span className="text-signal">--interaktywnie</span>
            </div>

            {state === "done" ? (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                role="status"
                className="mono flex flex-col gap-2 p-6 text-[0.875rem] sm:p-8"
              >
                <span className="text-signal">▸ status: 200 OK — wiadomość dostarczona</span>
                <span className="text-muted">▸ czas odpowiedzi: &lt; 24h, zwykle szybciej</span>
                <span className="text-faint">▸ exit 0 · do usłyszenia</span>
              </motion.div>
            ) : (
              <form className="flex flex-col p-5 sm:p-6" onSubmit={onSubmit} noValidate>
                <div className="field">
                  <label className="label mb-1.5 block" htmlFor="f-name">--imie</label>
                  <input id="f-name" name="name" type="text" autoComplete="name" required maxLength={100} placeholder="Jan Kowalski" />
                </div>
                <div className="field">
                  <label className="label mb-1.5 block" htmlFor="f-email">--email</label>
                  <input id="f-email" name="email" type="email" autoComplete="email" required maxLength={200} placeholder="jan@firma.pl" />
                </div>
                <div className="field">
                  <label className="label mb-1.5 block" htmlFor="f-msg">--opis</label>
                  <textarea id="f-msg" name="message" rows={4} required maxLength={5000} placeholder="Aplikacja, dashboard, bot…" />
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
                  {state === "sending" ? "wysyłanie…" : "wyślij"} <ArrowRightIcon />
                </button>
                {state === "error" && (
                  <p role="alert" className="mono mt-3 text-[0.8125rem] text-amber">
                    ▸ wysyłka nie powiodła się — napisz bezpośrednio: {SITE.email}
                  </p>
                )}
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
