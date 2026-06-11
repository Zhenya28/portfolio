"use client";

import { WIREFRAMES } from "./Wireframes";
import type { ServiceSlug } from "@/lib/i18n";

/* server pages pass a slug; the component lookup happens client-side */
export function ServiceWire({ slug }: { slug: ServiceSlug }) {
  const Wire = WIREFRAMES[slug];
  return <Wire />;
}
