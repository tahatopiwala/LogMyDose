import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { useDataExport } from "@/hooks/useDataExport";

interface ExportDataModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExportDataModal({ isOpen, onClose }: ExportDataModalProps) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const {
    exportData,
    downloadFile,
    resetState,
    status,
    error: exportError,
    isExporting,
    isComplete,
    isFailed,
  } = useDataExport();

  // Initialize with last 30 days when modal opens
  useEffect(() => {
    if (isOpen) {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 30);

      setStartDate(start.toISOString().split("T")[0]);
      setEndDate(end.toISOString().split("T")[0]);
      setLocalError(null);
      resetState();
    }
  }, [isOpen, resetState]);

  const setQuickRange = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);

    setStartDate(start.toISOString().split("T")[0]);
    setEndDate(end.toISOString().split("T")[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();

    if (start > end) {
      setLocalError("Start date must be before end date");
      return;
    }

    if (start > now || end > now) {
      setLocalError("Dates cannot be in the future");
      return;
    }

    try {
      await exportData(startDate, endDate);
    } catch {
      // Error is handled by the hook
    }
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleDownload = () => {
    downloadFile();
    handleClose();
  };

  const error = localError || exportError;

  // Progress UI component
  const renderProgressUI = () => {
    if (status === "queued") {
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
          <p className="text-center text-sm text-gray-400">
            Your export has been queued and will start processing shortly...
          </p>
        </div>
      );
    }

    if (status === "processing") {
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
          <p className="text-center text-sm text-gray-400">
            Generating your PDF report...
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-primary-500 h-2 rounded-full animate-pulse w-3/4"></div>
          </div>
        </div>
      );
    }

    return null;
  };

  // Success UI
  if (isComplete) {
    return (
      <Modal isOpen={isOpen} onClose={handleClose} title="Export Ready">
        <div className="space-y-4">
          <div className="flex items-center justify-center">
            <div className="rounded-full bg-green-900/40 p-3">
              <svg
                className="h-8 w-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
          <p className="text-center text-sm text-gray-400">
            Your PDF report is ready for download.
          </p>
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-2 px-4 border border-surface-border rounded-lg text-sm font-medium text-gray-300 hover:bg-surface-elevated"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="flex-1 py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-500 hover:bg-primary-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Download PDF
            </button>
          </div>
        </div>
      </Modal>
    );
  }

  // Processing UI
  if (isExporting) {
    return (
      <Modal isOpen={isOpen} onClose={handleClose} title="Generating Export">
        <div className="space-y-6">
          {renderProgressUI()}
          <button
            type="button"
            onClick={handleClose}
            className="w-full py-2 px-4 border border-surface-border rounded-lg text-sm font-medium text-gray-300 hover:bg-surface-elevated"
          >
            Cancel
          </button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Export Data">
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-sm text-gray-400">
          Select a date range to export your protocol and dose history data.
        </p>

        {error && (
          <div className="p-3 rounded-lg bg-red-900/30 border border-red-800 text-red-400 text-sm">
            {error}
          </div>
        )}

        {isFailed && (
          <button
            type="button"
            onClick={() => resetState()}
            className="text-sm text-primary-500 hover:text-primary-400"
          >
            Try again
          </button>
        )}

        {/* Quick range buttons */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Quick Select
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setQuickRange(30)}
              className="px-3 py-1.5 text-sm border border-surface-border rounded-lg hover:bg-surface-elevated disabled:opacity-50"
              disabled={isExporting}
            >
              Last 30 Days
            </button>
            <button
              type="button"
              onClick={() => setQuickRange(90)}
              className="px-3 py-1.5 text-sm border border-surface-border rounded-lg hover:bg-surface-elevated disabled:opacity-50"
              disabled={isExporting}
            >
              Last 3 Months
            </button>
            <button
              type="button"
              onClick={() => setQuickRange(180)}
              className="px-3 py-1.5 text-sm border border-surface-border rounded-lg hover:bg-surface-elevated disabled:opacity-50"
              disabled={isExporting}
            >
              Last 6 Months
            </button>
          </div>
        </div>

        {/* Date inputs */}
        <div>
          <label
            htmlFor="startDate"
            className="block text-sm font-medium text-gray-300"
          >
            Start Date
          </label>
          <input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            disabled={isExporting}
            max={new Date().toISOString().split("T")[0]}
            required
            className="mt-1 appearance-none block w-full px-3 py-2 border border-surface-border rounded-lg bg-surface-raised text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 disabled:bg-surface-elevated disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label
            htmlFor="endDate"
            className="block text-sm font-medium text-gray-300"
          >
            End Date
          </label>
          <input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            disabled={isExporting}
            max={new Date().toISOString().split("T")[0]}
            required
            className="mt-1 appearance-none block w-full px-3 py-2 border border-surface-border rounded-lg bg-surface-raised text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 disabled:bg-surface-elevated disabled:cursor-not-allowed"
          />
        </div>

        {/* Action buttons */}
        <div className="flex space-x-3 pt-2">
          <button
            type="button"
            onClick={handleClose}
            disabled={isExporting}
            className="flex-1 py-2 px-4 border border-surface-border rounded-lg text-sm font-medium text-gray-300 hover:bg-surface-elevated disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isExporting}
            className="flex-1 py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-500 hover:bg-primary-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Generate PDF
          </button>
        </div>
      </form>
    </Modal>
  );
}
