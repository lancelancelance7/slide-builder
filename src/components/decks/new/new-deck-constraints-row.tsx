"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";

import { PROMPT_MAX } from "./new-deck-brief-form";

export type NewDeckBrandKitPick = {
  id: string;
  name: string;
  accentHex: string;
};

type NewDeckConstraintsRowProps = {
  brandKits: NewDeckBrandKitPick[];
  brandKitId: string;
  onBrandKitIdChange: (id: string) => void;
  slideCount: number;
  onSlideCountChange: (n: number) => void;
  audience: string;
  onAudienceChange: (v: string) => void;
  tone: "direct" | "warm" | "technical";
  onToneChange: (t: "direct" | "warm" | "technical") => void;
  promptLength: number;
  className?: string;
};

const SLIDE_OPTIONS = Array.from({ length: 27 }, (_, i) => i + 4);

export function NewDeckConstraintsRow(props: NewDeckConstraintsRowProps) {
  const activeKit = props.brandKits.find((k) => k.id === props.brandKitId);

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2 border-[color:var(--app-divider)] border-t bg-[color:var(--app-surface-2)] px-4 py-3",
        props.className,
      )}
    >
      <Select
        value={props.brandKitId}
        onValueChange={props.onBrandKitIdChange}
      >
        <SelectTrigger size="sm" className="max-w-[180px] border-[color:var(--app-border)] bg-[color:var(--app-surface)]">
          <span className="flex min-w-0 items-center gap-2">
            {activeKit && (
              <span
                className="size-2 shrink-0 rounded-full"
                style={{ backgroundColor: activeKit.accentHex }}
                aria-hidden
              />
            )}
            <SelectValue placeholder="Brand kit" />
          </span>
        </SelectTrigger>
        <SelectContent>
          {props.brandKits.map((k) => (
            <SelectItem key={k.id} value={k.id}>
              <span className="flex items-center gap-2">
                <span
                  className="size-2 shrink-0 rounded-full"
                  style={{ backgroundColor: k.accentHex }}
                  aria-hidden
                />
                {k.name}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={String(props.slideCount)}
        onValueChange={(v) => props.onSlideCountChange(Number(v))}
      >
        <SelectTrigger size="sm" className="w-[120px] border-[color:var(--app-border)] bg-[color:var(--app-surface)]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {SLIDE_OPTIONS.map((n) => (
            <SelectItem key={n} value={String(n)}>
              {n} slides
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input
        placeholder="Audience"
        value={props.audience}
        maxLength={500}
        className="min-w-[140px] max-w-[220px] border-[color:var(--app-border)] bg-[color:var(--app-surface)]"
        onChange={(e) => props.onAudienceChange(e.target.value)}
      />

      <Select
        value={props.tone}
        onValueChange={(v) =>
          props.onToneChange(v as "direct" | "warm" | "technical")
        }
      >
        <SelectTrigger size="sm" className="w-[130px] border-[color:var(--app-border)] bg-[color:var(--app-surface)]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="direct">Tone: Direct</SelectItem>
          <SelectItem value="warm">Tone: Warm</SelectItem>
          <SelectItem value="technical">Tone: Technical</SelectItem>
        </SelectContent>
      </Select>

      <div className="grow" />
      <span className="t-micro text-[color:var(--app-text-2)]">
        {props.promptLength} / {PROMPT_MAX}
      </span>
    </div>
  );
}
