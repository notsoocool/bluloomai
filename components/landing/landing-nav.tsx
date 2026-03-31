"use client";

import Link from "next/link";
import { Shield } from "lucide-react";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const nav = [
  { href: "#features", label: "Features" },
  { href: "#insights", label: "Insights" },
  { href: "#workflow", label: "Workflow" },
  { href: "#faq", label: "FAQ" },
] as const;

const linkClass =
  "rounded-full px-4 py-2 text-sm font-medium text-zinc-400 transition-colors hover:bg-white/10 hover:text-white";

export function LandingNav() {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-5 md:pt-6">
      <nav
        className={cn(
          "pointer-events-auto flex w-full max-w-5xl items-center gap-2 rounded-full border border-white/10 bg-black/45 px-3 py-2 shadow-[0_0_60px_-20px_rgba(16,185,129,0.35)] backdrop-blur-2xl md:gap-3 md:px-4"
        )}
      >
        <Link
          href="/"
          className="shrink-0 pl-2 text-sm font-semibold tracking-tight text-white md:pl-3"
        >
          BluLoomAI
        </Link>

        <div className="hidden flex-1 items-center justify-center gap-0.5 md:flex">
          {nav.map((item) => (
            <a key={item.href} href={item.href} className={linkClass}>
              {item.label}
            </a>
          ))}
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2 pr-1 md:gap-3 md:pr-2">
          <Badge
            variant="outline"
            className="hidden border-emerald-500/40 bg-emerald-500/10 text-[10px] font-medium uppercase tracking-wider text-emerald-300/90 sm:inline-flex"
          >
            <Shield className="mr-1 size-3" aria-hidden />
            Graph API
          </Badge>
          <SignedOut>
            <SignInButton mode="modal">
              <button
                type="button"
                className="rounded-full px-3 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-white/10 hover:text-white"
              >
                Sign in
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button
                type="button"
                className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black shadow-lg shadow-emerald-500/10 transition-colors hover:bg-zinc-200"
              >
                Create account
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "h-9 w-9 ring-2 ring-white/20",
                },
              }}
            />
          </SignedIn>
        </div>
      </nav>
    </div>
  );
}
