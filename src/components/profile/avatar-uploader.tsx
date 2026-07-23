"use client";

import Image from "next/image";
import * as React from "react";
import { useActionState } from "react";

import { updateAvatarAction } from "@/lib/actions/profile";
import { initialProfileActionState } from "@/lib/actions/profile-state";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export interface AvatarUploaderProps {
  userId: string;
  initialAvatarUrl: string | null;
}

export function AvatarUploader({ userId, initialAvatarUrl }: AvatarUploaderProps) {
  const [avatarUrl, setAvatarUrl] = React.useState(initialAvatarUrl ?? "");
  const [uploading, setUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [state, formAction, pending] = useActionState(
    updateAvatarAction,
    initialProfileActionState,
  );
  const formRef = React.useRef<HTMLFormElement>(null);

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
      setAvatarUrl(data.publicUrl);
      // Persist immediately — submit the (now-updated) hidden field on the next tick.
      requestAnimationFrame(() => formRef.current?.requestSubmit());
    } finally {
      setUploading(false);
    }
  }

  return (
    <form ref={formRef} action={formAction} className="flex items-center gap-5">
      <input type="hidden" name="avatarUrl" value={avatarUrl} />
      <div className="rounded-pill bg-soft-sky relative h-20 w-20 shrink-0 overflow-hidden">
        {avatarUrl && (
          <Image src={avatarUrl} alt="Your profile photo" fill className="object-cover" />
        )}
      </div>
      <div>
        <label
          htmlFor="profile-avatar"
          className="rounded-pill border-cord-blue text-cord-blue hover:bg-cord-blue inline-block cursor-pointer border-[1.5px] px-5 py-2 text-sm font-semibold hover:text-white"
        >
          {uploading || pending ? "Saving…" : "Change photo"}
        </label>
        <input
          id="profile-avatar"
          type="file"
          accept="image/png, image/jpeg, image/webp"
          className="sr-only"
          onChange={handleFileChange}
          disabled={uploading || pending}
        />
        {error && <p className="text-sand-ink mt-2 text-xs">{error}</p>}
        {state.status === "success" && (
          <p className="text-community-green mt-2 text-xs">{state.message}</p>
        )}
      </div>
    </form>
  );
}
