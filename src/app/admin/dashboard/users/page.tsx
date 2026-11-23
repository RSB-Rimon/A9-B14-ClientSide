"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import {
  Search,
  Users,
  UserCheck,
  ShieldBan,
  Eye,
  RefreshCw,
  X,
  Mail,
  CalendarDays,
  Loader2,
  AlertCircle,
  UserX,
} from "lucide-react";
import { authClient } from "@/app/lib/auth-client";
import { toast } from "sonner";
import { API_BASE_URL } from "@/app/lib/api";

type Customer = {
  _id: string;
  id?: string;
  name?: string;
  email: string;
  image?: string;
  createdAt?: string;
  isBlocked?: boolean;
};

const FILTERS = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "blocked", label: "Blocked" },
];

// -------------------- Small UI pieces --------------------

function Avatar({
  user,
  size = 40,
}: {
  user: Customer;
  size?: number;
}) {
  const style = { width: size, height: size };

  if (user.image) {
    return (
      <Image
        src={user.image}
        alt={user.name || "Customer"}
        width={size}
        height={size}
        unoptimized
        style={style}
        className="shrink-0 rounded-full object-cover ring-2 ring-white"
      />
    );
  }

  return (
    <div
      style={{ ...style, fontSize: size * 0.4 }}
      className="flex shrink-0 items-center justify-center rounded-full bg-[#f4e9e4] font-semibold text-[#a66d5c] ring-2 ring-white"
    >
      {(user.name || user.email)[0].toUpperCase()}
    </div>
  );
}

function StatusChip({ blocked }: { blocked?: boolean }) {
  return blocked ? (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-600">
      <span className="size-1.5 rounded-full bg-red-500" />
      Blocked
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
      <span className="size-1.5 rounded-full bg-emerald-500" />
      Active
    </span>
  );
}

