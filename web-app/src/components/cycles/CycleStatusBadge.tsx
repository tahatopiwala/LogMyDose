import { CycleStatus } from "@/types/domain";

interface CycleStatusBadgeProps {
  status: CycleStatus;
  currentWeek?: number;
  totalWeeks?: number;
  compact?: boolean;
}

const STATUS_CONFIG = {
  on: {
    label: "ON",
    bgColor: "bg-green-500/20",
    textColor: "text-green-400",
    borderColor: "border-green-500/30",
    dotColor: "bg-green-500",
  },
  off: {
    label: "OFF",
    bgColor: "bg-amber-500/20",
    textColor: "text-amber-400",
    borderColor: "border-amber-500/30",
    dotColor: "bg-amber-500",
  },
  completed: {
    label: "DONE",
    bgColor: "bg-gray-500/20",
    textColor: "text-gray-400",
    borderColor: "border-gray-500/30",
    dotColor: "bg-gray-500",
  },
};

export function CycleStatusBadge({
  status,
  currentWeek,
  totalWeeks,
  compact = false,
}: CycleStatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  if (compact) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold ${config.bgColor} ${config.textColor} border ${config.borderColor}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`} />
        {config.label}
      </span>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg ${config.bgColor} border ${config.borderColor}`}
    >
      <span className={`w-2 h-2 rounded-full ${config.dotColor}`} />
      <div>
        <span className={`font-semibold ${config.textColor}`}>
          {status === "on" ? "On Cycle" : status === "off" ? "Off Cycle" : "Completed"}
        </span>
        {currentWeek !== undefined && totalWeeks !== undefined && status !== "completed" && (
          <span className="text-xs text-gray-500 ml-2">
            Week {currentWeek} of {totalWeeks}
          </span>
        )}
      </div>
    </div>
  );
}
