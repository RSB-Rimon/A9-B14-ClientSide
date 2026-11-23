import ServicesBrowser from "@/app/components/ServicesBrowser";
import type { ServiceSort } from "@/hooks/use-active-services";

type ServicesPageProps = {
  searchParams: Promise<{
    category?: string | string[];
    search?: string | string[];
    sort?: string | string[];
  }>;
};

export default async function ServicesPage({
  searchParams,
}: ServicesPageProps) {
  const { category, search, sort } = await searchParams;
  const initialCategory = Array.isArray(category) ? category[0] : category;
  const initialSearch = Array.isArray(search) ? search[0] : search;
  const requestedSort = Array.isArray(sort) ? sort[0] : sort;
  const initialSort: ServiceSort =
    requestedSort === "price-asc" || requestedSort === "price-desc"
      ? requestedSort
      : "";

  return (
    <ServicesBrowser
      key={`${initialCategory || ""}|${initialSearch || ""}|${initialSort}`}
      initialCategory={initialCategory || ""}
      initialSearch={initialSearch || ""}
      initialSort={initialSort}
    />
  );
}
