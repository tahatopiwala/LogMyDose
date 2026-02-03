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
      <div className="bg-surface-card rounded-xl p-5 border border-surface-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-100">
            Account Information
          </h2>
          <button
            onClick={() => setIsEditNameOpen(true)}
            className="text-sm text-primary-500 hover:text-primary-400 font-medium"
          >
            Edit
          </button>
        </div>

        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-400">
              Name
            </label>
            <p className="mt-1 text-gray-100">{fullName}</p>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-400">
              Email
            </label>
            <div className="mt-1 flex items-center justify-between">
              <p className="text-gray-100">{patient?.email}</p>
              <button
                onClick={() => setIsChangeEmailOpen(true)}
                className="text-sm text-primary-500 hover:text-primary-400 font-medium"
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
