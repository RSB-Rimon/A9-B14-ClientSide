"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Scissors } from "lucide-react";
import ServiceCard from "@/app/components/ServiceCard";
import {
  useActiveServices,
  type ServiceSort,
} from "@/hooks/use-active-services";

export default function ServicesBrowser({
  initialCategory,
  initialSearch,
  initialSort,
}: {
  initialCategory: string;
  initialSearch: string;
  initialSort: ServiceSort;
}) {
  const [search, setSearch] = useState(initialSearch);
  const [sort, setSort] = useState<ServiceSort>(initialSort);
  const { services, loading, error, retry } = useActiveServices(sort);

  const categories = [
    ...new Set(services.map((service) => service.category)),
  ].sort((a, b) => a.localeCompare(b));
  const filteredServices = services.filter((service) => {
    const matchesCategory =
      !initialCategory || service.category === initialCategory;
    const matchesSearch = `${service.serviceName} ${service.category}`
      .toLowerCase()
      .includes(search.trim().toLowerCase());

    return matchesCategory && matchesSearch;
  });
  const getCategoryHref = (category: string) => {
    const searchParams = new URLSearchParams();

    if (category) {
      searchParams.set("category", category);
    }

    if (search.trim()) {
      searchParams.set("search", search.trim());
    }

    if (sort) {
      searchParams.set("sort", sort);
    }

    const query = searchParams.toString();
    return query ? `/services?${query}` : "/services";
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] px-4 py-10 text-[#292321] sm:px-6 lg:px-9">
      <div className="container-custom space-y-8">
        <header>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#927044]">
            SalonBook
          </p>
          <h1 className="text-3xl font-bold sm:text-4xl">Browse Services</h1>
          <p className="mt-2 text-sm text-[#777067]">
            Explore active salon services and choose the one that suits you.
          </p>
        </header>

        {!loading && !error && categories.length > 0 && (
          <nav
            aria-label="Filter services by category"
            className="flex flex-wrap gap-2"
          >
            <Link
              href={getCategoryHref("")}
              aria-current={!initialCategory ? "page" : undefined}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                !initialCategory
                  ? "border-[#29251f] bg-[#29251f] text-white"
                  : "border-[#eadfd3] bg-white text-[#686159] hover:border-[#b58b57]"
              }`}
            >
              All
            </Link>
            {categories.map((category) => (
              <Link
                key={category}
                href={getCategoryHref(category)}
                aria-current={initialCategory === category ? "page" : undefined}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                  initialCategory === category
                    ? "border-[#29251f] bg-[#29251f] text-white"
                    : "border-[#eadfd3] bg-white text-[#686159] hover:border-[#b58b57]"
                }`}
              >
                {category}
              </Link>
            ))}
          </nav>
        )}

        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto]">
          <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-[#eee5dd] bg-white p-4">
            <Search size={19} className="shrink-0 text-[#9b9185]" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by service name or category..."
              aria-label="Search services"
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>

          <label className="flex items-center gap-3 rounded-2xl border border-[#eee5dd] bg-white px-4 py-3">
            <span className="shrink-0 text-sm font-medium text-[#686159]">
              Sort by
            </span>
            <select
              value={sort}
              onChange={(event) => {
                const value = event.target.value;
                setSort(
                  value === "price-asc" || value === "price-desc" ? value : "",
                );
              }}
              aria-label="Sort services by price"
              className="min-w-0 flex-1 bg-transparent text-sm text-[#29251f] outline-none md:min-w-48"
            >
              <option value="">Default sorting</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </label>
        </div>

        {loading ? (
          <div className="py-16 text-center text-sm text-[#777067]">
            Loading services...
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-white px-6 py-12 text-center">
            <p className="text-sm text-red-700">{error}</p>
            <button
              type="button"
              onClick={retry}
              className="mt-5 rounded-full bg-[#29251f] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#b58b57]"
            >
              Try again
            </button>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#d9cbb9] bg-white px-5 py-16 text-center">
            <Scissors className="mx-auto text-[#b58b57]" size={30} />
            <h2 className="mt-4 font-semibold text-[#29251f]">
              No services found
            </h2>
            <p className="mt-2 text-sm text-[#777067]">
              {initialCategory
                ? `No active services are available in ${initialCategory}.`
                : "Try another search or check back later."}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredServices.map((service) => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
