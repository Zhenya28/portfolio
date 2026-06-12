"use client";

/*
  Service illustrations, u1core-style but story-driven: each one narrates the
  essence of its category instead of being a generic skeleton.

  e-commerce   → storefront with a cart and a "purchase done" toast
  web apps     → SaaS dashboard: KPIs, a self-drawing revenue chart, deploy tag
  automation   → node pipeline cron → bot → Telegram/report, current flowing
  marketing    → ad creative → conversion funnel → leads counter

  Pure CSS/SVG, decorative (aria-hidden). The only loops are a slow dash-flow
  and LED pulses — alive, not noisy.
*/

import { motion, useReducedMotion } from "motion/react";
import type { ServiceSlug } from "@/lib/i18n";

function Dots() {
  return (
    <span className="flex gap-1">
      <i className="size-1 rounded-full bg-(--line-strong)" />
      <i className="size-1 rounded-full bg-(--line-strong)" />
      <i className="size-1 rounded-full bg-(--line-strong)" />
    </span>
  );
}

function Frame({
  className = "",
  children,
  bar = true,
  url = false,
}: {
  className?: string;
  children: React.ReactNode;
  bar?: boolean;
  url?: boolean;
}) {
  return (
    <div className={`overflow-hidden rounded-lg border border-(--line-strong) bg-panel-2 shadow-[0_8px_30px_rgba(0,0,0,0.35)] ${className}`}>
      {bar && (
        <div className="flex items-center gap-2 border-b border-(--line) px-2 py-1.5">
          <Dots />
          {url && <span className="h-1.5 w-1/3 rounded-full bg-(--line)" />}
        </div>
      )}
      {children}
    </div>
  );
}

const sk = "rounded-[3px] bg-(--line-strong)";
const skSoft = "rounded-[3px] bg-(--line-strong) opacity-60";
const hi = "rounded-[3px] bg-signal";

/* ── e-commerce: browse → product → bought ─────────────────────────── */

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-3 text-muted" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 4h2l2.2 11h10.6l2-7H7" />
      <circle cx="9.5" cy="19" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="16.5" cy="19" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

function ProductCard({ featured = false }: { featured?: boolean }) {
  return (
    <div className={`flex flex-col gap-1 rounded-md border p-1.5 ${featured ? "border-signal/70 bg-signal/[0.06]" : "border-(--line) bg-panel"}`}>
      <span className={`h-8 rounded-[3px] ${featured ? "bg-linear-to-br from-signal/30 to-signal/5" : "bg-(--line)"}`} />
      <span className={`${sk} h-1 w-4/5`} />
      <div className="flex items-center justify-between gap-1">
        <span className={`${featured ? hi : skSoft} h-1.5 w-2/5`} />
        {featured && <span className="grid size-3.5 place-items-center rounded-[3px] bg-signal text-[0.5rem] font-bold text-bg">+</span>}
      </div>
    </div>
  );
}

export function WireWebsite() {
  return (
    <div aria-hidden className="pointer-events-none relative flex h-full select-none items-end justify-center gap-4 px-4 pt-5">
      {/* storefront */}
      <Frame className="w-[58%]" url>
        <div className="flex flex-col gap-2 p-2.5">
          <div className="flex items-center justify-between">
            <span className={`${hi} h-2 w-1/4`} />
            <span className="relative">
              <CartIcon />
              <span className="absolute -right-1.5 -top-1.5 grid size-3 place-items-center rounded-full bg-signal text-[0.5rem] font-bold text-bg [animation:pulse_2.6s_ease-in-out_infinite]">
                2
              </span>
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            <ProductCard />
            <ProductCard featured />
            <ProductCard />
          </div>
        </div>
      </Frame>

      {/* mobile checkout */}
      <Frame className="w-[22%]">
        <div className="flex flex-col gap-1.5 p-2">
          <span className="h-9 rounded-[3px] bg-linear-to-br from-signal/25 to-transparent" />
          <span className={`${sk} h-1.5 w-3/4`} />
          <span className={`${skSoft} h-1 w-1/2`} />
          <span className={`${hi} mt-0.5 h-3 w-full`} />
        </div>
      </Frame>

    </div>
  );
}

/* ── web apps / MVP: a dashboard worth shipping ────────────────────── */

