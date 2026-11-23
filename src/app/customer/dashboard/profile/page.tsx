"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";
import {
  Image as ImageIcon,
  Loader2,
  Mail,
  Save,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/app/lib/auth-client";

type CustomerProfileUser = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
};

function isHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function CustomerProfileForm({ user }: { user: CustomerProfileUser }) {
  const [name, setName] = useState(user.name || "");
  const [image, setImage] = useState(user.image || "");
  const [saving, setSaving] = useState(false);

  const imagePreview = image.trim() && isHttpUrl(image.trim()) ? image.trim() : "";

  const handleUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedImage = image.trim();

    if (trimmedName.length < 2) {
      toast.error("Name must be at least 2 characters.");
      return;
    }

    if (trimmedName.length > 80) {
      toast.error("Name cannot be longer than 80 characters.");
      return;
    }

    if (trimmedImage && !isHttpUrl(trimmedImage)) {
      toast.error("Enter a valid image URL beginning with http:// or https://.");
      return;
    }

    try {
      setSaving(true);
      const { error } = await authClient.updateUser({
        name: trimmedName,
        image: trimmedImage,
      });

      if (error) {
        throw new Error(error.message || "Profile update failed.");
      }

      setName(trimmedName);
      setImage(trimmedImage);
      toast.success("Profile updated successfully.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Profile update failed.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-7">
      <header>
        <p className="text-sm font-medium text-[#b58b57]">
          CUSTOMER / ACCOUNT
        </p>
        <h1 className="mt-2 text-3xl font-bold text-[#29251f]">My Profile</h1>
        <p className="mt-2 text-sm text-[#81796f]">
          View and update your personal account information.
        </p>
      </header>

      <section className="overflow-hidden rounded-2xl border border-[#eee9e2] bg-white shadow-sm">
        <div className="h-32 bg-gradient-to-r from-[#eadbc5] via-[#f5ede2] to-[#faf8f5]" />
        <div className="px-5 pb-7 sm:px-7">
          <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-[#29251f] text-3xl font-bold text-white shadow-md">
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt={`${name || "Customer"} profile`}
                  width={96}
                  height={96}
                  unoptimized
                  className="h-full w-full object-cover"
                />
              ) : (
                name.trim().charAt(0).toUpperCase() || "C"
              )}
            </div>
            <div className="min-w-0 pb-1">
              <h2 className="truncate text-xl font-bold text-[#29251f]">
                {name || "Customer"}
              </h2>
              <p className="mt-1 break-all text-sm text-[#81796f]">
                {user.email}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-[#eee9e2] bg-white p-5 shadow-sm sm:p-7">
        <div className="mb-7">
          <h2 className="text-lg font-bold text-[#29251f]">
            Personal Information
          </h2>
          <p className="mt-1 text-sm text-[#81796f]">
            Update your name and profile image.
          </p>
        </div>

        <form onSubmit={handleUpdate} className="space-y-6">
          <div>
            <label
              htmlFor="customer-profile-name"
              className="mb-2 block text-sm font-semibold text-[#514a42]"
            >
              Full Name
            </label>
            <div className="relative">
              <UserRound
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9b9185]"
              />
              <input
                id="customer-profile-name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                maxLength={80}
                autoComplete="name"
                required
                className="w-full rounded-xl border border-[#e6e0d8] bg-white py-3 pl-11 pr-4 text-sm text-[#29251f] outline-none transition focus:border-[#b58b57] focus:ring-2 focus:ring-[#b58b57]/15"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="customer-profile-email"
              className="mb-2 block text-sm font-semibold text-[#514a42]"
            >
              Email Address
            </label>
            <div className="relative">
              <Mail
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9b9185]"
              />
              <input
                id="customer-profile-email"
                type="email"
                value={user.email}
                readOnly
                className="w-full cursor-not-allowed rounded-xl border border-[#e6e0d8] bg-[#f7f5f2] py-3 pl-11 pr-4 text-sm text-[#81796f] outline-none"
              />
            </div>
            <p className="mt-2 text-xs text-[#9b9185]">
              Email address cannot be changed here.
            </p>
          </div>

          <div>
            <label
              htmlFor="customer-profile-image"
              className="mb-2 block text-sm font-semibold text-[#514a42]"
            >
              Profile Image URL
            </label>
            <div className="relative">
              <ImageIcon
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9b9185]"
              />
              <input
                id="customer-profile-image"
                type="url"
                value={image}
                onChange={(event) => setImage(event.target.value)}
                placeholder="https://example.com/your-photo.jpg"
                className="w-full rounded-xl border border-[#e6e0d8] bg-white py-3 pl-11 pr-4 text-sm text-[#29251f] outline-none transition focus:border-[#b58b57] focus:ring-2 focus:ring-[#b58b57]/15"
              />
            </div>
            <p className="mt-2 text-xs text-[#9b9185]">
              Add a public image URL. Phone number is not currently supported
              by the account profile.
            </p>
          </div>

          <div className="flex justify-end border-t border-[#eee9e2] pt-5">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-[#29251f] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#b58b57] disabled:cursor-not-allowed disabled:opacity-60"
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
      </section>
    </div>
  );
}

export default function CustomerProfilePage() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="animate-spin text-[#b58b57]" size={30} />
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="rounded-2xl border border-[#eee9e2] bg-white p-8 text-center text-sm text-[#81796f]">
        Please sign in to view your profile.
      </div>
    );
  }

  return <CustomerProfileForm user={session.user} />;
}
