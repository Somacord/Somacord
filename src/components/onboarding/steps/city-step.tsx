import { StepActions } from "@/components/onboarding/step-actions";
import { cities } from "@/data/cities";

export interface CityStepProps {
  city: string;
  onChange: (city: string) => void;
  onNext: () => void;
  onBack: () => void;
}

/** Somacord is single-city at MVP, so this is a confirmation more than a search — see docs/business/launch-strategy.md. */
export function CityStep({ city, onChange, onNext, onBack }: CityStepProps) {
  return (
    <div>
      <h2 className="mb-1 text-2xl">Choose your city</h2>
      <p className="text-ink-muted mb-6 text-sm">
        Somacord is starting in one city — more are on the way.
      </p>
      <div className="mb-6 flex flex-col gap-3">
        {cities.map((option) => {
          const selected = city === option.name;
          return (
            <button
              key={option.slug}
              type="button"
              onClick={() => onChange(option.name)}
              className={`rounded-card flex items-center justify-between border px-5 py-4 text-left transition-colors ${
                selected
                  ? "border-cord-blue bg-soft-sky"
                  : "border-soft-sky hover:border-cord-blue bg-white"
              }`}
            >
              <span>
                <span className="text-ink block font-medium">{option.name}</span>
                <span className="text-ink-muted block text-xs">{option.state}</span>
              </span>
              {selected && <span className="text-community-green text-lg">✓</span>}
            </button>
          );
        })}
      </div>
      <StepActions onBack={onBack} onNext={onNext} nextDisabled={!city} />
    </div>
  );
}
