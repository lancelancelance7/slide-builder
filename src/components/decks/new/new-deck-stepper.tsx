export function NewDeckStepper() {
  return (
    <div className="mb-5 flex flex-wrap items-center gap-2 t-micro text-[color:var(--app-text-2)]">
      <span className="flex size-[18px] shrink-0 items-center justify-center rounded-full bg-[color:var(--color-accent)] font-semibold t-micro text-white">
        1
      </span>
      <span className="font-medium text-[color:var(--app-text)]">
        Describe
      </span>
      <span className="h-px w-6 shrink-0 bg-[color:var(--app-border)]" />
      <span className="flex size-[18px] shrink-0 items-center justify-center rounded-full border border-[color:var(--app-border)] bg-[color:var(--app-surface)] t-micro text-[color:var(--app-text-2)]">
        2
      </span>
      <span>Review the plan</span>
      <span className="h-px w-6 shrink-0 bg-[color:var(--app-border)]" />
      <span className="flex size-[18px] shrink-0 items-center justify-center rounded-full border border-[color:var(--app-border)] bg-[color:var(--app-surface)] t-micro text-[color:var(--app-text-2)]">
        3
      </span>
      <span>Generate</span>
    </div>
  );
}
