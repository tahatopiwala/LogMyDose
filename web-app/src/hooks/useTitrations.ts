import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import {
  TitrationPhaseWithSubstance,
  TitrationProgress,
  TitrationSummary,
  TitrationPlan,
} from "@/types/domain";

interface TitrationsResponse {
  phases: TitrationPhaseWithSubstance[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface TitrationsParams {
  page?: number;
  limit?: number;
  protocolSubstanceId?: string;
  status?: string;
}

export function useTitrations(params: TitrationsParams = {}) {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.set("page", params.page.toString());
  if (params.limit) queryParams.set("limit", params.limit.toString());
  if (params.protocolSubstanceId) queryParams.set("protocolSubstanceId", params.protocolSubstanceId);
  if (params.status) queryParams.set("status", params.status);

  const queryString = queryParams.toString();

  return useQuery({
    queryKey: ["titrations", params],
    queryFn: () =>
      apiClient.get<TitrationsResponse>(
        `/titrations${queryString ? `?${queryString}` : ""}`
      ),
  });
}

export function useActiveTitrations() {
  return useQuery({
    queryKey: ["titrations", "active"],
    queryFn: () =>
      apiClient.get<{ phases: TitrationPhaseWithSubstance[] }>("/titrations/active"),
  });
}

export function useTitrationSummary() {
  return useQuery({
    queryKey: ["titrations", "summary"],
    queryFn: () => apiClient.get<{ summary: TitrationSummary }>("/titrations/summary"),
  });
}

export function useTitrationProgress(protocolSubstanceId: string | undefined) {
  return useQuery({
    queryKey: ["titrations", "progress", protocolSubstanceId],
    queryFn: () =>
      apiClient.get<{ progress: TitrationProgress }>(
        `/titrations/progress/${protocolSubstanceId}`
      ),
    enabled: !!protocolSubstanceId,
  });
}

export function useTitrationPlans() {
  return useQuery({
    queryKey: ["titrations", "plans"],
    queryFn: () => apiClient.get<{ plans: TitrationPlan[] }>("/titrations/plans"),
  });
}

interface StartTitrationData {
  protocolSubstanceId: string;
  planName: string;
  startDate?: string;
}

export function useStartTitration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: StartTitrationData) =>
      apiClient.post<{ phase: TitrationPhaseWithSubstance }>("/titrations/start", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["titrations"] });
    },
  });
}

interface AdvanceTitrationData {
  protocolSubstanceId: string;
  reason?: string;
  notes?: string;
}

export function useAdvanceTitration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AdvanceTitrationData) =>
      apiClient.post<{ phase: TitrationPhaseWithSubstance }>("/titrations/advance", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["titrations"] });
    },
  });
}
