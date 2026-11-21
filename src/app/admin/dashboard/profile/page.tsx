
"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/app/lib/auth-client";
import {
  UserRound,
  Mail,
  ShieldCheck,
  Save,
  Loader2,
  Camera,
} from "lucide-react";

export default function AdminProfilePage() {
  const { data: session, isPending } = authClient.useSession();

  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const user = session?.user;

  useEffect(() => {
    if (user?.name) {
      setName(user.name);
    }
  }, [user?.name]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!name.trim()) {
      setMessage("Name cannot be empty.");
      return;
    }

    try {
      setSaving(true);

      const { error } = await authClient.updateUser({
        name: name.trim(),
      });

      if (error) {
        throw new Error(error.message || "Profile update failed");
      }

      setMessage("Profile updated successfully!");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  };

  if (isPending) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-rose-500" size={30} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-8 text-center text-gray-500">
        Please login to view your profile.
      </div>
    );
  }

  const userRole =
    (user as typeof user & { role?: string }).role || "admin";

  return (
    <div className="min-h-screen bg-[#fff9fb] p-4 md:p-8">
      <div className="mx-auto max-w-5xl space-y-7">

        {/* Header */}
        <div>
          <p className="text-sm font-semibold text-rose-500">
            ADMIN / ACCOUNT
          </p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            My Profile
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your personal account information.
          </p>
        </div>

        {/* Profile Header */}
        <div className="overflow-hidden rounded-2xl border border-rose-100 bg-white shadow-sm">
          <div className="h-32 bg-gradient-to-r from-rose-200 via-pink-100 to-rose-50" />

          <div className="px-6 pb-7">
            <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end">
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-white bg-[#29251f] text-3xl font-bold text-white shadow-md">
                {user.name?.charAt(0).toUpperCase() || "A"}
              </div>

              <div className="pb-1">
                <h2 className="text-xl font-bold text-gray-900">
                  {user.name || "Admin"}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {user.email}
                </p>
              </div>

              <div className="sm:ml-auto sm:pb-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-xs font-semibold capitalize text-emerald-700">
                  <ShieldCheck size={15} />
                  {userRole}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="rounded-2xl border border-rose-100 bg-white p-6 shadow-sm md:p-8">
          <div className="mb-7">
            <h2 className="text-lg font-bold text-gray-900">
              Personal Information
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Update your account details.
            </p>
          </div>

          <form onSubmit={handleUpdate} className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Full Name
              </label>

              <div className="relative">
                <UserRound
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="email"
                  value={user.email || ""}
                  readOnly
                  className="w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-500 outline-none"
                />
              </div>
              <p className="mt-2 text-xs text-gray-400">
                Email address cannot be changed here.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Account Role
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                <ShieldCheck size={18} className="text-rose-500" />
                <span className="text-sm font-medium capitalize text-gray-700">
                  {userRole}
                </span>
              </div>
            </div>

            {message && (
              <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {message}
              </p>
            )}

            <div className="flex justify-end border-t border-gray-100 pt-5">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 rounded-xl bg-[#29251f] px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 size={17} className="animate-spin" />
                ) : (
                  <Save size={17} />
                )}
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
