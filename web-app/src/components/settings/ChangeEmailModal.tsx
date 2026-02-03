import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { useAuth } from "@/hooks/useAuth";
import { apiClient } from "@/lib/api-client";
import { ApiError } from "@/types/auth";

interface ChangeEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChangeEmailModal({ isOpen, onClose }: ChangeEmailModalProps) {
  const { patient } = useAuth();
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setIsSubmitting(true);

    try {
      await apiClient.post("/settings/email", {
        newEmail,
        currentPassword,
      });

      setSuccess(true);
      setNewEmail("");
      setCurrentPassword("");
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.error || "Failed to update email. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setNewEmail("");
    setCurrentPassword("");
    setError(null);
    setSuccess(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Change Email">
      {success ? (
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-green-50 border border-green-800">
            <div className="flex items-start">
              <svg
                className="w-5 h-5 text-green-500 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-400">
                  Verification email sent!
                </p>
                <p className="mt-1 text-sm text-green-400">
                  We've sent a verification link to your new email address.
                  Please check your inbox and click the link to complete the
                  change.
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-full py-2 px-4 border border-surface-border rounded-lg text-sm font-medium text-gray-300 hover:bg-surface-elevated"
          >
            Close
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-900/30 border border-red-800 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="p-3 rounded-lg bg-surface-elevated border border-surface-border">
            <p className="text-sm text-gray-400">
              <span className="font-medium">Current email:</span>{" "}
              {patient?.email}
            </p>
          </div>

          <div>
            <label
              htmlFor="newEmail"
              className="block text-sm font-medium text-gray-300"
            >
              New Email Address
            </label>
            <input
              id="newEmail"
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              disabled={isSubmitting}
              required
              className="mt-1 appearance-none block w-full px-3 py-2 border border-surface-border rounded-lg bg-surface-raised text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 disabled:bg-surface-elevated disabled:cursor-not-allowed"
              placeholder="Enter new email address"
            />
          </div>

          <div>
            <label
              htmlFor="currentPassword"
              className="block text-sm font-medium text-gray-300"
            >
              Current Password
            </label>
            <input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              disabled={isSubmitting}
              required
              className="mt-1 appearance-none block w-full px-3 py-2 border border-surface-border rounded-lg bg-surface-raised text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 disabled:bg-surface-elevated disabled:cursor-not-allowed"
              placeholder="Enter your current password"
            />
            <p className="mt-1 text-xs text-gray-500">
              We need your password to verify this request.
            </p>
          </div>

          <div className="flex space-x-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 py-2 px-4 border border-surface-border rounded-lg text-sm font-medium text-gray-300 hover:bg-surface-elevated disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-500 hover:bg-primary-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Sending..." : "Update Email"}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
