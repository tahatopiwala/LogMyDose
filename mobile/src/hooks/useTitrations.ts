import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api-client";
import {
  TitrationPhase,
  TitrationPhaseWithSubstance,
  TitrationProgress,
  TitrationSummary,
  TitrationPlan,
} from "../types/domain";

interface TitrationsParams {
  protocolSubstanceId?: string;
}

export function useTitrations(params: TitrationsParams = {}) {
  const queryParams = new URLSearchParams();
  if (params.protocolSubstanceId) {
    queryParams.set("protocolSubstanceId", params.protocolSubstanceId);
  }

  const queryString = queryParams.toString();

  return useQuery({
    queryKey: ["titrations", params],
    queryFn: async () => {
      const response = await api.get<{ phases: TitrationPhaseWithSubstance[] }>(
        `/titrations${queryString ? `?${queryString}` : ""}`
      );
      return response.phases;
    },
  });
}

export function useTitrationSummary() {
  return useQuery({
    queryKey: ["titrations", "summary"],
    queryFn: async () => {
      const response = await api.get<{ summary: TitrationSummary }>(
        "/titrations/summary"
      );
      return response.summary;
    },
  });
}

export function useTitrationProgress(protocolSubstanceId: string) {
  return useQuery({
    queryKey: ["titrations", "progress", protocolSubstanceId],
    queryFn: async () => {
      const response = await api.get<{ progress: TitrationProgress | null }>(
        `/titrations/progress/${protocolSubstanceId}`
      );
      return response.progress;
    },
    enabled: !!protocolSubstanceId,
  });
}

export function useTitrationPlans() {
  return useQuery({
    queryKey: ["titrations", "plans"],
    queryFn: async () => {
      const response = await api.get<{ plans: TitrationPlan[] }>(
        "/titrations/plans"
      );
      return response.plans;
    },
  });
}

interface StartTitrationInput {
  protocolSubstanceId: string;
  planName?: string;
  customSteps?: {
    doseAmount: number;
    doseUnit: string;
    weeksAtDose: number;
    isMaintenance?: boolean;
  }[];
  startDate?: string;
  notes?: string;
}

export function useStartTitration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: StartTitrationInput) =>
      api.post<{ phases: TitrationPhase[]; message: string }>(
        "/titrations",
        data
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["titrations"] });
    },
  });
}

interface AdvancePhaseInput {
  reason?: "scheduled" | "tolerability" | "side_effects" | "plateau" | "custom";
  notes?: string;
  customDose?: number;
  customWeeks?: number;
}

export function useAdvanceTitration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      protocolSubstanceId,
      data,
    }: {
      protocolSubstanceId: string;
      data?: AdvancePhaseInput;
    }) =>
      api.post<{ phase: TitrationPhase; message: string }>(
        `/titrations/${protocolSubstanceId}/advance`,
        data || {}
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["titrations"] });
    },
  });
}

export function useSkipTitrationPhase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, notes }: { id: string; notes?: string }) =>
      api.post<{ phase: TitrationPhase; message: string }>(
        `/titrations/${id}/skip`,
        { notes }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["titrations"] });
    },
  });
}
