import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api-client";
import {
  BiometricEntry,
  BiometricStats,
  BiometricTrend,
  MetricType,
  PaginatedResponse,
} from "../types/domain";

interface BiometricsParams {
  page?: number;
  limit?: number;
  metricType?: MetricType;
  startDate?: string;
  endDate?: string;
  doseId?: string;
}

export function useBiometrics(params: BiometricsParams = {}) {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.set("page", params.page.toString());
  if (params.limit) queryParams.set("limit", params.limit.toString());
  if (params.metricType) queryParams.set("metricType", params.metricType);
  if (params.startDate) queryParams.set("startDate", params.startDate);
  if (params.endDate) queryParams.set("endDate", params.endDate);
  if (params.doseId) queryParams.set("doseId", params.doseId);

  const queryString = queryParams.toString();

  return useQuery({
    queryKey: ["biometrics", params],
    queryFn: async () => {
      const response = await api.get<{
        entries: BiometricEntry[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
        };
      }>(`/biometrics${queryString ? `?${queryString}` : ""}`);
      return {
        data: response.entries,
        meta: response.pagination,
      } as PaginatedResponse<BiometricEntry>;
    },
  });
}

interface StatsParams {
  metricType?: MetricType;
  startDate?: string;
  endDate?: string;
}

export function useBiometricStats(params: StatsParams = {}) {
  const queryParams = new URLSearchParams();
  if (params.metricType) queryParams.set("metricType", params.metricType);
  if (params.startDate) queryParams.set("startDate", params.startDate);
  if (params.endDate) queryParams.set("endDate", params.endDate);

  const queryString = queryParams.toString();

  return useQuery({
    queryKey: ["biometrics", "stats", params],
    queryFn: async () => {
      const response = await api.get<{ stats: BiometricStats[] }>(
        `/biometrics/stats${queryString ? `?${queryString}` : ""}`
      );
      return response.stats;
    },
  });
}

export function useBiometricTrend(metricType: MetricType, days: number = 30) {
  return useQuery({
    queryKey: ["biometrics", "trend", metricType, days],
    queryFn: async () => {
      const response = await api.get<{
        trend: BiometricTrend[];
        metricType: string;
        days: number;
      }>(`/biometrics/trend/${metricType}?days=${days}`);
      return response.trend;
    },
    enabled: !!metricType,
  });
}

interface LogBiometricData {
  metricType: MetricType;
  value: number;
  unit?: string;
  doseId?: string;
  notes?: string;
  recordedAt?: string;
}

export function useLogBiometric() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LogBiometricData) =>
      api.post<{ entry: BiometricEntry }>("/biometrics", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["biometrics"] });
    },
  });
}

interface BatchLogData {
  entries: LogBiometricData[];
}

export function useLogBiometricBatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BatchLogData) =>
      api.post<{ count: number; message: string }>("/biometrics/batch", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["biometrics"] });
    },
  });
}

export function useDeleteBiometric() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.delete(`/biometrics/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["biometrics"] });
    },
  });
}
