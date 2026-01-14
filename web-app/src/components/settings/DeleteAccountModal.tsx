import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { useAuth } from "@/hooks/useAuth";
import { apiClient } from "@/lib/api-client";
import { ApiError } from "@/types/auth";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DeleteAccountModal({
  isOpen,
  onClose,
}: DeleteAccountModalProps) {
  const { logout } = useAuth();
  const [password, setPassword] = useState("");
  const [confirmChecked, setConfirmChecked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canDelete = password.length > 0 && confirmChecked;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!canDelete) {
      return;
    }

    setIsSubmitting(true);

    try {
      await apiClient.delete("/settings/account", { password });

      // Log out and redirect
      await logout();
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.error || "Failed to delete account. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setPassword("");
    setConfirmChecked(false);
    setError(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Delete Account">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Warning */}
        <div className="p-4 rounded-lg bg-red-50 border border-red-200">
          <div className="flex items-start">
            <svg
              className="w-5 h-5 text-red-500 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                This action is irreversible
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>Deleting your account will:</p>
                <ul className="mt-1 list-disc list-inside space-y-1">
                  <li>Permanently delete all your data</li>
                  <li>Cancel any active subscriptions</li>
                  <li>Remove your dose history and protocols</li>
                  <li>Log you out of all devices</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Password Confirmation */}
        <div>
          <label
            htmlFor="deletePassword"
            className="block text-sm font-medium text-gray-700"
          >
            Enter your password to confirm
          </label>
          <input
            id="deletePassword"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isSubmitting}
            required
            className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="Enter your password"
          />
        </div>

        {/* Confirmation Checkbox */}
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="confirmDelete"
              type="checkbox"
              checked={confirmChecked}
              onChange={(e) => setConfirmChecked(e.target.checked)}
              disabled={isSubmitting}
              className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
            />
          </div>
          <div className="ml-3">
            <label htmlFor="confirmDelete" className="text-sm text-gray-700">
              I understand that this action cannot be undone and all my data
              will be permanently deleted.
            </label>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex space-x-3 pt-2">
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!canDelete || isSubmitting}
            className="flex-1 py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Deleting..." : "Delete Account"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
