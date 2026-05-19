"use client";

import Link from "next/link";

import { OpenAiModelSelect } from "~/components/ai/open-ai-model-select";
import { Button } from "~/components/ui/button";
import type { OpenAiChatModel } from "~/lib/openai-chat-model";

type PlanPageHeaderProps = {
  deckTitle: string;
  planPending: boolean;
  regeneratePending: boolean;
  generatePending: boolean;
  openAiModel: OpenAiChatModel;
  onOpenAiModelChange: (model: OpenAiChatModel) => void;
  modelSelectDisabled: boolean;
  onRegenerate: () => void;
  onAddSlide: () => void;
  onGenerate: () => void;
};

export function PlanPageHeader(props: PlanPageHeaderProps) {
  return (
    <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div>
        <Link
          href="/"
          className="t-caption text-(--color-accent) hover:underline"
        >
          ← Decks
        </Link>
        <h1 className="t-section mt-2">{props.deckTitle}</h1>
        <p className="t-caption mt-2 max-w-xl text-(--app-text-2)">
          Review the AI plan slide by slide. Edit copy, reorder, or rewrite with
          AI before generating visuals.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="t-caption text-(--app-text-2)">Model</span>
          <OpenAiModelSelect
            value={props.openAiModel}
            onValueChange={props.onOpenAiModelChange}
            disabled={props.modelSelectDisabled}
            id="plan-openai-model"
          />
        </div>
        <Button
          type="button"
          variant="outline"
          disabled={props.regeneratePending || props.planPending}
          onClick={props.onRegenerate}
        >
          {props.regeneratePending && (
            <span className="mr-2 inline-block size-3 animate-spin rounded-full border border-current border-t-transparent" />
          )}
          Regenerate plan
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={props.planPending}
          onClick={props.onAddSlide}
        >
          Add slide
        </Button>
        <Button
          type="button"
          variant="default"
          disabled={props.generatePending || props.planPending}
          onClick={props.onGenerate}
        >
          {props.generatePending && (
            <span className="mr-2 inline-block size-3 animate-spin rounded-full border border-current border-t-transparent" />
          )}
          Generate slides
        </Button>
      </div>
    </header>
  );
}
