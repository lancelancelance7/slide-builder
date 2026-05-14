"use client";

import { useEffect, useMemo, useState } from "react";
import { notFound, useRouter } from "next/navigation";

import { BrandKitAppliesToCard } from "~/components/brand-kit/brand-kit-applies-to-card";
import { BrandKitComplianceCard } from "~/components/brand-kit/brand-kit-compliance-card";
import {
  draftFromKitRow,
  draftsEqual,
  type BrandKitDraft,
} from "~/components/brand-kit/brand-kit-draft";
import { BrandKitImageStyleSection } from "~/components/brand-kit/brand-kit-image-style-section";
import type { PreviewTab } from "~/components/brand-kit/brand-kit-live-preview";
import { BrandKitLivePreview } from "~/components/brand-kit/brand-kit-live-preview";
import { BrandKitLogoSection } from "~/components/brand-kit/brand-kit-logo-section";
import { BrandKitPageHeader } from "~/components/brand-kit/brand-kit-page-header";
import { BrandKitPaletteSection } from "~/components/brand-kit/brand-kit-palette-section";
import { BrandKitToneSection } from "~/components/brand-kit/brand-kit-tone-section";
import { BrandKitTypographySection } from "~/components/brand-kit/brand-kit-typography-section";
import { Spinner } from "~/components/ui/spinner";
import { api } from "~/trpc/react";

export function BrandKitEditorClient(props: { kitId: string }) {
  const router = useRouter();
  const utils = api.useUtils();

  const detailQuery = api.brandKit.byId.useQuery({ id: props.kitId });

  const [draft, setDraft] = useState<BrandKitDraft | null>(null);
  const [snapshot, setSnapshot] = useState<BrandKitDraft | null>(null);
  const [previewTab, setPreviewTab] = useState<PreviewTab>("cover");
  const [saveError, setSaveError] = useState<string | null>(null);

  const updatedTick =
    detailQuery.data?.kit.updatedAt != null
      ? detailQuery.data.kit.updatedAt.getTime()
      : null;

  useEffect(() => {
    if (!detailQuery.data) {
      return;
    }
    const nextDraft = draftFromKitRow(detailQuery.data.kit);
    setDraft(nextDraft);
    setSnapshot(nextDraft);
  }, [props.kitId, updatedTick]);

  const dirty = useMemo(() => {
    if (!draft || !snapshot) {
      return false;
    }
    return !draftsEqual(draft, snapshot);
  }, [draft, snapshot]);

  const updateMutation = api.brandKit.update.useMutation({
    onSuccess: async () => {
      setSaveError(null);
      await utils.brandKit.list.invalidate();
      await detailQuery.refetch();
      router.refresh();
    },
    onError: (e) => {
      setSaveError(e.message);
    },
  });

  const duplicateMutation = api.brandKit.duplicate.useMutation({
    onSuccess: async (row) => {
      await utils.brandKit.list.invalidate();
      router.push(`/brand-kits/${row.id}`);
      router.refresh();
    },
  });

  const deleteMutation = api.brandKit.delete.useMutation({
    onSuccess: async () => {
      await utils.brandKit.list.invalidate();
      router.push("/brand-kits");
      router.refresh();
    },
    onError: (e) => {
      setSaveError(e.message);
    },
  });

  const setDefaultMutation = api.brandKit.setDefault.useMutation({
    onSuccess: async () => {
      await utils.brandKit.list.invalidate();
      await detailQuery.refetch();
      router.refresh();
    },
    onError: (e) => {
      setSaveError(e.message);
    },
  });

  if (!detailQuery.isPending && detailQuery.data === null) {
    notFound();
  }

  if (
    detailQuery.isPending ||
    detailQuery.data === undefined ||
    draft === null ||
    snapshot === null
  ) {
    return (
      <main className="flex grow justify-center px-10 py-24">
        <Spinner className="size-10" />
      </main>
    );
  }

  const detail = detailQuery.data!;

  const previewModel = {
    name: draft.name,
    colors: draft.colors,
    fontDisplay: draft.fontDisplay,
    fontText: draft.fontText,
  };

  return (
    <main className="grow overflow-auto px-10 py-8">
      <BrandKitPageHeader
        kitId={props.kitId}
        name={draft.name}
        deckCount={detail.deckCount}
        isDefault={detail.kit.isDefault}
        dirty={dirty}
        isSaving={updateMutation.isPending}
        isDuplicating={duplicateMutation.isPending}
        canDelete={detail.deckCount === 0}
        saveError={saveError}
        onNameChange={(value) => {
          setDraft((current) =>
            current === null ? current : { ...current, name: value },
          );
        }}
        onDiscard={() => {
          if (!snapshot) return;
          setDraft(structuredClone(snapshot));
          setSaveError(null);
        }}
        onSave={() => {
          updateMutation.mutate({
            id: props.kitId,
            name: draft.name,
            logoUrl: draft.logoUrl,
            colors: draft.colors,
            fontDisplay: draft.fontDisplay,
            fontText: draft.fontText,
            tone: draft.tone,
            imageStyle: draft.imageStyle,
          });
        }}
        onDuplicate={() => {
          duplicateMutation.mutate({ id: props.kitId });
        }}
        onDelete={() => {
          if (
            !window.confirm(
              "Delete this brand kit permanently? This cannot be undone.",
            )
          ) {
            return;
          }
          deleteMutation.mutate({ id: props.kitId });
        }}
        onSetDefault={() => {
          setDefaultMutation.mutate({ id: props.kitId });
        }}
      />

      <div className="grid grid-cols-1 gap-10 xl:grid-cols-2 xl:gap-12">
        <div className="flex flex-col gap-8">
          <BrandKitLogoSection
            logoUrl={draft.logoUrl}
            onLogoUrlChange={(url) => {
              setDraft((current) =>
                current === null ? current : { ...current, logoUrl: url },
              );
            }}
          />
          <BrandKitPaletteSection
            colors={draft.colors}
            onChange={(colors) => {
              setDraft((current) =>
                current === null ? current : { ...current, colors },
              );
            }}
          />
          <BrandKitTypographySection
            fontDisplay={draft.fontDisplay}
            fontText={draft.fontText}
            onFontDisplayChange={(fontDisplay) => {
              setDraft((current) =>
                current === null ? current : { ...current, fontDisplay },
              );
            }}
            onFontTextChange={(fontText) => {
              setDraft((current) =>
                current === null ? current : { ...current, fontText },
              );
            }}
          />
          <BrandKitToneSection
            tone={draft.tone}
            onToneChange={(tone) => {
              setDraft((current) =>
                current === null ? current : { ...current, tone },
              );
            }}
          />
          <BrandKitImageStyleSection
            imageStyle={draft.imageStyle}
            onImageStyleChange={(imageStyle) => {
              setDraft((current) =>
                current === null ? current : { ...current, imageStyle },
              );
            }}
          />
        </div>

        <div className="flex flex-col gap-4 xl:sticky xl:top-8 xl:self-start">
          <BrandKitLivePreview
            draft={previewModel}
            tab={previewTab}
            onTabChange={setPreviewTab}
          />
          <BrandKitComplianceCard
            colors={draft.colors}
            logoUrl={draft.logoUrl}
          />
          <BrandKitAppliesToCard
            kitName={draft.name.trim() || "Untitled kit"}
            deckCount={detail.deckCount}
            linkedDeckTitles={detail.linkedDeckTitles}
          />
        </div>
      </div>
    </main>
  );
}
