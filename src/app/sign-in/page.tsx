"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type UseFormRegisterReturn } from "react-hook-form";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Scissors,
  Loader2,
  Calendar,
  Clock,
  Sparkles,
  Check,
} from "lucide-react";

import { authClient } from "@/app/lib/auth-client";
import GitHubAuthButton from "@/app/components/GitHubAuthButton";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// -------------------- Validation --------------------

const signInSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type SignInFormValues = z.infer<typeof signInSchema>;

// -------------------- Reusable Field --------------------

type FormFieldProps = {
  id: string;
  label: string;
  placeholder: string;
  type?: string;
  icon: ReactNode;
  registration: UseFormRegisterReturn;
  error?: string;
  disabled?: boolean;
  autoComplete?: string;
  rightElement?: ReactNode;
};

function FormField({
  id,
  label,
  placeholder,
  type = "text",
  icon,
  registration,
  error,
  disabled,
  autoComplete,
  rightElement,
}: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-[13px] font-medium text-[#41352f]">
        {label}
      </Label>

      <div className="group relative">
        <span className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-[#b0a59c] transition-colors group-focus-within:text-[#a66d5c]">
          {icon}
        </span>

        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          className={`h-12 rounded-xl border bg-[#fcfaf8] pl-11 text-[14px] text-[#41352f] shadow-none transition-all placeholder:text-[#b9afa8] hover:border-[#d9cec5] focus-visible:border-[#a66d5c] focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-[#a66d5c]/10 ${
            rightElement ? "pr-12" : "pr-4"
          } ${
            error
              ? "border-red-300 bg-red-50/40 focus-visible:border-red-400 focus-visible:ring-red-100"
              : "border-[#e7dfd8]"
          }`}
          {...registration}
        />

        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>

      {error && <p className="text-xs font-medium text-red-500">{error}</p>}
    </div>
  );
}

// -------------------- Sign In Page --------------------

export default function SignInPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: SignInFormValues) => {
    setServerError("");

    try {
      const { error } = await authClient.signIn.email({
        email: values.email,
        password: values.password,
      });

      if (error) {
        setServerError(error.message || "Invalid email or password.");
        return;
      }

      router.replace("/auth/redirect");
      router.refresh();
    } catch {
      setServerError("Something went wrong. Please try again.");
    }
  };

  return (
    <main className="min-h-screen bg-[#faf8f5] px-4 py-6 sm:px-6 sm:py-10 lg:flex lg:items-center lg:justify-center">
      <div className="mx-auto grid w-full max-w-[1080px] overflow-hidden rounded-[28px] border border-[#ebe4de] bg-white shadow-[0_30px_80px_-30px_rgba(61,43,32,0.18)] lg:grid-cols-[1fr_1.05fr]">
        {/* ---------- Brand panel ---------- */}

        <section className="relative m-3 hidden flex-col justify-between overflow-hidden rounded-[20px] bg-[#f1ece6] px-10 py-10 lg:flex xl:px-12">
          <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-[#e8ddd2]/70" />
          <div className="pointer-events-none absolute -bottom-32 -left-20 size-80 rounded-full bg-[#e9dfd5]/80" />

          <Link href="/" className="relative z-10 flex w-fit items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-[#49372f] text-white">
              <Scissors className="size-[18px]" strokeWidth={1.7} />
            </span>
            <span className="text-[22px] font-semibold tracking-tight text-[#49372f]">
              SalonBook
            </span>
          </Link>

          <div className="relative z-10 py-10">
            <h2 className="max-w-[360px] font-serif text-[40px] leading-[1.15] tracking-[-1px] text-[#49372f] xl:text-[44px]">
              Welcome back. Your next visit is just ahead.
            </h2>

            <p className="mt-4 max-w-[340px] text-[14px] leading-7 text-[#7d7068]">
              Sign in to see your appointments, book a new service and
              manage everything in one place.
            </p>

            {/* Upcoming appointment slip */}
            <div className="relative mt-10 w-full max-w-[330px]">
              <div className="absolute inset-0 translate-x-2 translate-y-3 -rotate-3 rounded-2xl bg-[#e2d6ca]" />

              <div className="relative rounded-2xl bg-white p-5 shadow-[0_20px_40px_-20px_rgba(73,55,47,0.4)]">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-full bg-[#f4e9e4] text-[#a66d5c]">
                      <Sparkles className="size-[18px]" />
                    </span>
                    <div>
                      <p className="text-[14px] font-semibold text-[#49372f]">
                        Haircut and blow-dry
                      </p>
                      <p className="text-xs text-[#8e8178]">
                        with Amina, senior stylist
                      </p>
                    </div>
                  </div>

                  <span className="rounded-full bg-[#f4e9e4] px-2.5 py-1 text-[11px] font-medium text-[#a66d5c]">
                    Upcoming
                  </span>
                </div>

                <div className="relative my-4 border-t border-dashed border-[#e3d9cf]">
                  <span className="absolute -left-[30px] -top-2.5 size-5 rounded-full bg-[#f1ece6]" />
                  <span className="absolute -right-[30px] -top-2.5 size-5 rounded-full bg-[#f1ece6]" />
                </div>

                <div className="flex items-center gap-6 text-[13px] text-[#5b4c44]">
                  <span className="flex items-center gap-2">
                    <Calendar className="size-4 text-[#a66d5c]" />
                    Sat, 28 Nov
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock className="size-4 text-[#a66d5c]" />
                    11:30 AM
                  </span>
                </div>
              </div>
            </div>
          </div>

          <ul className="relative z-10 space-y-3 text-[13px] text-[#6f625a]">
            {[
              "See and manage all your bookings",
              "Reschedule or cancel in a couple of taps",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#49372f] text-white">
                  <Check className="size-3" strokeWidth={3} />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* ---------- Form panel ---------- */}

        <section className="flex items-center justify-center px-5 py-10 sm:px-10 sm:py-12 lg:px-12 xl:px-16">
          <div className="w-full max-w-[400px]">
            {/* Mobile brand */}
            <Link
              href="/"
              className="mb-9 flex w-fit items-center gap-2.5 lg:hidden"
            >
              <span className="flex size-9 items-center justify-center rounded-xl bg-[#49372f] text-white">
                <Scissors className="size-4" />
              </span>
              <span className="text-xl font-semibold tracking-tight text-[#49372f]">
                SalonBook
              </span>
            </Link>

            <div className="mb-8">
              <h1 className="font-serif text-[34px] font-medium leading-tight tracking-[-0.8px] text-[#49372f] sm:text-[38px]">
                Sign in to your account
              </h1>
              <p className="mt-2.5 text-[14px] leading-6 text-[#8e8178]">
                Enter your email and password to continue.
              </p>
            </div>

            <GitHubAuthButton disabled={isSubmitting} />

            <div className="my-6 flex items-center gap-4">
              <span className="h-px flex-1 bg-[#eee8e3]" />
              <span className="text-xs text-[#a99e96]">or sign in with email</span>
              <span className="h-px flex-1 bg-[#eee8e3]" />
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="space-y-4"
            >
              <FormField
                id="email"
                label="Email address"
                placeholder="you@example.com"
                type="email"
                icon={<Mail className="size-[17px]" />}
                registration={register("email")}
                error={errors.email?.message}
                autoComplete="email"
                disabled={isSubmitting}
              />

              <FormField
                id="password"
                label="Password"
                placeholder="Enter your password"
                type={showPassword ? "text" : "password"}
                icon={<Lock className="size-[17px]" />}
                registration={register("password")}
                error={errors.password?.message}
                autoComplete="current-password"
                disabled={isSubmitting}
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="flex size-8 items-center justify-center rounded-lg text-[#a69a91] transition hover:bg-[#f1ece6] hover:text-[#49372f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a66d5c]/40"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                }
              />

              {serverError && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-600"
                >
                  {serverError}
                </div>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-12 w-full rounded-xl bg-[#49372f] text-[14px] font-semibold text-white shadow-[0_10px_24px_-10px_rgba(73,55,47,0.6)] transition-all hover:bg-[#5b463c] active:scale-[0.99] disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>

            <p className="mt-7 text-center text-[13px] text-[#93877f]">
              Don’t have an account?{" "}
              <Link
                href="/sign-up"
                className="font-semibold text-[#a66d5c] transition hover:text-[#49372f] hover:underline"
              >
                Create account
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}