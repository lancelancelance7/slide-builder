"use client";

import Link from "next/link";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

export function BrandKitPageHeader(props: {
  kitId: string;
  name: string;
  deckCount: number;
  isDefault: boolean;
  isSaving: boolean;
  isDuplicating: boolean;
  canDelete: boolean;
  dirty: boolean;
  saveError: string | null;
  onNameChange: (value: string) => void;
  onDiscard: () => void;
  onSave: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onSetDefault: () => void;
}) {
  return (
    <header className="mb-8 flex flex-col gap-6 border-[color:var(--app-divider)] border-b pb-8">
      <nav className="flex flex-wrap items-center gap-2 t-caption">
        <Link
          href="/brand-kits"
          className="text-[color:var(--color-accent)] hover:underline"
        >
          Brand kits
        </Link>
        <span className="text-[color:var(--app-text-3)]">/</span>
        <span className="truncate text-[color:var(--app-text)]">
          {props.name.trim() || "Untitled kit"}
        </span>
      </nav>

      <div className="flex flex-wrap items-start gap-6">
        <div className="flex min-w-[200px] flex-1 flex-col gap-3">
          <Input
            className="t-section max-w-xl border-transparent bg-transparent px-0 shadow-none focus-visible:ring-0"
            value={props.name}
            onChange={(e) => {
              props.onNameChange(e.target.value);
            }}
            aria-label="Brand kit name"
          />
          <p className="text-[color:var(--app-text-2)] t-caption">
            {props.deckCount}{" "}
            {props.deckCount === 1 ? "deck" : "decks"} linked · Kit ID{" "}
            <span className="break-all font-mono t-micro">{props.kitId}</span>
          </p>
          {props.saveError !== null && props.saveError !== "" && (
            <p className="text-destructive t-caption">{props.saveError}</p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {props.isDefault && (
            <span className="rounded-full border border-[color:var(--app-border)] px-3 py-1 t-caption text-[color:var(--app-text)]">
              Workspace default
            </span>
          )}
          {!props.isDefault && (
            <Button
              size="sm"
              type="button"
              variant="outline"
              onClick={() => {
                props.onSetDefault();
              }}
            >
              Set as default
            </Button>
          )}
          <Button
            size="sm"
            type="button"
            variant="outline"
            disabled={props.isDuplicating}
            onClick={() => {
              props.onDuplicate();
            }}
          >
            Duplicate
          </Button>
          <Button
            size="sm"
            type="button"
            variant="ghost"
            disabled={!props.dirty || props.isSaving}
            onClick={() => {
              props.onDiscard();
            }}
          >
            Discard
          </Button>
          <Button
            size="sm"
            type="button"
            disabled={!props.dirty || props.isSaving}
            onClick={() => {
              props.onSave();
            }}
          >
            Save kit
          </Button>
          <Button
            size="sm"
            type="button"
            variant="destructive"
            disabled={!props.canDelete || props.isSaving}
            onClick={() => {
              props.onDelete();
            }}
          >
            Delete
          </Button>
        </div>
      </div>
    </header>
  );
}
