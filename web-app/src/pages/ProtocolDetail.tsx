import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { apiClient } from "@/lib/api-client";
import {
  Protocol,
  Dose,
  CycleWithSubstance,
  TitrationProgress,
} from "@/types/domain";
import { useUpdateProtocol, useArchiveProtocol } from "@/hooks/useProtocols";
import { ArchiveProtocolModal } from "@/components/protocols/ArchiveProtocolModal";
import { CycleStatusBadge } from "@/components/cycles";
import { TitrationProgressCard } from "@/components/titrations";

interface ProtocolStats {
  adherenceRate: number;
  totalDoses: number;
  expectedDoses: number;
  takenDoses: number;
  nextDoseTime: string | null;
  nextDoseSubstance: string | null;
}

function getDosesPerDay(frequency: string): number {
  const freq = frequency.toLowerCase();
  if (freq.includes("3x_daily") || freq.includes("tid")) return 3;
  if (freq.includes("twice") || freq.includes("bid") || freq.includes("2x_daily")) return 2;
  if (freq.includes("daily") || freq.includes("qd")) return 1;
  if (freq.includes("every_other_day") || freq.includes("eod")) return 0.5;
  if (freq.includes("5x_weekly")) return 5 / 7;
  if (freq.includes("3x_weekly") || freq.includes("tiw")) return 3 / 7;
  if (freq.includes("2x_weekly") || freq.includes("biw")) return 2 / 7;
  if (freq.includes("weekly") || freq.includes("qw")) return 1 / 7;
  if (freq.includes("biweekly") || freq.includes("every_2_weeks")) return 1 / 14;
  if (freq.includes("monthly")) return 1 / 30;
  return 0;
}

