import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { Vial, Product } from "@/types/domain";

interface VialsResponse {
  vials: Vial[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface VialsParams {
  page?: number;
  limit?: number;
  productId?: string;
  status?: string;
  substanceId?: string;
}

export function useVials(params: VialsParams = {}) {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.set("page", params.page.toString());
  if (params.limit) queryParams.set("limit", params.limit.toString());
  if (params.productId) queryParams.set("productId", params.productId);
  if (params.status) queryParams.set("status", params.status);
  if (params.substanceId) queryParams.set("substanceId", params.substanceId);

  const queryString = queryParams.toString();

  return useQuery({
    queryKey: ["vials", params],
    queryFn: () =>
      apiClient.get<VialsResponse>(
        `/vials${queryString ? `?${queryString}` : ""}`
      ),
  });
}

export function useActiveVials() {
  return useQuery({
    queryKey: ["vials", "active"],
    queryFn: () => apiClient.get<{ vials: Vial[] }>("/vials/active"),
  });
}

export function useVial(id: string) {
  return useQuery({
    queryKey: ["vials", id],
    queryFn: () => apiClient.get<{ vial: Vial }>(`/vials/${id}`),
    enabled: !!id,
  });
}

interface CreateVialData {
  productId: string;
  vialAmountMcg?: number;
  lotNumber?: string;
  manufacturerExpDate?: string;
  storageLocation?: string;
  requiresRefrigeration?: boolean;
  notes?: string;
}

export function useCreateVial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateVialData) =>
      apiClient.post<{ vial: Vial }>("/vials", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vials"] });
    },
  });
}

interface UpdateVialData {
  lotNumber?: string;
  manufacturerExpDate?: string;
  storageLocation?: string;
  requiresRefrigeration?: boolean;
  notes?: string;
  status?: "active" | "depleted" | "expired" | "disposed";
}

export function useUpdateVial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateVialData }) =>
      apiClient.put<{ vial: Vial }>(`/vials/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vials"] });
    },
  });
}

interface ReconstituteVialData {
  diluentType: "bacteriostatic_water" | "saline" | "sterile_water";
  diluentVolumeMl: number;
}

export function useReconstituteVial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ReconstituteVialData }) =>
      apiClient.post<{ vial: Vial }>(`/vials/${id}/reconstitute`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vials"] });
    },
  });
}

export function useMarkVialDepleted() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiClient.post<{ vial: Vial }>(`/vials/${id}/depleted`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vials"] });
    },
  });
}

// Products hook for vial creation
export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: () =>
      apiClient.get<{ products: Product[] }>("/products?limit=100"),
  });
}
