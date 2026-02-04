import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { CycleWithSubstance, CyclePhaseInfo, CycleSummary } from "@/types/domain";

interface CyclesResponse {
  cycles: CycleWithSubstance[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface CyclesParams {
  page?: number;
  limit?: number;
  protocolSubstanceId?: string;
  status?: string;
}

export function useCycles(params: CyclesParams = {}) {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.set("page", params.page.toString());
  if (params.limit) queryParams.set("limit", params.limit.toString());
  if (params.protocolSubstanceId) queryParams.set("protocolSubstanceId", params.protocolSubstanceId);
  if (params.status) queryParams.set("status", params.status);

  const queryString = queryParams.toString();

  return useQuery({
    queryKey: ["cycles", params],
    queryFn: () =>
      apiClient.get<CyclesResponse>(
        `/cycles${queryString ? `?${queryString}` : ""}`
      ),
  });
}

export function useActiveCycles() {
  return useQuery({
    queryKey: ["cycles", "active"],
    queryFn: () => apiClient.get<{ cycles: CycleWithSubstance[] }>("/cycles/active"),
  });
}

export function useCycleSummary() {
  return useQuery({
    queryKey: ["cycles", "summary"],
    queryFn: () => apiClient.get<{ summary: CycleSummary }>("/cycles/summary"),
  });
}

export function useCyclePhaseInfo(cycleId: string) {
  return useQuery({
    queryKey: ["cycles", cycleId, "phase"],
    queryFn: () => apiClient.get<{ phaseInfo: CyclePhaseInfo }>(`/cycles/${cycleId}/phase`),
    enabled: !!cycleId,
  });
}

export function useCyclesByProtocolSubstance(protocolSubstanceId: string | undefined) {
  return useQuery({
    queryKey: ["cycles", "protocolSubstance", protocolSubstanceId],
    queryFn: () =>
      apiClient.get<CyclesResponse>(
        `/cycles?protocolSubstanceId=${protocolSubstanceId}`
      ),
    enabled: !!protocolSubstanceId,
  });
}

interface StartCycleData {
  protocolSubstanceId: string;
  onWeeks: number;
  offWeeks: number;
  startDate?: string;
}

export function useStartCycle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: StartCycleData) =>
      apiClient.post<{ cycle: CycleWithSubstance }>("/cycles", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cycles"] });
    },
  });
}

export function useCompleteCycle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cycleId: string) =>
      apiClient.post<{ cycle: CycleWithSubstance }>(`/cycles/${cycleId}/complete`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cycles"] });
    },
  });
}
