import { cn } from "~/lib/utils";

export type DeckFlowStep = 1 | 2 | 3;

function StepDot(props: { n: DeckFlowStep; activeStep: DeckFlowStep }) {
  const active = props.n === props.activeStep;
  return (
    <span
      className={cn(
        "flex size-[18px] shrink-0 items-center justify-center rounded-full t-micro",
        active &&
          "bg-[color:var(--color-accent)] font-semibold text-white",
        !active &&
          "border border-[color:var(--app-border)] bg-[color:var(--app-surface)] text-[color:var(--app-text-2)]",
      )}
    >
      {props.n}
    </span>
  );
}

export function NewDeckStepper(props: { activeStep?: DeckFlowStep }) {
  const activeStep = props.activeStep ?? 1;

  return (
    <div className="mb-5 flex flex-wrap items-center gap-2 t-micro text-[color:var(--app-text-2)]">
      <StepDot n={1} activeStep={activeStep} />
      <span
        className={cn(
          activeStep === 1 && "font-medium text-[color:var(--app-text)]",
        )}
      >
        Describe
      </span>
      <span className="h-px w-6 shrink-0 bg-[color:var(--app-border)]" />
      <StepDot n={2} activeStep={activeStep} />
      <span
        className={cn(
          activeStep === 2 && "font-medium text-[color:var(--app-text)]",
        )}
      >
        Review the plan
      </span>
      <span className="h-px w-6 shrink-0 bg-[color:var(--app-border)]" />
      <StepDot n={3} activeStep={activeStep} />
      <span
        className={cn(
          activeStep === 3 && "font-medium text-[color:var(--app-text)]",
        )}
      >
        Generate
      </span>
    </div>
  );
}
