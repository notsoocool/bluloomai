"use client";

import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { usePathname } from "next/navigation";

/** Dashboard area uses `Sidebar` + `UserButton`; skip duplicate global header. */
const DASHBOARD_ROUTE_PREFIXES = [
  "/dashboard",
  "/analytics",
  "/insights",
  "/generate",
];

/** Clerk-hosted auth pages already include sign-in / sign-up UI. */
const AUTH_ROUTE_PREFIXES = ["/sign-in", "/sign-up"];

export function ClerkHeader() {
  const pathname = usePathname();
  if (pathname === "/" || pathname === "") return null;
  const hideHeader =
    DASHBOARD_ROUTE_PREFIXES.some((prefix) => pathname?.startsWith(prefix)) ||
    AUTH_ROUTE_PREFIXES.some((prefix) => pathname?.startsWith(prefix));
  if (hideHeader) return null;

  return (
    <header className="flex h-16 items-center justify-end gap-4 border-b border-border bg-background px-4">
      <SignedOut>
        <SignInButton />
        <SignUpButton>
          <button
            type="button"
            className="h-10 cursor-pointer rounded-full bg-[#6c47ff] px-4 text-sm font-medium text-white sm:h-12 sm:px-5 sm:text-base"
          >
            Sign Up
          </button>
        </SignUpButton>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </header>
  );
}
