import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Section cards — edge color comes from `.landing-panel` in landing-glass.css */
export const landingPanel =
  "landing-panel relative isolate overflow-hidden bg-black/18 text-white shadow-[0_22px_70px_rgba(0,0,0,0.45)] backdrop-blur-2xl";

/** Inner surfaces — border from `.landing-edge` in landing-glass.css */
export const landingSurface =
  "landing-edge overflow-hidden rounded-3xl border border-solid bg-black/22 shadow-none backdrop-blur-2xl";

/** Marketing home — column shell */
export const landingShellColumn =
  "landing-shell relative isolate flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden bg-gradient-to-b from-zinc-900/98 to-black shadow-[0_22px_80px_rgba(0,0,0,0.75)]";

/** App dashboard — row shell (sidebar + main) */
export const landingShellRow =
  "landing-shell relative isolate flex min-h-0 w-full min-w-0 flex-1 flex-row overflow-hidden bg-gradient-to-b from-zinc-900/98 to-black shadow-[0_22px_80px_rgba(0,0,0,0.75)]";

/** Form labels — matches landing microcopy */
export const landingFormLabel =
  "block text-xs font-medium uppercase tracking-wide text-zinc-500";

/** Inputs / selects on dark glass (requires [data-app-glass] or [data-landing-glass] for .landing-edge) */
export const landingFormControl =
  "mt-1.5 w-full rounded-lg border border-solid border-[rgb(36_36_40)] bg-black/35 px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-emerald-500/40 focus:outline-none focus:ring-1 focus:ring-emerald-500/25";

/** Primary CTA — white pill */
export const landingPrimaryButton =
  "inline-flex h-10 items-center justify-center rounded-full bg-white px-6 text-sm font-medium text-black transition-colors hover:bg-zinc-200 disabled:pointer-events-none disabled:opacity-50";

/** Secondary / outline on glass */
export const landingGhostButton =
  "landing-edge inline-flex h-10 items-center justify-center rounded-full border border-solid bg-white/5 px-5 text-sm text-white transition-colors hover:bg-white/10 disabled:opacity-50";

/** AI output / JSON blocks */
export const landingOutputBox =
  "landing-edge mt-4 rounded-xl border border-solid bg-black/30 p-4 text-sm text-zinc-200";

export function AmbientGlow() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      <div className="absolute -left-36 top-8 h-[420px] w-[420px] rounded-full bg-emerald-400/10 blur-[120px]" />
      <div className="absolute right-[-140px] top-1/3 h-[420px] w-[420px] rounded-full bg-cyan-400/10 blur-[120px]" />
      <div className="absolute bottom-[-140px] left-1/3 h-[300px] w-[300px] rounded-full bg-white/5 blur-[100px]" />
    </div>
  );
}

export function FloatingCanvas() {
  return (
    <div aria-hidden className="floating-canvas">
      <div className="canvas-light canvas-light-a" />
      <div className="canvas-light canvas-light-b" />
      <div className="canvas-light canvas-light-c" />
      <div className="canvas-grid" />
    </div>
  );
}

export function AppShellChrome({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      data-app-glass
      className={cn(
        /* h-dvh + max-h-dvh: lock height so flex children (e.g. <main>) can scroll with overflow-y-auto */
        "dark relative flex h-dvh max-h-dvh min-h-0 flex-col overflow-hidden overscroll-none bg-black p-3 text-white sm:p-4 md:p-5",
        className
      )}
    >
      <AmbientGlow />
      <div className="relative z-0 mx-auto flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden">
        {children}
      </div>
    </div>
  );
}
