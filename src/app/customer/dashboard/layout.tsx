
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/app/lib/auth";

export default async function CustomerDashboardLayout({
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

  if (session.user.role !== "customer") {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-[#faf8f5] md:flex">
      {/* Sidebar */}
      <aside className="w-full border-b border-[#eee9e2] bg-white p-5 md:min-h-screen md:w-64 md:border-b-0 md:border-r">
        <Link
          href="/"
          className="mb-8 block text-2xl font-bold text-[#29251f]"
        >
          Salon<span className="text-[#b58b57]">Book</span>
        </Link>

        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-[#9b9185]">
          Customer Menu
        </p>

        <nav className="flex gap-2 overflow-x-auto md:flex-col">
          <Link
            href="/customer/dashboard"
            className="shrink-0 rounded-lg bg-[#29251f] px-4 py-3 text-sm font-medium text-white"
          >
            Overview
          </Link>

          <Link
            href="/customer/dashboard/appointments"
            className="shrink-0 rounded-lg px-4 py-3 text-sm font-medium text-[#686159] transition hover:bg-[#f3eee7]"
          >
            My Appointments
          </Link>

          <Link
            href="/customer/dashboard/profile"
            className="shrink-0 rounded-lg px-4 py-3 text-sm font-medium text-[#686159] transition hover:bg-[#f3eee7]"
          >
            My Profile
          </Link>

          <Link
            href="/"
            className="shrink-0 rounded-lg px-4 py-3 text-sm font-medium text-[#686159] transition hover:bg-[#f3eee7]"
          >
            Back to Website
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="min-w-0 flex-1 p-5 sm:p-8 lg:p-10">
        {children}
      </main>
    </div>
  );
}
