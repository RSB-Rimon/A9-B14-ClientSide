
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  Clock3,
  ArrowLeft,
  CheckCircle2,
  Scissors,
  MessageSquare,
} from "lucide-react";
import { authClient } from "@/app/lib/auth-client";

const API = "http://localhost:5000";

type Service = {
  _id: string;
  name?: string;
  serviceName?: string;
  category: string;
  description: string;
  price: number;
  duration: number;
  image: string;
  status: string;
};

const timeSlots = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
];

export default function BookAppointmentPage() {
  const params = useParams();
  const router = useRouter();
  const serviceId = params.id as string;

  const [service, setService] = useState<Service | null>(null);
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function getService() {
      try {
        const response = await fetch(`${API}/services`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error("Could not load service");
        }

        const found = (result.data || []).find(
          (item: Service) => item._id === serviceId
        );

        if (!found) {
          setError("Service not found or currently unavailable.");
        } else {
          setService(found);
        }
      } catch {
        setError("Failed to load service. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    if (serviceId) getService();
  }, [serviceId]);

  async function handleBooking(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!date || !timeSlot) {
      setError("Please select appointment date and time.");
      return;
    }

    setSubmitting(true);

    try {
      const tokenResult = await authClient.token();
      const token = tokenResult.data?.token;

      if (!token) {
        throw new Error("Please sign in again.");
      }

      const response = await fetch(`${API}/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          serviceId,
          appointmentDate: date,
          timeSlot,
          message,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Booking failed.");
      }

      alert("Appointment request submitted successfully!");
      router.push("/customer/dashboard/appointments");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-[#77716a]">
        Loading service details...
      </div>
    );
  }

  if (error && !service) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-[#eee5dd] bg-white p-8 text-center">
        <p className="text-red-600">{error}</p>
        <Link
          href="/customer/dashboard/my-services"
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#29251f] px-5 py-3 text-sm font-semibold text-white"
        >
          <ArrowLeft size={16} /> Back to Services
        </Link>
      </div>
    );
  }

  if (!service) return null;

  const serviceName = service.serviceName || service.name || "Salon Service";

  const today = new Date();
  const minDate = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  return (
    <div className="mx-auto max-w-6xl">
      <Link
        href="/customer/dashboard/my-services"
        className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-[#77716a] transition hover:text-[#29251f]"
      >
        <ArrowLeft size={17} />
        Back to Services
      </Link>

      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#b77b82]">
          SalonBook Appointment
        </p>
        <h1 className="mt-2 text-3xl font-bold text-[#29251f] sm:text-4xl">
          Book Your Appointment
        </h1>
        <p className="mt-2 text-sm text-[#817b73]">
          Choose your preferred date and time to enjoy our service.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        {/* Service Details */}
        <div className="h-fit overflow-hidden rounded-3xl border border-[#eee5dd] bg-white shadow-sm">
          <div className="relative h-64 bg-[#f2ece6]">
            {service.image ? (
              <Image
                src={service.image}
                alt={serviceName}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-[#b77b82]">
                <Scissors size={48} />
              </div>
            )}
            <span className="absolute left-5 top-5 rounded-full bg-white/95 px-4 py-2 text-xs font-bold text-[#8f6268] shadow-sm">
              {service.category}
            </span>
          </div>

          <div className="p-6 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-widest text-[#b77b82]">
              Selected Service
            </p>
            <h2 className="mt-2 text-2xl font-bold text-[#29251f]">
              {serviceName}
            </h2>

            <p className="mt-3 text-sm leading-7 text-[#817b73]">
              {service.description || "Enjoy our professional salon service."}
            </p>

            <div className="my-6 grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-[#faf6f2] p-4">
                <p className="text-xs text-[#817b73]">Service Price</p>
                <p className="mt-2 text-2xl font-bold text-[#29251f]">
                  ৳{service.price}
                </p>
              </div>

              <div className="rounded-2xl bg-[#faf6f2] p-4">
                <p className="text-xs text-[#817b73]">Duration</p>
                <p className="mt-2 flex items-center gap-2 text-xl font-bold text-[#29251f]">
                  <Clock3 size={18} />
                  {service.duration} min
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-[#f0e5df] p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f8eeee] text-[#b77b82]">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#29251f]">
                  Booking Request
                </p>
                <p className="text-xs text-[#817b73]">
                  Your appointment will be pending until confirmed.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <div className="rounded-3xl border border-[#eee5dd] bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-7">
            <h2 className="text-xl font-bold text-[#29251f]">
              Appointment Details
            </h2>
            <p className="mt-1 text-sm text-[#817b73]">
              Fill in the details below to request your booking.
            </p>
          </div>

          <form onSubmit={handleBooking} className="space-y-7">
            <div>
              <label className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#29251f]">
                <CalendarDays size={17} className="text-[#b77b82]" />
                Appointment Date
              </label>
              <input
                type="date"
                required
                min={minDate}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border border-[#e9e1d9] bg-[#fdfbf9] px-4 py-3.5 text-sm text-[#29251f] outline-none transition focus:border-[#b77b82] focus:ring-2 focus:ring-[#b77b82]/10"
              />
            </div>

            <div>
              <label className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#29251f]">
                <Clock3 size={17} className="text-[#b77b82]" />
                Available Time Slot
              </label>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {timeSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setTimeSlot(slot)}
                    className={`rounded-xl border px-3 py-3 text-sm font-medium transition ${
                      timeSlot === slot
                        ? "border-[#29251f] bg-[#29251f] text-white"
                        : "border-[#e9e1d9] bg-[#fdfbf9] text-[#5f5952] hover:border-[#b77b82] hover:bg-[#f8eeee]"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#29251f]">
                <MessageSquare size={17} className="text-[#b77b82]" />
                Additional Message
                <span className="font-normal text-[#a49b91]">(Optional)</span>
              </label>

              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write any special request..."
                className="w-full resize-none rounded-xl border border-[#e9e1d9] bg-[#fdfbf9] px-4 py-3 text-sm text-[#29251f] outline-none transition placeholder:text-[#aaa198] focus:border-[#b77b82] focus:ring-2 focus:ring-[#b77b82]/10"
              />
            </div>

            {error && service && (
              <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </p>
            )}

            <div className="rounded-2xl bg-[#faf6f2] p-4">
              <div className="flex justify-between text-sm text-[#817b73]">
                <span>Service</span>
                <span className="font-semibold text-[#29251f]">
                  {serviceName}
                </span>
              </div>
              <div className="mt-3 flex justify-between border-t border-[#e9e1d9] pt-3">
                <span className="font-semibold text-[#29251f]">Total Price</span>
                <span className="text-xl font-bold text-[#29251f]">
                  ৳{service.price}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-[#29251f] px-6 py-4 text-sm font-bold text-white shadow-lg shadow-[#29251f]/10 transition hover:bg-[#51473d] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Submitting Request..." : "Confirm Booking Request"}
            </button>

            <p className="text-center text-xs text-[#a49b91]">
              No payment is required at this stage.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
    