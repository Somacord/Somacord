"use client";

import Image from "next/image";
import * as React from "react";

import { StepActions } from "@/components/onboarding/step-actions";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export interface PhotoStepProps {
  userId: string;
  avatarUrl: string;
  onChange: (avatarUrl: string) => void;
  onNext: () => void;
  onBack: () => void;
}

/** Optional profile photo — uploads immediately to Supabase Storage's `avatars` bucket. */
export function PhotoStep({ userId, avatarUrl, onChange, onNext, onBack }: PhotoStepProps) {
  const [uploading, setUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const supabase = createSupabaseBrowserClient();
      const extension = file.name.split(".").pop() ?? "jpg";
      const path = `${userId}/avatar-${Date.now()}.${extension}`;

      const { error: uploadError } = await supabase.storage.from("avatars").upload(path, file, {
        upsert: true,
        cacheControl: "3600",
      });

      if (uploadError) {
        setError("Couldn't upload that photo. Please try a different file.");
        return;
      }

      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
      onChange(data.publicUrl);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <h2 className="mb-1 text-2xl">Add a profile photo</h2>
      <p className="text-ink-muted mb-6 text-sm">
        Optional — you can always add one later from your profile.
      </p>

      <div className="mb-6 flex items-center gap-5">
        <div className="rounded-pill bg-soft-sky relative h-20 w-20 shrink-0 overflow-hidden">
          {avatarUrl && (
            <Image src={avatarUrl} alt="Your profile photo" fill className="object-cover" />
          )}
        </div>
        <div>
          <label
            htmlFor="onboarding-avatar"
            className="rounded-pill border-cord-blue text-cord-blue hover:bg-cord-blue inline-block cursor-pointer border-[1.5px] px-5 py-2 text-sm font-semibold hover:text-white"
          >
            {uploading ? "Uploading…" : avatarUrl ? "Choose a different photo" : "Choose a photo"}
          </label>
          <input
            id="onboarding-avatar"
            type="file"
            accept="image/png, image/jpeg, image/webp"
            className="sr-only"
            onChange={handleFileChange}
            disabled={uploading}
          />
          {error && <p className="text-sand-ink mt-2 text-xs">{error}</p>}
        </div>
      </div>

      <StepActions onBack={onBack} onNext={onNext} nextLabel="Continue" pending={uploading} />
    </div>
  );
}
