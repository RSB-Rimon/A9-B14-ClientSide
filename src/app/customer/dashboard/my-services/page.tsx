"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Scissors, Clock3, ArrowRight, RefreshCw } from "lucide-react";
import Image from "next/image";
import { API_BASE_URL } from "@/app/lib/api";

type Service = {
  _id: string;
  serviceName: string;
  category: string;
  description: string;
  price: number;
  duration: number;
  image: string;
  status: "active" | "inactive";
};

export default function MyServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadServices = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_BASE_URL}/services`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to load services.");
        }

        const activeServices = (result.data || []).filter(
          (service: Service) => service.status === "active",
        );

        setServices(activeServices);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

  const filteredServices = services.filter((service) =>
    `${service.serviceName} ${service.category}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-[#faf8f6] px-4 py-8 text-[#292321] sm:px-6 lg:px-9">
      <div className="mx-auto max-w-7xl space-y-8">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#b77970]">
            SalonBook Customer
          </p>
          <h1 className="text-3xl font-bold sm:text-4xl">
            Explore Our Services
          </h1>
          <p className="mt-2 text-sm text-[#8b817d]">
            Discover our salon treatments and choose the service you love.
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-[#eee5e1] bg-white p-4">
          <Search size={20} className="shrink-0 text-[#a79b96]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by service name or category..."
            className="w-full bg-transparent text-sm outline-none"
          />
        </div>

        {loading ? (
          <div className="rounded-2xl border border-[#eee5e1] bg-white p-14 text-center">
            <RefreshCw
              className="mx-auto animate-spin text-[#a85f58]"
              size={28}
            />
            <p className="mt-3 text-sm text-[#968b86]">Loading services...</p>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-sm text-red-700">
            {error}
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#e6d6d1] bg-white px-5 py-16 text-center">
            <Scissors className="mx-auto text-[#a85f58]" size={30} />
            <h2 className="mt-4 font-bold">No services found</h2>
            <p className="mt-2 text-sm text-[#968b86]">
              {search
                ? "Try another search."
                : "No active services are available right now."}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredServices.map((service) => (
              <article
                key={service._id}
                className="overflow-hidden rounded-2xl border border-[#eee5e1] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="h-52 overflow-hidden bg-[#f3eee7]">
                  <Image
                    src={service.image}
                    alt={service.serviceName}
                    width={600}
                    height={400}
                    className="h-full w-full object-cover transition duration-300 hover:scale-105"
                  />
                </div>

                <div className="space-y-4 p-5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-full bg-[#f8eeeb] px-3 py-1.5 text-xs font-semibold text-[#a85f58]">
                      {service.category}
                    </span>
                    <span className="text-lg font-bold text-[#a85f58]">
                      ৳{service.price.toLocaleString("en-BD")}
                    </span>
                  </div>

                  <div>
                    <h2 className="text-lg font-bold">{service.serviceName}</h2>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#8b817d]">
                      {service.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-[#8b817d]">
                    <Clock3 size={15} />
                    {service.duration} minutes
                  </div>

                  <Link
                    href={`/customer/dashboard/book-appointment/${service._id}`}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#a85f58] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#914c46]"
                  >
                    Book Now
                    <ArrowRight size={17} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
