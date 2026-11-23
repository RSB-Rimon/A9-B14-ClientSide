import Link from "next/link";
import { CircleX } from "lucide-react";

export default function PaymentCancelledPage() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl items-center justify-center">
      <section className="w-full rounded-3xl border border-[#eee9e2] bg-white p-7 text-center shadow-sm sm:p-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-amber-600">
          <CircleX size={34} />
        </div>

        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-[#b58b57]">
          Checkout cancelled
        </p>
        <h1 className="mt-3 text-3xl font-bold text-[#29251f]">
          Your payment was not completed
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-[#81796f]">
          The checkout was cancelled, so your appointment remains unpaid. If it
          is still confirmed, you can return to My Appointments to try again.
        </p>

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
