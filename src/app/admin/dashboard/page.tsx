
import Link from "next/link";
import {
  Users,
  Scissors,
  CalendarDays,
  Clock3,
  CheckCircle2,
  CircleDollarSign,
  ArrowUpRight,
} from "lucide-react";
import AdminAuthTest from "./AdminAuthTest";

const stats = [
  {
    title: "Registered Customers",
    value: "—",
    description: "Total registered customers",
    icon: Users,
    color: "bg-blue-50 text-blue-600",
  },
  {
    title: "Active Services",
    value: "—",
    description: "Currently available services",
    icon: Scissors,
    color: "bg-purple-50 text-purple-600",
  },
  {
    title: "Total Appointments",
    value: "—",
    description: "All appointment requests",
    icon: CalendarDays,
    color: "bg-orange-50 text-orange-600",
  },
  {
    title: "Pending Appointments",
    value: "—",
    description: "Waiting for confirmation",
    icon: Clock3,
    color: "bg-amber-50 text-amber-600",
  },
  {
    title: "Confirmed Appointments",
    value: "—",
    description: "Successfully confirmed",
    icon: CheckCircle2,
    color: "bg-green-50 text-green-600",
  },
  {
    title: "Successful Payments",
    value: "—",
    description: "Total successful payments",
    icon: CircleDollarSign,
    color: "bg-rose-50 text-rose-600",
  },
];

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

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <section>
        <p className="text-sm font-medium text-rose-600">
          Welcome to SalonBook
        </p>

        <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Dashboard Overview
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Monitor your salon activities and manage your business from here.
        </p>
      </section>

      {/* Statistics */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">
            Business Overview
          </h3>
          <span className="text-xs text-slate-400">
            Live statistics coming with API integration
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`flex size-11 items-center justify-center rounded-xl ${stat.color}`}
                  >
                    <Icon className="size-5" />
                  </div>

                  <span className="text-2xl font-bold text-slate-900">
                    {stat.value}
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

      {/* Recent Activity */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
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

        <div className="mt-6 rounded-xl bg-slate-50 px-4 py-12 text-center">
          <CalendarDays className="mx-auto size-10 text-slate-300" />

          <h4 className="mt-3 font-semibold text-slate-700">
            No appointment data yet
          </h4>

          <p className="mt-1 text-sm text-slate-500">
            Appointment information will appear here after API integration.
          </p>
        </div>
      </section>
      <AdminAuthTest />
    </div>
  );
}
