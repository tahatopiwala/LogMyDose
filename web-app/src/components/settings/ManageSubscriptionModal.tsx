import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { useAuth } from "@/hooks/useAuth";
import { apiClient } from "@/lib/api-client";
import { ApiError } from "@/types/auth";

interface ManageSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Plan {
  id: string;
  name: string;
  price: number;
  interval: string;
  features: string[];
  priceId: string;
}

const plans: Plan[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    interval: "month",
    features: [
      "Track up to 2 protocols",
      "Basic dose logging",
      "7-day history",
    ],
    priceId: "",
  },
  {
    id: "pro_monthly",
    name: "Pro",
    price: 9.99,
    interval: "month",
    features: [
      "Unlimited protocols",
      "Full dose history",
      "AI-powered insights",
      "Weekly AI reports",
      "Side effect tracking",
      "Data export",
    ],
    priceId: "price_pro_monthly",
  },
  {
    id: "pro_annual",
    name: "Pro (Annual)",
    price: 99,
    interval: "year",
    features: ["Everything in Pro", "2 months free", "Priority support"],
    priceId: "price_pro_annual",
  },
];

export function ManageSubscriptionModal({
  isOpen,
  onClose,
}: ManageSubscriptionModalProps) {
  const { patient } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentTier = patient?.subscriptionTier || "free";
  const isPro = currentTier.toLowerCase() === "pro";

  const handleUpgrade = async (priceId: string) => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await apiClient.post<{ checkoutUrl: string }>(
        "/subscription/checkout",
        { priceId },
      );

      // Redirect to Stripe Checkout
      window.location.href = response.checkoutUrl;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.error || "Failed to start checkout. Please try again.");
      setIsLoading(false);
    }
  };

  const handleManageBilling = async () => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await apiClient.post<{ portalUrl: string }>(
        "/subscription/portal",
        {},
      );

      // Redirect to Stripe Customer Portal
      window.location.href = response.portalUrl;
    } catch (err) {
      const apiError = err as ApiError;
      setError(
        apiError.error || "Failed to open billing portal. Please try again.",
      );
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Manage Subscription"
      size="lg"
    >
      <div className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-red-900/30 border border-red-800 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Current Plan Info */}
        <div className="p-4 bg-surface-elevated rounded-lg border border-surface-border">
          <p className="text-sm text-gray-400">
            <span className="font-medium">Current plan:</span>{" "}
            {isPro ? "Pro" : "Free"}
          </p>
          {patient?.subscriptionStatus === "trialing" && (
            <p className="text-sm text-blue-600 mt-1">
              You are currently on a free trial.
            </p>
          )}
        </div>

        {/* Plans */}
        <div className="space-y-3">
          {plans.map((plan) => {
            const isCurrentPlan =
              (plan.id === "free" && !isPro) ||
              (plan.id.startsWith("pro") && isPro);

            return (
              <div
                key={plan.id}
                className={`p-4 rounded-lg border ${
                  isCurrentPlan
                    ? "border-primary-300 bg-primary-500/20"
                    : "border-surface-border bg-surface-card"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center">
                      <h3 className="font-medium text-gray-100">{plan.name}</h3>
                      {isCurrentPlan && (
                        <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full bg-primary-500/20 text-primary-400">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400 mt-1">
                      {plan.price === 0 ? (
                        "Free forever"
                      ) : (
                        <>
                          ${plan.price}/{plan.interval}
                        </>
                      )}
                    </p>
                    <ul className="mt-2 space-y-1">
                      {plan.features.map((feature) => (
                        <li
                          key={feature}
                          className="text-xs text-gray-500 flex items-center"
                        >
                          <svg
                            className="w-3 h-3 text-green-500 mr-1.5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    {!isCurrentPlan && plan.priceId && (
                      <button
                        onClick={() => handleUpgrade(plan.priceId)}
                        disabled={isLoading}
                        className="px-4 py-2 text-sm font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-400 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? "Loading..." : "Upgrade"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Manage Billing Button (for existing subscribers) */}
        {isPro && (
          <div className="pt-2 border-t border-surface-border">
            <button
              onClick={handleManageBilling}
              disabled={isLoading}
              className="w-full py-2 px-4 text-sm font-medium text-gray-300 bg-surface-card border border-surface-border rounded-lg hover:bg-surface-elevated disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Loading..." : "Manage Billing & Invoices"}
            </button>
            <p className="mt-2 text-xs text-center text-gray-500">
              Update payment method, view invoices, or cancel subscription
            </p>
          </div>
        )}

        {/* Close Button */}
        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-2 px-4 text-sm font-medium text-gray-300 bg-surface-card border border-surface-border rounded-lg hover:bg-surface-elevated"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
