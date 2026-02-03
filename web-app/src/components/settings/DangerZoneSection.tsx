import { useState } from "react";
import { DeleteAccountModal } from "./DeleteAccountModal";

export function DangerZoneSection() {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <>
      <div className="bg-surface-card rounded-xl p-5 border border-red-800 shadow-sm">
        <h2 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h2>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-100">
              Delete Account
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Permanently delete your account and all associated data. This
              action cannot be undone.
            </p>
          </div>

          <button
            onClick={() => setIsDeleteOpen(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
          >
            Delete Account
          </button>
        </div>
      </div>

      <DeleteAccountModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
      />
    </>
  );
}
