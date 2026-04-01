"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/analytics", label: "Analytics" },
  { href: "/insights", label: "Insights" },
  { href: "/generate", label: "Generate" },
];

export function Sidebar() {
  const pathname = usePathname();
  const basePath = pathname?.split("/")[1] ?? "";

  return (
    <aside className="relative z-20 flex w-56 shrink-0 flex-col border-r border-solid border-[rgb(36_36_40)] bg-black/25 backdrop-blur-xl">
      <div className="landing-header flex h-16 shrink-0 items-center px-5">
        <Link
          href="/dashboard"
          className="text-sm font-semibold tracking-tight text-white hover:text-zinc-200"
        >
          BluLoomAI
        </Link>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const itemBase = item.href.split("/")[1] ?? "";
          const isActive = basePath === itemBase || pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-white text-black"
                  : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="landing-header p-4">
        <div className="flex items-center gap-2">
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "h-9 w-9 ring-1 ring-white/10",
              },
            }}
          />
          <span className="text-xs text-zinc-500">Account</span>
        </div>
      </div>
    </aside>
  );
}
