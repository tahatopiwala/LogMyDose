import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api-client";
import { Dose, DoseStats, PaginatedResponse } from "../types/domain";

export function useDosesToday() {
  return useQuery({
    queryKey: ["doses", "today"],
    queryFn: () => api.get<Dose[]>("/doses/today"),
  });
}

export function useDoseStats(period: "week" | "month" | "year" = "week") {
  return useQuery({
    queryKey: ["doses", "stats", period],
    queryFn: () => api.get<DoseStats>(`/doses/stats?period=${period}`),
  });
}

interface DosesParams {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  substanceId?: string;
}

export function useDoses(params: DosesParams = {}) {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.set("page", params.page.toString());
  if (params.limit) queryParams.set("limit", params.limit.toString());
  if (params.startDate) queryParams.set("startDate", params.startDate);
  if (params.endDate) queryParams.set("endDate", params.endDate);
  if (params.substanceId) queryParams.set("substanceId", params.substanceId);

  const queryString = queryParams.toString();

  return useQuery({
    queryKey: ["doses", params],
    queryFn: () =>
      api.get<PaginatedResponse<Dose>>(
        `/doses${queryString ? `?${queryString}` : ""}`
      ),
  });
}

interface LogDoseData {
  protocolSubstanceId?: string; // Optional for ad-hoc logging
  substanceId: string; // Required - identifies what was taken
  productId?: string; // Optional product reference
  vialId?: string; // Optional vial for injectable substances
  dose: number;
  doseUnit?: string;
  status?: "taken" | "missed" | "skipped";
  administrationSite?: string;
  notes?: string;
  loggedAt?: string;
  // Dose context fields
  fastingState?: "fasted" | "fed" | "unknown";
  takenWithFood?: boolean;
  mealFatContent?: "none" | "low" | "medium" | "high";
  timeOfDay?: "morning" | "afternoon" | "evening" | "night";
  needleGauge?: "25g" | "27g" | "29g" | "30g" | "31g";
  injectionDepth?: "subcutaneous" | "intramuscular";
}

export function useLogDose() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LogDoseData) => api.post<Dose>("/doses", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doses"] });
      queryClient.invalidateQueries({ queryKey: ["protocols"] });
    },
  });
}

export function useUpdateDose() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<LogDoseData>;
    }) => api.put<Dose>(`/doses/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doses"] });
    },
  });
}

export function useDeleteDose() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.delete(`/doses/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doses"] });
    },
  });
}
