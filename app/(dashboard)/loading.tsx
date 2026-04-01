import { landingPanel, landingSurface } from "@/components/landing/landing-theme";
import { cn } from "@/lib/utils";

export default function DashboardLoading() {
  return (
    <div data-app-glass>
      {/* Header skeleton */}
      <div className="mb-8">
        <p className="text-[11px] tracking-[0.28em] text-zinc-500">
          BLULOOMAI · WORKSPACE
        </p>
        <div className="mt-5 h-10 w-48 animate-pulse rounded-lg bg-zinc-800/50" />
        <div className="mt-2 h-4 w-64 animate-pulse rounded bg-zinc-800/40" />
      </div>

      {/* Metrics skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={cn(landingSurface, "flex flex-col gap-2 rounded-2xl p-4")}
          >
            <div className="h-3 w-24 animate-pulse rounded bg-zinc-700/50" />
            <div className="h-7 w-16 animate-pulse rounded bg-zinc-600/40" />
          </div>
        ))}
      </div>

      {/* Content panel skeleton */}
      <div className={cn(landingPanel, "mt-6 rounded-2xl p-8 sm:rounded-3xl")}>
        <div className="h-4 w-20 animate-pulse rounded bg-zinc-700/50" />
        <div className="mt-4 h-6 w-32 animate-pulse rounded-lg bg-zinc-800/50" />
        <div className="mt-2 h-3 w-48 animate-pulse rounded bg-zinc-700/40" />
        <div className="mt-6 space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={cn(landingSurface, "flex items-center justify-between rounded-2xl px-4 py-3")}
            >
              <div className="h-4 w-24 animate-pulse rounded bg-zinc-700/50" />
              <div className="h-3 w-16 animate-pulse rounded bg-zinc-600/40" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}