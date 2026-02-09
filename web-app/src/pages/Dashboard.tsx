import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/lib/api-client";
import { Protocol, Dose, DoseStats } from "@/types/domain";
import { ProtocolCard } from "@/components/protocols/ProtocolCard";
import { ProtocolSearch } from "@/components/protocols/ProtocolSearch";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function getUpbeatMessage(): string {
  const messages = [
    "Ready to make today count!",
    "Every dose brings you closer to your goals.",
    "You're doing great - keep it up!",
    "Consistency is key, and you've got this.",
    "Your health journey continues today.",
  ];
  return messages[Math.floor(Math.random() * messages.length)];
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

function formatTimeUntil(date: Date): string {
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
  return "due now";
}

function computeNextDose(
  protocols: Protocol[],
  allDoses: Dose[],
): { substanceName: string; timeLabel: string } | null {
  const now = new Date();
  const activeProtocols = protocols.filter((p) => p.status === "active");

  // Check for upcoming scheduled doses
  const upcomingScheduled = allDoses
    .filter((d) => d.scheduledAt && new Date(d.scheduledAt) > now)
    .sort(
      (a, b) =>
        new Date(a.scheduledAt!).getTime() - new Date(b.scheduledAt!).getTime(),
    );

  if (upcomingScheduled.length > 0) {
    const next = upcomingScheduled[0];
    return {
      substanceName: next.substance.name,
      timeLabel: formatTimeUntil(new Date(next.scheduledAt!)),
    };
  }

  // Estimate based on frequency for each active protocol substance
  let earliestFuture: { substanceName: string; dueTime: Date } | null = null;

  for (const protocol of activeProtocols) {
    for (const ps of protocol.substances) {
      if (!ps.frequency) continue;

      const substanceDoses = allDoses
        .filter((d) => d.substanceId === ps.substanceId && d.status === "taken")
        .sort(
          (a, b) =>
            new Date(b.loggedAt).getTime() - new Date(a.loggedAt).getTime(),
        );

      if (substanceDoses.length === 0) {
        return { substanceName: ps.substance.name, timeLabel: "due now" };
      }

      const lastDose = substanceDoses[0];
      const nextTime = estimateNextDose(new Date(lastDose.loggedAt), ps.frequency);

      if (nextTime) {
        if (nextTime <= now) {
          return { substanceName: ps.substance.name, timeLabel: "due now" };
        }
        if (!earliestFuture || nextTime < earliestFuture.dueTime) {
          earliestFuture = { substanceName: ps.substance.name, dueTime: nextTime };
        }
      }
    }
  }

  if (earliestFuture) {
    return {
      substanceName: earliestFuture.substanceName,
      timeLabel: formatTimeUntil(earliestFuture.dueTime),
    };
  }

  return null;
}

export function Dashboard() {
  const { patient } = useAuth();
  const [protocols, setProtocols] = useState<Protocol[]>([]);
  const [todayDoses, setTodayDoses] = useState<Dose[]>([]);
  const [allDoses, setAllDoses] = useState<Dose[]>([]);
  const [weekStats, setWeekStats] = useState<DoseStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const upbeatMessage = useMemo(() => getUpbeatMessage(), []);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [protocolsRes, todayRes, allDosesRes, statsRes] =
          await Promise.all([
            apiClient.get<{ protocols: Protocol[] }>("/patients/protocols"),
            apiClient.get<{ doses: Dose[] }>("/doses/today"),
            apiClient.get<{ doses: Dose[] }>("/doses?limit=100"),
            apiClient.get<{ stats: DoseStats }>(
              `/doses/stats?startDate=${getWeekStart()}&endDate=${getWeekEnd()}`,
            ),
          ]);
        setProtocols(protocolsRes.protocols);
        setTodayDoses(todayRes.doses);
        setAllDoses(allDosesRes.doses);
        setWeekStats(statsRes.stats);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  const firstName = patient?.firstName || "there";
  const activeProtocols = protocols.filter((p) => p.status === "active");
  const inactiveProtocols = protocols.filter(
    (p) => p.status === "completed" || p.status === "paused" || p.status === "archived",
  );

  // Filter protocols based on search query
  const filteredActiveProtocols = useMemo(() => {
    if (!searchQuery.trim()) return activeProtocols;

    const query = searchQuery.toLowerCase();
    return activeProtocols.filter((protocol) => {
      // Search in template name
      if (protocol.template?.name.toLowerCase().includes(query)) return true;

      // Search in substance names
      const hasMatchingSubstance = protocol.substances.some((ps) =>
        ps.substance.name.toLowerCase().includes(query),
      );
      if (hasMatchingSubstance) return true;

      // Search in notes
      if (protocol.notes?.toLowerCase().includes(query)) return true;

      return false;
    });
  }, [activeProtocols, searchQuery]);

  const filteredInactiveProtocols = useMemo(() => {
    if (!searchQuery.trim()) return inactiveProtocols;

    const query = searchQuery.toLowerCase();
    return inactiveProtocols.filter((protocol) => {
      if (protocol.template?.name.toLowerCase().includes(query)) return true;
      const hasMatchingSubstance = protocol.substances.some((ps) =>
        ps.substance.name.toLowerCase().includes(query),
      );
      if (hasMatchingSubstance) return true;
      if (protocol.notes?.toLowerCase().includes(query)) return true;
      return false;
    });
  }, [inactiveProtocols, searchQuery]);

  // Calculate today's progress
  const dosesCompletedToday = todayDoses.filter(
    (d) => d.status === "taken",
  ).length;
  const totalDosesToday = todayDoses.length;

  // Get next dose (scheduled or estimated from frequency)
  const nextDoseInfo = computeNextDose(protocols, allDoses);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-500/20 to-primary-400/10 border border-primary-500/30 rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-gray-100">
          {getGreeting()}, {firstName}!
        </h1>
        <p className="mt-1 text-primary-400">{upbeatMessage}</p>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Link
          to="/log"
          className="inline-flex items-center px-4 py-2.5 bg-primary-500 text-surface-base font-medium rounded-xl hover:bg-primary-400 transition-colors shadow-glow-sm shadow-primary-500/25"
        >
          <svg
            className="w-5 h-5 mr-2"
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
        <Link
          to="/protocols/new"
          className="inline-flex items-center px-4 py-2.5 bg-surface-card text-primary-500 font-medium rounded-xl hover:bg-surface-hover transition-colors shadow-sm border border-surface-border"
        >
          <svg
            className="w-5 h-5 mr-2"
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
          Add Protocol
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Next Dose Card */}
        <div className="bg-surface-card rounded-xl p-5 border border-surface-border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Next Dose</p>
              {nextDoseInfo ? (
                <>
                  <p className="text-xl font-bold text-gray-100 mt-1">
                    {nextDoseInfo.substanceName}
                  </p>
                  <p className={`text-sm mt-0.5 ${nextDoseInfo.timeLabel === "due now" ? "text-amber-400 font-semibold" : "text-primary-500"}`}>
                    {nextDoseInfo.timeLabel}
                  </p>
                </>
              ) : (
                <p className="text-lg font-semibold text-gray-500 mt-1">
                  No doses scheduled
                </p>
              )}
            </div>
            <div className="p-3 bg-primary-500/20 rounded-lg">
              <svg
                className="w-6 h-6 text-primary-500"
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
            </div>
          </div>
        </div>

        {/* Today's Progress Card */}
        <div className="bg-surface-card rounded-xl p-5 border border-surface-border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Today</p>
              <p className="text-xl font-bold text-gray-100 mt-1">
                {totalDosesToday > 0
                  ? `${dosesCompletedToday}/${totalDosesToday}`
                  : "0"}
                <span className="text-base font-normal text-gray-400 ml-1">
                  doses
                </span>
              </p>
              {totalDosesToday > 0 && (
                <div className="w-full bg-surface-elevated rounded-full h-1.5 mt-2">
                  <div
                    className="bg-green-500 h-1.5 rounded-full transition-all"
                    style={{
                      width: `${(dosesCompletedToday / totalDosesToday) * 100}%`,
                    }}
                  />
                </div>
              )}
            </div>
            <div className="p-3 bg-green-900/30 rounded-lg">
              <svg
                className="w-6 h-6 text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Weekly Progress Card */}
        <div className="bg-surface-card rounded-xl p-5 border border-surface-border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">This Week</p>
              <p className="text-xl font-bold text-gray-100 mt-1">
                {weekStats ? `${Math.round(weekStats.adherenceRate)}%` : "-%"}
                <span className="text-base font-normal text-gray-400 ml-1">
                  adherence
                </span>
              </p>
              {weekStats && (
                <p className="text-sm text-gray-400 mt-0.5">
                  {weekStats.takenDoses} of {weekStats.totalDoses} doses
                </p>
              )}
            </div>
            <div className="p-3 bg-blue-900/30 rounded-lg">
              <svg
                className="w-6 h-6 text-blue-400"
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
            </div>
          </div>
        </div>
      </div>

      {/* Active Protocols */}
      <div>
        <h2 className="text-lg font-semibold text-gray-100 mb-4">
          Active Protocols
        </h2>

        {activeProtocols.length > 0 && (
          <div className="mb-4">
            <ProtocolSearch onSearchChange={setSearchQuery} />
          </div>
        )}

        {activeProtocols.length > 0 ? (
          <>
            {filteredActiveProtocols.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredActiveProtocols.map((protocol) => (
                  <ProtocolCard
                    key={protocol.id}
                    protocol={protocol}
                    doses={allDoses}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-surface-raised rounded-xl p-8 text-center border border-dashed border-surface-border">
                <svg
                  className="w-12 h-12 mx-auto text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <h3 className="mt-4 text-base font-medium text-gray-100">
                  No protocols found
                </h3>
                <p className="mt-1 text-sm text-gray-400">
                  Try adjusting your search terms
                </p>
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium text-primary-500 hover:text-primary-400 hover:bg-primary-500/20 rounded-lg transition-colors"
                >
                  Clear search
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="bg-surface-raised rounded-xl p-8 text-center border border-dashed border-surface-border">
            <svg
              className="w-12 h-12 mx-auto text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="mt-4 text-base font-medium text-gray-100">
              No active protocols
            </h3>
            <p className="mt-1 text-sm text-gray-400">
              Start your journey by adding a protocol from our template library.
            </p>
            <Link
              to="/protocols/new"
              className="mt-4 inline-flex items-center px-4 py-2 bg-primary-500 text-surface-base text-sm font-medium rounded-lg hover:bg-primary-400 transition-colors"
            >
              Browse Templates
            </Link>
          </div>
        )}
      </div>

      {/* Inactive Protocols */}
      {inactiveProtocols.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-100 mb-4">
            Past Protocols
          </h2>
          {filteredInactiveProtocols.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredInactiveProtocols.map((protocol) => (
                <ProtocolCard
                  key={protocol.id}
                  protocol={protocol}
                  doses={allDoses}
                  inactive
                />
              ))}
            </div>
          ) : searchQuery ? (
            <div className="bg-surface-raised rounded-xl p-6 text-center border border-dashed border-surface-border">
              <p className="text-sm text-gray-400">
                No past protocols match your search
              </p>
            </div>
          ) : null}
        </div>
      )}

    </div>
  );
}

// Helper functions
function getWeekStart(): string {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
  const monday = new Date(now.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday.toISOString().split("T")[0];
}

function getWeekEnd(): string {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? 0 : 7);
  const sunday = new Date(now.setDate(diff));
  sunday.setHours(23, 59, 59, 999);
  return sunday.toISOString().split("T")[0];
}
