import { StepActions } from "@/components/onboarding/step-actions";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";

export interface NameStepProps {
  firstName: string;
  lastName: string;
  onChange: (field: "firstName" | "lastName", value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function NameStep({ firstName, lastName, onChange, onNext, onBack }: NameStepProps) {
  const canContinue = firstName.trim().length > 0 && lastName.trim().length > 0;

  return (
    <div>
      <h2 className="mb-1 text-2xl">What&apos;s your name?</h2>
      <p className="text-ink-muted mb-6 text-sm">
        This is how you&apos;ll appear to others on Somacord.
      </p>
      <div className="mb-6 grid gap-5 sm:grid-cols-2">
        <FormField label="First name" htmlFor="onboarding-first-name">
          <Input
            id="onboarding-first-name"
            value={firstName}
            onChange={(event) => onChange("firstName", event.target.value)}
            autoComplete="given-name"
            required
          />
        </FormField>
        <FormField label="Last name" htmlFor="onboarding-last-name">
          <Input
            id="onboarding-last-name"
            value={lastName}
            onChange={(event) => onChange("lastName", event.target.value)}
            autoComplete="family-name"
            required
          />
        </FormField>
      </div>
      <StepActions onBack={onBack} onNext={onNext} nextDisabled={!canContinue} />
    </div>
  );
}
