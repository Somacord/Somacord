import { Button } from "@/components/ui/button";

export interface StepActionsProps {
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  nextType?: "button" | "submit";
  pending?: boolean;
}

/** Shared Back/Continue footer for onboarding wizard steps. */
export function StepActions({
  onBack,
  onNext,
  nextLabel = "Continue",
  nextDisabled,
  nextType = "button",
  pending,
}: StepActionsProps) {
  return (
    <div className="flex items-center gap-3">
      {onBack && (
        <Button type="button" variant="secondary-light" onClick={onBack} className="shrink-0">
          Back
        </Button>
      )}
      <Button
        type={nextType}
        variant="primary"
        onClick={nextType === "button" ? onNext : undefined}
        disabled={nextDisabled || pending}
        className="flex-1"
      >
        {pending ? "Saving…" : nextLabel}
      </Button>
    </div>
  );
}
