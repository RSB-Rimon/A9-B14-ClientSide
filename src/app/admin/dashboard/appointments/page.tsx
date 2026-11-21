
"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/app/lib/auth-client";
import {
  CalendarDays,
  Clock,
  Search,
  RefreshCw,
  Eye,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";

type Appointment = {
  _id: string;
  customerName?: string;
  customerEmail?: string;
  serviceName?: string;
  appointmentDate?: string;
  timeSlot?: string;
  status?: string;
  paymentStatus?: string;
  servicePrice?: number;
  message?: string;
  createdAt?: string;
};

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Appointment | null>(null);
  const [updating, setUpdating] = useState("");

  const fetchAppointments = async () => {
    try {
      setLoading(true);

      const { data } = await authClient.token();
      const token = data?.token;

      if (!token) {
        alert("Authentication token not found. Please login again.");
        return;
      }

      const response = await fetch(
        "http://localhost:5000/admin/appointments",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to load appointments");
      }

      setAppointments(result.data || []);
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const updateStatus = async (
    id: string,
    status: "confirmed" | "cancelled"
  ) => {
    const confirmed = window.confirm(
      `Are you sure you want to ${status} this appointment?`
    );

    if (!confirmed) return;

    try {
      setUpdating(id);

      const { data } = await authClient.token();
      const token = data?.token;

      const response = await fetch(
        `http://localhost:5000/admin/appointments/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Status update failed");
      }

      await fetchAppointments();
      if (selected?._id === id) {
        setSelected({ ...selected, status });
      }

      alert(result.message);
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setUpdating("");
    }
  };

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesFilter =
      filter === "all" || appointment.status === filter;

    const searchText = search.toLowerCase();

    const matchesSearch =
      (appointment.customerName || "").toLowerCase().includes(searchText) ||
      (appointment.customerEmail || "").toLowerCase().includes(searchText) ||
      (appointment.serviceName || "").toLowerCase().includes(searchText);

    return matchesFilter && matchesSearch;
  });

  const count = (status: string) =>
    appointments.filter((item) => item.status === status).length;

  const formatDate = (date?: string) => {
    if (!date) return "—";

    const parsed = new Date(date);
    return isNaN(parsed.getTime())
      ? date
      : parsed.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
  };

  const statusStyle = (status?: string) => {
    switch (status) {
      case "confirmed":
        return "bg-emerald-50 text-emerald-700";
      case "cancelled":
        return "bg-red-50 text-red-700";
      default:
        return "bg-amber-50 text-amber-700";
    }
  };

  return (
    <div className="min-h-screen bg-[#fff9fb] p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-7">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium text-rose-500">
              ADMIN / MANAGEMENT
            </p>
            <h1 className="mt-2 text-3xl font-bold text-gray-900">
              Appointments
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage customer appointment requests.
            </p>
          </div>

          <button
            onClick={fetchAppointments}
            className="flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-white px-4 py-3 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Pending</p>
              <AlertCircle className="text-amber-500" size={21} />
            </div>
            <h2 className="mt-3 text-3xl font-bold text-gray-900">
              {count("pending")}
            </h2>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Confirmed</p>
              <CheckCircle2 className="text-emerald-500" size={21} />
            </div>
            <h2 className="mt-3 text-3xl font-bold text-gray-900">
              {count("confirmed")}
            </h2>
          </div>

          <div className="rounded-2xl border border-red-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Cancelled</p>
              <XCircle className="text-red-500" size={21} />
            </div>
            <h2 className="mt-3 text-3xl font-bold text-gray-900">
              {count("cancelled")}
            </h2>
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-hidden rounded-2xl border border-rose-100 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-gray-100 p-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                All Appointments
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                {filteredAppointments.length} appointments found
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search appointments..."
                  className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-rose-400 sm:w-64"
                />
              </div>

              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-rose-400"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center gap-3 py-20 text-gray-500">
              <RefreshCw className="animate-spin" size={20} />
              Loading appointments...
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="py-20 text-center">
              <CalendarDays
                size={42}
                className="mx-auto text-rose-300"
              />
              <h3 className="mt-4 font-semibold text-gray-800">
                No appointments found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Appointment requests will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left">
                <thead className="bg-[#fff7fa] text-xs uppercase tracking-wider text-gray-500">
                  <tr>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Service</th>
                    <th className="px-6 py-4">Date & Time</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Payment</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredAppointments.map((appointment) => (
                    <tr
                      key={appointment._id}
                      className="transition hover:bg-rose-50/40"
                    >
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-800">
                          {appointment.customerName || "Customer"}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {appointment.customerEmail || "—"}
                        </p>
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-700">
                        {appointment.serviceName || "—"}
                      </td>

                      <td className="px-6 py-4">
                        <p className="flex items-center gap-2 text-sm text-gray-700">
                          <CalendarDays size={15} className="text-rose-400" />
                          {formatDate(appointment.appointmentDate)}
                        </p>
                        <p className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                          <Clock size={14} />
                          {appointment.timeSlot || "—"}
                        </p>
                      </td>

                      <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                        ৳{appointment.servicePrice ?? 0}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${statusStyle(
                            appointment.status
                          )}`}
                        >
                          {appointment.status || "pending"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium capitalize text-gray-600">
                          {appointment.paymentStatus || "unpaid"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelected(appointment)}
                            title="View details"
                            className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-100"
                          >
                            <Eye size={16} />
                          </button>

                          {appointment.status === "pending" && (
                            <button
                              disabled={updating === appointment._id}
                              onClick={() =>
                                updateStatus(appointment._id, "confirmed")
                              }
                              className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                            >
                              Confirm
                            </button>
                          )}

                          {["pending", "confirmed"].includes(
                            appointment.status || ""
                          ) && (
                            <button
                              disabled={updating === appointment._id}
                              onClick={() =>
                                updateStatus(appointment._id, "cancelled")
                              }
                              className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-100 disabled:opacity-50"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Details Modal */}
        {selected && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onClick={() => setSelected(null)}
          >
            <div
              className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  Appointment Details
                </h2>
                <button
                  onClick={() => setSelected(null)}
                  className="text-2xl text-gray-400 hover:text-gray-700"
                >
                  ×
                </button>
              </div>

              <div className="mt-6 space-y-4">
                {[
                  ["Customer", selected.customerName || "—"],
                  ["Email", selected.customerEmail || "—"],
                  ["Service", selected.serviceName || "—"],
                  ["Date", formatDate(selected.appointmentDate)],
                  ["Time", selected.timeSlot || "—"],
                  ["Price", `৳${selected.servicePrice ?? 0}`],
                  ["Payment", selected.paymentStatus || "unpaid"],
                  ["Status", selected.status || "pending"],
                  ["Message", selected.message || "No message provided"],
                  ["Booking Request", formatDate(selected.createdAt)],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex justify-between gap-4 border-b border-gray-100 pb-3 text-sm"
                  >
                    <span className="text-gray-500">{label}</span>
                    <span className="max-w-[65%] break-words text-right font-medium text-gray-800">
                      {value}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setSelected(null)}
                className="mt-6 w-full rounded-xl bg-rose-500 py-3 font-semibold text-white hover:bg-rose-600"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
