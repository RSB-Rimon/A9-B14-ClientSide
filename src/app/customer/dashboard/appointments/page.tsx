
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Clock3,
  Scissors,
  RefreshCw,
  ArrowRight,
  ClipboardList,
} from "lucide-react";
import { authClient } from "@/app/lib/auth-client";

const API = "http://localhost:5000";

type Appointment = {
  _id: string;
  serviceName: string;
  servicePrice: number;
  serviceDuration?: number;
  appointmentDate: string;
  timeSlot: string;
  status: string;
  paymentStatus: string;
  message?: string;
  createdAt: string;
};

function StatusBadge({ status }: { status: string }) {
  const value = status?.toLowerCase();

  const styles: Record<string, string> = {
    pending: "bg-amber-50 text-amber-700",
    confirmed: "bg-green-50 text-green-700",
    cancelled: "bg-red-50 text-red-600",
    paid: "bg-green-50 text-green-700",
    unpaid: "bg-orange-50 text-orange-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${
        styles[value] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status || "Unknown"}
    </span>
  );
}

export default function MyAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  async function fetchAppointments() {
    setLoading(true);
    setError("");

    try {
      const tokenResult = await authClient.token();
      const token = tokenResult.data?.token;

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

      if (!response.ok) {
        throw new Error(result.message || "Failed to load appointments.");
      }

      setAppointments(result.data || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAppointments();
  }, []);

  const filteredAppointments =
    filter === "all"
      ? appointments
      : appointments.filter(
          (appointment) => appointment.status?.toLowerCase() === filter
        );

  const pendingCount = appointments.filter(
    (item) => item.status?.toLowerCase() === "pending"
  ).length;

  const confirmedCount = appointments.filter(
    (item) => item.status?.toLowerCase() === "confirmed"
  ).length;

  const cancelledCount = appointments.filter(
    (item) => item.status?.toLowerCase() === "cancelled"
  ).length;

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#b77b82]">
            Your Bookings
          </p>
          <h1 className="mt-2 text-3xl font-bold text-[#29251f]">
            My Appointments
          </h1>
          <p className="mt-2 text-sm text-[#817b73]">
            Track and manage your salon appointment requests.
          </p>
        </div>

        <Link
          href="/customer/dashboard/my-services"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#29251f] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#51473d]"
        >
          Book New Service <ArrowRight size={16} />
        </Link>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Total Appointments",
            value: appointments.length,
            icon: ClipboardList,
          },
          { label: "Pending", value: pendingCount, icon: Clock3 },
          { label: "Confirmed", value: confirmedCount, icon: CalendarDays },
          { label: "Cancelled", value: cancelledCount, icon: Scissors },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="rounded-2xl border border-[#eee5dd] bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-[#817b73]">{item.label}</p>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f8eeee] text-[#b77b82]">
                  <Icon size={19} />
                </div>
              </div>
              <p className="mt-4 text-3xl font-bold text-[#29251f]">
                {item.value}
              </p>
            </div>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#eee5dd] bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-4 border-b border-[#eee5dd] p-5 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-bold text-[#29251f]">Appointment History</h2>
            <p className="mt-1 text-xs text-[#817b73]">
              View all your booking requests.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-lg border border-[#e9e1d9] bg-[#fdfbf9] px-3 py-2 text-sm text-[#29251f] outline-none focus:border-[#b77b82]"
            >
              <option value="all">All Appointments</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <button
              onClick={fetchAppointments}
              className="flex items-center gap-2 rounded-lg border border-[#e9e1d9] px-3 py-2 text-sm text-[#5f5952] transition hover:bg-[#faf6f2]"
            >
              <RefreshCw size={15} /> Refresh
            </button>
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center text-sm text-[#817b73]">
            Loading appointments...
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-sm text-red-600">{error}</p>
            <button
              onClick={fetchAppointments}
              className="mt-4 rounded-lg bg-[#29251f] px-5 py-2.5 text-sm text-white"
            >
              Try Again
            </button>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f8eeee] text-[#b77b82]">
              <CalendarDays size={28} />
            </div>
            <h3 className="mt-5 font-bold text-[#29251f]">
              No Appointments Found
            </h3>
            <p className="mt-2 text-sm text-[#817b73]">
              {appointments.length === 0
                ? "You haven't booked any salon services yet."
                : "No appointments match this filter."}
            </p>
            <Link
              href="/customer/dashboard/my-services"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#29251f] px-5 py-3 text-sm font-semibold text-white"
            >
              Browse Services <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left">
              <thead className="bg-[#faf6f2]">
                <tr className="text-xs font-semibold uppercase tracking-wider text-[#817b73]">
                  <th className="px-5 py-4">Service</th>
                  <th className="px-5 py-4">Appointment Date</th>
                  <th className="px-5 py-4">Time</th>
                  <th className="px-5 py-4">Price</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Payment</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#f0e9e2]">
                {filteredAppointments.map((appointment) => (
                  <tr
                    key={appointment._id}
                    className="transition hover:bg-[#fdfbf9]"
                  >
                    <td className="px-5 py-5">
                      <p className="font-semibold text-[#29251f]">
                        {appointment.serviceName}
                      </p>
                      {appointment.serviceDuration && (
                        <p className="mt-1 text-xs text-[#817b73]">
                          {appointment.serviceDuration} minutes
                        </p>
                      )}
                    </td>

                    <td className="px-5 py-5 text-sm text-[#5f5952]">
                      {new Date(
                        appointment.appointmentDate + "T00:00:00"
                      ).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    <td className="px-5 py-5 text-sm text-[#5f5952]">
                      {appointment.timeSlot}
                    </td>

                    <td className="px-5 py-5 text-sm font-semibold text-[#29251f]">
                      ৳{appointment.servicePrice}
                    </td>

                    <td className="px-5 py-5">
                      <StatusBadge status={appointment.status} />
                    </td>

                    <td className="px-5 py-5">
                      <StatusBadge status={appointment.paymentStatus} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="border-t border-[#eee5dd] px-5 py-4">
          <p className="text-xs text-[#817b73]">
            Showing {filteredAppointments.length} of {appointments.length} appointments
          </p>
        </div>
      </div>
    </div>
  );
}
