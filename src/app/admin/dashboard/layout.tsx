
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  LayoutDashboard,
  Scissors,
  CalendarDays,
  Users,
  CreditCard,
  UserRound,
  Home,
  LogOut,
} from "lucide-react";

import { auth } from "@/app/lib/auth";

const navItems = [
  {
    label: "Overview",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Manage Services",
    href:"/admin/dashboard/services",
    icon: Scissors,
  },
  {
    label: "Manage Appointments",
    href: "/admin/dashboard/appointments",
    icon: CalendarDays,
  },
  {
    label: "Manage Users",
    href: "/admin/dashboard/users",
    icon: Users,
  },
  {
    label: "Transactions",
    href: "/admin/dashboard/transactions",
    icon: CreditCard,
  },
  {
    label: "My Profile",
    href: "/admin/dashboard/profile",
    icon: UserRound,
  },
];

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  if (session.user.role !== "admin") {
    redirect("/customer/dashboard");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="w-full shrink-0 border-b border-slate-200 bg-white md:min-h-screen md:w-72 md:border-r md:border-b-0">
          <div className="border-b border-slate-200 px-6 py-6">
            <Link
              href="/"
              className="text-2xl font-bold tracking-tight text-rose-600"
            >
              SalonBook<span className="text-slate-900">.</span>
            </Link>

            <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
              Admin Panel
            </p>
          </div>

          <div className="px-4 py-5">
            <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Dashboard Menu
            </p>

            <nav className="flex gap-2 overflow-x-auto md:flex-col">
              {navItems.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex shrink-0 items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-600 transition hover:bg-rose-50 hover:text-rose-600"
                  >
                    <Icon className="size-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="hidden border-t border-slate-200 px-4 py-5 md:block">
            <Link
              href="/"
              className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            >
              <Home className="size-5" />
              Back to Website
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="min-w-0 flex-1">
          <header className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 sm:px-8">
            <div>
              <p className="text-sm text-slate-500">SalonBook Management</p>
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
