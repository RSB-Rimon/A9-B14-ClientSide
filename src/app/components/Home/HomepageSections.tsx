"use client";

import Link from "next/link";
import {
  BadgeCheck,
  CalendarCheck2,
  HeartHandshake,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import ServiceCard from "@/app/components/ServiceCard";
import { useActiveServices } from "@/hooks/use-active-services";

const features: {
  icon: LucideIcon;
  title: string;
  description: string;
}[] = [
  {
    icon: BadgeCheck,
    title: "Professional Care",
    description:
      "Explore salon services with clear descriptions, pricing, and duration before you book.",
  },
  {
    icon: CalendarCheck2,
    title: "Simple Online Booking",
    description:
      "Choose a service, preferred date, and time slot through a straightforward booking flow.",
  },
  {
    icon: HeartHandshake,
    title: "A Service for Your Needs",
    description:
      "Browse hair, skin, nail, and other salon categories to find the treatment that suits you.",
  },
  {
    icon: Sparkles,
    title: "A Relaxing Salon Experience",
    description:
      "Keep your appointment details together and return to them from your customer dashboard.",
  },
];

export default function HomepageSections() {
  const { services, loading, error, retry } = useActiveServices();
  const featuredServices = services.slice(0, 6);
  const categories = [...new Set(services.map((service) => service.category))];

  return (
    <>
      <section className="section-padding bg-[#faf8f5]">
        <div className="container-custom">
          <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#927044]">
                Discover our treatments
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-[#29251f] sm:text-4xl">
                Featured Salon Services
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#777067]">
                Browse services currently available at SalonBook and find the
                right fit for your next visit.
              </p>
            </div>
            <Link
              href="/services"
              className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-[#927044] transition hover:text-[#29251f]"
            >
              Browse all services
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }, (_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-2xl border border-[#eee5dd] bg-white"
                >
                  <div className="h-52 animate-pulse bg-[#f3eee7]" />
                  <div className="space-y-3 p-5">
                    <div className="h-4 w-1/3 animate-pulse rounded bg-[#f3eee7]" />
                    <div className="h-5 w-2/3 animate-pulse rounded bg-[#f3eee7]" />
                    <div className="h-4 w-full animate-pulse rounded bg-[#f3eee7]" />
                    <div className="h-10 w-full animate-pulse rounded-xl bg-[#f3eee7]" />
                  </div>
                </div>
              ))}
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
          ) : featuredServices.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#d9cbb9] bg-white px-6 py-14 text-center">
              <h3 className="text-lg font-semibold text-[#29251f]">
                No services available yet
              </h3>
              <p className="mt-2 text-sm text-[#777067]">
                Active salon services will appear here when they are available.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredServices.map((service) => (
                <ServiceCard key={service._id} service={service} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section-padding bg-[#fffdf9]">
        <div className="container-custom">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#927044]">
              Find what you need
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-[#29251f] sm:text-4xl">
              Salon Service Categories
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#777067]">
              Choose a category to see the active services available.
            </p>
          </div>

          {loading ? (
            <div className="flex flex-wrap justify-center gap-3">
              {Array.from({ length: 4 }, (_, index) => (
                <div
                  key={index}
                  className="h-12 w-32 animate-pulse rounded-full bg-[#f3eee7]"
                />
              ))}
            </div>
          ) : error ? (
            <p className="text-center text-sm text-[#777067]">
              Categories are unavailable until services can be loaded.
            </p>
          ) : categories.length === 0 ? (
            <p className="text-center text-sm text-[#777067]">
              Categories will appear when active services are available.
            </p>
          ) : (
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <Link
                  key={category}
                  href={`/services?category=${encodeURIComponent(category)}`}
                  className="rounded-full border border-[#eadfd3] bg-white px-6 py-3 text-sm font-semibold text-[#686159] shadow-sm transition hover:border-[#b58b57] hover:bg-[#f8f2e9] hover:text-[#927044]"
                >
                  {category}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section-padding luxury-gradient">
        <div className="container-custom">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#927044]">
              The SalonBook difference
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-[#29251f] sm:text-4xl">
              Why Choose Us
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#777067]">
              A clearer, more convenient way to explore salon services and
              arrange your next appointment.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(({ icon: Icon, title, description }) => (
              <article
                key={title}
                className="rounded-2xl border border-[#eadfd3] bg-white/80 p-6 shadow-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f8f2e9] text-[#927044]">
                  <Icon size={23} />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-[#29251f]">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#777067]">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
