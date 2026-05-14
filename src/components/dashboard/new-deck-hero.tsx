"use client";

import Link from "next/link";
import { Plus, Sparkles } from "lucide-react";

import { Button } from "~/components/ui/button";

export function NewDeckHero() {
  return (
    <section className="relative flex min-h-[230px] flex-col gap-4 overflow-hidden rounded-[length:var(--radius-comfortable)] bg-[color:var(--color-near-black)] p-[18px] text-[color:var(--color-white)] shadow-[var(--app-shadow-soft)]">
      <div className="-right-12 -bottom-12 pointer-events-none absolute size-[200px] bg-[radial-gradient(closest-side,rgba(0,113,227,0.55),transparent)] blur-md" />
      <div className="relative z-[1] flex items-center gap-1.5 t-micro text-[color:rgba(255,255,255,0.75)]">
        <Sparkles className="size-4 shrink-0" aria-hidden />
        <span>AI · Start from a brief</span>
      </div>
      <div className="relative z-[1] grow">
        <h2 className="t-tile text-[color:var(--color-white)] leading-tight">
          Describe the deck
          <br />
          you want.
        </h2>
        <p className="mt-2 max-w-[220px] t-caption leading-snug text-[color:rgba(255,255,255,0.65)]">
          A title, an audience, a few bullets — Slideline plans the slides
          before generating them.
        </p>
      </div>
      <div className="relative z-[1] flex flex-wrap gap-2">
        <Button
          asChild
          size="sm"
          className="border-transparent bg-[color:var(--color-accent)] text-white hover:bg-[#0077ed]"
        >
          <Link href="/decks/new">
            <Plus aria-hidden /> New deck
          </Link>
        </Button>
        <Button asChild variant="outline" size="sm" className="border-[color:rgba(255,255,255,0.15)] bg-[color:rgba(255,255,255,0.10)] text-[color:var(--color-white)] hover:bg-[color:rgba(255,255,255,0.16)]">
          <Link href="/decks/new?mode=template">Use template</Link>
        </Button>
      </div>
    </section>
  );
}
