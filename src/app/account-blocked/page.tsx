"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/app/lib/auth-client";

export default function AccountBlockedPage() {
  const [isSigningOut, setIsSigningOut] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    setIsSigningOut(true);

    try {
      const { error } = await authClient.signOut();

      if (error) {
        toast.error(error.message || "Unable to sign out. Please try again.");
        return;
      }

      router.replace("/sign-in");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to sign out.",
      );
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <section className="flex flex-1 items-center justify-center bg-[#faf8f5] px-5 py-16">
      <div className="w-full max-w-lg rounded-2xl border border-[#eee9e2] bg-white p-8 text-center shadow-sm sm:p-10">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-rose-50 text-rose-600">
          <ShieldAlert className="size-7" aria-hidden="true" />
        </div>

        <h1 className="mt-6 text-2xl font-bold text-[#29251f]">
          Account access is blocked
        </h1>
        <p className="mt-3 text-sm leading-6 text-[#686159]">
          This account is currently blocked, so you can’t access SalonBook
          dashboards or services. If you believe this is a mistake, please
          contact SalonBook support.
        </p>

        <button
          type="button"
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="mt-7 inline-flex items-center justify-center gap-2 rounded-lg bg-[#29251f] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#443d34] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <LogOut className="size-4" aria-hidden="true" />
          {isSigningOut ? "Signing out..." : "Sign out"}
        </button>
      </div>
    </section>
  );
}
