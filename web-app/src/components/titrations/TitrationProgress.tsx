import {
  TitrationProgress as TitrationProgressType,
  TitrationPhaseStatus,
} from "@/types/domain";

interface TitrationProgressCardProps {
  progress: TitrationProgressType;
  substanceName: string;
}

const STATUS_COLORS = {
  active: "bg-primary-500",
  completed: "bg-green-500",
  skipped: "bg-gray-500",
};

export function TitrationProgressCard({
  progress,
  substanceName,
}: TitrationProgressCardProps) {
  const { currentPhase, phases, progressPercent, isAtMaintenance } = progress;

  return (
    <div className="bg-surface-card rounded-xl p-5 border border-surface-border">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <div>
          <h3 className="text-lg font-semibold text-gray-100">
            {substanceName} Titration
          </h3>
          <p className="text-sm text-gray-500">
            Phase {currentPhase?.phaseNumber || 0} of {progress.totalPhases}
          </p>
        </div>
        <TitrationStatusBadge isAtMaintenance={isAtMaintenance} compact />
      </div>

      {/* Current Dose */}
      <div className="bg-surface-elevated rounded-xl p-4 mb-5">
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
          Current Dose
        </p>
        <p className="text-3xl font-bold text-primary-500">
          {progress.currentDose}
          <span className="text-lg text-gray-400 ml-1">{progress.doseUnit}</span>
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Target: {progress.targetDose} {progress.doseUnit}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-5">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-400">Progress to Target</span>
          <span className="text-sm font-semibold text-gray-300">
            {Math.round(progressPercent)}%
          </span>
        </div>
        <div className="h-3 bg-surface-elevated rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-500 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Phase Timeline */}
      <div>
        <h4 className="text-sm font-semibold text-gray-400 mb-3">
          Dose Schedule
        </h4>
        <div className="space-y-1">
          {phases.map((phase, index) => (
            <PhaseRow
              key={phase.id}
              phase={phase}
              isActive={phase.status === "active"}
              isLast={index === phases.length - 1}
            />
          ))}
        </div>
      </div>

      {/* Next Phase Info */}
      {currentPhase && !isAtMaintenance && progress.nextPhaseDate && (
        <div className="mt-5 pt-5 border-t border-surface-border">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>
              {progress.weeksRemainingInPhase} week
              {progress.weeksRemainingInPhase !== 1 ? "s" : ""} remaining at
              current dose
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

interface PhaseRowProps {
  phase: {
    id: string;
    phaseNumber: number;
    doseAmount: number | string;
    doseUnit: string;
    weeksAtDose: number;
    status: TitrationPhaseStatus;
    isMaintenancePhase: boolean;
  };
  isActive: boolean;
  isLast: boolean;
}

function PhaseRow({ phase, isActive, isLast }: PhaseRowProps) {
  const statusColor = STATUS_COLORS[phase.status];

  return (
    <div className="flex items-center">
      {/* Status indicator */}
      <div className="flex flex-col items-center mr-3">
        <div
          className={`w-4 h-4 rounded-full flex items-center justify-center ${
            isActive ? "bg-primary-500" : statusColor
          } ${phase.status === "completed" ? "opacity-100" : "opacity-50"}`}
        >
          {phase.status === "completed" && (
            <svg
              className="w-2.5 h-2.5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </div>
        {!isLast && (
          <div
            className={`w-0.5 h-6 ${
              phase.status === "completed" ? "bg-green-500" : "bg-surface-border"
            }`}
          />
        )}
      </div>

      {/* Phase info */}
      <div
        className={`flex-1 flex justify-between items-center py-1 ${
          isActive ? "opacity-100" : "opacity-60"
        }`}
      >
        <div>
          <span
            className={`font-medium ${
              isActive ? "text-gray-100" : "text-gray-400"
            }`}
          >
            {Number(phase.doseAmount)} {phase.doseUnit}
          </span>
          {phase.isMaintenancePhase && (
            <span className="text-green-400 ml-2">(Maintenance)</span>
          )}
        </div>
        <span className="text-sm text-gray-500">
          {phase.weeksAtDose} week{phase.weeksAtDose !== 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
}

interface TitrationStatusBadgeProps {
  isAtMaintenance: boolean;
  compact?: boolean;
}

export function TitrationStatusBadge({
  isAtMaintenance,
  compact = false,
}: TitrationStatusBadgeProps) {
  if (compact) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold border ${
          isAtMaintenance
            ? "bg-green-500/20 text-green-400 border-green-500/30"
            : "bg-primary-500/20 text-primary-400 border-primary-500/30"
        }`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            isAtMaintenance ? "bg-green-500" : "bg-primary-500"
          }`}
        />
        {isAtMaintenance ? "MAINT" : "TITRATING"}
      </span>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border ${
        isAtMaintenance
          ? "bg-green-500/20 border-green-500/30"
          : "bg-primary-500/20 border-primary-500/30"
      }`}
    >
      <svg
        className={`w-5 h-5 ${
          isAtMaintenance ? "text-green-400" : "text-primary-400"
        }`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        {isAtMaintenance ? (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        ) : (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
        )}
      </svg>
      <span
        className={`font-semibold ${
          isAtMaintenance ? "text-green-400" : "text-primary-400"
        }`}
      >
        {isAtMaintenance ? "At Maintenance" : "Titrating"}
      </span>
    </div>
  );
}

interface TitrationListItemProps {
  progress: TitrationProgressType;
  substanceName: string;
  onClick?: () => void;
}

export function TitrationListItem({
  progress,
  substanceName,
  onClick,
}: TitrationListItemProps) {
  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-lg border bg-surface-card border-surface-border ${
        onClick ? "cursor-pointer hover:bg-surface-hover transition-colors" : ""
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <h4 className="font-medium text-gray-100">{substanceName}</h4>
          <span className="text-xs text-gray-500">
            Phase {progress.currentPhase?.phaseNumber || 0} of{" "}
            {progress.totalPhases}
          </span>
        </div>
        <TitrationStatusBadge isAtMaintenance={progress.isAtMaintenance} compact />
      </div>

      <div className="flex items-center gap-4 text-sm text-gray-400">
        <span>
          {progress.currentDose} {progress.doseUnit}
        </span>
        <span>•</span>
        <span>Target: {progress.targetDose} {progress.doseUnit}</span>
        <span>•</span>
        <span>{Math.round(progress.progressPercent)}% complete</span>
      </div>

      {/* Mini progress bar */}
      <div className="mt-3 h-1.5 bg-surface-elevated rounded-full overflow-hidden">
        <div
          className="h-full bg-primary-500 rounded-full"
          style={{ width: `${progress.progressPercent}%` }}
        />
      </div>
    </div>
  );
}
