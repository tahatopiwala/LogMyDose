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
      <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Data Export
        </h2>

        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Export your protocol and dose history data as a PDF report. Perfect
            for sharing with your healthcare provider.
          </p>

          {isProUser ? (
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium transition-colors"
            >
              Export Data
            </button>
          ) : (
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-700 mb-2">
                Data export is a Pro feature
              </p>
              <p className="text-sm text-gray-600 mb-3">
                Upgrade to Pro to download comprehensive PDF reports of your
                protocols and dose history.
              </p>
              <button
                onClick={() => {
                  // Navigate to subscription management
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
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
