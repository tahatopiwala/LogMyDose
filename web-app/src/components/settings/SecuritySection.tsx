import { useState } from "react";
import { ChangePasswordModal } from "./ChangePasswordModal";

export function SecuritySection() {
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  return (
    <>
      <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Security</h2>

        <div>
          <label className="block text-sm font-medium text-gray-500">
            Password
          </label>
          <div className="mt-1 flex items-center justify-between">
            <p className="text-gray-900">••••••••••••</p>
            <button
              onClick={() => setIsChangePasswordOpen(true)}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
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
