"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

const faqItems = [
  {
    q: "Who is BluLoomAI for?",
    a: "Creators with roughly 1k–100k followers who want clearer analytics, pattern insights, and AI help with scripts and captions—without enterprise tooling or shady scraping.",
  },
  {
    q: "How does Instagram connection work?",
    a: "You connect via Meta’s official Instagram Graph API (Business or Creator accounts). We don’t use unofficial scrapers; access follows Meta’s rules.",
  },
  {
    q: "Will AI replace my voice?",
    a: "No. Generators are meant as drafts and ideas you edit. They can use your synced context to stay closer to your niche and what’s already worked for you.",
  },
  {
    q: "Is my data safe?",
    a: "Tokens and app data are handled with standard security practices. Use a strong password on your account and review Meta’s permissions when you connect Instagram.",
  },
] as const;

export function HomeFaq({ glass }: { glass?: boolean }) {
  return (
    <Accordion type="single" collapsible className="w-full">
      {faqItems.map((item, i) => (
        <AccordionItem
          key={item.q}
          value={`item-${i}`}
          className={cn(glass && "border-white/10")}
        >
          <AccordionTrigger
            className={cn(
              "text-left text-base hover:no-underline",
              glass && "text-zinc-100 hover:text-emerald-200/90"
            )}
          >
            {item.q}
          </AccordionTrigger>
          <AccordionContent
            className={cn(glass ? "text-zinc-400" : "text-muted-foreground")}
          >
            {item.a}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
