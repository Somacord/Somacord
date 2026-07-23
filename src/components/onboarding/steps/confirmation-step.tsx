import { StepActions } from "@/components/onboarding/step-actions";

export interface ConfirmationStepProps {
  firstName: string;
  onBack: () => void;
  pending: boolean;
  error?: string;
}

export function ConfirmationStep({ firstName, onBack, pending, error }: ConfirmationStepProps) {
  return (
    <div className="text-center">
      <div className="mb-4 text-4xl">🎉</div>
      <h2 className="mb-3 text-2xl">Welcome to Somacord{firstName ? `, ${firstName}` : ""}!</h2>
      <p className="text-ink-muted mb-8 text-sm">
        Your profile is ready. Head to your dashboard to see what&apos;s happening nearby and try a
        free Speed Connect.
      </p>
      {error && (
        <p className="bg-warm-sand text-sand-ink mb-4 rounded-[10px] px-4 py-3 text-left text-sm">
          {error}
        </p>
      )}
      <StepActions onBack={onBack} nextLabel="Finish" nextType="submit" pending={pending} />
    </div>
  );
}
