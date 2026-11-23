import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock3, Scissors } from "lucide-react";
import type { SalonService } from "@/hooks/use-active-services";

export default function ServiceCard({ service }: { service: SalonService }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-[#eee5dd] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-52 overflow-hidden bg-[#f3eee7]">
        {service.image ? (
          <Image
            src={service.image}
            alt={service.serviceName}
            width={800}
            height={600}
            className="h-full w-full object-cover transition duration-300 hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[#b58b57]">
            <Scissors size={36} />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <span className="rounded-full bg-[#f8f2e9] px-3 py-1.5 text-xs font-semibold text-[#927044]">
            {service.category}
          </span>
          <span className="shrink-0 text-lg font-bold text-[#927044]">
            ৳{service.price.toLocaleString("en-BD")}
          </span>
        </div>

        <h3 className="mt-4 text-lg font-bold text-[#29251f]">
          {service.serviceName}
        </h3>
        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-6 text-[#777067]">
          {service.description}
        </p>

        <div className="mt-4 flex items-center gap-2 text-sm text-[#8b8176]">
          <Clock3 size={16} />
          {service.duration} minutes
        </div>

        <Link
          href={`/services/${service._id}`}
          className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-[#29251f] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#b58b57]"
        >
          View Details
          <ArrowRight size={16} />
        </Link>
      </div>
    </article>
  );
}
