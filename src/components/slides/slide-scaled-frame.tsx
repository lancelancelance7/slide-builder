"use client";

import type { ReactNode } from "react";

import { SLIDE_LOGICAL_H, SLIDE_LOGICAL_W } from "~/lib/slide-viewport";

type SlideScaledFrameProps = {
  scale: number;
  children: ReactNode;
};

export function SlideScaledFrame(props: SlideScaledFrameProps) {
  const { scale } = props;
  return (
    <div
      style={{
        width: SLIDE_LOGICAL_W * scale,
        height: SLIDE_LOGICAL_H * scale,
      }}
    >
      <div
        className="overflow-hidden rounded-lg shadow-(--app-shadow-soft)"
        style={{
          width: SLIDE_LOGICAL_W * scale,
          height: SLIDE_LOGICAL_H * scale,
        }}
      >
        <div
          className="flex flex-col"
          style={{
            width: SLIDE_LOGICAL_W,
            height: SLIDE_LOGICAL_H,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          {props.children}
        </div>
      </div>
    </div>
  );
}