function Kpi({ accent = false, spark }: { accent?: boolean; spark: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-md border border-(--line) bg-panel p-1.5">
      <span className={`${skSoft} h-1 w-1/2`} />
      <span className={`${accent ? hi : sk} h-1.5 w-2/3`} />
      <svg viewBox="0 0 40 12" className="h-2.5 w-full">
        <polyline
          points={spark}
          fill="none"
          stroke={accent ? "var(--color-signal)" : "var(--color-faint)"}
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

export function WireApp() {
  const reduced = useReducedMotion();
  return (
    <div aria-hidden className="pointer-events-none relative flex h-full select-none items-end justify-center px-4 pt-5">
      <Frame className="w-[88%]" url>
        <div className="flex gap-2 p-2.5">
          {/* sidebar */}
          <div className="flex w-[16%] flex-col gap-1.5 border-r border-(--line) pr-1.5">
            <span className="size-2.5 rounded-[3px] bg-signal" />
            <span className={`${hi} mt-1 h-1.5`} />
            <span className={`${sk} h-1.5`} />
            <span className={`${skSoft} h-1.5`} />
            <span className={`${skSoft} h-1.5`} />
          </div>
          {/* main */}
          <div className="flex flex-1 flex-col gap-1.5">
            <div className="grid grid-cols-3 gap-1.5">
              <Kpi accent spark="0,9 8,7 16,8 24,4 32,5 40,2" />
              <Kpi spark="0,8 8,9 16,6 24,7 32,4 40,5" />
              <Kpi spark="0,6 8,8 16,7 24,9 32,6 40,7" />
            </div>
            {/* revenue chart draws itself */}
            <div className="relative rounded-md border border-(--line) bg-panel p-1.5">
              <svg viewBox="0 0 200 52" className="h-14 w-full">
                <defs>
                  <linearGradient id="wa-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-signal)" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="var(--color-signal)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {[13, 26, 39].map((y) => (
                  <line key={y} x1="0" y1={y} x2="200" y2={y} stroke="var(--color-text)" strokeOpacity="0.06" />
                ))}
                <motion.path
                  d="M0 46 L28 38 L56 41 L84 28 L112 31 L140 16 L168 20 L200 8"
                  fill="none"
                  stroke="var(--color-signal)"
                  strokeWidth="1.6"
                  initial={reduced ? false : { pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                />
                <path d="M0 46 L28 38 L56 41 L84 28 L112 31 L140 16 L168 20 L200 8 L200 52 L0 52 Z" fill="url(#wa-fill)" />
                <circle cx="200" cy="8" r="2.4" fill="var(--color-signal)" className="[animation:pulse_2.4s_ease-in-out_infinite]" />
              </svg>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-(--line-strong)" />
              <span className={`${sk} h-1 flex-1`} />
              <span className={`${skSoft} h-1 w-1/6`} />
            </div>
          </div>
        </div>
      </Frame>
    </div>
  );
}

/* ── automation & AI: chaos in, robot in the middle, done-list out ─── */

export function WireAutomation() {
  return (
    <div aria-hidden className="pointer-events-none flex h-full select-none items-center justify-center px-4 pt-2">
      <svg viewBox="0 0 320 168" className="h-full w-full max-w-[420px]">
        {/* three manual chores, perfectly stacked */}
        {[
          { y: 18, glyph: "mail" },
          { y: 68, glyph: "doc" },
          { y: 118, glyph: "loop" },
        ].map(({ y, glyph }) => (
          <g key={glyph}>
            <rect x="16" y={y} width="40" height="32" rx="8" fill="var(--color-panel-2)" stroke="var(--line-strong)" />
            {glyph === "mail" && (
              <g stroke="var(--color-muted)" strokeWidth="1.6" fill="none">
                <rect x="26" y={y + 9} width="20" height="14" rx="2" />
                <path d={`M26 ${y + 11} l10 7 10-7`} />
              </g>
            )}
            {glyph === "doc" && (
              <g stroke="var(--color-muted)" strokeWidth="1.6" fill="none">
                <rect x="28" y={y + 7} width="16" height="18" rx="2" />
                <path d={`M31 ${y + 12} h10 M31 ${y + 16} h10 M31 ${y + 20} h6`} />
              </g>
            )}
            {glyph === "loop" && (
              <g stroke="var(--color-muted)" strokeWidth="1.6" fill="none">
                <path d={`M28 ${y + 13} a8 8 0 0 1 14 -2 M44 ${y + 19} a8 8 0 0 1 -14 2`} />
                <path d={`M42 ${y + 7} v5 h-5 M30 ${y + 25} v-5 h5`} />
              </g>
            )}
          </g>
        ))}

        {/* converging flows */}
        <g
          fill="none"
          stroke="var(--color-signal)"
          strokeWidth="1.4"
          strokeDasharray="5 5"
          opacity="0.7"
          className="[animation:dashflow_2.6s_linear_infinite]"
        >
          <path d="M56 34 H88 Q98 34 98 44 V74 Q98 84 108 84 H124" />
          <path d="M56 84 H124" />
          <path d="M56 134 H88 Q98 134 98 124 V94 Q98 84 108 84 H124" />
        </g>

        {/* the robot */}
        <rect x="124" y="60" width="48" height="48" rx="12" fill="rgba(159,239,0,0.12)" stroke="var(--color-signal)" strokeWidth="1.4" />
        <g stroke="var(--color-signal)" strokeWidth="1.8" fill="none">
          <circle cx="148" cy="56" r="2.6" fill="var(--color-signal)" stroke="none" />
          <path d="M148 58 v6" />
          <rect x="134" y="72" width="28" height="22" rx="6" />
          <circle cx="143" cy="81" r="1.6" fill="var(--color-signal)" stroke="none" />
          <circle cx="153" cy="81" r="1.6" fill="var(--color-signal)" stroke="none" />
          <path d="M142 88 h12" />
        </g>
        <text
          x="148"
          y="126"
          textAnchor="middle"
          fontSize="11"
          fontWeight="700"
          fill="var(--color-signal)"
          style={{ fontFamily: "var(--font-jetbrains)", letterSpacing: "0.12em" }}
        >
          AUTO
        </text>

        {/* one outgoing flow */}
        <path
          d="M172 84 H204"
          fill="none"
          stroke="var(--color-signal)"
          strokeWidth="1.4"
          strokeDasharray="5 5"
          opacity="0.7"
          className="[animation:dashflow_2.6s_linear_infinite]"
        />

        {/* the done-list */}
        <rect x="204" y="42" width="100" height="84" rx="10" fill="var(--color-panel-2)" stroke="var(--line-strong)" />
        {[62, 84, 106].map((y, i) => (
          <g key={y}>
            <circle cx="222" cy={y} r="6" fill="var(--color-signal)" opacity={i === 2 ? 0.45 : 1} />
            <path d={`M219.4 ${y} l1.8 1.9 3.4 -3.6`} stroke="var(--color-bg)" strokeWidth="1.6" fill="none" />
            <rect x="236" y={y - 3} width={i === 1 ? 44 : 56} height="6" rx="3" fill="var(--line-strong)" opacity={i === 2 ? 0.5 : 1} />
          </g>
        ))}
      </svg>
    </div>
  );
}

/* ── digital marketing: megaphone → audience → counted leads ───────── */

export function WireMarketing() {
  /* 3×3 audience grid; the bottom-right corner converts */
  const audience = [0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => ({
    cx: 150 + (i % 3) * 28,
    cy: 42 + Math.floor(i / 3) * 38,
    lit: [4, 5, 7, 8].includes(i),
  }));

  return (
    <div aria-hidden className="pointer-events-none flex h-full select-none items-center justify-center px-4 pt-2">
      <svg viewBox="0 0 320 168" className="h-full w-full max-w-[420px]">
        {/* megaphone */}
        <g>
          <path d="M22 70 L62 50 V110 L22 90 Z" fill="rgba(159,239,0,0.14)" stroke="var(--color-signal)" strokeWidth="1.6" strokeLinejoin="round" />
          <rect x="14" y="68" width="10" height="24" rx="3" fill="var(--color-panel-2)" stroke="var(--color-signal)" strokeWidth="1.6" />
          <path d="M34 92 v16 a4 4 0 0 0 8 0 v-12" fill="none" stroke="var(--color-signal)" strokeWidth="1.6" />
          <rect x="30" y="34" width="22" height="12" rx="3" fill="var(--color-panel-2)" stroke="var(--line-strong)" />
          <text x="41" y="43" textAnchor="middle" fontSize="8" fill="var(--color-faint)" style={{ fontFamily: "var(--font-jetbrains)" }}>
            AD
          </text>
        </g>

        {/* reach waves */}
        <g fill="none" stroke="var(--color-signal)" strokeWidth="1.4" strokeLinecap="round">
          <path d="M72 64 a22 22 0 0 1 0 32" opacity="0.9" />
          <path d="M82 54 a36 36 0 0 1 0 52" opacity="0.55" />
          <path d="M92 44 a50 50 0 0 1 0 72" opacity="0.3" />
        </g>

        {/* audience — the campaign lights people up */}
        {audience.map(({ cx, cy, lit }, i) => (
          <g key={i} opacity={lit ? 1 : 0.45}>
            <circle cx={cx} cy={cy} r="6" fill={lit ? "var(--color-signal)" : "var(--color-faint)"} />
            <path
              d={`M${cx - 10} ${cy + 22} a10 10 0 0 1 20 0`}
              fill={lit ? "var(--color-signal)" : "var(--color-faint)"}
            />
          </g>
        ))}

        {/* conversion flow */}
        <path
          d="M218 84 H244"
          fill="none"
          stroke="var(--color-signal)"
          strokeWidth="1.4"
          strokeDasharray="5 5"
          opacity="0.7"
          className="[animation:dashflow_2.6s_linear_infinite]"
        />

        {/* counted result */}
        <rect x="244" y="48" width="62" height="72" rx="10" fill="var(--color-panel-2)" stroke="var(--color-signal)" strokeWidth="1.2" opacity="0.95" />
        <text
          x="275"
          y="78"
          textAnchor="middle"
          fontSize="17"
          fontWeight="700"
          fill="var(--color-signal)"
          style={{ fontFamily: "var(--font-jetbrains)" }}
        >
          +24
        </text>
        <rect x="258" y="88" width="34" height="5" rx="2.5" fill="var(--line-strong)" />
        <polyline points="256,110 266,104 276,106 286,98 294,100 298,94" fill="none" stroke="var(--color-signal)" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="298" cy="94" r="2.4" fill="var(--color-signal)" className="[animation:pulse_2.4s_ease-in-out_infinite]" />
      </svg>
    </div>
  );
}

export const WIREFRAMES: Record<ServiceSlug, () => React.ReactNode> = {
  "strony-www-e-commerce": WireWebsite,
  "aplikacje-webowe": WireApp,
  "automatyzacje-ai": WireAutomation,
  "digital-marketing": WireMarketing,
};
