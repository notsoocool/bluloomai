import Link from "next/link";
import { UserPlus } from "lucide-react";
import { HeroGraph } from "@/components/landing/hero-graph";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Section cards — edge color comes from `.landing-panel` in landing-glass.css */
const panel =
  "landing-panel relative isolate overflow-hidden bg-black/18 text-white shadow-[0_22px_70px_rgba(0,0,0,0.45)] backdrop-blur-2xl";
/**
 * `border` + `landing-edge`: width from Tailwind, color forced in landing-glass.css
 * so it never inherits `currentColor` from `text-white` on <main>.
 */
const surface =
  "landing-edge overflow-hidden rounded-3xl border border-solid bg-black/22 shadow-none backdrop-blur-2xl";

/** App shell — full width inside `main` padding (no `max-w-*` cap). */
const shell =
  "landing-shell relative isolate flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden bg-gradient-to-b from-zinc-900/98 to-black shadow-[0_22px_80px_rgba(0,0,0,0.75)]";

export function HomeMarketing() {
  return (
    <main
      data-landing-glass
      className="dark relative flex h-dvh max-h-dvh flex-col overflow-hidden overscroll-none bg-black p-3 text-white sm:p-4 md:p-5"
    >
      <AmbientGlow />
      <div className="relative z-0 mx-auto flex min-h-0 w-full flex-1 flex-col">
        <div className={shell}>
          <div aria-hidden className="floating-canvas">
            <div className="canvas-light canvas-light-a" />
            <div className="canvas-light canvas-light-b" />
            <div className="canvas-light canvas-light-c" />
            <div className="canvas-grid" />
          </div>
          <ShellHeader />
          <div
            id="landing-scroll"
            className="relative z-10 min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-y-contain px-3 pb-6 pt-4 sm:px-4 sm:pb-8 sm:pt-5"
          >
            <div
              id="landing-top"
              aria-hidden
              className="h-0 w-full shrink-0 scroll-mt-22"
            />
            <section className="mx-auto grid w-full gap-5 xl:grid-cols-2">
              <HeroDefensePanel graphId="hero-primary" />
              <InsightsPanel />
              <WorkflowPanel className="xl:col-span-2" />
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

function AmbientGlow() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      <div className="absolute -left-36 top-8 h-[420px] w-[420px] rounded-full bg-emerald-400/10 blur-[120px]" />
      <div className="absolute right-[-140px] top-1/3 h-[420px] w-[420px] rounded-full bg-cyan-400/10 blur-[120px]" />
      <div className="absolute bottom-[-140px] left-1/3 h-[300px] w-[300px] rounded-full bg-white/5 blur-[100px]" />
    </div>
  );
}

function HeroDefensePanel({
  compact = false,
  graphId = "hero-a",
}: {
  compact?: boolean;
  graphId?: string;
}) {
  return (
    <article className={cn(panel, compact ? "min-h-[360px]" : "min-h-[500px]")}>
      <div className="relative px-8 pb-8 pt-10">
        <p className="text-[11px] tracking-[0.28em] text-zinc-500">
          BLULOOMAI · GRAPH API
        </p>
        <h1 className="mt-5 max-w-xl text-4xl font-semibold leading-tight md:text-5xl">
          One workspace for creator growth
        </h1>
        <p className="mt-3 max-w-md text-sm text-zinc-400">
          Analytics, viral-pattern insights, and AI drafts—built on Meta&apos;s
          official Instagram Graph API, not scrapers.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button
            asChild
            className="landing-edge h-8 rounded-full border border-solid bg-white/5 px-5 text-xs text-white hover:bg-white/10"
          >
            <Link href="/sign-in">Open app</Link>
          </Button>
          <Button
            asChild
            className="h-8 rounded-full bg-white px-5 text-xs font-medium text-black hover:bg-zinc-200"
          >
            <Link href="/sign-up">Get started</Link>
          </Button>
        </div>
        <div className={cn(surface, "relative mt-7 h-[230px] p-4 md:h-[250px]")}>
          <HeroGraph instanceId={graphId} />
        </div>
      </div>
    </article>
  );
}

