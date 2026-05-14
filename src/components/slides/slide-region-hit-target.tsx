"use client";

import type { CSSProperties, ReactNode } from "react";

import { cn } from "~/lib/utils";

export function regionShell(
  active: boolean,
  opts?: { cursor?: boolean },
) {
  return cn(
    "rounded-md outline-none transition-shadow",
    opts?.cursor !== false && "cursor-pointer",
    active &&
      "ring-2 ring-[color:var(--color-accent)] ring-offset-4 ring-offset-[inherit]",
  );
}

export function RegionHitTarget(props: {
  interactive: boolean;
  className: string;
  style?: CSSProperties;
  onRegionActivate: () => void;
  children: ReactNode;
}) {
  if (props.interactive) {
    return (
      <button
        type="button"
        className={props.className}
        style={props.style}
        onClick={() => {
          props.onRegionActivate();
        }}
      >
        {props.children}
      </button>
    );
  }
  return (
    <div className={props.className} style={props.style}>
      {props.children}
    </div>
  );
}
