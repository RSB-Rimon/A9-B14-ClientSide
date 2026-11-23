import Link from "next/link";
import { CheckCircle2, Clock3 } from "lucide-react";

export default function PaymentSuccessPage() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl items-center justify-center">
      <section className="w-full rounded-3xl border border-[#eee9e2] bg-white p-7 text-center shadow-sm sm:p-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600">
          <CheckCircle2 size={34} />
        </div>

        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-[#b58b57]">
          Payment submitted
        </p>
        <h1 className="mt-3 text-3xl font-bold text-[#29251f]">
          Thank you for your payment
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-[#81796f]">
          Stripe has returned you to SalonBook. Your appointment will be marked
          paid only after our server verifies the payment through Stripe&apos;s
          webhook.
        </p>

        <div className="mt-6 flex items-start gap-3 rounded-2xl bg-[#faf6f2] p-4 text-left">
          <Clock3 size={19} className="mt-0.5 shrink-0 text-[#b58b57]" />
          <p className="text-sm leading-6 text-[#686159]">
            Payment status may take a moment to update while the verified
            webhook is processed. You can check again in My Appointments.
          </p>
        </div>

        <Link
          href="/customer/dashboard/appointments"
          className="mt-7 inline-flex w-full items-center justify-center rounded-xl bg-[#29251f] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#51473d] sm:w-auto"
        >
          Go to My Appointments
        </Link>
      </section>
    </div>
  );
}
