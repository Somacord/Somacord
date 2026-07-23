import { StepActions } from "@/components/onboarding/step-actions";
import { FilterPill } from "@/components/ui/filter-pill";
import { interestOptions } from "@/data/onboarding";

export interface InterestsStepProps {
  interests: string[];
  onToggle: (interest: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function InterestsStep({ interests, onToggle, onNext, onBack }: InterestsStepProps) {
  return (
    <div>
      <h2 className="mb-1 text-2xl">What are you into?</h2>
      <p className="text-ink-muted mb-6 text-sm">
        Pick a few — this helps us recommend the right gatherings.
      </p>
      <div className="mb-6 flex flex-wrap gap-2.5">
        {interestOptions.map((interest) => (
          <FilterPill
            key={interest}
            active={interests.includes(interest)}
            onClick={() => onToggle(interest)}
          >
            {interest}
          </FilterPill>
        ))}
      </div>
      <StepActions onBack={onBack} onNext={onNext} nextDisabled={interests.length === 0} />
    </div>
  );
}
