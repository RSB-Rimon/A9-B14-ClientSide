
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { label: "Overview", href: "/customer/dashboard" },
  { label: "Browse Services", href: "/customer/dashboard/my-services" },
  { label: "My Appointments", href: "/customer/dashboard/appointments" },
  { label: "My Profile", href: "/customer/dashboard/profile" },
];

export default function CustomerSidebar() {
  const pathname = usePathname();

  return (
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
        {menuItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/customer/dashboard" &&
              pathname.startsWith(`${item.href}/`));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`shrink-0 rounded-lg px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-[#29251f] text-white shadow-sm"
                  : "text-[#686159] hover:bg-[#f3eee7] hover:text-[#b58b57]"
              }`}
            >
              {item.label}
            </Link>
          );
        })}

        <Link
          href="/"
          className="shrink-0 rounded-lg px-4 py-3 text-sm font-medium text-[#686159] transition hover:bg-[#f3eee7] hover:text-[#b58b57]"
        >
          Back to Website
        </Link>
      </nav>
    </aside>
  );
}
