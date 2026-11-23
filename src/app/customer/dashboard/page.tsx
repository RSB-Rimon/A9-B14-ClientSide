"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Clock3,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/app/lib/auth-client";

const API = "http://localhost:5000";

type Appointment = {
  _id: string;
  serviceName?: string;
  appointmentDate?: string;
  timeSlot?: string;
  status?: string;
};

const statusStyles: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700",
  confirmed: "bg-green-50 text-green-700",
  cancelled: "bg-red-50 text-red-600",
};

export default function CustomerDashboardPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;

    const loadAppointments = async () => {
      try {
        const { data } = await authClient.token();
        const token = data?.token;

        if (!token) {
          throw new Error("Please sign in again.");
        }

        const response = await fetch(`${API}/appointments`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });
        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to load appointments.");
        }

        if (!Array.isArray(result.data)) {
          throw new Error("The appointments API returned an invalid response.");
        }

        if (active) {
          setAppointments(result.data);
          setError("");
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to load appointments.";

        if (active) {
          setError(message);
          toast.error(message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadAppointments();

    return () => {
      active = false;
    };
  }, [attempt]);

  const retry = () => {
    setError("");
    setLoading(true);
    setAttempt((current) => current + 1);
  };

  const getCount = (status?: string) =>
    appointments.filter(
      (appointment) => appointment.status?.toLowerCase() === status,
    ).length;

  const stats = [
    {
      title: "Total Appointments",
      value: appointments.length,
      description: "All your appointment requests",
      icon: ClipboardList,
      iconStyle: "bg-[#f8f2e9] text-[#927044]",
    },
    {
      title: "Pending",
      value: getCount("pending"),
      description: "Waiting for confirmation",
      icon: Clock3,
      iconStyle: "bg-amber-50 text-amber-600",
    },
    {
      title: "Confirmed",
      value: getCount("confirmed"),
      description: "Your confirmed appointments",
      icon: CheckCircle2,
      iconStyle: "bg-green-50 text-green-600",
    },
    {
      title: "Cancelled",
      value: getCount("cancelled"),
      description: "Cancelled appointments",
      icon: XCircle,
      iconStyle: "bg-red-50 text-red-600",
    },
  ];

  const recentAppointments = appointments.slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-[#b58b57]">
            CUSTOMER DASHBOARD
          </p>
          <h1 className="mt-2 text-3xl font-bold text-[#29251f]">
            Welcome Back!
          </h1>
          <p className="mt-2 text-sm text-[#81796f]">
            Your appointment activity and status at a glance.
          </p>
        </div>

        <button
          type="button"
          onClick={retry}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#eee9e2] bg-white px-4 py-2.5 text-sm font-semibold text-[#686159] transition hover:bg-[#f3eee7] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </header>

      {error ? (
        <section
          role="alert"
          className="rounded-2xl border border-red-200 bg-white px-6 py-12 text-center"
        >
          <p className="text-sm text-red-700">{error}</p>
          <button
            type="button"
            onClick={retry}
            className="mt-5 rounded-full bg-[#29251f] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#b58b57]"
          >
            Try Again
          </button>
        </section>
      ) : (
        <>
          <section aria-label="Appointment statistics">
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                  <article
                    key={stat.title}
                    className="rounded-2xl border border-[#eee9e2] bg-white p-5 shadow-sm sm:p-6"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-medium text-[#81796f]">
                        {stat.title}
                      </p>
                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${stat.iconStyle}`}
                      >
                        <Icon size={19} />
                      </span>
                    </div>
                    <p className="mt-4 text-3xl font-bold text-[#29251f]">
                      {loading ? (
                        <span className="inline-block h-9 w-12 animate-pulse rounded bg-[#f3eee7]" />
                      ) : (
                        stat.value
                      )}
                    </p>
                    <p className="mt-2 text-xs text-[#9b9185]">
                      {stat.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="rounded-2xl border border-[#eee9e2] bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-[#29251f]">
                  Recent Appointments
                </h2>
                <p className="mt-1 text-sm text-[#81796f]">
                  Your latest booking requests.
                </p>
              </div>
              <Link
                href="/customer/dashboard/appointments"
                className="text-sm font-semibold text-[#b58b57] transition hover:text-[#927044] hover:underline"
              >
                View All
              </Link>
            </div>

            {loading ? (
              <div className="mt-6 space-y-3">
                {[0, 1, 2].map((item) => (
                  <div
                    key={item}
                    className="h-16 animate-pulse rounded-xl bg-[#faf8f5]"
                  />
                ))}
              </div>
            ) : appointments.length === 0 ? (
              <div className="mt-6 rounded-xl bg-[#faf8f5] px-5 py-10 text-center">
                <CalendarDays
                  className="mx-auto text-[#b58b57]"
                  size={28}
                />
                <h3 className="mt-4 font-semibold text-[#29251f]">
                  No appointments yet
                </h3>
                <p className="mt-2 text-sm text-[#81796f]">
                  Explore salon services and book your first appointment.
                </p>
                <Link
                  href="/services"
                  className="mt-5 inline-flex rounded-full bg-[#29251f] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#b58b57]"
                >
                  Explore Services
                </Link>
              </div>
            ) : (
              <ul className="mt-6 divide-y divide-[#eee9e2]">
                {recentAppointments.map((appointment) => {
                  const status = appointment.status?.toLowerCase() || "pending";

                  return (
                    <li
                      key={appointment._id}
                      className="flex flex-col justify-between gap-3 py-4 sm:flex-row sm:items-center"
                    >
                      <div>
                        <p className="font-semibold text-[#29251f]">
                          {appointment.serviceName || "Salon Service"}
                        </p>
                        <p className="mt-1 text-sm text-[#81796f]">
                          {appointment.appointmentDate || "Date not available"}
                          {appointment.timeSlot
                            ? ` · ${appointment.timeSlot}`
                            : ""}
                        </p>
                      </div>
                      <span
                        className={`w-fit rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${
                          statusStyles[status] || "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {status}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  );
}
