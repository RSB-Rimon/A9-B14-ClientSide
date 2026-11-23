
"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Search, Users, ShieldCheck, ShieldBan, Eye, RefreshCw } from "lucide-react";
import { authClient } from "@/app/lib/auth-client";
import { toast } from "sonner";

const API_URL = "http://localhost:5000";

type Customer = {
  _id: string;
  id?: string;
  name?: string;
  email: string;
  image?: string;
  createdAt?: string;
  isBlocked?: boolean;
};

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
      setLoading(true);
      setError("");

      const { data } = await authClient.token();

      if (!data?.token) {
        throw new Error("Please sign in again.");
      }

      const params = new URLSearchParams();

      if (search.trim()) params.set("search", search.trim());
      if (status !== "all") params.set("status", status);

      const response = await fetch(
        `${API_URL}/admin/users?${params.toString()}`,
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
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }, [search, status]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleStatusChange = async (user: Customer) => {
    const userId = user._id || user.id;

    if (!userId) return;

    try {
      setBusyId(userId);

      const { data } = await authClient.token();

      const response = await fetch(
        `${API_URL}/admin/users/${userId}/status`,
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
    return new Date(date).toLocaleDateString();
  };

  const totalBlocked = users.filter((user) => user.isBlocked).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Users</h1>
          <p className="mt-1 text-sm text-gray-500">
            View and manage registered customers.
          </p>
        </div>

        <button
          onClick={fetchUsers}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-50"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Customers Found</p>
            <Users className="text-blue-600" />
          </div>
          <p className="mt-3 text-3xl font-bold">{users.length}</p>
        </div>

        <div className="rounded-xl border bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Blocked Customers</p>
            <ShieldBan className="text-red-500" />
          </div>
          <p className="mt-3 text-3xl font-bold">{totalBlocked}</p>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full rounded-lg border py-2.5 pl-10 pr-3 text-sm outline-none focus:border-pink-500"
            />
          </div>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-lg border px-4 py-2.5 text-sm outline-none focus:border-pink-500"
          >
            <option value="all">All Customers</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border bg-white">
        <div className="border-b px-5 py-4">
          <h2 className="font-semibold text-gray-900">Customer List</h2>
        </div>

        {loading ? (
          <div className="p-10 text-center text-sm text-gray-500">
            Loading customers...
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-sm text-red-600">{error}</p>
            <button
              onClick={fetchUsers}
              className="mt-3 text-sm font-medium text-pink-600"
            >
              Try again
            </button>
          </div>
        ) : users.length === 0 ? (
          <div className="p-10 text-center text-sm text-gray-500">
            No customers found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-5 py-4">Customer</th>
                  <th className="px-5 py-4">Joined</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {users.map((user) => (
                  <tr key={user._id || user.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {user.image ? (
                          <Image
                            src={user.image}
                            alt={user.name || "Customer"}
                            width={40}
                            height={40}
                            unoptimized
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100 font-semibold text-pink-600">
                            {(user.name || user.email)[0].toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">
                            {user.name || "Unnamed Customer"}
                          </p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {formatDate(user.createdAt)}
                    </td>

                    <td className="px-5 py-4">
                      {user.isBlocked ? (
                        <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-600">
                          Blocked
                        </span>
                      ) : (
                        <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                          Active
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setSelectedUser(user)}
                          title="View details"
                          className="rounded-lg border p-2 text-gray-600 hover:bg-gray-100"
                        >
                          <Eye size={16} />
                        </button>

                        <button
                          onClick={() => handleStatusChange(user)}
                          disabled={busyId === (user._id || user.id)}
                          className={`rounded-lg px-3 py-2 text-xs font-medium disabled:opacity-50 ${
                            user.isBlocked
                              ? "bg-green-50 text-green-700 hover:bg-green-100"
                              : "bg-red-50 text-red-600 hover:bg-red-100"
                          }`}
                        >
                          {busyId === (user._id || user.id)
                            ? "Please wait..."
                            : user.isBlocked
                              ? "Unblock"
                              : "Block"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Customer Details</h2>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-xl text-gray-500 hover:text-gray-900"
              >
                ×
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <p className="text-xs text-gray-500">Name</p>
                <p className="font-medium">
                  {selectedUser.name || "Unnamed Customer"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="font-medium">{selectedUser.email}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Joined Date</p>
                <p className="font-medium">
                  {formatDate(selectedUser.createdAt)}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Account Status</p>
                <p className="font-medium">
                  {selectedUser.isBlocked ? "Blocked" : "Active"}
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelectedUser(null)}
              className="mt-6 w-full rounded-lg bg-gray-900 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
