import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api-client";
import { Cycle, CycleWithSubstance, CyclePhaseInfo, CycleSummary } from "../types/domain";

interface CyclesParams {
  protocolSubstanceId?: string;
}

export function useCycles(params: CyclesParams = {}) {
  const queryParams = new URLSearchParams();
  if (params.protocolSubstanceId) {
    queryParams.set("protocolSubstanceId", params.protocolSubstanceId);
  }

  const queryString = queryParams.toString();

  return useQuery({
    queryKey: ["cycles", params],
    queryFn: async () => {
      const response = await api.get<{ cycles: CycleWithSubstance[] }>(
        `/cycles${queryString ? `?${queryString}` : ""}`
      );
      return response.cycles;
    },
  });
}

export function useCycleSummary() {
  return useQuery({
    queryKey: ["cycles", "summary"],
    queryFn: async () => {
      const response = await api.get<{ summary: CycleSummary }>("/cycles/summary");
      return response.summary;
    },
  });
}

export function useActiveCycle(protocolSubstanceId: string) {
  return useQuery({
    queryKey: ["cycles", "active", protocolSubstanceId],
    queryFn: async () => {
      const response = await api.get<{
        cycle: CycleWithSubstance | null;
        phaseInfo: CyclePhaseInfo | null;
      }>(`/cycles/active/${protocolSubstanceId}`);
      return response;
    },
    enabled: !!protocolSubstanceId,
  });
}

export function useCycle(id: string) {
  return useQuery({
    queryKey: ["cycles", id],
    queryFn: async () => {
      const response = await api.get<{
        cycle: CycleWithSubstance;
        phaseInfo: CyclePhaseInfo;
      }>(`/cycles/${id}`);
      return response;
    },
    enabled: !!id,
  });
}

interface StartCycleInput {
  protocolSubstanceId: string;
  startDate?: string;
  onWeeks: number;
  offWeeks: number;
  notes?: string;
}

export function useStartCycle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: StartCycleInput) =>
      api.post<{ cycle: Cycle }>("/cycles", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cycles"] });
    },
  });
}

interface UpdateCycleInput {
  onWeeks?: number;
  offWeeks?: number;
  notes?: string;
}

export function useUpdateCycle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCycleInput }) =>
      api.put<{ cycle: Cycle }>(`/cycles/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cycles"] });
    },
  });
}

export function useCompleteCycle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      api.post<{ cycle: Cycle; message: string }>(`/cycles/${id}/complete`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cycles"] });
    },
  });
}

export function useDeleteCycle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.delete(`/cycles/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cycles"] });
    },
  });
}
