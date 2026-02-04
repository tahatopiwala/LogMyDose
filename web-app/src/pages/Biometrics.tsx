import { useEffect, useState, useMemo } from "react";
import { apiClient } from "@/lib/api-client";
import {
  BiometricEntry,
  BiometricStats,
  MetricType,
} from "@/types/domain";

const METRIC_CONFIG: Record<
  MetricType,
  { label: string; unit: string; category: string }
> = {
  weight: { label: "Weight", unit: "kg", category: "Body" },
  blood_glucose: { label: "Blood Glucose", unit: "mg/dL", category: "Vitals" },
  blood_pressure_systolic: { label: "BP Systolic", unit: "mmHg", category: "Vitals" },
  blood_pressure_diastolic: { label: "BP Diastolic", unit: "mmHg", category: "Vitals" },
  heart_rate: { label: "Heart Rate", unit: "bpm", category: "Vitals" },
  body_fat_percentage: { label: "Body Fat", unit: "%", category: "Body" },
  sleep_quality: { label: "Sleep Quality", unit: "/10", category: "Wellness" },
  energy_level: { label: "Energy Level", unit: "/10", category: "Wellness" },
  appetite_level: { label: "Appetite", unit: "/10", category: "Wellness" },
  pain_level: { label: "Pain Level", unit: "/10", category: "Wellness" },
  mood: { label: "Mood", unit: "/10", category: "Wellness" },
  stress_level: { label: "Stress Level", unit: "/10", category: "Wellness" },
  hydration: { label: "Hydration", unit: "L", category: "Body" },
  steps: { label: "Steps", unit: "steps", category: "Activity" },
  calories_burned: { label: "Calories Burned", unit: "kcal", category: "Activity" },
};

const QUICK_LOG_METRICS: MetricType[] = [
  "weight",
  "energy_level",
  "sleep_quality",
  "mood",
  "stress_level",
  "blood_glucose",
];

type FilterPeriod = "week" | "month" | "all";

