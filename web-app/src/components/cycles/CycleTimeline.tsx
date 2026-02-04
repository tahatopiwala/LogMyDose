import { CyclePhaseInfo } from "@/types/domain";
import { CycleStatusBadge } from "./CycleStatusBadge";

interface CycleTimelineProps {
  phaseInfo: CyclePhaseInfo;
  onWeeks: number;
  offWeeks: number;
  cycleNumber: number;
}

export function CycleTimeline({
  phaseInfo,
  onWeeks,
  offWeeks,
  cycleNumber,
}: CycleTimelineProps) {
  const totalWeeks = onWeeks + offWeeks;
  const currentWeekInCycle = ((phaseInfo.currentWeek - 1) % totalWeeks) + 1;
  const isOnPhase = currentWeekInCycle <= onWeeks;

  // Calculate progress percentage
  const progressPercent = (currentWeekInCycle / totalWeeks) * 100;
  const onPhasePercent = (onWeeks / totalWeeks) * 100;

  return (
    <div className="bg-surface-card rounded-xl p-5 border border-surface-border">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-100">
            Cycle #{cycleNumber}
          </h3>
          <p className="text-sm text-gray-500">
            Week {currentWeekInCycle} of {totalWeeks}
          </p>
        </div>
        <CycleStatusBadge status={phaseInfo.status} compact />
      </div>

      {/* Progress bar */}
      <div className="relative h-4 bg-surface-elevated rounded-full overflow-hidden mb-4">
        {/* On phase background */}
        <div
          className="absolute h-full bg-green-500/20"
          style={{ width: `${onPhasePercent}%` }}
        />
        {/* Off phase background */}
        <div
          className="absolute h-full bg-amber-500/20 right-0"
          style={{ width: `${100 - onPhasePercent}%` }}
        />
        {/* Progress indicator */}
        <div
          className={`absolute h-full ${isOnPhase ? "bg-green-500" : "bg-amber-500"} rounded-full transition-all duration-300`}
          style={{ width: `${progressPercent}%` }}
        />
        {/* Phase divider */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-surface-border"
          style={{ left: `${onPhasePercent}%` }}
        />
      </div>

      {/* Phase labels */}
      <div className="flex justify-between text-xs text-gray-500 mb-4">
        <span>Start</span>
        <span style={{ marginLeft: `${onPhasePercent - 10}%` }}>
          On → Off
        </span>
        <span>End</span>
      </div>

      {/* Phase breakdown */}
      <div className="grid grid-cols-2 gap-3">
        <div className={`p-3 rounded-lg border ${
          isOnPhase
            ? "bg-green-500/10 border-green-500/30"
            : "bg-surface-elevated border-surface-border"
        }`}>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <span className={`text-xs font-medium ${isOnPhase ? "text-green-400" : "text-gray-500"}`}>
              ON PHASE
            </span>
          </div>
          <p className="text-gray-100 font-semibold">{onWeeks} weeks</p>
          {isOnPhase && (
            <p className="text-xs text-gray-500 mt-1">
              {phaseInfo.weeksRemaining} weeks remaining
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg border ${
          !isOnPhase && phaseInfo.status !== "completed"
            ? "bg-amber-500/10 border-amber-500/30"
            : "bg-surface-elevated border-surface-border"
        }`}>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span className={`text-xs font-medium ${!isOnPhase && phaseInfo.status !== "completed" ? "text-amber-400" : "text-gray-500"}`}>
              OFF PHASE
            </span>
          </div>
          <p className="text-gray-100 font-semibold">{offWeeks} weeks</p>
          {!isOnPhase && phaseInfo.status !== "completed" && (
            <p className="text-xs text-gray-500 mt-1">
              {phaseInfo.weeksRemaining} weeks remaining
            </p>
          )}
        </div>
      </div>

      {/* Next phase info */}
      {phaseInfo.nextPhaseDate && phaseInfo.status !== "completed" && (
        <div className="mt-4 pt-4 border-t border-surface-border">
          <p className="text-sm text-gray-400">
            {isOnPhase ? "Off phase" : "Next cycle"} starts:{" "}
            <span className="text-gray-200">
              {new Date(phaseInfo.phaseEndDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}

interface CycleListItemProps {
  cycle: {
    id: string;
    cycleNumber: number;
    status: "on" | "off" | "completed";
    currentWeek: number;
    onWeeks: number;
    offWeeks: number;
    startDate: string;
    endDate: string | null;
    protocolSubstance: {
      substance: {
        name: string;
      };
    };
  };
  onClick?: () => void;
}

export function CycleListItem({ cycle, onClick }: CycleListItemProps) {
  const totalWeeks = cycle.onWeeks + cycle.offWeeks;

  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-lg border bg-surface-card border-surface-border ${
        onClick ? "cursor-pointer hover:bg-surface-hover transition-colors" : ""
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <h4 className="font-medium text-gray-100">
            {cycle.protocolSubstance.substance.name}
          </h4>
          <span className="text-xs text-gray-500">
            Cycle #{cycle.cycleNumber}
          </span>
        </div>
        <CycleStatusBadge status={cycle.status} compact />
      </div>

      {cycle.status !== "completed" && (
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <span>Week {cycle.currentWeek} of {totalWeeks}</span>
          <span>•</span>
          <span>{cycle.onWeeks}w on / {cycle.offWeeks}w off</span>
        </div>
      )}

      {cycle.status === "completed" && cycle.endDate && (
        <p className="text-sm text-gray-500">
          Completed {new Date(cycle.endDate).toLocaleDateString()}
        </p>
      )}
    </div>
  );
}
