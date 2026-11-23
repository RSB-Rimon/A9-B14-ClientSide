import ServicesBrowser from "@/app/components/ServicesBrowser";

type ServicesPageProps = {
  searchParams: Promise<{
    category?: string | string[];
  }>;
};

export default async function ServicesPage({
  searchParams,
}: ServicesPageProps) {
  const { category } = await searchParams;
  const initialCategory = Array.isArray(category) ? category[0] : category;

  return <ServicesBrowser initialCategory={initialCategory || ""} />;
}
