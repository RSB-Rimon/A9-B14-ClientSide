
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Clock3,
  RefreshCw,
  Scissors,
  Sparkles,
  CalendarCheck,
  Tag,
} from "lucide-react";
import { authClient } from "@/app/lib/auth-client";
import { API_BASE_URL } from "@/app/lib/api";

type Service = {
  _id: string;
  serviceName: string;
  category: string;
  description: string;
  price: number;
  duration: number;
  image: string;
  status: "active" | "inactive";
};

export default function ServiceDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data: session, isPending: authPending } =
    authClient.useSession();

  const userId = session?.user.id;
  const userRole =
    session?.user && "role" in session.user
      ? session.user.role
      : undefined;

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authPending) return;

    if (!userId) {
      router.replace("/sign-in");
    } else if (userRole !== "customer") {
      router.replace("/admin/dashboard");
    }
  }, [authPending, router, userId, userRole]);

  useEffect(() => {
    if (authPending || !userId || userRole !== "customer" || !id) {
      return;
    }

    let active = true;

    const loadService = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_BASE_URL}/services`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to load service.");
        }

        if (!active) return;

        const found = (result.data || []).find(
          (item: Service) =>
            item._id === id && item.status === "active"
        );

        if (!found) {
          setError("Service not found or currently unavailable.");
          return;
        }

        setService(found);
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load service."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadService();

    return () => {
      active = false;
    };
  }, [authPending, id, userId, userRole]);

  if (authPending || !userId) {
    return (
      <div className="flex min-h-[65vh] items-center justify-center bg-[#fcfaf7] px-4">
        <div className="flex flex-col items-center gap-4 text-[#77716a]">
          <RefreshCw className="animate-spin text-[#a77b4e]" size={30} />
          <p className="text-sm font-medium">
            {authPending
              ? "Checking your account..."
              : "Redirecting to sign in..."}
          </p>
        </div>
      </div>
    );
  }

  if (userRole !== "customer") {
    return (
      <div className="flex min-h-[65vh] items-center justify-center bg-[#fcfaf7] px-4 py-12">
        <div className="w-full max-w-lg rounded-3xl border border-[#eee5dd] bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f8f2e9] text-[#a77b4e]">
            <Scissors size={28} />
          </div>

          <h2 className="mt-5 text-2xl font-bold text-[#29251f]">
            Customer Access Only
          </h2>

          <p className="mt-3 text-sm leading-7 text-[#77716a]">
            Admin accounts cannot book customer services.
            Please use the admin dashboard.
          </p>

          <Link
            href="/admin/dashboard"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#29251f] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#51473d]"
          >
            Go to Admin Dashboard
            <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-[65vh] items-center justify-center bg-[#fcfaf7] px-4">
        <div className="flex flex-col items-center gap-4 text-[#77716a]">
          <RefreshCw className="animate-spin text-[#a77b4e]" size={30} />
          <p className="text-sm font-medium">
            Loading service details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="flex min-h-[65vh] items-center justify-center bg-[#fcfaf7] px-4 py-12">
        <div className="w-full max-w-lg rounded-3xl border border-[#eee5dd] bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#fdf0ed] text-red-500">
            <Scissors size={28} />
          </div>

          <h2 className="mt-5 text-2xl font-bold text-[#29251f]">
            Service Unavailable
          </h2>

          <p className="mt-3 text-sm leading-7 text-red-600">
            {error || "Service not found."}
          </p>

          <Link
            href="/services"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#29251f] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#51473d]"
          >
            <ArrowLeft size={17} />
            Back to Services
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#fcfaf7]">
      <section className="container-custom py-8 sm:py-12 lg:py-16">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/services"
            className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-[#77716a] transition hover:text-[#a77b4e]"
          >
            <ArrowLeft size={17} />
            Back to Services
          </Link>

          <div className="overflow-hidden rounded-[28px] border border-[#eee5dd] bg-white shadow-[0_12px_45px_rgba(41,37,31,0.07)]">
            <div className="grid lg:grid-cols-2">
              {/* Service Image */}
              <div className="relative min-h-[280px] bg-[#f2ece6] sm:min-h-[380px] lg:min-h-[560px]">
                {service.image ? (
                  <Image
                    src={service.image}
                    alt={service.serviceName}
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                ) : (
                  <div className="flex h-full min-h-[280px] items-center justify-center text-[#b58b57] sm:min-h-[380px]">
                    <Scissors size={64} strokeWidth={1.2} />
                  </div>
                )}

                <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-white/60 bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#927044] shadow-sm backdrop-blur-sm">
                  <Sparkles size={14} />
                  Salon Service
                </div>
              </div>

              {/* Service Information */}
              <div className="flex flex-col justify-center p-6 sm:p-9 lg:p-12">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#a77b4e]">
                  <span className="h-px w-7 bg-[#b58b57]" />
                  Service Details
                </div>

                <div className="mt-6">
                  <span className="inline-flex items-center gap-2 rounded-full bg-[#f8f2e9] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#927044]">
                    <Tag size={13} />
                    {service.category}
                  </span>

                  <h1 className="mt-5 text-3xl font-bold leading-tight tracking-tight text-[#29251f] sm:text-4xl lg:text-[42px]">
                    {service.serviceName}
                  </h1>
                </div>

                {/* Description */}
                <div className="mt-7 border-t border-[#eee5dd] pt-6">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-[#51473d]">
                    About This Service
                  </h2>

                  <p className="mt-3 whitespace-pre-line text-sm leading-8 text-[#777067] sm:text-base">
                    {service.description || "Description is not available."}
                  </p>
                </div>

                {/* Price and Duration */}
                <div className="my-8 grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="rounded-2xl border border-[#eee5dd] bg-[#faf7f3] p-4 sm:p-5">
                    <div className="flex items-center gap-2 text-[#927044]">
                      <Tag size={16} />
                      <span className="text-xs font-medium">
                        Service Price
                      </span>
                    </div>

                    <p className="mt-3 text-2xl font-bold text-[#29251f] sm:text-3xl">
                      ৳{service.price.toLocaleString("en-BD")}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[#eee5dd] bg-[#faf7f3] p-4 sm:p-5">
                    <div className="flex items-center gap-2 text-[#927044]">
                      <Clock3 size={16} />
                      <span className="text-xs font-medium">
                        Estimated Duration
                      </span>
                    </div>

                    <p className="mt-3 flex items-center gap-2 text-2xl font-bold text-[#29251f] sm:text-3xl">
                      {service.duration}
                      <span className="text-sm font-medium text-[#777067]">
                        min
                      </span>
                    </p>
                  </div>
                </div>

                {/* Booking Option */}
                <Link
                  href={`/customer/dashboard/book-appointment/${service._id}`}
                  className="group inline-flex w-full items-center justify-center gap-3 rounded-xl bg-[#29251f] px-6 py-4 text-sm font-bold text-white shadow-md transition duration-300 hover:-translate-y-0.5 hover:bg-[#51473d] hover:shadow-lg"
                >
                  <CalendarCheck size={19} />
                  Book This Service
                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>

                <p className="mt-4 text-center text-xs text-[#999087]">
                  Choose your preferred date and time for your appointment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
  