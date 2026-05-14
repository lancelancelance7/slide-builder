"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Spinner } from "~/components/ui/spinner";
import { api } from "~/trpc/react";

import { NewDeckBriefForm } from "./new-deck-brief-form";
import { NewDeckConstraintsRow } from "./new-deck-constraints-row";
import {
  DEFAULT_NEW_DECK_LAYOUTS,
  NewDeckPlanSettings,
  sortPlanLayouts,
  type PlanLayoutId,
} from "./new-deck-plan-settings";
import { NewDeckSampleStarters } from "./new-deck-sample-starters";
import { NewDeckStepper } from "./new-deck-stepper";

export type NewDeckPageClientProps = {
  brandKits: {
    id: string;
    name: string;
    accentHex: string;
    isDefault: boolean;
  }[];
  defaultBrandKitId: string;
  templateMode: boolean;
};

export function NewDeckPageClient(props: NewDeckPageClientProps) {
  const router = useRouter();
  const utils = api.useUtils();

  const [title, setTitle] = useState("");
  const [prompt, setPrompt] = useState("");
  const [brandKitId, setBrandKitId] = useState(props.defaultBrandKitId);
  const [slideCount, setSlideCount] = useState(10);
  const [audience, setAudience] = useState("");
  const [tone, setTone] = useState<"direct" | "warm" | "technical">("direct");
  const [layoutsAllowed, setLayoutsAllowed] = useState<PlanLayoutId[]>([
    ...DEFAULT_NEW_DECK_LAYOUTS,
  ]);
  const [imagePolicy, setImagePolicy] = useState<
    "generatePrompts" | "omit" | "placeholders"
  >("generatePrompts");
  const [speakerNotesPolicy, setSpeakerNotesPolicy] = useState<
    "none" | "short" | "full"
  >("short");
  const [requirePlanReview, setRequirePlanReview] = useState(true);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const createDeck = api.deck.create.useMutation({
    onSuccess: async (data, variables) => {
      await utils.deck.dashboard.invalidate();
      setSubmitError(null);
      if (variables.afterCreate === "plan") {
        router.push(`/decks/${data.id}/plan`);
      } else {
        router.push("/");
      }
    },
    onError: (err) => {
      setSubmitError(err.message);
    },
  });

  const canSubmit =
    title.trim().length > 0 &&
    prompt.trim().length > 0 &&
    props.brandKits.length > 0 &&
    layoutsAllowed.length > 0;

  function buildPayload() {
    return {
      title: title.trim(),
      prompt: prompt.trim(),
      brandKitId,
      settings: {
        slideCount,
        slideCountMin: 4,
        slideCountMax: 30,
        audience: audience.trim(),
        tone,
        layoutsAllowed,
        imagePolicy,
        speakerNotesPolicy,
        requirePlanReview,
      },
    };
  }

  function handlePlan() {
    if (!canSubmit) return;
    setSubmitError(null);
    createDeck.mutate({ ...buildPayload(), afterCreate: "plan" });
  }

  function handleSaveDraft() {
    if (!canSubmit) return;
    setSubmitError(null);
    createDeck.mutate({ ...buildPayload(), afterCreate: "dashboard" });
  }

  function handleToggleLayout(id: PlanLayoutId, allowed: boolean) {
    setLayoutsAllowed((prev) => {
      if (allowed) {
        if (prev.includes(id)) return prev;
        return sortPlanLayouts([...prev, id]);
      }
      if (prev.length <= 1) return prev;
      return prev.filter((x) => x !== id);
    });
  }

  const pending = createDeck.isPending;

  return (
    <main className="grow overflow-auto px-10 py-8">
      <div className="mx-auto w-full max-w-[820px]">
        <NewDeckStepper />

        <h1 className="t-display text-[color:var(--app-text)]">
          Describe the deck.
        </h1>
        <p className="mt-2.5 max-w-[560px] t-body text-[color:var(--app-text-2)]">
          A title, an audience, a few bullets. Slideline will draft a
          slide-by-slide plan for you to review before any pixels move.
        </p>

        {props.templateMode && (
          <p className="mt-4 max-w-[560px] t-caption text-[color:var(--app-text-2)]">
            Template-based decks are not wired up yet — write a brief below to
            start from scratch, or{" "}
            <Link
              href="/decks/new"
              className="t-link text-[color:var(--color-link-light)]"
            >
              switch to the default flow
            </Link>
            .
          </p>
        )}

        <div className="mt-7 overflow-hidden rounded-[length:var(--radius-comfortable)] border border-[color:var(--app-border-strong)] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_28px_rgba(0,0,0,0.06)]">
          <div className="px-5 pt-5 pb-4">
            <NewDeckBriefForm
              title={title}
              prompt={prompt}
              onTitleChange={setTitle}
              onPromptChange={setPrompt}
            />
          </div>
          <NewDeckConstraintsRow
            brandKits={props.brandKits}
            brandKitId={brandKitId}
            onBrandKitIdChange={setBrandKitId}
            slideCount={slideCount}
            onSlideCountChange={setSlideCount}
            audience={audience}
            onAudienceChange={setAudience}
            tone={tone}
            onToneChange={setTone}
            promptLength={prompt.length}
          />
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Button
            type="button"
            size="lg"
            disabled={!canSubmit || pending}
            className="border-transparent bg-[color:var(--color-accent)] text-white hover:bg-[#0077ed]"
            onClick={handlePlan}
          >
            {pending &&
              createDeck.variables?.afterCreate === "plan" && (
                <Spinner className="size-4" />
              )}
            {!(pending && createDeck.variables?.afterCreate === "plan") && (
              <Sparkles aria-hidden />
            )}
            Plan the deck
          </Button>
          <Button
            type="button"
            size="lg"
            variant="outline"
            disabled={!canSubmit || pending}
            onClick={handleSaveDraft}
          >
            {pending &&
              createDeck.variables?.afterCreate === "dashboard" && (
                <Spinner className="size-4" />
              )}
            Save as draft
          </Button>
          <div className="grow" />
          <p className="t-micro text-[color:var(--app-text-2)]">
            Est. plan time ~12s when AI is connected
          </p>
        </div>

        {submitError && (
          <p className="mt-3 t-caption text-destructive" role="alert">
            {submitError}
          </p>
        )}

        <div className="mt-8 flex flex-wrap gap-7">
          <NewDeckSampleStarters
            onPick={(sample) => {
              setTitle(sample.deckTitle);
              setPrompt(sample.prompt);
            }}
          />
          <NewDeckPlanSettings
            slideCount={slideCount}
            onSlideCountChange={setSlideCount}
            layoutsAllowed={layoutsAllowed}
            onToggleLayout={handleToggleLayout}
            imagePolicy={imagePolicy}
            onImagePolicyChange={setImagePolicy}
            speakerNotesPolicy={speakerNotesPolicy}
            onSpeakerNotesPolicyChange={setSpeakerNotesPolicy}
            requirePlanReview={requirePlanReview}
            onRequirePlanReviewChange={setRequirePlanReview}
          />
        </div>
      </div>
    </main>
  );
}
