  import Link from "next/link";

  const stats = [
    {
      title: "Total Appointments",
      value: "—",
      description: "All your appointment requests",
    },
    {
      title: "Pending",
      value: "—",
      description: "Waiting for confirmation",
    },
    {
      title: "Confirmed",
      value: "—",
      description: "Your confirmed appointments",
    },
    {
      title: "Cancelled",
      value: "—",
      description: "Cancelled appointments",
    },
  ];

  export default function CustomerDashboardPage() {
    return (
      <div className="mx-auto max-w-7xl space-y-8">
        <div>
          <p className="text-sm font-medium text-[#b58b57]">
            CUSTOMER DASHBOARD
          </p>

          <h1 className="mt-2 text-3xl font-bold text-[#29251f]">
            Welcome Back!
          </h1>

          <p className="mt-2 text-sm text-[#81796f]">
            Manage your salon appointments and profile from here.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.title}
              className="rounded-2xl border border-[#eee9e2] bg-white p-6 shadow-sm"
            >
              <p className="text-sm font-medium text-[#81796f]">
                {stat.title}
              </p>

              <h2 className="mt-4 text-3xl font-bold text-[#29251f]">
                {stat.value}
              </h2>

              <p className="mt-2 text-xs text-[#9b9185]">
                {stat.description}
              </p>
            </div>
          ))}
        </div>

        {/* Recent Appointments */}
        <section className="rounded-2xl border border-[#eee9e2] bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-[#29251f]">
                Recent Appointments
              </h2>

              <p className="mt-1 text-sm text-[#81796f]">
                Your latest salon appointment requests.
              </p>
            </div>

            <a
              href="/customer/dashboard/appointments"
              className="text-sm font-semibold text-[#b58b57] hover:underline"
            >
              View All
            </a>
          </div>

          <div className="mt-8 rounded-xl bg-[#faf8f5] px-5 py-12 text-center">
            <h3 className="font-semibold text-[#29251f]">
              No appointments yet
            </h3>

            <p className="mt-2 text-sm text-[#81796f]">
              Explore our salon services and book your first appointment.
            </p>

            <Link
              href="/services"
              className="mt-5 inline-flex rounded-full bg-[#29251f] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#b58b57]"
            >
              Explore Services
            </Link>
          </div>
        </section>
      </div>
    );
  }
