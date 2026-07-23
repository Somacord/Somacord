import Image from "next/image";

import { Button } from "@/components/ui/button";
import { photography } from "@/config/media";

export interface WelcomeStepProps {
  onNext: () => void;
}

export function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <div className="text-center">
      <div className="rounded-card relative mx-auto mb-6 h-40 w-full max-w-sm overflow-hidden">
        <Image
          src={photography.homepageHero1.src}
          alt={photography.homepageHero1.alt}
          fill
          className="object-cover"
        />
      </div>
      <h1 className="mb-3 text-[28px]">Welcome to Somacord</h1>
      <p className="text-ink-muted mb-8 text-sm">
        A few quick questions and you&apos;ll be ready to find your people. This takes about two
        minutes.
      </p>
      <Button type="button" variant="primary" className="w-full" onClick={onNext}>
        Get Started
      </Button>
    </div>
  );
}
