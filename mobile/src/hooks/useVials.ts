import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api-client";
import { PaginatedResponse } from "../types/domain";

export interface Vial {
  id: string;
  patientId: string;
  productId: string;
  reconstitutedAt: string | null;
  diluentType: string | null;
  diluentVolumeMl: number | null;
  concentrationMcgMl: number | null;
  vialAmountMcg: number | null;
  remainingAmountMcg: number | null;
  lotNumber: string | null;
  manufacturerExpDate: string | null;
  calculatedExpDate: string | null;
  storageLocation: string | null;
  requiresRefrigeration: boolean;
  status: "active" | "depleted" | "expired" | "disposed";
  depletedAt: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  product: {
    id: string;
    name: string;
    substanceId: string;
    doseUnit: string | null;
    substance: {
      id: string;
      name: string;
      doseUnit: string | null;
      shelfLifeReconstitutedDays: number | null;
    };
  };
  _count?: {
    doses: number;
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
      api.get<PaginatedResponse<Vial>>(
        `/vials${queryString ? `?${queryString}` : ""}`
      ),
  });
}

export function useActiveVials() {
  return useQuery({
    queryKey: ["vials", "active"],
    queryFn: () => api.get<Vial[]>("/vials/active"),
  });
}

export function useActiveVialsBySubstance(substanceId: string | undefined) {
  return useQuery({
    queryKey: ["vials", "active", "substance", substanceId],
    queryFn: () =>
      api.get<Vial[]>(`/vials?status=active&substanceId=${substanceId}`).then(
        (res) => (res as unknown as PaginatedResponse<Vial>).data || res
      ),
    enabled: !!substanceId,
  });
}

export function useVial(id: string) {
  return useQuery({
    queryKey: ["vials", id],
    queryFn: () => api.get<Vial>(`/vials/${id}`),
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
    mutationFn: (data: CreateVialData) => api.post<Vial>("/vials", data),
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
      api.put<Vial>(`/vials/${id}`, data),
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
      api.post<Vial>(`/vials/${id}/reconstitute`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vials"] });
    },
  });
}

export function useMarkVialDepleted() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.post<Vial>(`/vials/${id}/depleted`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vials"] });
    },
  });
}
