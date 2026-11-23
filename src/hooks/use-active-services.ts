"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { API_BASE_URL } from "@/app/lib/api";

export type SalonService = {
  _id: string;
  serviceName: string;
  category: string;
  description: string;
  price: number;
  duration: number;
  image: string;
  status: "active" | "inactive";
};

export type ServiceSort = "" | "price-asc" | "price-desc";

export function useActiveServices(sort: ServiceSort = "") {
  const [services, setServices] = useState<SalonService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;

    const loadServices = async () => {
      try {
        setLoading(true);
        const searchParams = new URLSearchParams();

        if (sort) {
          searchParams.set("sort", sort);
        }

        const query = searchParams.toString();
        const response = await fetch(
          `${API_BASE_URL}/services${query ? `?${query}` : ""}`,
        );
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to load salon services.");
        }

        if (!Array.isArray(result.data)) {
          throw new Error("The services API returned an invalid response.");
        }

        if (active) {
          setServices(
            result.data.filter(
              (service: SalonService) => service.status === "active"
            )
          );
          setError("");
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to load salon services.";

        if (active) {
          setError(message);
          toast.error(message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadServices();

    return () => {
      active = false;
    };
  }, [attempt, sort]);

  const retry = useCallback(() => {
    setLoading(true);
    setError("");
    setAttempt((current) => current + 1);
  }, []);

  return { services, loading, error, retry };
}
