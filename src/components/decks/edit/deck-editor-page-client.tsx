"use client";

import { useEffect, useMemo, useState } from "react";

import type { EditorRegionId } from "~/components/slides/slide-layout-inner";
import type { SlideBrandTokens } from "~/components/slides/slide-layout-inner";
import { SlideCanvasView } from "~/components/slides/slide-canvas-view";
import { Spinner } from "~/components/ui/spinner";
import {
  SLIDE_LAYOUT_VALUES,
  contentToFormFields,
  formFieldsToContent,
  normalizeContentForPersist,
  slideLayoutSchema,
  type PlanFormFields,
  type PlanSlideContent,
  type SlideLayoutId,
} from "~/lib/slide-plan";
import { api } from "~/trpc/react";

import type { InspectorTabId } from "./editor-inspector";
import { EditorInspector } from "./editor-inspector";
import { EditorThumbnailRail } from "./editor-thumbnail-rail";
import { EditorToolbar } from "./editor-toolbar";

function layoutOptions(allowed: SlideLayoutId[]): SlideLayoutId[] {
  const raw = allowed.length > 0 ? allowed : [];
  if (raw.length > 0) return raw;
  return [...SLIDE_LAYOUT_VALUES];
}

function buildPersistContent(
  layout: SlideLayoutId,
  fields: PlanFormFields,
  eyebrow: string,
): Record<string, unknown> {
  const base = formFieldsToContent(layout, fields);
  if (layout === "title") {
    return normalizeContentForPersist("title", {
      ...base,
      eyebrow,
      subtitle: fields.body,
    });
  }
  return base;
}

