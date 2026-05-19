"use client";

import Link from "next/link";
import {
  Download,
  ImageIcon,
  Plus,
  Redo2,
  Share2,
  Sparkles,
  Square,
  Type,
  Undo2,
} from "lucide-react";

import type { SlideLayoutId } from "~/lib/slide-plan";
import { Button } from "~/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";

type EditorToolbarProps = {
  deckTitle: string;
  brandKitName: string;
  layout: SlideLayoutId;
  onAddSlide: () => void;
  addSlidePending: boolean;
  onExportPdf: () => void | Promise<void>;
  exportPdfPending: boolean;
  onInsertImage: () => void;
  insertImageDisabled: boolean;
};

export function EditorToolbar(props: EditorToolbarProps) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-[color:var(--app-divider)] border-b px-4 bg-[color:var(--app-surface)]">
      <Link
        href="/"
        className="flex items-center gap-2 rounded-md px-1 py-1 transition-colors hover:bg-[color:var(--app-hover)]"
      >
        <div className="flex size-7 items-center justify-center rounded-md bg-[color:var(--color-near-black)] font-medium text-[color:var(--color-white)]">
          S
        </div>
        <span className="t-caption-b text-[color:var(--app-text)]">
          Slideline
        </span>
      </Link>
      <span className="text-[color:var(--app-text-3)]">/</span>
      <div className="min-w-0 flex flex-col">
        <span className="truncate t-caption-b text-[color:var(--app-text)]">
          {props.deckTitle}
        </span>
        <span className="truncate t-micro text-[color:var(--app-text-3)]">
          {props.brandKitName}
        </span>
      </div>

      <div
        className="mx-2 hidden h-6 w-px shrink-0 bg-[color:var(--app-divider)] sm:block"
        aria-hidden
      />

      <Tooltip>
        <TooltipTrigger asChild>
          <span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-9"
              disabled
              aria-label="Undo"
            >
              <Undo2 className="size-4" />
            </Button>
          </span>
        </TooltipTrigger>
        <TooltipContent>Undo (soon)</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-9"
              disabled
              aria-label="Redo"
            >
              <Redo2 className="size-4" />
            </Button>
          </span>
        </TooltipTrigger>
        <TooltipContent>Redo (soon)</TooltipContent>
      </Tooltip>

      <div
        className="mx-2 hidden h-6 w-px shrink-0 bg-[color:var(--app-divider)] sm:block"
        aria-hidden
      />

      <Button
        type="button"
        variant="secondary"
        size="sm"
        className="gap-1"
        disabled={props.addSlidePending}
        onClick={() => {
          props.onAddSlide();
        }}
      >
        <Plus className="size-4" />
        Add slide
      </Button>

      <Tooltip>
        <TooltipTrigger asChild>
          <span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-9"
              disabled
              aria-label="Insert text"
            >
              <Type className="size-4" />
            </Button>
          </span>
        </TooltipTrigger>
        <TooltipContent>Insert text (soon)</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-9"
              disabled={props.insertImageDisabled}
              aria-label="Insert image"
              onClick={() => {
                props.onInsertImage();
              }}
            >
              <ImageIcon className="size-4" />
            </Button>
          </span>
        </TooltipTrigger>
        <TooltipContent>
          {props.layout === "imageText"
            ? "Upload slide image (Slide tab)"
            : "Switch to Image + text layout to add an image"}
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-9"
              disabled
              aria-label="Insert shape"
            >
              <Square className="size-4" />
            </Button>
          </span>
        </TooltipTrigger>
        <TooltipContent>Insert shape (soon)</TooltipContent>
      </Tooltip>

      <span className="flex-1" />

      <Tooltip>
        <TooltipTrigger asChild>
          <span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="gap-1"
              disabled
            >
              <Sparkles className="size-4" />
              Ask Slideline
            </Button>
          </span>
        </TooltipTrigger>
        <TooltipContent>Ask Slideline (soon)</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="gap-1"
              disabled
            >
              <Share2 className="size-4" />
              Share
            </Button>
          </span>
        </TooltipTrigger>
        <TooltipContent>Share (soon)</TooltipContent>
      </Tooltip>

      <Button
        type="button"
        size="sm"
        className={props.exportPdfPending ? "cursor-wait gap-1" : "gap-1"}
        disabled={props.exportPdfPending}
        onClick={() => {
          void props.onExportPdf();
        }}
      >
        <Download className="size-4" />
        {props.exportPdfPending ? "Saving…" : "Export PDF"}
      </Button>
    </header>
  );
}
