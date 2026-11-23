"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { authClient } from "@/app/lib/auth-client";

export default function GitHubAuthButton({
  disabled = false,
}: {
  disabled?: boolean;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignIn = async () => {
    setError("");
    setIsLoading(true);

    try {
      const { error: signInError } = await authClient.signIn.social({
        provider: "github",
        callbackURL: "/auth/redirect",
        errorCallbackURL: "/sign-in",
      });

      if (signInError) {
        setError(signInError.message || "GitHub authentication failed.");
        setIsLoading(false);
      }
    } catch (signInError) {
      setError(
        signInError instanceof Error
          ? signInError.message
          : "GitHub authentication failed. Please try again.",
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={handleSignIn}
        disabled={disabled || isLoading}
        className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-stone-200 bg-white px-4 text-sm font-semibold text-stone-800 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? (
          <Loader2 className="size-5 animate-spin" />
        ) : (
          <span className="flex size-5 items-center justify-center rounded-full bg-[#24292f] text-[9px] font-bold text-white">
            GH
          </span>
        )}
        {isLoading ? "Connecting to GitHub..." : "Continue with GitHub"}
      </button>

      {error && (
        <p
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
        >
          {error}
        </p>
      )}
    </div>
  );
}
