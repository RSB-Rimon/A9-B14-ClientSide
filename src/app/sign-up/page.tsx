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
  UserRound,
  Mail,
  Lock,
  Image as ImageIcon,
  Scissors,
  Loader2,
  Calendar,
  Clock,
  Sparkles,
  Check,
  Plus,
} from "lucide-react";

import { authClient } from "@/app/lib/auth-client";
import GitHubAuthButton from "@/app/components/GitHubAuthButton";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// -------------------- Validation --------------------

const signUpSchema = z
  .object({
    name: z.string().trim().min(2, "Name must be at least 2 characters"),
    email: z.string().trim().email("Enter a valid email address"),
    image: z
      .string()
      .trim()
      .url("Enter a valid image URL")
      .or(z.literal("")),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignUpFormValues = z.infer<typeof signUpSchema>;

// -------------------- Password strength --------------------

const STRENGTH_LABELS = ["Too short", "Weak", "Okay", "Good", "Strong"];
const STRENGTH_COLORS = [
  "bg-red-400",
  "bg-orange-400",
  "bg-amber-400",
  "bg-emerald-500",
];

function getStrength(password: string) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

function StrengthMeter({ password }: { password: string }) {
  if (!password) return null;
  const score = getStrength(password);

  return (
    <div className="flex items-center gap-3 pt-1" aria-live="polite">
      <div className="flex flex-1 gap-1.5">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
              i < score ? STRENGTH_COLORS[score - 1] : "bg-[#ece5de]"
            }`}
          />
        ))}
      </div>
      <span className="w-14 text-right text-[11px] font-medium text-[#8e8178]">
        {STRENGTH_LABELS[score]}
      </span>
    </div>
  );
}

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
  optional?: boolean;
  rightElement?: ReactNode;
  hint?: ReactNode;
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
  optional,
  rightElement,
  hint,
}: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between">
        <Label
          htmlFor={id}
          className="text-[13px] font-medium text-[#41352f]"
        >
          {label}
        </Label>

        {optional && (
          <span className="text-[11px] text-[#a69a91]">Optional</span>
        )}
      </div>

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

      {error ? (
        <p className="text-xs font-medium text-red-500">{error}</p>
      ) : (
        hint
      )}
    </div>
  );
}

function VisibilityToggle({
  visible,
  onToggle,
}: {
  visible: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex size-8 items-center justify-center rounded-lg text-[#a69a91] transition hover:bg-[#f1ece6] hover:text-[#49372f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a66d5c]/40"
      aria-label={visible ? "Hide password" : "Show password"}
    >
      {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
    </button>
  );
}

// -------------------- Sign Up Page --------------------

export default function SignUpPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showImageField, setShowImageField] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      image: "",
      password: "",
      confirmPassword: "",
    },
  });

  const passwordValue = watch("password");

  const onSubmit = async (values: SignUpFormValues) => {
    setServerError("");

    try {
      const { error } = await authClient.signUp.email({
        name: values.name,
        email: values.email,
        password: values.password,
        image: values.image || undefined,
      });

      if (error) {
        setServerError(error.message || "Unable to create your account.");
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
          {/* soft background shapes */}
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
              Your chair is waiting. Pick the time.
            </h2>

            <p className="mt-4 max-w-[340px] text-[14px] leading-7 text-[#7d7068]">
              Create an account to book services, manage appointments and
              keep every visit in one place.
            </p>

            {/* Appointment slip */}
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
                      <p className="text-xs text-[#8e8178]">with Amina, senior stylist</p>
                    </div>
                  </div>

                  <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700">
                    <Check className="size-3" strokeWidth={2.5} />
                    Booked
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
              "Choose a service and a time that suits you",
              "Get a reminder before every appointment",
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
                Create your account
              </h1>
              <p className="mt-2.5 text-[14px] leading-6 text-[#8e8178]">
                It takes less than a minute. Book your first appointment
                right after.
              </p>
            </div>

            <GitHubAuthButton disabled={isSubmitting} />

            <div className="my-6 flex items-center gap-4">
              <span className="h-px flex-1 bg-[#eee8e3]" />
              <span className="text-xs text-[#a99e96]">or sign up with email</span>
              <span className="h-px flex-1 bg-[#eee8e3]" />
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="space-y-4"
            >
              <FormField
                id="name"
                label="Full name"
                placeholder="Your full name"
                icon={<UserRound className="size-[17px]" />}
                registration={register("name")}
                error={errors.name?.message}
                autoComplete="name"
                disabled={isSubmitting}
              />

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
                placeholder="At least 8 characters"
                type={showPassword ? "text" : "password"}
                icon={<Lock className="size-[17px]" />}
                registration={register("password")}
                error={errors.password?.message}
                autoComplete="new-password"
                disabled={isSubmitting}
                hint={<StrengthMeter password={passwordValue} />}
                rightElement={
                  <VisibilityToggle
                    visible={showPassword}
                    onToggle={() => setShowPassword((prev) => !prev)}
                  />
                }
              />

              <FormField
                id="confirmPassword"
                label="Confirm password"
                placeholder="Re-enter your password"
                type={showConfirmPassword ? "text" : "password"}
                icon={<Lock className="size-[17px]" />}
                registration={register("confirmPassword")}
                error={errors.confirmPassword?.message}
                autoComplete="new-password"
                disabled={isSubmitting}
                rightElement={
                  <VisibilityToggle
                    visible={showConfirmPassword}
                    onToggle={() => setShowConfirmPassword((prev) => !prev)}
                  />
                }
              />

              {showImageField ? (
                <FormField
                  id="image"
                  label="Profile photo URL"
                  placeholder="https://example.com/photo.jpg"
                  type="url"
                  icon={<ImageIcon className="size-[17px]" />}
                  registration={register("image")}
                  error={errors.image?.message}
                  optional
                  disabled={isSubmitting}
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setShowImageField(true)}
                  className="flex items-center gap-2 text-[13px] font-medium text-[#a66d5c] transition hover:text-[#49372f]"
                >
                  <Plus className="size-4" />
                  Add a profile photo
                </button>
              )}

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
                    Creating account...
                  </>
                ) : (
                  "Create account"
                )}
              </Button>
            </form>

            <p className="mt-7 text-center text-[13px] text-[#93877f]">
              Already have an account?{" "}
              <Link
                href="/sign-in"
                className="font-semibold text-[#a66d5c] transition hover:text-[#49372f] hover:underline"
              >
                Sign in
              </Link>
            </p>

            <p className="mt-4 text-center text-[11px] leading-5 text-[#b0a69f]">
              By creating an account, you agree to our Terms of Service and
              Privacy Policy.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
