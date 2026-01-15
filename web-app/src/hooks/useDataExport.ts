import { useState, useCallback, useRef } from "react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3010/api/v1";

export type ExportStatus = "idle" | "queued" | "processing" | "completed" | "failed";

interface ExportJob {
  id: string;
  status: string;
  startDate: string;
  endDate: string;
  fileName?: string;
  fileSize?: number;
  downloadUrl?: string;
  error?: string;
  createdAt: string;
  expiresAt: string;
}

interface ExportState {
  status: ExportStatus;
  jobId?: string;
  error?: string;
  downloadUrl?: string;
  fileName?: string;
}

const POLL_INTERVAL = 2000; // 2 seconds
const MAX_POLL_ATTEMPTS = 150; // 5 minutes max (150 * 2s)

export function useDataExport() {
  const [state, setState] = useState<ExportState>({ status: "idle" });
  const pollCountRef = useRef(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  const resetState = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    pollCountRef.current = 0;
    setState({ status: "idle" });
  }, []);

  const pollJobStatus = useCallback(async (jobId: string): Promise<ExportJob> => {
    const response = await fetch(`${API_BASE_URL}/exports/${jobId}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      signal: abortControllerRef.current?.signal,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Failed to check export status" }));
      throw new Error(error.error || "Failed to check export status");
    }

    const data = await response.json();
    return data.job;
  }, []);

  const startPolling = useCallback(async (jobId: string) => {
    pollCountRef.current = 0;

    const poll = async () => {
      if (pollCountRef.current >= MAX_POLL_ATTEMPTS) {
        setState((prev) => ({
          ...prev,
          status: "failed",
          error: "Export timed out. Please try again.",
        }));
        return;
      }

      try {
        pollCountRef.current++;
        const job = await pollJobStatus(jobId);

        if (job.status === "completed" && job.downloadUrl) {
          setState({
            status: "completed",
            jobId,
            downloadUrl: job.downloadUrl,
            fileName: job.fileName,
          });
          return;
        }

        if (job.status === "failed") {
          setState({
            status: "failed",
            jobId,
            error: job.error || "Export failed. Please try again.",
          });
          return;
        }

        // Still processing, continue polling
        setState((prev) => ({
          ...prev,
          status: job.status === "processing" ? "processing" : "queued",
        }));

        setTimeout(poll, POLL_INTERVAL);
      } catch (err) {
        if ((err as Error).name === "AbortError") {
          return; // Polling was cancelled
        }
        setState((prev) => ({
          ...prev,
          status: "failed",
          error: (err as Error).message || "Failed to check export status",
        }));
      }
    };

    poll();
  }, [pollJobStatus]);

  const exportData = useCallback(async (startDate: string, endDate: string) => {
    // Reset any previous state
    resetState();
    abortControllerRef.current = new AbortController();

    setState({ status: "queued" });

    try {
      // Create export job
      const response = await fetch(`${API_BASE_URL}/exports`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ startDate, endDate }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: "Failed to start export" }));
        throw new Error(error.error || "Failed to start export");
      }

      const data = await response.json();
      const jobId = data.job.id;

      setState({ status: "queued", jobId });

      // Start polling for status
      await startPolling(jobId);
    } catch (err) {
      if ((err as Error).name === "AbortError") {
        return;
      }
      setState({
        status: "failed",
        error: (err as Error).message || "Failed to start export",
      });
      throw err;
    }
  }, [resetState, startPolling]);

  const downloadFile = useCallback(() => {
    if (state.downloadUrl) {
      const a = document.createElement("a");
      a.href = state.downloadUrl;
      a.download = state.fileName || "medical-report.pdf";
      a.target = "_blank";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }, [state.downloadUrl, state.fileName]);

  return {
    exportData,
    downloadFile,
    resetState,
    status: state.status,
    error: state.error,
    downloadUrl: state.downloadUrl,
    fileName: state.fileName,
    isExporting: state.status === "queued" || state.status === "processing",
    isComplete: state.status === "completed",
    isFailed: state.status === "failed",
  };
}