function calculateExpectedDosesForProtocol(protocol: Protocol): number {
  if (!protocol.startDate) return 0;

  const now = new Date();
  const protocolStart = new Date(protocol.startDate);
  if (protocolStart > now) return 0;

  const protocolEnd = protocol.endDate ? new Date(protocol.endDate) : null;
  const effectiveEnd = protocolEnd
    ? new Date(Math.min(protocolEnd.getTime(), now.getTime()))
    : now;

  const startDay = new Date(protocolStart);
  startDay.setHours(0, 0, 0, 0);
  const endDay = new Date(effectiveEnd);
  endDay.setHours(0, 0, 0, 0);

  const daysDiff =
    Math.round((endDay.getTime() - startDay.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  let totalExpected = 0;
  for (const ps of protocol.substances) {
    if (!ps.frequency) continue;
    const dosesPerDay = getDosesPerDay(ps.frequency);
    totalExpected += dosesPerDay * daysDiff;
  }

  return Math.round(totalExpected);
}

function calculateProtocolStats(
  protocol: Protocol,
  doses: Dose[] = [],
): ProtocolStats {
  const protocolDoses = doses.filter((d) =>
    protocol.substances.some((ps) => ps.substanceId === d.substanceId),
  );

  const totalDoses = protocolDoses.length;
  const takenDoses = protocolDoses.filter((d) => d.status === "taken").length;
  const expectedDoses = calculateExpectedDosesForProtocol(protocol);

  // Use expected doses as denominator when available, fallback to logged doses
  const denominator = expectedDoses > 0 ? expectedDoses : totalDoses;
  const adherenceRate =
    denominator > 0 ? Math.min(100, Math.round((takenDoses / denominator) * 100)) : 0;

  const now = new Date();
  let nextDoseTime: string | null = null;
  let nextDoseSubstance: string | null = null;

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
        if (nextTime) {
          nextDoseTime =
            nextTime > now ? formatNextDoseTime(nextTime) : "due now";
          nextDoseSubstance = lastDose.substance.name;
        }
      }
    }
  }

  // If no doses logged at all but protocol has substances with frequencies, it's due now
  if (!nextDoseTime) {
    const substanceWithFreq = protocol.substances.find((ps) => ps.frequency);
    if (substanceWithFreq) {
      nextDoseTime = "due now";
      nextDoseSubstance = substanceWithFreq.substance.name;
    }
  }

  return {
    adherenceRate,
    totalDoses,
    expectedDoses,
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
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function ProtocolDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [protocol, setProtocol] = useState<Protocol | null>(null);
  const [doses, setDoses] = useState<Dose[]>([]);
  const [cycles, setCycles] = useState<CycleWithSubstance[]>([]);
  const [titrationProgress, setTitrationProgress] = useState<
    Record<string, TitrationProgress>
  >({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showArchiveModal, setShowArchiveModal] = useState(false);

  const updateProtocol = useUpdateProtocol();
  const archiveProtocol = useArchiveProtocol();

  console.log("ProtocolDetail component mounted with ID:", id);

  useEffect(() => {
    async function fetchProtocolData() {
      if (!id) {
        console.error("No protocol ID provided");
        setError("No protocol ID provided");
        setLoading(false);
        return;
      }

      console.log("Fetching protocol:", id);

      try {
        const [protocolRes, dosesRes, cyclesRes] = await Promise.all([
          apiClient.get<{ protocol: Protocol }>(`/protocols/${id}`),
          apiClient.get<{ doses: Dose[] }>("/doses?limit=100"),
          apiClient.get<{ cycles: CycleWithSubstance[] }>("/cycles/active"),
        ]);

        console.log("Protocol data:", protocolRes.protocol);
        setProtocol(protocolRes.protocol);
        setDoses(dosesRes.doses);

        // Filter cycles for this protocol's substances
        const protocolSubstanceIds = protocolRes.protocol.substances.map(
          (s) => s.id,
        );
        const protocolCycles = (cyclesRes.cycles || []).filter((c) =>
          protocolSubstanceIds.includes(c.protocolSubstanceId),
        );
        setCycles(protocolCycles);

        // Fetch titration progress for each substance that might have titrations
        const titrationPromises = protocolRes.protocol.substances.map(
          async (ps) => {
            try {
              const res = await apiClient.get<{ progress: TitrationProgress }>(
                `/titrations/progress/${ps.id}`,
              );
              return { id: ps.id, progress: res.progress };
            } catch {
              return null;
            }
          },
        );

        const titrationResults = await Promise.all(titrationPromises);
        const titrationMap: Record<string, TitrationProgress> = {};
        titrationResults.forEach((result) => {
          if (result && result.progress && result.progress.phases.length > 0) {
            titrationMap[result.id] = result.progress;
          }
        });
        setTitrationProgress(titrationMap);
      } catch (err) {
        console.error("Error fetching protocol:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load protocol",
        );
      } finally {
        setLoading(false);
      }
    }

    fetchProtocolData();
  }, [id]);

  const handlePauseProtocol = () => {
    if (!protocol || !id) return;

    const confirmed = window.confirm(
      "Pausing this protocol will stop scheduled reminders and exclude it from dose logging. You can resume it at any time.\n\nAre you sure you want to pause this protocol?",
    );

    if (confirmed) {
      updateProtocol.mutate(
        { id, status: "paused" },
        {
          onSuccess: (data) => {
            setProtocol(data.protocol);
          },
        },
      );
    }
  };

  const handleResumeProtocol = () => {
    if (!protocol || !id) return;

    const confirmed = window.confirm(
      "Resuming this protocol will restore it to your active protocols and enable dose logging again.\n\nAre you sure you want to resume this protocol?",
    );

    if (confirmed) {
      updateProtocol.mutate(
        { id, status: "active" },
        {
          onSuccess: (data) => {
            setProtocol(data.protocol);
          },
        },
      );
    }
  };

  const handleArchiveProtocol = () => {
    if (!id) return;

    archiveProtocol.mutate(id, {
      onSuccess: () => {
        setShowArchiveModal(false);
        navigate("/dashboard");
      },
    });
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-sm text-gray-500">Loading protocol...</p>
          {id && (
            <p className="mt-2 text-xs text-gray-400">Protocol ID: {id}</p>
          )}
        </div>
      </div>
    );
  }

  if (error || !protocol) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-900/30 border border-red-800 rounded-xl p-6">
          <svg
            className="w-12 h-12 mx-auto text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-red-900 text-center">
            {error || "Protocol not found"}
          </h3>
          <div className="mt-4 p-3 bg-surface-card rounded border border-red-800">
            <p className="text-sm text-gray-400">
              <strong>Protocol ID:</strong> {id || "Not provided"}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              <strong>Error:</strong> {error || "Protocol data is null"}
            </p>
          </div>
          <div className="mt-6 flex gap-3 justify-center">
            <Link
              to="/dashboard"
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
            >
              Back to Dashboard
            </Link>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-4 py-2 border border-red-300 text-red-400 text-sm font-medium rounded-lg hover:bg-red-900/30 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const stats = calculateProtocolStats(protocol, doses);

  const statusColors: Record<string, string> = {
    active: "bg-green-900/40 text-green-400 border-green-800",
    paused: "bg-amber-900/40 text-amber-400 border-amber-800",
    completed: "bg-surface-elevated text-gray-300 border-surface-border",
    draft: "bg-blue-900/40 text-blue-400 border-blue-800",
    archived: "bg-slate-900/40 text-slate-400 border-slate-700",
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <button
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center text-sm text-gray-400 hover:text-gray-100 mb-2 transition-colors"
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Dashboard
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-100">
              {protocol.name || protocol.template?.name || "Custom Protocol"}
            </h1>
            <span
              className={`px-3 py-1 text-sm font-medium rounded-full border ${statusColors[protocol.status]}`}
            >
              {protocol.status}
            </span>
          </div>
          {protocol.startDate && (
            <p className="mt-1 text-sm text-gray-400">
              Started {formatDate(protocol.startDate)}
              {protocol.endDate && ` • Ends ${formatDate(protocol.endDate)}`}
            </p>
          )}
        </div>
      </div>

      {/* Paused Protocol Banner */}
      {protocol.status === "paused" && (
        <div className="bg-amber-900/30 border border-amber-900/50 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <svg
              className="w-6 h-6 text-amber-400 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <p className="font-medium text-amber-400">Protocol Paused</p>
              <p className="text-sm text-amber-400">
                This protocol is not active and won't appear in dose logging.
                Resume it to continue tracking.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Archived Protocol Banner */}
      {protocol.status === "archived" && (
        <div className="bg-slate-900/30 border border-slate-800/50 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <svg
              className="w-6 h-6 text-slate-400 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
              />
            </svg>
            <div>
              <p className="font-medium text-slate-300">Protocol Archived</p>
              <p className="text-sm text-slate-400">
                This protocol has been archived and won't appear in dose
                logging. Your dose history has been preserved.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Glance View - Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Protocol Summary Card */}
        <div className="bg-indigo-900/30 rounded-xl p-5 border border-indigo-900/50">
          <div className="flex items-center gap-2 mb-3">
            <svg
              className="w-5 h-5 text-indigo-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <p className="text-sm font-semibold text-indigo-300">Summary</p>
          </div>
          <div className="space-y-2">
            {protocol.substances.map((ps, idx) => (
              <div key={ps.id} className="text-sm">
                <p className="font-medium text-indigo-200">
                  {ps.substance.name}
                </p>
                <p className="text-indigo-400">
                  {ps.dose}
                  {ps.doseUnit || ps.substance.doseUnit || ""} •{" "}
                  {ps.frequency?.replace("_", " ") || "as needed"}
                </p>
                {idx < protocol.substances.length - 1 && (
                  <div className="mt-2 border-t border-indigo-700"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Consistency Card */}
        <div className="bg-blue-900/30 rounded-xl p-5 border border-blue-900/50">
          <div className="flex items-center gap-2 mb-3">
            <svg
              className="w-5 h-5 text-blue-400"
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
            <p className="text-sm font-semibold text-blue-300">Consistency</p>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-4xl font-bold text-blue-200">
              {stats.adherenceRate}%
            </p>
          </div>
          {(stats.expectedDoses > 0 || stats.totalDoses > 0) && (
            <div className="mt-3">
              <p className="text-sm text-blue-400 mb-2">
                {stats.takenDoses} of {stats.expectedDoses > 0 ? stats.expectedDoses : stats.totalDoses} doses {stats.expectedDoses > 0 ? "expected" : "logged"}
              </p>
              <div className="w-full bg-blue-900 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all"
                  style={{ width: `${stats.adherenceRate}%` }}
                ></div>
              </div>
            </div>
          )}
          {stats.expectedDoses === 0 && stats.totalDoses === 0 && (
            <p className="mt-2 text-sm text-blue-400">No doses logged yet</p>
          )}
        </div>

        {/* Next Dose Card */}
        <div className="bg-purple-900/30 rounded-xl p-5 border border-purple-900/50">
          <div className="flex items-center gap-2 mb-3">
            <svg
              className="w-5 h-5 text-purple-400"
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
            <p className="text-sm font-semibold text-purple-300">Next Dose</p>
          </div>
          {stats.nextDoseTime ? (
            <>
              <div className="flex items-baseline gap-2">
                <p
                  className={`text-4xl font-bold ${stats.nextDoseTime === "due now" ? "text-amber-200" : "text-purple-200"}`}
                >
                  {stats.nextDoseTime}
                </p>
              </div>
              {stats.nextDoseSubstance && (
                <p
                  className={`mt-2 text-sm ${stats.nextDoseTime === "due now" ? "text-amber-400" : "text-purple-400"}`}
                >
                  {stats.nextDoseSubstance}
                </p>
              )}
            </>
          ) : (
            <div className="mt-2">
              <p className="text-lg font-semibold text-purple-300">
                Not scheduled
              </p>
              <p className="mt-1 text-sm text-purple-400">
                Log a dose to track your schedule
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Substances Detail */}
      <div className="bg-surface-card rounded-xl border border-surface-border overflow-hidden">
        <div className="bg-surface-elevated px-6 py-4 border-b border-surface-border">
          <h2 className="text-lg font-semibold text-gray-100">
            Protocol Substances
          </h2>
        </div>
        <div className="divide-y divide-surface-border">
          {protocol.substances.map((ps) => (
            <div key={ps.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-100">
                    {ps.substance.name}
                  </h3>
                  <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase">
                        Dose
                      </p>
                      <p className="mt-1 text-sm text-gray-100">
                        {ps.dose} {ps.doseUnit || ps.substance.doseUnit || ""}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase">
                        Frequency
                      </p>
                      <p className="mt-1 text-sm text-gray-100">
                        {ps.frequency?.replace("_", " ") || "as needed"}
                      </p>
                    </div>
                    {ps.cycleOnWeeks && (
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase">
                          Cycling
                        </p>
                        <p className="mt-1 text-sm text-gray-100">
                          {ps.cycleOnWeeks}w on / {ps.cycleOffWeeks || 0}w off
                        </p>
                      </div>
                    )}
                    {ps.substance.administrationRoute && (
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase">
                          Route
                        </p>
                        <p className="mt-1 text-sm text-gray-100">
                          {ps.substance.administrationRoute}
                        </p>
                      </div>
                    )}
                  </div>
                  {ps.notes && (
                    <div className="mt-4 p-3 bg-surface-elevated rounded-lg">
                      <p className="text-sm text-gray-300">{ps.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Cycles */}
      {cycles.length > 0 && (
        <div className="bg-surface-card rounded-xl border border-surface-border overflow-hidden">
          <div className="bg-surface-elevated px-6 py-4 border-b border-surface-border">
            <h2 className="text-lg font-semibold text-gray-100">
              Active Cycles
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              On/off cycling status for your substances
            </p>
          </div>
          <div className="p-6 space-y-4">
            {cycles.map((cycle) => {
              const totalWeeks = cycle.onWeeks + cycle.offWeeks;
              const currentWeekInCycle =
                ((cycle.currentWeek - 1) % totalWeeks) + 1;
              const isOnPhase = currentWeekInCycle <= cycle.onWeeks;

              return (
                <div
                  key={cycle.id}
                  className="p-4 rounded-lg border border-surface-border bg-surface-base"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-gray-100">
                        {cycle.protocolSubstance.substance.name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        Cycle #{cycle.cycleNumber} • Week {cycle.currentWeek}
                      </p>
                    </div>
                    <CycleStatusBadge status={cycle.status} compact />
                  </div>

                  {/* Mini progress bar */}
                  <div className="relative h-2 bg-surface-elevated rounded-full overflow-hidden mb-2">
                    <div
                      className="absolute h-full bg-green-500/20"
                      style={{
                        width: `${(cycle.onWeeks / totalWeeks) * 100}%`,
                      }}
                    />
                    <div
                      className={`absolute h-full ${isOnPhase ? "bg-green-500" : "bg-amber-500"} rounded-full`}
                      style={{
                        width: `${(currentWeekInCycle / totalWeeks) * 100}%`,
                      }}
                    />
                  </div>

                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{cycle.onWeeks}w on</span>
                    <span>{cycle.offWeeks}w off</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Active Titrations */}
      {Object.keys(titrationProgress).length > 0 && (
        <div className="bg-surface-card rounded-xl border border-surface-border overflow-hidden">
          <div className="bg-surface-elevated px-6 py-4 border-b border-surface-border">
            <h2 className="text-lg font-semibold text-gray-100">
              Titration Progress
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Dose escalation tracking for GLP-1s and similar
            </p>
          </div>
          <div className="p-6 space-y-4">
            {protocol.substances.map((ps) => {
              const progress = titrationProgress[ps.id];
              if (!progress) return null;

              return (
                <TitrationProgressCard
                  key={ps.id}
                  progress={progress}
                  substanceName={ps.substance.name}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Dose History */}
      {(() => {
        const protocolDoses = doses
          .filter((d) =>
            protocol.substances.some((ps) => ps.substanceId === d.substanceId),
          )
          .sort(
            (a, b) =>
              new Date(b.loggedAt).getTime() - new Date(a.loggedAt).getTime(),
          );

        const statusStyles = {
          taken: "bg-green-900/40 text-green-400",
          missed: "bg-red-900/40 text-red-400",
          skipped: "bg-surface-elevated text-gray-400",
        };

        const formatDoseDate = (dateStr: string) => {
          const date = new Date(dateStr);
          const today = new Date();
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);

          if (date.toDateString() === today.toDateString()) {
            return `Today at ${date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`;
          }
          if (date.toDateString() === yesterday.toDateString()) {
            return `Yesterday at ${date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`;
          }
          return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year:
              date.getFullYear() !== today.getFullYear()
                ? "numeric"
                : undefined,
            hour: "numeric",
            minute: "2-digit",
          });
        };

        return (
          <div className="bg-surface-card rounded-xl border border-surface-border overflow-hidden">
            <div className="bg-surface-elevated px-6 py-4 border-b border-surface-border">
              <h2 className="text-lg font-semibold text-gray-100">
                Dose History
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {protocolDoses.length} dose
                {protocolDoses.length !== 1 ? "s" : ""} logged
              </p>
            </div>
            {protocolDoses.length > 0 ? (
              <div className="divide-y divide-surface-border">
                {protocolDoses.map((dose) => (
                  <div
                    key={dose.id}
                    className="px-6 py-4 hover:bg-surface-elevated transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3">
                          <h4 className="text-sm font-medium text-gray-100 truncate">
                            {dose.substance.name}
                          </h4>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${statusStyles[dose.status]}`}
                          >
                            {dose.status}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center gap-4 text-sm text-gray-500">
                          <span>
                            {dose.dose}{" "}
                            {dose.doseUnit || dose.substance.doseUnit || ""}
                          </span>
                          {dose.administrationSite && (
                            <span className="flex items-center gap-1">
                              <svg
                                className="w-3.5 h-3.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                              </svg>
                              {dose.administrationSite}
                            </span>
                          )}
                        </div>
                        {dose.notes && (
                          <p className="mt-2 text-sm text-gray-400 italic">
                            "{dose.notes}"
                          </p>
                        )}
                      </div>
                      <div className="ml-4 text-right flex-shrink-0">
                        <p className="text-sm text-gray-500">
                          {formatDoseDate(dose.loggedAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-6 py-12 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
                <p className="mt-4 text-sm font-medium text-gray-100">
                  No doses logged yet
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Start logging doses to track your progress
                </p>
                {protocol.status === "active" && (
                  <Link
                    to="/log"
                    className="mt-4 inline-flex items-center px-4 py-2 bg-primary-500 text-white text-sm font-medium rounded-lg hover:bg-primary-400 transition-colors"
                  >
                    Log Your First Dose
                  </Link>
                )}
              </div>
            )}
          </div>
        );
      })()}

      {/* Protocol Notes */}
      {protocol.notes && (
        <div className="bg-surface-card rounded-xl border border-surface-border p-6">
          <h2 className="text-lg font-semibold text-gray-100 mb-3">
            Protocol Notes
          </h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            {protocol.notes}
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        {protocol.status === "active" && (
          <Link
            to="/log"
            className="inline-flex items-center justify-center px-4 py-2 text-sm bg-primary-500 text-surface-base font-medium rounded-lg hover:bg-primary-400 transition-colors shadow-sm"
          >
            <svg
              className="w-4 h-4 mr-1.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Log a Dose
          </Link>
        )}
        {protocol.status === "active" && (
          <button
            onClick={handlePauseProtocol}
            disabled={updateProtocol.isPending}
            className="px-4 py-2 text-sm border border-amber-700 text-amber-400 font-medium rounded-lg hover:bg-amber-900/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {updateProtocol.isPending ? "Pausing..." : "Pause"}
          </button>
        )}
        {protocol.status === "paused" && (
          <button
            onClick={handleResumeProtocol}
            disabled={updateProtocol.isPending}
            className="px-4 py-2 text-sm bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {updateProtocol.isPending ? "Resuming..." : "Resume"}
          </button>
        )}
        {(protocol.status === "active" || protocol.status === "paused") && (
          <button
            onClick={() => setShowArchiveModal(true)}
            className="px-4 py-2 text-sm border border-slate-600 text-slate-400 font-medium rounded-lg hover:bg-slate-900/30 transition-colors"
          >
            Archive
          </button>
        )}
      </div>

      {/* Archive Protocol Modal */}
      <ArchiveProtocolModal
        isOpen={showArchiveModal}
        onClose={() => setShowArchiveModal(false)}
        onConfirm={handleArchiveProtocol}
        protocolName={
          protocol.name || protocol.template?.name || "Custom Protocol"
        }
        isArchiving={archiveProtocol.isPending}
      />
    </div>
  );
}
