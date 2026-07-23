import { StepActions } from "@/components/onboarding/step-actions";
import { availabilityOptions } from "@/data/onboarding";
import { cn } from "@/lib/utils";
import type { Availability } from "@/types/domain";

export interface AvailabilityStepProps {
  availability: Availability[];
  onToggle: (value: Availability) => void;
  onNext: () => void;
  onBack: () => void;
}

export function AvailabilityStep({
  availability,
  onToggle,
  onNext,
  onBack,
}: AvailabilityStepProps) {
  return (
    <div>
      <h2 className="mb-1 text-2xl">When are you usually free?</h2>
      <p className="text-ink-muted mb-6 text-sm">
        Pick as many as apply — this just helps with recommendations.
      </p>
      <div className="mb-6 flex flex-col gap-3">
        {availabilityOptions.map((option) => {
          const selected = availability.includes(option.value);
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onToggle(option.value)}
              className={cn(
                "rounded-card flex items-center justify-between border px-5 py-4 text-left transition-colors",
                selected
                  ? "border-cord-blue bg-soft-sky"
                  : "border-soft-sky hover:border-cord-blue bg-white",
              )}
            >
              <span>
                <span className="text-ink block font-medium">{option.label}</span>
                <span className="text-ink-muted block text-xs">{option.description}</span>
              </span>
              {selected && <span className="text-community-green text-lg">✓</span>}
            </button>
          );
        })}
      </div>
      <StepActions onBack={onBack} onNext={onNext} nextDisabled={availability.length === 0} />
    </div>
  );
}
