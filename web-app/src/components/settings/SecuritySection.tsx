import { useState } from "react";
import { ChangePasswordModal } from "./ChangePasswordModal";

export function SecuritySection() {
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  return (
    <>
      <div className="bg-surface-card rounded-xl p-5 border border-surface-border">
        <h2 className="text-lg font-semibold text-gray-100 mb-4">Security</h2>

        <div>
          <label className="block text-sm font-medium text-gray-400">
            Password
          </label>
          <div className="mt-1 flex items-center justify-between">
            <p className="text-gray-100">••••••••••••</p>
            <button
              onClick={() => setIsChangePasswordOpen(true)}
              className="text-sm text-primary-500 hover:text-primary-400 font-medium"
            >
              Change Password
            </button>
          </div>
        </div>
      </div>

      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />
    </>
  );
}
