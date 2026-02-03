import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { ExportDataModal } from "./ExportDataModal";

export function DataExportSection() {
  const { patient } = useAuth();
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const isProUser = ["pro", "premium"].includes(
    patient?.subscriptionTier?.toLowerCase() || "",
  );

  return (
    <>
      <div className="bg-surface-card rounded-xl p-5 border border-surface-border">
        <h2 className="text-lg font-semibold text-gray-100 mb-4">
          Data Export
        </h2>

        <div className="space-y-4">
          <p className="text-sm text-gray-400">
            Export your protocol and dose history data as a PDF report. Perfect
            for sharing with your healthcare provider.
          </p>

          {isProUser ? (
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="px-4 py-2 bg-primary-500 text-surface-base rounded-lg hover:bg-primary-400 font-medium transition-colors"
            >
              Export Data
            </button>
          ) : (
            <div className="p-4 bg-surface-elevated rounded-lg border border-surface-border">
              <p className="text-sm text-gray-300 mb-2">
                Data export is a Pro feature
              </p>
              <p className="text-sm text-gray-400 mb-3">
                Upgrade to Pro to download comprehensive PDF reports of your
                protocols and dose history.
              </p>
              <button
                onClick={() => {
                  // Navigate to subscription management
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="text-sm text-primary-500 hover:text-primary-400 font-medium"
              >
                Upgrade to Pro
              </button>
            </div>
          )}
        </div>
      </div>

      <ExportDataModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />
    </>
  );
}
