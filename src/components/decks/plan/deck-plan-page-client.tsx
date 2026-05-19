"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { NewDeckStepper } from "~/components/decks/new/new-deck-stepper";
import { Button } from "~/components/ui/button";
import { Spinner } from "~/components/ui/spinner";
import {
  persistOpenAiChatModel,
  readStoredOpenAiChatModel,
  type OpenAiChatModel,
} from "~/lib/openai-chat-model";
import { slideLayoutSchema, type SlideLayoutId } from "~/lib/slide-plan";
import { api } from "~/trpc/react";

import { PlanPageHeader } from "./plan-page-header";
import { PlanSlideCard } from "./plan-slide-card";
import { PlanStatsStrip } from "./plan-stats-strip";

export function DeckPlanPageClient(props: { deckId: string }) {
  const router = useRouter();
  const utils = api.useUtils();
  const deckId = props.deckId;

  const [rewriteId, setRewriteId] = useState<string | null>(null);
  const [openAiModel, setOpenAiModel] = useState<OpenAiChatModel>(
    readStoredOpenAiChatModel,
  );

  function handleOpenAiModelChange(model: OpenAiChatModel) {
    setOpenAiModel(model);
    persistOpenAiChatModel(model);
  }

  const bundleQuery = api.slide.planBundle.useQuery({ deckId });

  const autoPlanAttempted = useRef(false);

  const planDeck = api.ai.planDeck.useMutation({
    onSuccess: async () => {
      await utils.slide.planBundle.invalidate({ deckId });
    },
  });

  const regeneratePlan = api.ai.regeneratePlan.useMutation({
    onSuccess: async () => {
      await utils.slide.planBundle.invalidate({ deckId });
    },
  });

  const updateSlide = api.slide.update.useMutation();

  const reorderSlides = api.slide.reorder.useMutation({
    onSuccess: async () => {
      await utils.slide.planBundle.invalidate({ deckId });
    },
  });

  const addSlide = api.slide.add.useMutation({
    onSuccess: async () => {
      await utils.slide.planBundle.invalidate({ deckId });
    },
  });

  const removeSlide = api.slide.remove.useMutation({
    onSuccess: async () => {
      await utils.slide.planBundle.invalidate({ deckId });
    },
  });

  const rewriteSlide = api.ai.rewriteSlide.useMutation({
    onMutate: ({ slideId }) => {
      setRewriteId(slideId);
    },
    onSettled: async () => {
      setRewriteId(null);
      await utils.slide.planBundle.invalidate({ deckId });
    },
  });

  const generateSlides = api.ai.generateSlides.useMutation({
    onSuccess: async () => {
      await utils.deck.dashboard.invalidate();
      router.push(`/decks/${deckId}/edit`);
    },
  });

  const data = bundleQuery.data;

  const planMutate = planDeck.mutate;

  useEffect(() => {
    if (!data || data.slides.length > 0) {
      autoPlanAttempted.current = false;
      return;
    }
    const st = data.deck.status;
    if (st !== "draft" && st !== "planned") return;
    if (autoPlanAttempted.current) return;
    autoPlanAttempted.current = true;
    planMutate({ deckId, model: openAiModel });
  }, [data, deckId, planMutate, openAiModel]);

  const allowedLayouts = useMemo(() => {
    const raw = data?.deck.settings.layoutsAllowed;
    if (!raw?.length) return [] as SlideLayoutId[];
    return raw.flatMap((x) => {
      const p = slideLayoutSchema.safeParse(x);
      return p.success ? [p.data] : [];
    });
  }, [data?.deck.settings.layoutsAllowed]);

  const orderedSlides = data?.slides ?? [];

  function reorderIndex(from: number, to: number) {
    if (!data || to < 0 || to >= data.slides.length) return;
    const ids = data.slides.map((s) => s.id);
    const next = [...ids];
    const [x] = next.splice(from, 1);
    if (x === undefined) return;
    next.splice(to, 0, x);
    reorderSlides.mutate({ deckId, orderedSlideIds: next });
  }

  function confirmRemove(slideId: string) {
    if (
      typeof window !== "undefined" &&
      !window.confirm("Remove this slide from the plan?")
    ) {
      return;
    }
    removeSlide.mutate({ slideId });
  }

  function confirmRegenerate() {
    if (
      typeof window !== "undefined" &&
      !window.confirm(
        "Regenerate the full plan? Local edits to slides will be replaced.",
      )
    ) {
      return;
    }
    regeneratePlan.mutate({ deckId, model: openAiModel });
  }

  if (bundleQuery.isPending && !data) {
    return (
      <main className="flex grow flex-col items-center justify-center px-10 py-16">
        <Spinner className="size-8" />
        <p className="t-caption mt-4 text-(--app-text-2)">Loading deck…</p>
      </main>
    );
  }

  if (bundleQuery.error ?? !data) {
    return (
      <main className="grow px-10 py-8">
        <p className="t-body text-destructive">
          {bundleQuery.error?.message ?? "Could not load deck."}
        </p>
        <Button type="button" className="mt-4" variant="outline" asChild>
          <Link href="/">Back to decks</Link>
        </Button>
      </main>
    );
  }

  const planning = planDeck.isPending && orderedSlides.length === 0;

  const planFailed =
    orderedSlides.length === 0 && planDeck.isError && !planning;

  return (
    <main className="grow overflow-auto px-10 py-8">
      <NewDeckStepper activeStep={2} />

      <PlanPageHeader
        deckTitle={data.deck.title}
        planPending={planning}
        regeneratePending={regeneratePlan.isPending}
        generatePending={generateSlides.isPending}
        openAiModel={openAiModel}
        onOpenAiModelChange={handleOpenAiModelChange}
        modelSelectDisabled={planDeck.isPending || regeneratePlan.isPending}
        onRegenerate={confirmRegenerate}
        onAddSlide={() => addSlide.mutate({ deckId })}
        onGenerate={() => generateSlides.mutate({ deckId })}
      />

      {planning && (
        <div className="t-caption mb-6 flex items-center gap-3 rounded-[length:var(--radius-comfortable)] border border-[color:var(--app-border)] bg-[color:var(--app-surface-2)] px-4 py-3 text-[color:var(--app-text-2)]">
          <Spinner className="size-5 shrink-0" />
          <span>Generating your slide plan with AI…</span>
        </div>
      )}

      {planFailed && (
        <div className="t-caption mb-6 flex flex-wrap items-center gap-3 rounded-[length:var(--radius-comfortable)] border border-[color:var(--destructive)]/40 bg-[color:var(--destructive)]/5 px-4 py-3 text-[color:var(--app-text)]">
          <span>{planDeck.error?.message ?? "Planning failed."}</span>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => planDeck.mutate({ deckId, model: openAiModel })}
          >
            Retry
          </Button>
        </div>
      )}

      <PlanStatsStrip
        slides={orderedSlides}
        brandKitName={data.brandKit.name}
      />

      <div className="flex flex-col gap-5 pb-24">
        {orderedSlides.map((slide, i) => (
          <PlanSlideCard
            key={slide.id}
            slide={slide}
            displayIndex={i + 1}
            allowedLayouts={allowedLayouts}
            isFirst={i === 0}
            isLast={i === orderedSlides.length - 1}
            rewritePending={rewriteId === slide.id}
            onSave={(patch) =>
              updateSlide.mutate({
                slideId: slide.id,
                layout: patch.layout,
                content: patch.content,
                imagePrompt: patch.imagePrompt,
                speakerNotes: patch.speakerNotes,
              })
            }
            onRewrite={() =>
              rewriteSlide.mutate({
                slideId: slide.id,
                focus: "all",
                model: openAiModel,
              })
            }
            onMoveUp={() => reorderIndex(i, i - 1)}
            onMoveDown={() => reorderIndex(i, i + 1)}
            onRemove={() => confirmRemove(slide.id)}
          />
        ))}
      </div>
    </main>
  );
}
