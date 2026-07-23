import { cn } from "@/lib/utils";

export interface ProgressStepsProps {
  current: number;
  total: number;
  labels: string[];
}

/** Step indicator for the onboarding wizard — dots + current step label. */
export function ProgressSteps({ current, total, labels }: ProgressStepsProps) {
  return (
    <div className="mb-8">
      <div className="mb-3 flex justify-center gap-2">
        {Array.from({ length: total }).map((_, index) => (
          <span
            key={index}
            className={cn(
              "rounded-pill h-1.5 max-w-10 flex-1 transition-colors",
              index <= current ? "bg-community-green" : "bg-soft-sky",
            )}
          />
        ))}
      </div>
      <p className="text-community-green text-center text-xs font-semibold tracking-[0.08em] uppercase">
        Step {current + 1} of {total} · {labels[current]}
      </p>
    </div>
  );
}
