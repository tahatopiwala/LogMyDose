import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { EditNameModal } from "./EditNameModal";
import { ChangeEmailModal } from "./ChangeEmailModal";

export function AccountSection() {
  const { patient } = useAuth();
  const [isEditNameOpen, setIsEditNameOpen] = useState(false);
  const [isChangeEmailOpen, setIsChangeEmailOpen] = useState(false);

  const fullName =
    patient?.firstName || patient?.lastName
      ? `${patient?.firstName || ""} ${patient?.lastName || ""}`.trim()
      : "Not set";

  return (
    <>
      <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Account Information
          </h2>
          <button
            onClick={() => setIsEditNameOpen(true)}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Edit
          </button>
        </div>

        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-500">
              Name
            </label>
            <p className="mt-1 text-gray-900">{fullName}</p>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-500">
              Email
            </label>
            <div className="mt-1 flex items-center justify-between">
              <p className="text-gray-900">{patient?.email}</p>
              <button
                onClick={() => setIsChangeEmailOpen(true)}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                Change Email
              </button>
            </div>
          </div>
        </div>
      </div>

      <EditNameModal
        isOpen={isEditNameOpen}
        onClose={() => setIsEditNameOpen(false)}
      />

      <ChangeEmailModal
        isOpen={isChangeEmailOpen}
        onClose={() => setIsChangeEmailOpen(false)}
      />
    </>
  );
}