function StatCard({
  label,
  value,
  icon,
  tone,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  tone: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-[#ebe4de] bg-white p-5">
      <span
        className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${tone}`}
      >
        {icon}
      </span>
      <div>
        <p className="text-sm text-[#8e8178]">{label}</p>
        <p className="mt-0.5 font-serif text-3xl leading-none text-[#49372f]">
          {value}
        </p>
      </div>
    </div>
  );
}

function SkeletonRows() {
  return (
    <div className="divide-y divide-[#f1ece6]">
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center gap-4 px-5 py-4">
          <div className="size-10 animate-pulse rounded-full bg-[#f1ece6]" />
          <div className="flex-1 space-y-2">
            <div className="h-3.5 w-40 animate-pulse rounded bg-[#f1ece6]" />
            <div className="h-3 w-56 max-w-full animate-pulse rounded bg-[#f6f2ee]" />
          </div>
          <div className="hidden h-6 w-20 animate-pulse rounded-full bg-[#f1ece6] sm:block" />
        </div>
      ))}
    </div>
  );
}

function BlockButton({
  user,
  busyId,
  onStatusChange,
}: {
  user: Customer;
  busyId: string;
  onStatusChange: (user: Customer) => void;
}) {
  const id = user._id || user.id;
  const busy = busyId === id;

  return (
    <button
      onClick={() => onStatusChange(user)}
      disabled={busy}
      className={`inline-flex min-w-[88px] items-center justify-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
        user.isBlocked
          ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
          : "bg-red-50 text-red-600 hover:bg-red-100"
      }`}
    >
      {busy && <Loader2 className="size-3.5 animate-spin" />}
      {busy ? "Updating" : user.isBlocked ? "Unblock" : "Block"}
    </button>
  );
}

// -------------------- Page --------------------

export default function ManageUsersPage() {
  const [users, setUsers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState<Customer | null>(null);
  const [busyId, setBusyId] = useState("");

  const fetchUsers = useCallback(async () => {
    try {
      const { data } = await authClient.token();

      if (!data?.token) {
        throw new Error("Please sign in again.");
      }

      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      if (search.trim()) params.set("search", search.trim());
      if (status !== "all") params.set("status", status);

      const response = await fetch(
        `${API_BASE_URL}/admin/users?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
          cache: "no-store",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to load customers.");
      }

      setUsers(result.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, [search, status]);

  useEffect(() => {
    void Promise.resolve().then(fetchUsers);
  }, [fetchUsers]);

  // Close the details dialog with Escape
  useEffect(() => {
    if (!selectedUser) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedUser(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedUser]);

  const handleStatusChange = async (user: Customer) => {
    const userId = user._id || user.id;

    if (!userId) return;

    try {
      setBusyId(userId);

      const { data } = await authClient.token();

      const response = await fetch(
        `${API_BASE_URL}/admin/users/${userId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data?.token}`,
          },
          body: JSON.stringify({
            isBlocked: !user.isBlocked,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Could not update customer.");
      }

      await fetchUsers();

      if (selectedUser && (selectedUser._id || selectedUser.id) === userId) {
        setSelectedUser({
          ...selectedUser,
          isBlocked: !user.isBlocked,
        });
      }
      toast.success(
        result.message ||
          `Customer ${user.isBlocked ? "unblocked" : "blocked"} successfully.`
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusyId("");
    }
  };

  const formatDate = (date?: string) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const totalBlocked = users.filter((user) => user.isBlocked).length;
  const totalActive = users.length - totalBlocked;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif text-[30px] font-medium leading-tight tracking-tight text-[#49372f]">
            Manage users
          </h1>
          <p className="mt-1.5 text-sm text-[#8e8178]">
            View registered customers and control who can book.
          </p>
        </div>

        <button
          onClick={fetchUsers}
          disabled={loading}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#e3dad2] bg-white px-4 text-sm font-medium text-[#49372f] transition hover:bg-[#f6f2ee] disabled:opacity-60"
        >
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Customers found"
          value={users.length}
          icon={<Users className="size-5" />}
          tone="bg-[#f1ece6] text-[#49372f]"
        />
        <StatCard
          label="Active"
          value={totalActive}
          icon={<UserCheck className="size-5" />}
          tone="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          label="Blocked"
          value={totalBlocked}
          icon={<ShieldBan className="size-5" />}
          tone="bg-red-50 text-red-500"
        />
      </div>

      {/* Table card */}
      <div className="overflow-hidden rounded-2xl border border-[#ebe4de] bg-white">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 border-b border-[#f1ece6] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="group relative sm:max-w-sm sm:flex-1">
            <Search
              size={17}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#b0a59c] transition-colors group-focus-within:text-[#a66d5c]"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email"
              aria-label="Search customers"
              className="h-11 w-full rounded-xl border border-[#e7dfd8] bg-[#fcfaf8] pl-10 pr-3 text-sm text-[#41352f] outline-none transition placeholder:text-[#b9afa8] hover:border-[#d9cec5] focus:border-[#a66d5c] focus:bg-white focus:ring-4 focus:ring-[#a66d5c]/10"
            />
          </div>

          <div
            role="group"
            aria-label="Filter by status"
            className="inline-flex w-full rounded-xl bg-[#f1ece6] p-1 sm:w-auto"
          >
            {FILTERS.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setStatus(filter.value)}
                aria-pressed={status === filter.value}
                className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition sm:flex-none ${
                  status === filter.value
                    ? "bg-white text-[#49372f] shadow-sm"
                    : "text-[#8e8178] hover:text-[#49372f]"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content states */}
        {loading ? (
          <SkeletonRows />
        ) : error ? (
          <div className="flex flex-col items-center px-6 py-14 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-red-50 text-red-500">
              <AlertCircle className="size-6" />
            </span>
            <p className="mt-4 text-sm font-medium text-[#49372f]">
              Could not load customers
            </p>
            <p className="mt-1 text-sm text-[#8e8178]">{error}</p>
            <button
              onClick={fetchUsers}
              className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-[#49372f] px-5 text-sm font-medium text-white transition hover:bg-[#5b463c]"
            >
              <RefreshCw size={15} />
              Try again
            </button>
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-14 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-[#f1ece6] text-[#a66d5c]">
              <UserX className="size-6" />
            </span>
            <p className="mt-4 text-sm font-medium text-[#49372f]">
              No customers found
            </p>
            <p className="mt-1 text-sm text-[#8e8178]">
              Try a different search or change the status filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="bg-[#faf8f5] text-xs font-medium text-[#8e8178]">
                  <th className="px-5 py-3.5 font-medium">Customer</th>
                  <th className="hidden px-5 py-3.5 font-medium sm:table-cell">
                    Joined
                  </th>
                  <th className="px-5 py-3.5 font-medium">Status</th>
                  <th className="px-5 py-3.5 text-right font-medium">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#f1ece6]">
                {users.map((user) => (
                  <tr
                    key={user._id || user.id}
                    className="transition-colors hover:bg-[#fcfaf8]"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar user={user} />
                        <div className="min-w-0">
                          <p className="truncate font-medium text-[#41352f]">
                            {user.name || "Unnamed customer"}
                          </p>
                          <p className="truncate text-xs text-[#8e8178]">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="hidden px-5 py-4 text-[#6f625a] sm:table-cell">
                      {formatDate(user.createdAt)}
                    </td>

                    <td className="px-5 py-4">
                      <StatusChip blocked={user.isBlocked} />
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedUser(user)}
                          title="View details"
                          aria-label={`View details for ${user.name || user.email}`}
                          className="flex size-9 items-center justify-center rounded-lg border border-[#e7dfd8] text-[#6f625a] transition hover:bg-[#f1ece6] hover:text-[#49372f]"
                        >
                          <Eye size={16} />
                        </button>

                        <BlockButton
                          user={user}
                          busyId={busyId}
                          onStatusChange={handleStatusChange}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Details dialog */}
      {selectedUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#2a201b]/50 p-4 backdrop-blur-[2px]"
          onClick={() => setSelectedUser(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Customer details"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="relative bg-[#f1ece6] px-6 pb-6 pt-7">
              <button
                onClick={() => setSelectedUser(null)}
                aria-label="Close"
                className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-full text-[#8e8178] transition hover:bg-white hover:text-[#49372f]"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-4">
                <Avatar user={selectedUser} size={64} />
                <div className="min-w-0">
                  <h2 className="truncate font-serif text-xl text-[#49372f]">
                    {selectedUser.name || "Unnamed customer"}
                  </h2>
                  <div className="mt-2">
                    <StatusChip blocked={selectedUser.isBlocked} />
                  </div>
                </div>
              </div>
            </div>

            {/* Details */}
            <dl className="divide-y divide-[#f1ece6] px-6">
              <div className="flex items-start gap-3 py-4">
                <Mail className="mt-0.5 size-4 shrink-0 text-[#a66d5c]" />
                <div className="min-w-0">
                  <dt className="text-xs text-[#8e8178]">Email</dt>
                  <dd className="mt-0.5 break-all text-sm font-medium text-[#41352f]">
                    {selectedUser.email}
                  </dd>
                </div>
              </div>

              <div className="flex items-start gap-3 py-4">
                <CalendarDays className="mt-0.5 size-4 shrink-0 text-[#a66d5c]" />
                <div>
                  <dt className="text-xs text-[#8e8178]">Joined</dt>
                  <dd className="mt-0.5 text-sm font-medium text-[#41352f]">
                    {formatDate(selectedUser.createdAt)}
                  </dd>
                </div>
              </div>
            </dl>

            {/* Actions */}
            <div className="flex gap-3 px-6 pb-6 pt-2">
              <button
                onClick={() => setSelectedUser(null)}
                className="h-11 flex-1 rounded-xl bg-[#49372f] text-sm font-semibold text-white transition hover:bg-[#5b463c]"
              >
                Close
              </button>
              <BlockButton
                user={selectedUser}
                busyId={busyId}
                onStatusChange={handleStatusChange}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}