export function Biometrics() {
  const [entries, setEntries] = useState<BiometricEntry[]>([]);
  const [stats, setStats] = useState<BiometricStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<FilterPeriod>("week");
  const [showLogModal, setShowLogModal] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<MetricType>("weight");
  const [logValue, setLogValue] = useState("");
  const [logNotes, setLogNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const dateRange = useMemo(() => {
    if (period === "all") return {};
    const now = new Date();
    const startDate = new Date();
    if (period === "week") {
      startDate.setDate(now.getDate() - 7);
    } else {
      startDate.setMonth(now.getMonth() - 1);
    }
    return {
      startDate: startDate.toISOString(),
      endDate: now.toISOString(),
    };
  }, [period]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (dateRange.startDate) queryParams.set("startDate", dateRange.startDate);
      if (dateRange.endDate) queryParams.set("endDate", dateRange.endDate);
      queryParams.set("limit", "50");

      const [entriesRes, statsRes] = await Promise.all([
        apiClient.get<{
          entries: BiometricEntry[];
          pagination: { page: number; limit: number; total: number; totalPages: number };
        }>(`/biometrics?${queryParams.toString()}`),
        apiClient.get<{ stats: BiometricStats[] }>(
          `/biometrics/stats${queryParams.toString() ? `?${queryParams.toString()}` : ""}`
        ),
      ]);

      setEntries(entriesRes.entries);
      setStats(statsRes.stats);
    } catch (error) {
      console.error("Failed to fetch biometrics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [period]);

  const handleSubmitLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!logValue) return;

    setSubmitting(true);
    try {
      await apiClient.post("/biometrics", {
        metricType: selectedMetric,
        value: parseFloat(logValue),
        unit: METRIC_CONFIG[selectedMetric].unit,
        notes: logNotes || undefined,
      });
      setShowLogModal(false);
      setLogValue("");
      setLogNotes("");
      fetchData();
    } catch (error) {
      console.error("Failed to log biometric:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";

    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  // Group entries by date
  const groupedEntries = entries.reduce(
    (groups, entry) => {
      const date = new Date(entry.recordedAt).toDateString();
      if (!groups[date]) groups[date] = [];
      groups[date].push(entry);
      return groups;
    },
    {} as Record<string, typeof entries>
  );

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">Biometrics</h1>
          <p className="text-gray-400 mt-1">Track your health metrics over time</p>
        </div>
        <button
          onClick={() => setShowLogModal(true)}
          className="inline-flex items-center gap-2 bg-primary-500 text-surface-base font-semibold px-4 py-2 rounded-lg hover:bg-primary-400 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Log Entry
        </button>
      </div>

      {/* Period Filter */}
      <div className="flex gap-2 mb-6">
        {(["week", "month", "all"] as FilterPeriod[]).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-4 py-2 rounded-full font-medium text-sm transition-colors ${
              period === p
                ? "bg-primary-500 text-surface-base"
                : "bg-surface-card text-gray-400 hover:bg-surface-elevated"
            }`}
          >
            {p === "all" ? "All Time" : `This ${p.charAt(0).toUpperCase() + p.slice(1)}`}
          </button>
        ))}
      </div>

      {/* Stats Cards */}
      {stats.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.slice(0, 4).map((stat) => {
            const config = METRIC_CONFIG[stat.metricType as MetricType];
            return (
              <div
                key={stat.metricType}
                className="bg-surface-card border border-surface-border rounded-xl p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-gray-400 text-sm">
                    {config?.label || stat.metricType}
                  </span>
                </div>
                <div className="text-2xl font-bold text-gray-100">
                  {stat.latest.toFixed(1)}
                  <span className="text-sm text-gray-500 ml-1">
                    {config?.unit || ""}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Avg: {stat.avg.toFixed(1)} • {stat.count} entries
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Quick Log Buttons */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
          Quick Log
        </h2>
        <div className="flex flex-wrap gap-2">
          {QUICK_LOG_METRICS.map((metric) => {
            const config = METRIC_CONFIG[metric];
            return (
              <button
                key={metric}
                onClick={() => {
                  setSelectedMetric(metric);
                  setShowLogModal(true);
                }}
                className="bg-surface-card border border-surface-border px-4 py-2 rounded-lg text-gray-300 hover:bg-surface-elevated hover:text-gray-100 transition-colors"
              >
                {config.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Entries */}
      <div>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
          Recent Entries
        </h2>

        {loading ? (
          <div className="bg-surface-card border border-surface-border rounded-xl p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading...</p>
          </div>
        ) : entries.length === 0 ? (
          <div className="bg-surface-card border border-surface-border rounded-xl p-8 text-center">
            <svg
              className="w-12 h-12 text-gray-500 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <p className="text-gray-300 mt-4">No biometric entries yet</p>
            <p className="text-gray-500 text-sm mt-1">
              Start logging metrics to track your progress
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedEntries).map(([date, dateEntries]) => (
              <div key={date}>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  {formatDate(dateEntries[0].recordedAt)}
                </h3>
                <div className="space-y-2">
                  {dateEntries.map((entry) => {
                    const config = METRIC_CONFIG[entry.metricType as MetricType];
                    return (
                      <div
                        key={entry.id}
                        className="bg-surface-card border border-surface-border rounded-lg p-4 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-surface-elevated flex items-center justify-center">
                            <svg
                              className="w-5 h-5 text-primary-500"
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
                          <div>
                            <p className="font-medium text-gray-100">
                              {config?.label || entry.metricType}
                            </p>
                            <p className="text-sm text-gray-400">
                              {formatTime(entry.recordedAt)}
                              {entry.notes && ` • ${entry.notes}`}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-primary-500">
                            {Number(entry.value).toFixed(1)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {entry.unit || config?.unit || ""}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Log Modal */}
      {showLogModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-surface-card border border-surface-border rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-100">
                Log {METRIC_CONFIG[selectedMetric]?.label}
              </h2>
              <button
                onClick={() => setShowLogModal(false)}
                className="text-gray-400 hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmitLog}>
              {/* Metric Selection */}
              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-2">Metric</label>
                <div className="flex flex-wrap gap-2">
                  {QUICK_LOG_METRICS.map((metric) => (
                    <button
                      key={metric}
                      type="button"
                      onClick={() => setSelectedMetric(metric)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        selectedMetric === metric
                          ? "bg-primary-500 text-surface-base"
                          : "bg-surface-elevated text-gray-400 hover:text-gray-200"
                      }`}
                    >
                      {METRIC_CONFIG[metric].label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Value Input */}
              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-2">Value</label>
                <div className="flex items-center bg-surface-elevated rounded-lg">
                  <input
                    type="number"
                    step="any"
                    value={logValue}
                    onChange={(e) => setLogValue(e.target.value)}
                    placeholder="0"
                    className="flex-1 bg-transparent px-4 py-3 text-gray-100 text-lg font-semibold focus:outline-none"
                    required
                  />
                  <span className="text-gray-400 pr-4">
                    {METRIC_CONFIG[selectedMetric]?.unit}
                  </span>
                </div>
              </div>

              {/* Notes Input */}
              <div className="mb-6">
                <label className="block text-sm text-gray-400 mb-2">Notes (optional)</label>
                <textarea
                  value={logNotes}
                  onChange={(e) => setLogNotes(e.target.value)}
                  placeholder="Add notes..."
                  rows={2}
                  className="w-full bg-surface-elevated rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!logValue || submitting}
                className="w-full bg-primary-500 text-surface-base font-bold py-3 rounded-lg hover:bg-primary-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Logging..." : "Log Entry"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