export function DeckEditorPageClient(props: { deckId: string }) {
  const deckId = props.deckId;
  const utils = api.useUtils();

  const bundleQuery = api.slide.planBundle.useQuery({ deckId });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [zoom, setZoom] = useState(0.44);
  const [inspectorTab, setInspectorTab] = useState<InspectorTabId>("element");
  const [activeRegion, setActiveRegion] = useState<EditorRegionId | null>(null);

  const [layout, setLayout] = useState<SlideLayoutId>("imageText");
  const [fields, setFields] = useState<PlanFormFields>({
    title: "",
    body: "",
    bullets: [],
  });
  const [eyebrow, setEyebrow] = useState("");
  const [imagePrompt, setImagePrompt] = useState("");
  const [speakerNotes, setSpeakerNotes] = useState("");

  const updateSlide = api.slide.update.useMutation({
    onSuccess: async () => {
      await utils.slide.planBundle.invalidate({ deckId });
      await utils.deck.dashboard.invalidate();
    },
  });

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
      await utils.deck.dashboard.invalidate();
    },
  });

  const data = bundleQuery.data;

  const orderedSlides = useMemo(() => {
    if (!data?.slides) return [];
    return [...data.slides].sort((a, b) => a.position - b.position);
  }, [data?.slides]);

  const allowedLayouts = useMemo(() => {
    const raw = data?.deck.settings.layoutsAllowed;
    if (!raw?.length) return [] as SlideLayoutId[];
    return raw.flatMap((x) => {
      const p = slideLayoutSchema.safeParse(x);
      return p.success ? [p.data] : [];
    });
  }, [data?.deck.settings.layoutsAllowed]);

  const layoutOpts = useMemo(
    () => layoutOptions(allowedLayouts),
    [allowedLayouts],
  );

  const activeSlide = orderedSlides[selectedIndex];

  const isDirty = useMemo(() => {
    if (!activeSlide) return false;
    const pl = slideLayoutSchema.safeParse(activeSlide.layout);
    const serverLayout = pl.success ? pl.data : "imageText";
    if (layout !== serverLayout) return true;
    if (imagePrompt !== activeSlide.imagePrompt) return true;
    if (speakerNotes !== activeSlide.speakerNotes) return true;
    const serverContent = normalizeContentForPersist(
      serverLayout,
      activeSlide.content,
    );
    const draftContent = normalizeContentForPersist(
      layout,
      buildPersistContent(layout, fields, eyebrow),
    );
    return JSON.stringify(serverContent) !== JSON.stringify(draftContent);
  }, [activeSlide, layout, fields, eyebrow, imagePrompt, speakerNotes]);

  useEffect(() => {
    if (!activeSlide) return;
    const pl = slideLayoutSchema.safeParse(activeSlide.layout);
    const lo = pl.success ? pl.data : "imageText";
    setLayout(lo);
    setFields(contentToFormFields(lo, activeSlide.content));
    setImagePrompt(activeSlide.imagePrompt);
    setSpeakerNotes(activeSlide.speakerNotes);
    const norm = normalizeContentForPersist(
      lo,
      activeSlide.content,
    ) as PlanSlideContent;
    setEyebrow((norm.eyebrow ?? "").trim());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSlide?.id]);

  useEffect(() => {
    if (orderedSlides.length === 0) return;
    if (selectedIndex > orderedSlides.length - 1) {
      setSelectedIndex(orderedSlides.length - 1);
    }
  }, [orderedSlides.length, selectedIndex]);

  function confirmDiscardIfDirty(): boolean {
    if (!isDirty) return true;
    return window.confirm(
      "You have unsaved changes on this slide. Discard them and continue?",
    );
  }

  function saveCurrentSlide() {
    const slideId = activeSlide?.id;
    if (!slideId || !isDirty) return;
    updateSlide.mutate({
      slideId,
      layout,
      content: buildPersistContent(layout, fields, eyebrow),
      imagePrompt,
      speakerNotes,
    });
  }

  function patchFields(patch: Partial<PlanFormFields>) {
    setFields((prev) => ({ ...prev, ...patch }));
  }

  function patchEyebrow(v: string) {
    setEyebrow(v);
  }

  function patchImagePrompt(v: string) {
    setImagePrompt(v);
  }

  function patchSpeakerNotes(v: string) {
    setSpeakerNotes(v);
  }

  function selectSlideIndex(next: number) {
    if (!confirmDiscardIfDirty()) return;
    setSelectedIndex(next);
    setActiveRegion(null);
  }

  function onLayoutSelect(next: SlideLayoutId) {
    const prevContent = formFieldsToContent(layout, fields);
    setLayout(next);
    const nf = contentToFormFields(next, prevContent);
    setFields(nf);
  }

  function reorderIndex(from: number, to: number) {
    if (!confirmDiscardIfDirty()) return;
    const ids = orderedSlides.map((s) => s.id);
    const [x] = ids.splice(from, 1);
    if (!x) return;
    ids.splice(to, 0, x);
    reorderSlides.mutate({ deckId, orderedSlideIds: ids });
    if (from === selectedIndex) {
      setSelectedIndex(to);
    } else if (from < selectedIndex && to >= selectedIndex) {
      setSelectedIndex(selectedIndex - 1);
    } else if (from > selectedIndex && to <= selectedIndex) {
      setSelectedIndex(selectedIndex + 1);
    }
  }

  function handleAddSlide() {
    if (!confirmDiscardIfDirty()) return;
    const nextIdx = orderedSlides.length;
    addSlide.mutate(
      { deckId },
      {
        onSuccess: () => {
          setSelectedIndex(nextIdx);
        },
      },
    );
  }

  async function handleExportPdf() {
    try {
      if (activeSlide && isDirty) {
        await updateSlide.mutateAsync({
          slideId: activeSlide.id,
          layout,
          content: buildPersistContent(layout, fields, eyebrow),
          imagePrompt,
          speakerNotes,
        });
      }
      window.open(
        `/decks/${deckId}/print`,
        "_blank",
        "noopener,noreferrer",
      );
    } catch {
      /* save failed — do not open print tab */
    }
  }

  function handleRemoveSlide() {
    const slideId = activeSlide?.id;
    if (!slideId) return;
    if (
      !window.confirm(
        isDirty
          ? "Remove this slide? Unsaved changes will be lost. This cannot be undone."
          : "Remove this slide from the deck? This cannot be undone.",
      )
    ) {
      return;
    }
    removeSlide.mutate({ slideId });
  }

  if (bundleQuery.isLoading || !data) {
    return (
      <div className="flex flex-1 items-center justify-center gap-3 py-24">
        <Spinner />
        <span className="t-caption text-(--app-text-2)">Loading editor…</span>
      </div>
    );
  }

  if (bundleQuery.isError) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 p-8">
        <p className="t-caption text-destructive">Could not load this deck.</p>
      </div>
    );
  }

  if (orderedSlides.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
        <p className="t-body text-(--app-text-2)">
          This deck has no slides yet.
        </p>
      </div>
    );
  }

  if (!activeSlide) {
    return null;
  }

  const brand: SlideBrandTokens = {
    colors: data.brandKit.colors,
    fontDisplay: data.brandKit.fontDisplay,
    fontText: data.brandKit.fontText,
    logoUrl: data.brandKit.logoUrl ?? null,
    kitName: data.brandKit.name,
  };

  const previewContent = normalizeContentForPersist(
    layout,
    buildPersistContent(layout, fields, eyebrow),
  ) as PlanSlideContent;

  const thumbRows = orderedSlides.map((s) => {
    const pl = slideLayoutSchema.safeParse(s.layout);
    const lo = pl.success ? pl.data : "imageText";
    return {
      id: s.id,
      layout: lo,
      previewContent: normalizeContentForPersist(
        lo,
        s.content,
      ) as PlanSlideContent,
    };
  });

  return (
    <div className="flex h-dvh min-h-0 flex-col bg-(--app-bg) text-(--app-text)">
      <EditorToolbar
        deckTitle={data.deck.title}
        brandKitName={data.brandKit.name}
        onAddSlide={handleAddSlide}
        addSlidePending={addSlide.isPending}
        onExportPdf={handleExportPdf}
        exportPdfPending={updateSlide.isPending}
      />
      <div className="flex min-h-0 flex-1">
        <EditorThumbnailRail
          slides={thumbRows}
          selectedIndex={selectedIndex}
          onSelectIndex={selectSlideIndex}
          brand={brand}
          onMoveUp={(i) => {
            reorderIndex(i, i - 1);
          }}
          onMoveDown={(i) => {
            reorderIndex(i, i + 1);
          }}
        />
        <SlideCanvasView
          scale={zoom}
          onScaleChange={setZoom}
          layout={layout}
          previewContent={previewContent}
          brand={brand}
          slideIndex={selectedIndex + 1}
          slideTotal={orderedSlides.length}
          activeRegion={activeRegion}
          onRegionClick={(region) => {
            setActiveRegion(region);
            setInspectorTab("element");
          }}
          onSaveSlide={saveCurrentSlide}
          saveSlidePending={updateSlide.isPending}
          saveSlideDisabled={!isDirty}
        />
        <EditorInspector
          tab={inspectorTab}
          onTabChange={setInspectorTab}
          layout={layout}
          allowedLayouts={layoutOpts}
          onLayoutSelect={onLayoutSelect}
          fields={fields}
          onPatchFields={patchFields}
          eyebrow={eyebrow}
          onEyebrowChange={patchEyebrow}
          imagePrompt={imagePrompt}
          onImagePromptChange={patchImagePrompt}
          speakerNotes={speakerNotes}
          onSpeakerNotesChange={patchSpeakerNotes}
          templateConfig={data.deck.templateConfig}
          activeRegion={activeRegion}
          onRemoveSlide={handleRemoveSlide}
        />
      </div>
    </div>
  );
}
