import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api-client";

export interface Product {
  id: string;
  substanceId: string;
  name: string;
  defaultDose: number | string | null;
  doseUnit: string | null;
  isGlobal: boolean;
  patientId: string | null;
  isActive: boolean;
  createdAt: string;
  substance?: {
    id: string;
    name: string;
    categoryId: string;
    doseUnit: string | null;
  };
}

interface ProductsParams {
  substanceId?: string;
  page?: number;
  limit?: number;
}

export function useProducts(params: ProductsParams = {}) {
  const queryParams = new URLSearchParams();
  if (params.substanceId) queryParams.set("substanceId", params.substanceId);
  if (params.page) queryParams.set("page", params.page.toString());
  if (params.limit) queryParams.set("limit", params.limit.toString());

  const queryString = queryParams.toString();

  return useQuery({
    queryKey: ["products", params],
    queryFn: async () => {
      const response = await api.get<{
        products: Product[];
        pagination: { page: number; limit: number; total: number; totalPages: number };
      }>(`/products${queryString ? `?${queryString}` : ""}`);
      return response.products;
    },
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ["products", id],
    queryFn: async () => {
      const response = await api.get<{ product: Product }>(`/products/${id}`);
      return response.product;
    },
    enabled: !!id,
  });
}

export function useProductsBySubstance(substanceId: string | undefined) {
  return useQuery({
    queryKey: ["products", "substance", substanceId],
    queryFn: async () => {
      const response = await api.get<{ products: Product[] }>(
        `/products/by-substance/${substanceId}`
      );
      return response.products;
    },
    enabled: !!substanceId,
  });
}
