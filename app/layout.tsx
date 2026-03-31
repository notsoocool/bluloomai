import type { Metadata } from "next";

export const dynamic = "force-dynamic";

import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ClerkHeader } from "@/components/clerk-header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BluLoomAI | Growth Intelligence for Creators",
  description:
    "AI-powered analytics and content intelligence for micro-influencers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClerkProvider>
          <ClerkHeader />
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
