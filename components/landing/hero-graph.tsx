/**
 * Decorative network graphic (reference: connected nodes + glow lines).
 * `instanceId` keeps SVG defs unique when multiple graphs render on one page.
 */
export function HeroGraph({ instanceId = "a" }: { instanceId?: string }) {
  const safeId = instanceId.replace(/[^a-zA-Z0-9_-]/g, "");
  const gradId = `hero-line-${safeId}`;
  const filterId = `hero-glow-${safeId}`;

  return (
    <div className="landing-float relative mx-auto flex h-full min-h-0 w-full max-w-lg items-center justify-center overflow-hidden rounded-[inherit] md:max-w-none">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full bg-linear-to-br from-emerald-500/20 via-transparent to-cyan-500/15 blur-3xl"
      />
      <svg
        viewBox="0 0 400 400"
        preserveAspectRatio="xMidYMid meet"
        className="relative max-h-full w-full text-emerald-400/60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgb(52 211 153)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="rgb(34 211 238)" stopOpacity="0.35" />
          </linearGradient>
          <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* Lines */}
        <g stroke={`url(#${gradId})`} strokeWidth="1" filter={`url(#${filterId})`}>
          <path d="M200 120 L120 200" />
          <path d="M200 120 L280 200" />
          <path d="M120 200 L200 280" />
          <path d="M280 200 L200 280" />
          <path d="M200 120 L200 200" />
          <path d="M120 200 L280 200" />
        </g>
        {/* Nodes */}
        <GraphNode cx={200} cy={120} filterId={filterId} label="Sync" />
        <GraphNode cx={120} cy={200} filterId={filterId} label="Reels" />
        <GraphNode cx={280} cy={200} filterId={filterId} label="Insights" />
        <GraphNode cx={200} cy={280} filterId={filterId} label="Growth" />
        <circle
          cx={200}
          cy={200}
          r={6}
          className="fill-emerald-400/80 landing-glow-pulse"
          opacity={0.85}
        />
      </svg>
    </div>
  );
}

function GraphNode({
  cx,
  cy,
  label,
  filterId,
}: {
  cx: number;
  cy: number;
  label: string;
  filterId: string;
}) {
  return (
    <g>
      <circle
        cx={cx}
        cy={cy}
        r={22}
        fill="rgb(24 24 27 / 0.5)"
        stroke="rgb(48 48 54)"
        strokeWidth={1}
      />
      <circle
        cx={cx}
        cy={cy}
        r={4}
        className="fill-emerald-400/90"
        filter={`url(#${filterId})`}
      />
      <text
        x={cx}
        y={cy + 38}
        textAnchor="middle"
        className="fill-zinc-500 text-[10px] font-medium uppercase tracking-wider"
        style={{ fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}
      >
        {label}
      </text>
    </g>
  );
}
