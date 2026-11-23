"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock3, RefreshCw, Scissors } from "lucide-react";
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
  const { data: session, isPending: authPending } = authClient.useSession();
  const userId = session?.user.id;
  const userRole =
    session?.user && "role" in session.user ? session.user.role : undefined;
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authPending) {
      return;
    }

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

        if (!active) {
          return;
        }

        const found = (result.data || []).find(
          (item: Service) => item._id === id && item.status === "active"
        );

        if (!found) {
          setError("Service not found or currently unavailable.");
          return;
        }

        setService(found);
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "Failed to load service.");
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
      <div className="flex min-h-[60vh] items-center justify-center gap-3 text-[#77716a]">
        <RefreshCw className="animate-spin" size={20} />
        {authPending ? "Checking your account..." : "Redirecting to sign in..."}
      </div>
    );
  }

  if (userRole !== "customer") {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-[#eee5dd] bg-white p-8 text-center">
        <p className="text-[#51473d]">
          Admin accounts cannot book customer services. You are being redirected
          to the admin dashboard.
        </p>
        <Link
          href="/admin/dashboard"
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#29251f] px-5 py-3 text-sm font-semibold text-white"
        >
          Go to Admin Dashboard
          <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center gap-3 text-[#77716a]">
        <RefreshCw className="animate-spin" size={20} />
        Loading service details...
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-[#eee5dd] bg-white p-8 text-center">
        <p className="text-red-600">{error || "Service not found."}</p>
        <Link
          href="/customer/dashboard/my-services"
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#29251f] px-5 py-3 text-sm font-semibold text-white"
        >
          <ArrowLeft size={16} />
          Back to Services
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      <Link
        href="/customer/dashboard/my-services"
        className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-[#77716a] transition hover:text-[#29251f]"
      >
        <ArrowLeft size={17} />
        Back to Services
      </Link>

      <div className="grid gap-8 overflow-hidden rounded-3xl border border-[#eee5dd] bg-white shadow-sm lg:grid-cols-2">
        <div className="relative min-h-72 bg-[#f2ece6] lg:min-h-[460px]">
          {service.image ? (
            <Image
              src={service.image}
              alt={service.serviceName}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          ) : (
            <div className="flex h-full min-h-72 items-center justify-center text-[#b77b82]">
              <Scissors size={48} />
            </div>
          )}
        </div>

        <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
          <span className="w-fit rounded-full bg-[#f8eeeb] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#a85f58]">
            {service.category}
          </span>
          <h1 className="mt-5 text-3xl font-bold text-[#29251f] sm:text-4xl">
            {service.serviceName}
          </h1>
          <p className="mt-4 whitespace-pre-line text-sm leading-7 text-[#817b73]">
            {service.description}
          </p>

          <div className="my-7 grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-[#faf6f2] p-4">
              <p className="text-xs text-[#817b73]">Service Price</p>
              <p className="mt-2 text-2xl font-bold text-[#29251f]">
                ৳{service.price.toLocaleString("en-BD")}
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

          <Link
            href={`/customer/dashboard/book-appointment/${service._id}`}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#29251f] px-6 py-4 text-sm font-bold text-white transition hover:bg-[#51473d]"
          >
            Book This Service
            <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </div>
  );
}