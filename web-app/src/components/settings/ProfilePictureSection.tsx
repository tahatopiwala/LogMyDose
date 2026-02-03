import { useAuth } from "@/hooks/useAuth";

export function ProfilePictureSection() {
  const { patient } = useAuth();

  // Generate initials from patient name or email
  const initials = patient
    ? `${patient.firstName?.[0] || ""}${patient.lastName?.[0] || ""}`.toUpperCase() ||
      patient.email[0].toUpperCase()
    : "U";

  return (
    <div className="bg-surface-card rounded-xl p-5 border border-surface-border">
      <h2 className="text-lg font-semibold text-gray-100 mb-4">
        Profile Picture
      </h2>

      <div className="flex flex-col items-center py-4">
        {/* Current avatar with initials */}
        <div className="w-24 h-24 bg-primary-500/20 rounded-full flex items-center justify-center mb-4">
          <span className="text-primary-400 font-semibold text-2xl">
            {initials}
          </span>
        </div>

        {/* Coming Soon placeholder */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-surface-elevated rounded-full mb-3">
            <svg
              className="w-6 h-6 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <p className="text-sm font-medium text-gray-100">Coming Soon</p>
          <p className="text-xs text-gray-400 mt-1">
            Profile picture upload will be available in a future update.
          </p>
        </div>
      </div>
    </div>
  );
}
