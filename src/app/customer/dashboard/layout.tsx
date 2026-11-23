
import { requireRole } from "@/app/lib/require-user";
import CustomerSidebar from "./CustomerSidebar";

export default async function CustomerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole("customer");

  return (
    <div className="min-h-screen bg-[#faf8f5] md:flex">
      <CustomerSidebar />

      <main className="min-w-0 flex-1 p-5 sm:p-8 lg:p-10">
        {children}
      </main>
    </div>
  );
}
