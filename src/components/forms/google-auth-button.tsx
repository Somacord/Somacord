import { signInWithGoogleAction } from "@/lib/actions/auth";

export interface GoogleAuthButtonProps {
  /** Where to send the user after a successful Google sign-in. */
  next?: string;
}

/** "Continue with Google" — see GOAL #4 in the auth milestone. */
export function GoogleAuthButton({ next }: GoogleAuthButtonProps) {
  return (
    <form action={signInWithGoogleAction}>
      {next && <input type="hidden" name="next" value={next} />}
      <button
        type="submit"
        className="rounded-pill border-soft-sky text-ink hover:border-cord-blue flex w-full items-center justify-center gap-3 border-[1.5px] bg-white px-6 py-3 text-sm font-semibold transition-colors"
      >
        <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" aria-hidden>
          <path
            fill="#4285F4"
            d="M23.52 12.27c0-.82-.07-1.42-.22-2.04H12v3.86h6.53c-.13 1.08-.85 2.71-2.44 3.8l-.02.15 3.55 2.75.25.02c2.26-2.09 3.65-5.17 3.65-8.54Z"
          />
          <path
            fill="#34A853"
            d="M12 24c3.24 0 5.95-1.07 7.93-2.9l-3.78-2.93c-1.01.7-2.37 1.19-4.15 1.19-3.17 0-5.86-2.09-6.82-4.98l-.14.01-3.7 2.86-.05.13C3.28 21.3 7.31 24 12 24Z"
          />
          <path
            fill="#FBBC05"
            d="M5.18 14.38A7.4 7.4 0 0 1 4.77 12c0-.83.15-1.63.4-2.38l-.01-.16-3.75-2.91-.12.06A11.93 11.93 0 0 0 0 12c0 1.93.47 3.76 1.29 5.38l3.89-3Z"
          />
          <path
            fill="#EA4335"
            d="M12 4.75c2.25 0 3.77.97 4.64 1.78l3.38-3.3C17.94 1.19 15.24 0 12 0 7.31 0 3.28 2.7 1.29 6.62l3.88 3.01C6.14 6.84 8.83 4.75 12 4.75Z"
          />
        </svg>
        Continue with Google
      </button>
    </form>
  );
}