function InsightsPanel() {
  return (
    <article
      id="insights"
      className={cn(panel, "min-h-[500px] scroll-mt-18")}
    >
      <div className="px-8 pb-7 pt-8">
        <h2 className="text-4xl font-semibold leading-tight">
          Insights for your real posts
        </h2>
        <p className="mt-2 text-sm text-zinc-500">
          Engagement trends, saves, and posting windows—so you plan content with
          signal, not vibes.
        </p>

        <div className="mt-7 grid grid-cols-2 gap-3">
          <div className={cn(surface, "col-span-1 flex flex-col gap-2 p-4")}>
            <p className="text-4xl font-semibold text-zinc-100">94.2%</p>
            <p className="mt-1 text-xs text-zinc-500">
              Avg. sync health · last 30 days
            </p>
            <div className="landing-edge mt-4 h-24 rounded-2xl border border-solid bg-linear-to-br from-white/6 to-transparent" />
          </div>
          <div className={cn(surface, "col-span-1 flex flex-col gap-2 p-4")}>
            <p className="text-xs text-zinc-400">Reach → saves → follows</p>
            <div className="mt-3 flex h-28 items-end gap-2">
              {[38, 58, 82, 68].map((height) => (
                <span
                  key={height}
                  className="w-5 rounded-full bg-linear-to-t from-emerald-500/80 to-cyan-300/70"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
          </div>
          <div className={cn(surface, "col-span-1 flex flex-col gap-2 p-4")}>
            <p className="text-xs text-zinc-400">This week</p>
            <p className="mt-2 text-3xl font-semibold">+18.4%</p>
            <p className="text-xs text-zinc-500">Saves vs. prior period</p>
          </div>
          <div className={cn(surface, "col-span-1 flex flex-col gap-2 p-4")}>
            <p className="text-xs text-zinc-400">Best posting windows</p>
            <div className="mt-4 grid grid-cols-5 items-end gap-2">
              {[35, 58, 70, 48, 32].map((height) => (
                <span
                  key={height}
                  className="rounded-md bg-linear-to-t from-fuchsia-400/70 to-emerald-300/70"
                  style={{ height: `${height}px` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function WorkflowPanel({ className }: { className?: string }) {
  return (
    <article
      id="workflow"
      className={cn(panel, "min-h-[500px] scroll-mt-18", className)}
    >
      <div className="px-8 pb-8 pt-8">
        <h2 className="text-4xl font-semibold">Connect once. Grow with data.</h2>
        <p className="mt-2 text-sm text-zinc-500">
          Link Instagram Business or Creator, sync posts and engagement, then use
          dashboards and AI tools in one place.
        </p>
        <div className="mt-8 grid gap-6 md:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="text-xs uppercase tracking-wider text-zinc-500">
              Connected workspace
            </p>
            <p className="mt-2 text-6xl font-semibold tracking-tight">
              +<span className="text-emerald-400">12.4</span>k
            </p>
            <p className="text-xs text-zinc-600">Reach index · illustrative</p>
            <div className="mt-6 space-y-3">
              <MiniRow label="Posts synced" value="48" />
              <MiniRow label="Insights" value="Ready" />
              <MiniRow label="Graph API" value="Official" />
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative h-52 w-52">
              <div className="landing-edge absolute inset-0 rounded-full border border-solid" />
              <div className="landing-edge absolute inset-4 rounded-full border border-solid" />
              <div className="landing-edge absolute inset-8 rounded-full border border-solid" />
              <svg viewBox="0 0 120 120" className="absolute inset-0 h-full w-full -rotate-90">
                <circle
                  cx="60"
                  cy="60"
                  r="46"
                  fill="none"
                  stroke="rgb(36 36 40)"
                  strokeWidth="10"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="46"
                  fill="none"
                  stroke="url(#workflowRing)"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${0.62 * 2 * Math.PI * 46} ${2 * Math.PI * 46}`}
                />
                <defs>
                  <linearGradient id="workflowRing" x1="0" y1="0" x2="1" y2="1">
                    <stop stopColor="rgb(243 244 246)" />
                    <stop offset="1" stopColor="rgb(16 185 129)" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">
                    Step
                  </p>
                  <p className="text-3xl font-semibold">01</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 flex flex-wrap gap-2 text-xs">
          {[
            "Micro-creators",
            "Graph API",
            "No scrapers",
            "Reels & feeds",
          ].map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="landing-edge rounded-full border border-solid bg-white/5 font-normal text-zinc-300"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </article>
  );
}

const navLinks = [
  { label: "Home", href: "#landing-top" },
  { label: "Insights", href: "#insights" },
  { label: "Workflow", href: "#workflow" },
  { label: "Dashboard", href: "/dashboard" },
] as const;

function ShellHeader() {
  return (
    <header className="landing-header relative z-30 flex shrink-0 items-center justify-between bg-black/20 px-3 py-3 backdrop-blur-2xl sm:px-4">
      <Link
        href="#landing-top"
        className="text-sm font-semibold tracking-tight text-white hover:text-zinc-200"
      >
        BluLoomAI
      </Link>
      <nav className="landing-edge hidden rounded-full border border-solid bg-white/3 px-3 py-1.5 text-[10px] text-zinc-400 md:flex md:items-center md:gap-3">
        {navLinks.map((item) => (
          <Link key={item.label} href={item.href} className="hover:text-zinc-200">
            {item.label}
          </Link>
        ))}
      </nav>
      <Button
        asChild
        size="sm"
        className="landing-edge h-7 rounded-full border border-solid bg-transparent px-3 text-[11px] text-zinc-200 hover:bg-white/10"
      >
        <Link href="/sign-up" className="inline-flex items-center">
          <UserPlus className="mr-1 h-3 w-3" aria-hidden />
          Sign up
        </Link>
      </Button>
    </header>
  );
}

function MiniRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      className={cn(
        surface,
        "flex items-center justify-between px-3 py-2.5 text-sm"
      )}
    >
      <p className="text-zinc-400">{label}</p>
      <p className="font-medium text-zinc-200">{value}</p>
    </div>
  );
}

