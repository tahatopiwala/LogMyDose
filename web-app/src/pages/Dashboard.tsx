import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/lib/api-client";
import { Protocol, Dose, DoseStats } from "@/types/domain";

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

function formatNextDoseTime(doses: Dose[]): string | null {
  const now = new Date();
  const upcoming = doses
    .filter((d) => d.scheduledAt && new Date(d.scheduledAt) > now)
    .sort(
      (a, b) =>
        new Date(a.scheduledAt!).getTime() - new Date(b.scheduledAt!).getTime(),
    );

  if (upcoming.length === 0) return null;

  const nextDose = upcoming[0];
  const nextTime = new Date(nextDose.scheduledAt!);
  const diffMs = nextTime.getTime() - now.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  if (diffHours > 24) {
    return `in ${Math.floor(diffHours / 24)} day${Math.floor(diffHours / 24) > 1 ? "s" : ""}`;
  }
  if (diffHours > 0) {
    return `in ${diffHours}h ${diffMins}m`;
  }
  return `in ${diffMins}m`;
}

export function Dashboard() {
  const { patient } = useAuth();
  const [protocols, setProtocols] = useState<Protocol[]>([]);
  const [todayDoses, setTodayDoses] = useState<Dose[]>([]);
  const [weekStats, setWeekStats] = useState<DoseStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [protocolsRes, todayRes, statsRes] = await Promise.all([
          apiClient.get<{ protocols: Protocol[] }>("/patients/protocols"),
          apiClient.get<{ doses: Dose[] }>("/doses/today"),
          apiClient.get<{ stats: DoseStats }>(
            `/doses/stats?startDate=${getWeekStart()}&endDate=${getWeekEnd()}`,
          ),
        ]);
        setProtocols(protocolsRes.protocols);
        setTodayDoses(todayRes.doses);
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
    (p) => p.status === "completed" || p.status === "paused",
  );

  // Calculate today's progress
  const dosesCompletedToday = todayDoses.filter(
    (d) => d.status === "taken",
  ).length;
  const totalDosesToday = todayDoses.length;

  // Get next scheduled dose
  const nextDoseTime = formatNextDoseTime(todayDoses);
  const nextDose = todayDoses.find(
    (d) => d.scheduledAt && new Date(d.scheduledAt) > new Date(),
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold">
          {getGreeting()}, {firstName}!
        </h1>
        <p className="mt-1 text-primary-100">{getUpbeatMessage()}</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Next Dose Card */}
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Next Dose</p>
              {nextDose ? (
                <>
                  <p className="text-xl font-bold text-gray-900 mt-1">
                    {nextDose.substance.name}
                  </p>
                  <p className="text-sm text-primary-600 mt-0.5">
                    {nextDoseTime}
                  </p>
                </>
              ) : (
                <p className="text-lg font-semibold text-gray-400 mt-1">
                  No doses scheduled
                </p>
              )}
            </div>
            <div className="p-3 bg-primary-50 rounded-lg">
              <svg
                className="w-6 h-6 text-primary-600"
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
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Today</p>
              <p className="text-xl font-bold text-gray-900 mt-1">
                {totalDosesToday > 0
                  ? `${dosesCompletedToday}/${totalDosesToday}`
                  : "0"}
                <span className="text-base font-normal text-gray-500 ml-1">
                  doses
                </span>
              </p>
              {totalDosesToday > 0 && (
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                  <div
                    className="bg-green-500 h-1.5 rounded-full transition-all"
                    style={{
                      width: `${(dosesCompletedToday / totalDosesToday) * 100}%`,
                    }}
                  />
                </div>
              )}
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <svg
                className="w-6 h-6 text-green-600"
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
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">This Week</p>
              <p className="text-xl font-bold text-gray-900 mt-1">
                {weekStats ? `${Math.round(weekStats.adherenceRate)}%` : "-%"}
                <span className="text-base font-normal text-gray-500 ml-1">
                  adherence
                </span>
              </p>
              {weekStats && (
                <p className="text-sm text-gray-500 mt-0.5">
                  {weekStats.takenDoses} of {weekStats.totalDoses} doses
                </p>
              )}
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <svg
                className="w-6 h-6 text-blue-600"
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
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Active Protocols
          </h2>
          <Link
            to="/protocols/new"
            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Protocol
          </Link>
        </div>

        {activeProtocols.length > 0 ? (
          <div className="space-y-3">
            {activeProtocols.map((protocol) => (
              <ProtocolCard key={protocol.id} protocol={protocol} />
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-xl p-8 text-center border border-dashed border-gray-300">
            <svg
              className="w-12 h-12 mx-auto text-gray-400"
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
            <h3 className="mt-4 text-base font-medium text-gray-900">
              No active protocols
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Start your journey by adding a protocol from our template library.
            </p>
            <Link
              to="/protocols/new"
              className="mt-4 inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
            >
              Browse Templates
            </Link>
          </div>
        )}
      </div>

      {/* Inactive Protocols */}
      {inactiveProtocols.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Past Protocols
          </h2>
          <div className="space-y-3">
            {inactiveProtocols.map((protocol) => (
              <ProtocolCard key={protocol.id} protocol={protocol} inactive />
            ))}
          </div>
        </div>
      )}

      {/* Quick Action */}
      {activeProtocols.length > 0 && (
        <div className="flex justify-center pt-4">
          <Link
            to="/log"
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-colors shadow-sm"
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
        </div>
      )}
    </div>
  );
}

// Protocol Card Component
function ProtocolCard({
  protocol,
  inactive = false,
}: {
  protocol: Protocol;
  inactive?: boolean;
}) {
  const substanceNames = protocol.substances
    .map((s) => s.substance.name)
    .join(", ");

  const statusColors = {
    active: "bg-green-100 text-green-700",
    paused: "bg-yellow-100 text-yellow-700",
    completed: "bg-gray-100 text-gray-700",
    draft: "bg-blue-100 text-blue-700",
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Link
      to={`/protocols/${protocol.id}`}
      className={`block bg-white rounded-xl p-4 border border-gray-200 hover:border-primary-300 hover:shadow-sm transition-all ${inactive ? "opacity-75" : ""}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-gray-900 truncate">
              {protocol.template?.name || substanceNames || "Custom Protocol"}
            </h3>
            <span
              className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusColors[protocol.status]}`}
            >
              {protocol.status}
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-500 truncate">
            {substanceNames}
          </p>
          {protocol.startDate && (
            <p className="mt-1 text-xs text-gray-400">
              Started {formatDate(protocol.startDate)}
              {protocol.endDate && ` - Ends ${formatDate(protocol.endDate)}`}
            </p>
          )}
        </div>
        <svg
          className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2"
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
    </Link>
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
