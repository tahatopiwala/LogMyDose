import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { ManageSubscriptionModal } from "./ManageSubscriptionModal";

export function SubscriptionSection() {
  const { patient } = useAuth();
  const [isManageOpen, setIsManageOpen] = useState(false);

  const tier = patient?.subscriptionTier || "free";
  const status = patient?.subscriptionStatus || "active";

  const getTierDisplay = (tier: string) => {
    switch (tier.toLowerCase()) {
      case "pro":
        return "Pro";
      case "premium":
        return "Premium";
      default:
        return "Free";
    }
  };

  const getStatusDisplay = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return { label: "Active", className: "bg-green-100 text-green-800" };
      case "trialing":
        return { label: "Trial", className: "bg-blue-100 text-blue-800" };
      case "past_due":
        return {
          label: "Past Due",
          className: "bg-yellow-100 text-yellow-800",
        };
      case "canceled":
        return { label: "Canceled", className: "bg-gray-100 text-gray-800" };
      default:
        return { label: status, className: "bg-gray-100 text-gray-800" };
    }
  };

  const statusDisplay = getStatusDisplay(status);

  return (
    <>
      <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Subscription
        </h2>

        <div className="space-y-4">
          {/* Current Plan */}
          <div>
            <label className="block text-sm font-medium text-gray-500">
              Current Plan
            </label>
            <div className="mt-1 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <p className="text-gray-900 font-medium">
                  {getTierDisplay(tier)}
                </p>
                <span
                  className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusDisplay.className}`}
                >
                  {statusDisplay.label}
                </span>
              </div>
              <button
                onClick={() => setIsManageOpen(true)}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                Manage Subscription
              </button>
            </div>
          </div>

          {/* Plan Features */}
          {tier.toLowerCase() === "free" && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 mb-2">
                Upgrade to Pro for advanced features:
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li className="flex items-center">
                  <svg
                    className="w-4 h-4 text-primary-500 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Unlimited protocols
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-4 h-4 text-primary-500 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  AI-powered insights
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-4 h-4 text-primary-500 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Weekly AI reports
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-4 h-4 text-primary-500 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Data export
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      <ManageSubscriptionModal
        isOpen={isManageOpen}
        onClose={() => setIsManageOpen(false)}
      />
    </>
  );
}
