import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api-client";
import { Protocol, ActiveProtocolSubstance } from "../types/domain";

// Substance type for ad-hoc logging
interface Substance {
  id: string;
  name: string;
  aliases?: string[];
  defaultDose: number | string | null;
  doseUnit: string | null;
  administrationRoute: string | null;
}

export function useSubstances() {
  return useQuery({
    queryKey: ["substances"],
    queryFn: async () => {
      const res = await api.get<{ substances: Substance[] }>("/substances?limit=100");
      return res.substances;
    },
  });
}

export function useProtocols() {
  return useQuery({
    queryKey: ["protocols"],
    queryFn: () => api.get<Protocol[]>("/protocols"),
  });
}

export function useProtocol(id: string) {
  return useQuery({
    queryKey: ["protocols", id],
    queryFn: async () => {
      const res = await api.get<{ protocol: Protocol }>(`/protocols/${id}`);
      return res.protocol;
    },
    enabled: !!id,
  });
}

export function useActiveSubstances() {
  return useQuery({
    queryKey: ["protocols", "my-substances"],
    queryFn: async () => {
      const res = await api.get<{ substances: ActiveProtocolSubstance[] }>("/protocols/my-substances");
      return res.substances;
    },
  });
}

interface CreateProtocolData {
  substances: Array<{
    substanceId: string;
    productId?: string;
    dose: number;
    doseUnit?: string;
    frequency?: string;
  }>;
  startDate?: string;
  notes?: string;
}

export function useCreateProtocol() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProtocolData) =>
      api.post<Protocol>("/protocols", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["protocols"] });
    },
  });
}

export function useUpdateProtocolStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Protocol["status"] }) =>
      api.put<{ protocol: Protocol }>(`/protocols/${id}`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["protocols"] });
      queryClient.invalidateQueries({ queryKey: ["protocols", "my-substances"] });
    },
  });
}
