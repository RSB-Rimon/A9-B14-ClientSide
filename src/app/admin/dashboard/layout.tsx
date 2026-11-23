
import Link from "next/link";
import { Home } from "lucide-react";

import { requireRole } from "@/app/lib/require-user";
import AdminSidebar from "./AdminSidebar";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole("admin");

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col md:flex-row">
        <AdminSidebar />

        <main className="min-w-0 flex-1">
          <header className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 sm:px-8">
            <div>
              <p className="text-sm text-slate-500">
                SalonBook Management
              </p>
              <h1 className="text-lg font-bold text-slate-900">
                Admin Dashboard
              </h1>
            </div>

            <Link
              href="/"
              className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              <Home className="size-4" />
              <span className="hidden sm:inline">Visit Website</span>
            </Link>
          </header>

          <div className="p-5 sm:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
