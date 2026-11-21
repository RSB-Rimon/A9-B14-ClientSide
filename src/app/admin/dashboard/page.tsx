
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Users,
  Scissors,
  CalendarDays,
  Clock3,
  CheckCircle2,
  CircleDollarSign,
  ArrowUpRight,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { authClient } from "@/app/lib/auth-client";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const statsConfig = [
  {
    key: "totalCustomers",
    title: "Registered Customers",
    description: "Total registered customers",
    icon: Users,
    color: "bg-blue-50 text-blue-600",
  },
  {
    key: "activeServices",
    title: "Active Services",
    description: "Currently available services",
    icon: Scissors,
    color: "bg-purple-50 text-purple-600",
  },
  {
    key: "totalAppointments",
    title: "Total Appointments",
    description: "All appointment requests",
    icon: CalendarDays,
    color: "bg-orange-50 text-orange-600",
  },
  {
    key: "pendingAppointments",
    title: "Pending Appointments",
    description: "Waiting for confirmation",
    icon: Clock3,
    color: "bg-amber-50 text-amber-600",
  },
  {
    key: "confirmedAppointments",
    title: "Confirmed Appointments",
    description: "Successfully confirmed",
    icon: CheckCircle2,
    color: "bg-green-50 text-green-600",
  },
  {
    key: "successfulPayments",
    title: "Successful Payments",
    description: "Total successful payments",
    icon: CircleDollarSign,
    color: "bg-rose-50 text-rose-600",
  },
] as const;

const quickActions = [
  {
    title: "Manage Services",
    description: "Add, edit and manage salon services.",
    href: "/admin/dashboard/services",
    icon: Scissors,
  },
  {
    title: "Manage Appointments",
    description: "Review and update customer bookings.",
    href: "/admin/dashboard/appointments",
    icon: CalendarDays,
  },
  {
    title: "Manage Users",
    description: "View and manage registered customers.",
    href: "/admin/dashboard/users",
    icon: Users,
  },
];

type DashboardStats = {
  totalCustomers: number;
  activeServices: number;
  totalAppointments: number;
  pendingAppointments: number;
  confirmedAppointments: number;
  successfulPayments: number;
  successfulPaymentAmount: number;
};

type Appointment = {
  _id: string;
  customerName: string;
  customerEmail: string;
  serviceName: string;
  appointmentDate: string | null;
  timeSlot: string;
  servicePrice: number;
  status: string;
};

const initialStats: DashboardStats = {
  totalCustomers: 0,
  activeServices: 0,
  totalAppointments: 0,
  pendingAppointments: 0,
  confirmedAppointments: 0,
  successfulPayments: 0,
  successfulPaymentAmount: 0,
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>(initialStats);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const { data: tokenData, error: tokenError } =
        await authClient.token();

      if (tokenError || !tokenData?.token) {
        throw new Error("Authentication failed. Please login again.");
      }

      const response = await fetch(`${API_URL}/admin/dashboard/stats`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${tokenData.token}`,
        },
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to load dashboard data.");
      }

      setStats(result.data.stats);
      setAppointments(result.data.recentAppointments || []);
    } catch (err) {
      console.error("Dashboard error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const formatDate = (date: string | null) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return date;

    return parsedDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatPrice = (price: number) =>
    `৳${Number(price || 0).toLocaleString("en-BD")}`;

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <section className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-rose-600">
            Welcome to SalonBook
          </p>

          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Dashboard Overview
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Monitor your salon activities and manage your business from here.
          </p>
        </div>

        <button
          onClick={fetchDashboardData}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </section>

      {/* Error Message */}
      {error && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-600">{error}</p>

          <button
            onClick={fetchDashboardData}
            className="text-sm font-semibold text-red-700 hover:underline"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Statistics */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">
            Business Overview
          </h3>

          <span className="text-xs text-slate-400">
            Live statistics
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {statsConfig.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.key}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`flex size-11 items-center justify-center rounded-xl ${stat.color}`}
                  >
                    <Icon className="size-5" />
                  </div>

                  <span className="text-2xl font-bold text-slate-900">
                    {loading ? (
                      <Loader2 className="size-5 animate-spin text-slate-400" />
                    ) : (
                      (stats[stat.key] ?? 0).toLocaleString()
                    )}
                  </span>
                </div>

                <h4 className="mt-5 font-semibold text-slate-800">
                  {stat.title}
                </h4>

                <p className="mt-1 text-sm text-slate-500">
                  {stat.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <CircleDollarSign className="size-5" />
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Total Successful Payment Amount
              </p>

              <p className="text-xl font-bold text-slate-900">
                {loading
                  ? "Loading..."
                  : formatPrice(stats.successfulPaymentAmount)}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section>
        <h3 className="mb-4 text-lg font-bold text-slate-900">
          Quick Actions
        </h3>

        <div className="grid gap-4 lg:grid-cols-3">
          {quickActions.map((action) => {
            const Icon = action.icon;

            return (
              <Link
                key={action.href}
                href={action.href}
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-rose-200 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex size-11 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                    <Icon className="size-5" />
                  </div>

                  <ArrowUpRight className="size-5 text-slate-400 transition group-hover:text-rose-600" />
                </div>

                <h4 className="mt-5 font-semibold text-slate-900">
                  {action.title}
                </h4>

                <p className="mt-2 text-sm text-slate-500">
                  {action.description}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Recent Appointments */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Recent Appointments
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Latest customer appointment requests.
            </p>
          </div>

          <Link
            href="/admin/dashboard/appointments"
            className="text-sm font-semibold text-rose-600 hover:text-rose-700"
          >
            View All
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-2 py-14 text-sm text-slate-500">
            <Loader2 className="size-5 animate-spin" />
            Loading appointments...
          </div>
        ) : appointments.length === 0 ? (
          <div className="px-4 py-12 text-center">
            <CalendarDays className="mx-auto size-10 text-slate-300" />

            <h4 className="mt-3 font-semibold text-slate-700">
              No appointment data yet
            </h4>

            <p className="mt-1 text-sm text-slate-500">
              Customer appointments will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[750px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-6 py-4 font-semibold">Customer</th>
                  <th className="px-6 py-4 font-semibold">Service</th>
                  <th className="px-6 py-4 font-semibold">Date & Time</th>
                  <th className="px-6 py-4 font-semibold">Price</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {appointments.map((appointment) => (
                  <tr
                    key={appointment._id}
                    className="transition hover:bg-slate-50"
                  >
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-800">
                        {appointment.customerName}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {appointment.customerEmail || "—"}
                      </p>
                    </td>

                    <td className="px-6 py-4 font-medium text-slate-700">
                      {appointment.serviceName}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      <p>{formatDate(appointment.appointmentDate)}</p>
                      <p className="mt-1 text-xs text-slate-400">
                        {appointment.timeSlot || "—"}
                      </p>
                    </td>

                    <td className="px-6 py-4 font-semibold text-slate-700">
                      {formatPrice(appointment.servicePrice)}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                          appointment.status === "confirmed"
                            ? "bg-green-50 text-green-700"
                            : appointment.status === "cancelled"
                              ? "bg-red-50 text-red-700"
                              : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {appointment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
