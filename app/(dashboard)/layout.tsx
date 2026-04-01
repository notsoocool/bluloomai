import type { ReactNode } from "react";
import "../landing-glass.css";
import { Sidebar } from "@/components/dashboard/sidebar";
import {
  AppShellChrome,
  FloatingCanvas,
  landingShellRow,
} from "@/components/landing/landing-theme";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AppShellChrome>
      <div className={landingShellRow}>
        <FloatingCanvas />
        <Sidebar />
        <main className="relative z-10 min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-3 pb-8 pt-4 sm:px-5 sm:pt-5 md:px-8 md:pb-10">
          {children}
        </main>
      </div>
    </AppShellChrome>
  );
}
