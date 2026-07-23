"use client";

import * as React from "react";
import { useActionState } from "react";

import { ProgressSteps } from "@/components/onboarding/progress-steps";
import { AvailabilityStep } from "@/components/onboarding/steps/availability-step";
import { CityStep } from "@/components/onboarding/steps/city-step";
import { ConfirmationStep } from "@/components/onboarding/steps/confirmation-step";
import { InterestsStep } from "@/components/onboarding/steps/interests-step";
import { NameStep } from "@/components/onboarding/steps/name-step";
import { PhotoStep } from "@/components/onboarding/steps/photo-step";
import { WelcomeStep } from "@/components/onboarding/steps/welcome-step";
import { completeOnboardingAction, initialOnboardingActionState } from "@/lib/actions/onboarding";
import type { Availability } from "@/types/domain";

const STEP_LABELS = [
  "Welcome",
  "Your name",
  "Your city",
  "Interests",
  "Availability",
  "Photo",
  "Confirmation",
];

export interface OnboardingWizardProps {
  userId: string;
  defaultCity: string;
}

interface WizardData {
  firstName: string;
  lastName: string;
  city: string;
  interests: string[];
  availability: Availability[];
  avatarUrl: string;
}

/**
 * Onboarding wizard — 7 steps per this milestone's brief (Welcome, Name,
 * City, Interests, Availability, Photo, Confirmation). All step data is
 * held in memory and written to Supabase in one transaction-like pair of
 * updates when the final "Finish" button submits the wrapping form — see
 * completeOnboardingAction. Refreshing mid-wizard restarts from step 1;
 * that's an accepted tradeoff for this milestone (except an already
 * uploaded photo, which stays in Storage either way).
 */
export function OnboardingWizard({ userId, defaultCity }: OnboardingWizardProps) {
  const [step, setStep] = React.useState(0);
  const [data, setData] = React.useState<WizardData>({
    firstName: "",
    lastName: "",
    city: defaultCity,
    interests: [],
    availability: [],
    avatarUrl: "",
  });
  const [state, formAction, pending] = useActionState(
    completeOnboardingAction,
    initialOnboardingActionState,
  );

  const goNext = () => setStep((s) => Math.min(s + 1, STEP_LABELS.length - 1));
  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  function toggleInterest(interest: string) {
    setData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  }

  function toggleAvailability(value: Availability) {
    setData((prev) => ({
      ...prev,
      availability: prev.availability.includes(value)
        ? prev.availability.filter((a) => a !== value)
        : [...prev.availability, value],
    }));
  }

  return (
    <div>
      {step > 0 && <ProgressSteps current={step} total={STEP_LABELS.length} labels={STEP_LABELS} />}

      <form action={formAction}>
        <input type="hidden" name="firstName" value={data.firstName} />
        <input type="hidden" name="lastName" value={data.lastName} />
        <input type="hidden" name="city" value={data.city} />
        <input type="hidden" name="avatarUrl" value={data.avatarUrl} />
        {data.interests.map((interest) => (
          <input key={interest} type="hidden" name="interests" value={interest} />
        ))}
        {data.availability.map((value) => (
          <input key={value} type="hidden" name="availability" value={value} />
        ))}

        {step === 0 && <WelcomeStep onNext={goNext} />}

        {step === 1 && (
          <NameStep
            firstName={data.firstName}
            lastName={data.lastName}
            onChange={(field, value) => setData((prev) => ({ ...prev, [field]: value }))}
            onNext={goNext}
            onBack={goBack}
          />
        )}

        {step === 2 && (
          <CityStep
            city={data.city}
            onChange={(city) => setData((prev) => ({ ...prev, city }))}
            onNext={goNext}
            onBack={goBack}
          />
        )}

        {step === 3 && (
          <InterestsStep
            interests={data.interests}
            onToggle={toggleInterest}
            onNext={goNext}
            onBack={goBack}
          />
        )}

        {step === 4 && (
          <AvailabilityStep
            availability={data.availability}
            onToggle={toggleAvailability}
            onNext={goNext}
            onBack={goBack}
          />
        )}

        {step === 5 && (
          <PhotoStep
            userId={userId}
            avatarUrl={data.avatarUrl}
            onChange={(avatarUrl) => setData((prev) => ({ ...prev, avatarUrl }))}
            onNext={goNext}
            onBack={goBack}
          />
        )}

        {step === 6 && (
          <ConfirmationStep
            firstName={data.firstName}
            onBack={goBack}
            pending={pending}
            error={state.status === "error" ? state.message : undefined}
          />
        )}
      </form>
    </div>
  );
}
