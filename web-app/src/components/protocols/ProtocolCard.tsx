import { Link } from "react-router-dom";
import { Protocol, Dose } from "@/types/domain";

interface ProtocolCardProps {
  protocol: Protocol;
  doses?: Dose[];
  inactive?: boolean;
}

interface ProtocolStats {
  adherenceRate: number;
  totalDoses: number;
  takenDoses: number;
  nextDoseTime: string | null;
  nextDoseSubstance: string | null;
}

function calculateProtocolStats(
  protocol: Protocol,
  doses: Dose[] = [],
): ProtocolStats {
  // Filter doses for this protocol
  const protocolDoses = doses.filter((d) =>
    protocol.substances.some((ps) => ps.substanceId === d.substanceId),
  );

  const totalDoses = protocolDoses.length;
  const takenDoses = protocolDoses.filter((d) => d.status === "taken").length;
  const adherenceRate =
    totalDoses > 0 ? Math.round((takenDoses / totalDoses) * 100) : 0;

  // Calculate next dose based on frequency
  const now = new Date();
  let nextDoseTime: string | null = null;
  let nextDoseSubstance: string | null = null;

  // Find upcoming scheduled doses
  const upcomingDoses = protocolDoses
    .filter((d) => d.scheduledAt && new Date(d.scheduledAt) > now)
    .sort(
      (a, b) =>
        new Date(a.scheduledAt!).getTime() - new Date(b.scheduledAt!).getTime(),
    );

  if (upcomingDoses.length > 0) {
    const nextDose = upcomingDoses[0];
    nextDoseSubstance = nextDose.substance.name;
    nextDoseTime = formatNextDoseTime(new Date(nextDose.scheduledAt!));
  } else {
    // Estimate next dose based on frequency if no scheduled doses
    const lastDose = protocolDoses
      .filter((d) => d.status === "taken")
      .sort(
        (a, b) =>
          new Date(b.loggedAt).getTime() - new Date(a.loggedAt).getTime(),
      )[0];

    if (lastDose && protocol.substances.length > 0) {
      const substance = protocol.substances.find(
        (ps) => ps.substanceId === lastDose.substanceId,
      );
      if (substance?.frequency) {
        const nextTime = estimateNextDose(
          new Date(lastDose.loggedAt),
          substance.frequency,
        );
        if (nextTime && nextTime > now) {
          nextDoseTime = formatNextDoseTime(nextTime);
          nextDoseSubstance = lastDose.substance.name;
        }
      }
    }
  }

  return {
    adherenceRate,
    totalDoses,
    takenDoses,
    nextDoseTime,
    nextDoseSubstance,
  };
}

function estimateNextDose(lastDoseDate: Date, frequency: string): Date | null {
  const freq = frequency.toLowerCase();
  const nextDate = new Date(lastDoseDate);

  if (freq.includes("daily") || freq.includes("qd")) {
    nextDate.setDate(nextDate.getDate() + 1);
  } else if (freq.includes("twice") || freq.includes("bid")) {
    nextDate.setHours(nextDate.getHours() + 12);
  } else if (freq.includes("weekly")) {
    nextDate.setDate(nextDate.getDate() + 7);
  } else if (freq.includes("every_other_day")) {
    nextDate.setDate(nextDate.getDate() + 2);
  } else {
    return null;
  }

  return nextDate;
}

function formatNextDoseTime(date: Date): string {
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  if (diffHours > 48) {
    const days = Math.floor(diffHours / 24);
    return `in ${days} day${days > 1 ? "s" : ""}`;
  }
  if (diffHours > 24) {
    return "tomorrow";
  }
  if (diffHours > 0) {
    return `in ${diffHours}h ${diffMins}m`;
  }
  if (diffMins > 0) {
    return `in ${diffMins}m`;
  }
  return "now";
}

function formatDate(dateStr: string | null): string | null {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function ProtocolCard({
  protocol,
  doses = [],
  inactive = false,
}: ProtocolCardProps) {
  const substanceNames = protocol.substances
    .map((s) => s.substance.name)
    .join(", ");

  const statusColors: Record<string, string> = {
    active: "bg-green-900/40 text-green-400 border-green-800",
    paused: "bg-amber-900/40 text-amber-400 border-amber-800",
    completed: "bg-surface-elevated text-gray-400 border-surface-border",
    draft: "bg-blue-900/40 text-blue-400 border-blue-800",
    archived: "bg-surface-elevated text-gray-500 border-surface-border",
  };

  const stats = calculateProtocolStats(protocol, doses);

  // Generate protocol summary
  const summary = protocol.substances
    .map((ps) => {
      const freq = ps.frequency?.replace("_", " ") || "as needed";
      return `${ps.substance.name}: ${ps.dose}${ps.doseUnit || ps.substance.doseUnit || ""} ${freq}`;
    })
    .join(" • ");

  return (
    <Link
      to={`/protocols/${protocol.id}`}
      className={`block bg-surface-card rounded-xl p-5 border border-surface-border hover:border-primary-500/50 hover:shadow-lg hover:shadow-primary-500/10 transition-all ${inactive ? "opacity-70" : ""}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-lg text-gray-100">
              {protocol.template?.name || "Custom Protocol"}
            </h3>
            <span
              className={`px-2.5 py-0.5 text-xs font-medium rounded-full border ${statusColors[protocol.status]}`}
            >
              {protocol.status}
            </span>
          </div>
          <p className="text-sm text-gray-400">{substanceNames}</p>
        </div>
        <svg
          className="w-5 h-5 text-gray-500 flex-shrink-0 ml-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>

      {/* Summary */}
      <div className="mb-4 p-3 bg-surface-elevated rounded-lg">
        <p className="text-xs font-medium text-gray-400 mb-1">Summary</p>
        <p className="text-sm text-gray-300 leading-relaxed">{summary}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Consistency */}
        <div className="p-3 bg-blue-900/30 rounded-lg border border-blue-800/50">
          <div className="flex items-center gap-2 mb-1">
            <svg
              className="w-4 h-4 text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <p className="text-xs font-medium text-blue-300">Consistency</p>
          </div>
          <p className="text-2xl font-bold text-blue-300">
            {stats.adherenceRate}%
          </p>
          {stats.totalDoses > 0 && (
            <p className="text-xs text-blue-400 mt-0.5">
              {stats.takenDoses}/{stats.totalDoses} doses
            </p>
          )}
        </div>

        {/* Next Dose */}
        <div className="p-3 bg-purple-900/30 rounded-lg border border-purple-800/50">
          <div className="flex items-center gap-2 mb-1">
            <svg
              className="w-4 h-4 text-purple-400"
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
            <p className="text-xs font-medium text-purple-300">Next Dose</p>
          </div>
          {stats.nextDoseTime ? (
            <>
              <p className="text-2xl font-bold text-purple-300">
                {stats.nextDoseTime}
              </p>
              {stats.nextDoseSubstance && (
                <p className="text-xs text-purple-400 mt-0.5 truncate">
                  {stats.nextDoseSubstance}
                </p>
              )}
            </>
          ) : (
            <p className="text-sm font-semibold text-purple-500 mt-1">
              Not scheduled
            </p>
          )}
        </div>
      </div>

      {/* Date Range */}
      {protocol.startDate && (
        <div className="mt-3 pt-3 border-t border-surface-border">
          <p className="text-xs text-gray-400">
            Started {formatDate(protocol.startDate)}
            {protocol.endDate && ` • Ends ${formatDate(protocol.endDate)}`}
          </p>
        </div>
      )}
    </Link>
  );
}
