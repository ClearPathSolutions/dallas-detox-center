"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { recordFirstTouch } from "@/lib/attribution";

/**
 * Records the visit's first touch, on entry and on every client-side route
 * change. Without the route-change half, a fresh ad click that arrives partway
 * through a visit would never re-attribute.
 *
 * Reads the query string from window.location rather than useSearchParams:
 * useSearchParams forces a Suspense boundary and opts every static page in the
 * site into dynamic rendering, which is a steep price for a value we only need
 * inside an effect.
 */
export function AttributionTracker() {
  const pathname = usePathname();

  useEffect(() => {
    recordFirstTouch();
  }, [pathname]);

  return null;
}
