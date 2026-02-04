import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../lib/api-client";
import { ActiveProtocolSubstance, Substance, Dose } from "../types/domain";
import { QuickProtocolModal } from "../components/protocols/QuickProtocolModal";

const INJECTION_SITES = [
  "Subcutaneous - Abdomen",
  "Subcutaneous - Thigh",
  "Subcutaneous - Arm",
  "Intramuscular - Deltoid",
  "Intramuscular - Gluteal",
];

type LogType = "protocol" | "adhoc" | null;
type FastingState = "fasted" | "fed" | "unknown";
type TimeOfDay = "morning" | "afternoon" | "evening" | "night";
type NeedleGauge = "25g" | "27g" | "29g" | "30g" | "31g";
type InjectionDepth = "subcutaneous" | "intramuscular";

const NEEDLE_GAUGES: NeedleGauge[] = ["25g", "27g", "29g", "30g", "31g"];

// Determine time of day from current hour
const getTimeOfDay = (): TimeOfDay => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
};

interface ProtocolGroup {
  protocol: {
    id: string;
    name: string | null;
    status: string;
  };
  substances: ActiveProtocolSubstance[];
}

export function LogDose() {
  const navigate = useNavigate();

  // Data state
  const [protocolSubstances, setProtocolSubstances] = useState<
    ActiveProtocolSubstance[]
  >([]);
  const [substances, setSubstances] = useState<Substance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Flow state
  const [logType, setLogType] = useState<LogType>(null);
  const [selectedProtocolSubstance, setSelectedProtocolSubstance] =
    useState<ActiveProtocolSubstance | null>(null);
  const [selectedSubstance, setSelectedSubstance] = useState<Substance | null>(
    null
  );

  // Form state
  const [dose, setDose] = useState<string>("");
  const [doseUnit, setDoseUnit] = useState<string>("");
  const [site, setSite] = useState(INJECTION_SITES[0]);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [adHocSearch, setAdHocSearch] = useState("");
  const [showCustomProtocolModal, setShowCustomProtocolModal] = useState(false);

  // Dose context state
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [fastingState, setFastingState] = useState<FastingState | null>(null);
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>(getTimeOfDay());
  const [needleGauge, setNeedleGauge] = useState<NeedleGauge | null>(null);
  const [injectionDepth, setInjectionDepth] = useState<InjectionDepth | null>(null);

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [substancesRes, protocolSubstancesRes] = await Promise.all([
        apiClient.get<{ substances: Substance[] }>("/substances?limit=100"),
        apiClient.get<{ substances: ActiveProtocolSubstance[] }>(
          "/protocols/my-substances"
        ),
      ]);

      setSubstances(substancesRes.substances);
      setProtocolSubstances(protocolSubstancesRes.substances);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  // Calculate current step
  const currentStep = useMemo(() => {
    if (!logType) return 1;
    if (!selectedProtocolSubstance && !selectedSubstance) return 2;
    return 3;
  }, [logType, selectedProtocolSubstance, selectedSubstance]);

  // Group protocol substances by protocol
  const protocolGroups = useMemo((): ProtocolGroup[] => {
    const grouped = new Map<string, ProtocolGroup>();

    protocolSubstances.forEach((ps) => {
      const existing = grouped.get(ps.protocol.id);
      if (existing) {
        existing.substances.push(ps);
      } else {
        grouped.set(ps.protocol.id, {
          protocol: {
            id: ps.protocol.id,
            name: ps.protocol.name,
            status: ps.protocol.status,
          },
          substances: [ps],
        });
      }
    });

    return Array.from(grouped.values());
  }, [protocolSubstances]);

  // Filter substances for ad-hoc search
  const filteredSubstances = useMemo(() => {
    if (!adHocSearch.trim()) return substances.slice(0, 20);
    const search = adHocSearch.toLowerCase();
    return substances.filter(
      (s) =>
        s.name.toLowerCase().includes(search) ||
        s.aliases?.some((a) => a.toLowerCase().includes(search))
    );
  }, [substances, adHocSearch]);

  const handleSelectLogType = (type: LogType) => {
    setLogType(type);
  };

  const handleProtocolSubstanceSelect = (ps: ActiveProtocolSubstance) => {
    setSelectedProtocolSubstance(ps);
    setSelectedSubstance(null);
    setDose(String(ps.dose));
    setDoseUnit(ps.doseUnit || ps.substance.doseUnit || "");
  };

  const handleAdHocSubstanceSelect = (substance: Substance) => {
    setSelectedSubstance(substance);
    setSelectedProtocolSubstance(null);
    setDose(substance.defaultDose ? String(substance.defaultDose) : "");
    setDoseUnit(substance.doseUnit || "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (logType === "protocol" && !selectedProtocolSubstance) {
      setError("Please select a substance from your protocol");
      return;
    }

    if (logType === "adhoc" && !selectedSubstance) {
      setError("Please select a substance to log");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // Build context fields object
      const contextFields = {
        fastingState: fastingState || undefined,
        timeOfDay: timeOfDay || undefined,
        needleGauge: needleGauge || undefined,
        injectionDepth: injectionDepth || undefined,
      };

      if (logType === "protocol" && selectedProtocolSubstance) {
        await apiClient.post<{ dose: Dose }>("/doses", {
          protocolSubstanceId: selectedProtocolSubstance.id,
          substanceId: selectedProtocolSubstance.substanceId,
          dose: Number(dose),
          doseUnit:
            selectedProtocolSubstance.doseUnit ||
            selectedProtocolSubstance.substance.doseUnit,
          status: "taken",
          administrationSite: site,
          notes: notes || undefined,
          ...contextFields,
        });
      } else if (logType === "adhoc" && selectedSubstance) {
        await apiClient.post<{ dose: Dose }>("/doses", {
          substanceId: selectedSubstance.id,
          dose: Number(dose),
          doseUnit: doseUnit || selectedSubstance.doseUnit,
          status: "taken",
          administrationSite: site,
          notes: notes || undefined,
          ...contextFields,
        });
      }

      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to log dose");
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    if (currentStep === 3) {
      setSelectedProtocolSubstance(null);
      setSelectedSubstance(null);
      setDose("");
      setDoseUnit("");
      // Reset context fields
      setShowAdvanced(false);
      setFastingState(null);
      setTimeOfDay(getTimeOfDay());
      setNeedleGauge(null);
      setInjectionDepth(null);
    } else if (currentStep === 2) {
      setLogType(null);
      setAdHocSearch("");
    } else {
      navigate("/dashboard");
    }
  };

  const handleCustomProtocolCreated = async (protocolSubstanceId: string) => {
    // Refresh the protocol substances list
    await fetchData();
    setShowCustomProtocolModal(false);
    // Set to protocol mode and find the newly created protocol substance
    setLogType("protocol");
    // The protocolSubstances will be updated after fetchData,
    // so we need to wait for the next render to find it
    setTimeout(() => {
      const newPs = protocolSubstances.find(ps => ps.id === protocolSubstanceId);
      if (newPs) {
        handleProtocolSubstanceSelect(newPs);
      }
    }, 100);
  };

  const currentDoseUnit =
    logType === "protocol" && selectedProtocolSubstance
      ? selectedProtocolSubstance.doseUnit ||
        selectedProtocolSubstance.substance.doseUnit ||
        "units"
      : logType === "adhoc" && selectedSubstance
        ? doseUnit || selectedSubstance.doseUnit || "units"
        : "units";

  // Check if the selected substance is injectable
  const isInjectable = useMemo(() => {
    if (logType === "protocol" && selectedProtocolSubstance) {
      const route = selectedProtocolSubstance.substance.administrationRoute;
      return route?.includes("injection") || false;
    }
    if (logType === "adhoc" && selectedSubstance) {
      return selectedSubstance.administrationRoute?.includes("injection") || false;
    }
    return false;
  }, [logType, selectedProtocolSubstance, selectedSubstance]);

  const stepLabels = ["Choose type", "Select substance", "Enter details"];

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p className="text-gray-400 mt-4">Loading your protocols...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header with Step Counter */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-gray-100">Log Dose</h1>
          <span className="text-sm text-gray-500">
            Step {currentStep} of 3
          </span>
        </div>

        {/* Step Progress Bar */}
        <div className="flex gap-2 mb-3">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={`flex-1 h-1.5 rounded-full transition-colors ${
                step <= currentStep ? "bg-primary-500" : "bg-gray-200"
              }`}
            />
          ))}
        </div>

        <p className="text-gray-400">{stepLabels[currentStep - 1]}</p>

        {error && (
          <div className="mt-4 p-3 text-sm text-red-600 bg-red-900/30 rounded-lg">
            {error}
          </div>
        )}
      </div>

      {/* Step 1: Choose Log Type */}
      {currentStep === 1 && (
        <div className="space-y-4">
          {/* Protocol Option */}
          <button
            type="button"
            onClick={() => handleSelectLogType("protocol")}
            disabled={protocolGroups.length === 0}
            className={`w-full p-6 rounded-xl border text-left transition-all ${
              protocolGroups.length === 0
                ? "border-surface-border bg-surface-elevated cursor-not-allowed"
                : "border-surface-border hover:border-primary-300 hover:bg-primary-500/20"
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  protocolGroups.length === 0 ? "bg-surface-elevated" : "bg-primary-500/20"
                }`}
              >
                <svg
                  className={`w-6 h-6 ${
                    protocolGroups.length === 0
                      ? "text-gray-400"
                      : "text-primary-500"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3
                  className={`font-semibold text-lg ${
                    protocolGroups.length === 0
                      ? "text-gray-400"
                      : "text-gray-100"
                  }`}
                >
                  Log from Protocol
                </h3>
                <p
                  className={`text-sm mt-1 ${
                    protocolGroups.length === 0
                      ? "text-gray-400"
                      : "text-gray-500"
                  }`}
                >
                  {protocolGroups.length === 0
                    ? "No active protocols available"
                    : `${protocolGroups.length} active protocol${protocolGroups.length > 1 ? "s" : ""} with tracking`}
                </p>
              </div>
              {protocolGroups.length > 0 && (
                <svg
                  className="w-5 h-5 text-gray-400 mt-1"
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
              )}
            </div>
          </button>

          {/* Ad-hoc Option */}
          <button
            type="button"
            onClick={() => handleSelectLogType("adhoc")}
            className="w-full p-6 rounded-xl border border-surface-border text-left hover:border-primary-300 hover:bg-primary-500/20 transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-900/40 flex items-center justify-center">
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
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-100">
                  Quick Log
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Log a one-time dose without protocol tracking
                </p>
              </div>
              <svg
                className="w-5 h-5 text-gray-400 mt-1"
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
          </button>

          {/* Create Protocol Option */}
          <button
            type="button"
            onClick={() => setShowCustomProtocolModal(true)}
            className="w-full p-6 rounded-xl border border-dashed border-surface-border text-left hover:border-primary-300 hover:bg-primary-500/20 transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-surface-elevated flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-gray-400"
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
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-100">
                  Create Custom Protocol
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Set up a new protocol with schedule and tracking
                </p>
              </div>
              <svg
                className="w-5 h-5 text-gray-400 mt-1"
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
          </button>

          {/* Cancel Button */}
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="w-full py-3 px-4 text-sm font-medium text-gray-400 hover:text-gray-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Step 2: Select Substance */}
      {currentStep === 2 && logType === "protocol" && (
        <div className="space-y-4">
          {protocolGroups.map((group) => (
            <div
              key={group.protocol.id}
              className="border border-surface-border rounded-xl overflow-hidden"
            >
              <div className="bg-surface-elevated px-4 py-3 border-b border-surface-border">
                <h3 className="font-medium text-gray-100">
                  {group.protocol.name || "Unnamed Protocol"}
                </h3>
              </div>
              <div className="divide-y divide-gray-100">
                {group.substances.map((ps) => (
                  <button
                    key={ps.id}
                    type="button"
                    onClick={() => handleProtocolSubstanceSelect(ps)}
                    className="w-full p-4 text-left hover:bg-surface-elevated transition-colors flex justify-between items-center"
                  >
                    <div>
                      <div className="font-medium text-gray-100">
                        {ps.substance.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {ps.dose} {ps.doseUnit || ps.substance.doseUnit} •{" "}
                        {ps.frequency?.replace("_", " ") || "as needed"}
                      </div>
                    </div>
                    <svg
                      className="w-5 h-5 text-gray-400"
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
                  </button>
                ))}
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={handleBack}
            className="w-full py-3 px-4 border border-surface-border rounded-lg text-sm font-medium text-gray-300 hover:bg-surface-elevated transition-colors"
          >
            Back
          </button>
        </div>
      )}

      {currentStep === 2 && logType === "adhoc" && (
        <div className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Search substances..."
              value={adHocSearch}
              onChange={(e) => setAdHocSearch(e.target.value)}
              className="w-full px-4 py-3 border border-surface-border rounded-lg bg-surface-raised text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              autoFocus
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {filteredSubstances.map((substance) => (
              <button
                key={substance.id}
                type="button"
                onClick={() => handleAdHocSubstanceSelect(substance)}
                className="px-4 py-2.5 text-sm border border-surface-border rounded-lg text-gray-300 hover:bg-surface-elevated hover:border-surface-hover transition-colors"
              >
                {substance.name}
              </button>
            ))}
            {filteredSubstances.length === 0 && adHocSearch && (
              <p className="text-sm text-gray-500 py-4">
                No substances found matching "{adHocSearch}"
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={handleBack}
            className="w-full py-3 px-4 border border-surface-border rounded-lg text-sm font-medium text-gray-300 hover:bg-surface-elevated transition-colors"
          >
            Back
          </button>
        </div>
      )}

      {/* Step 3: Enter Dose Details */}
      {currentStep === 3 && (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Selected item header */}
          <div className="flex items-center justify-between p-4 bg-primary-500/20 border border-primary-200 rounded-xl">
            <div>
              <div className="text-sm text-primary-500 font-medium">
                {logType === "protocol" ? "Protocol Dose" : "Quick Log"}
              </div>
              <div className="font-semibold text-gray-100">
                {logType === "protocol" && selectedProtocolSubstance
                  ? selectedProtocolSubstance.substance.name
                  : selectedSubstance?.name}
              </div>
              {logType === "protocol" && selectedProtocolSubstance && (
                <div className="text-sm text-gray-500">
                  from{" "}
                  {selectedProtocolSubstance.protocol.name || "Unnamed Protocol"}
                </div>
              )}
            </div>
          </div>

          {/* Dose Amount */}
          <div>
            <label
              htmlFor="dose"
              className="block text-sm font-medium text-gray-300"
            >
              Dose Amount
            </label>
            <div className="mt-1 flex rounded-lg shadow-sm">
              <input
                type="number"
                step="any"
                id="dose"
                value={dose}
                onChange={(e) => setDose(e.target.value)}
                className="flex-1 block w-full px-3 py-2 border border-surface-border rounded-l-lg bg-surface-raised text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                required
                autoFocus
              />
              <span className="inline-flex items-center px-4 border border-l-0 border-surface-border bg-surface-elevated text-gray-500 rounded-r-lg">
                {currentDoseUnit}
              </span>
            </div>
            {logType === "protocol" && selectedProtocolSubstance && (
              <p className="mt-1 text-xs text-gray-500">
                Protocol dose: {selectedProtocolSubstance.dose}{" "}
                {selectedProtocolSubstance.doseUnit ||
                  selectedProtocolSubstance.substance.doseUnit}
              </p>
            )}
          </div>

          {/* Injection Site */}
          <div>
            <label
              htmlFor="site"
              className="block text-sm font-medium text-gray-300"
            >
              Administration Site
            </label>
            <select
              id="site"
              value={site}
              onChange={(e) => setSite(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-surface-border rounded-lg bg-surface-raised text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              {INJECTION_SITES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div>
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-gray-300"
            >
              Notes (optional)
            </label>
            <textarea
              id="notes"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any observations or side effects..."
              className="mt-1 block w-full px-3 py-2 border border-surface-border rounded-lg bg-surface-raised text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          {/* Advanced Options Accordion */}
          <div className="border border-surface-border rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full flex items-center justify-between p-4 bg-surface-card hover:bg-surface-elevated transition-colors"
            >
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                  />
                </svg>
                <span className="text-sm font-medium text-gray-300">
                  Dose Context
                </span>
              </div>
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform ${
                  showAdvanced ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {showAdvanced && (
              <div className="p-4 bg-surface-raised border-t border-surface-border space-y-5">
                {/* Fasting State */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Fasting State
                  </label>
                  <div className="flex gap-2">
                    {(["fasted", "fed", "unknown"] as FastingState[]).map(
                      (state) => (
                        <button
                          key={state}
                          type="button"
                          onClick={() =>
                            setFastingState(
                              fastingState === state ? null : state
                            )
                          }
                          className={`flex-1 py-2 px-3 rounded-lg border text-sm capitalize transition-colors ${
                            fastingState === state
                              ? "border-primary-500 bg-primary-500/20 text-primary-400 font-medium"
                              : "border-surface-border bg-surface-card text-gray-400 hover:bg-surface-elevated"
                          }`}
                        >
                          {state}
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* Time of Day */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Time of Day
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {(
                      ["morning", "afternoon", "evening", "night"] as TimeOfDay[]
                    ).map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setTimeOfDay(time)}
                        className={`py-2 px-4 rounded-lg border text-sm capitalize transition-colors ${
                          timeOfDay === time
                            ? "border-primary-500 bg-primary-500/20 text-primary-400 font-medium"
                            : "border-surface-border bg-surface-card text-gray-400 hover:bg-surface-elevated"
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Injection-specific fields */}
                {isInjectable && (
                  <>
                    {/* Injection Depth */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Injection Depth
                      </label>
                      <div className="flex gap-2">
                        {(
                          ["subcutaneous", "intramuscular"] as InjectionDepth[]
                        ).map((depth) => (
                          <button
                            key={depth}
                            type="button"
                            onClick={() =>
                              setInjectionDepth(
                                injectionDepth === depth ? null : depth
                              )
                            }
                            className={`flex-1 py-2 px-3 rounded-lg border text-sm transition-colors ${
                              injectionDepth === depth
                                ? "border-primary-500 bg-primary-500/20 text-primary-400 font-medium"
                                : "border-surface-border bg-surface-card text-gray-400 hover:bg-surface-elevated"
                            }`}
                          >
                            {depth === "subcutaneous" ? "SubQ" : "Intramuscular"}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Needle Gauge */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Needle Gauge
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {NEEDLE_GAUGES.map((gauge) => (
                          <button
                            key={gauge}
                            type="button"
                            onClick={() =>
                              setNeedleGauge(
                                needleGauge === gauge ? null : gauge
                              )
                            }
                            className={`py-2 px-4 rounded-lg border text-sm transition-colors ${
                              needleGauge === gauge
                                ? "border-primary-500 bg-primary-500/20 text-primary-400 font-medium"
                                : "border-surface-border bg-surface-card text-gray-400 hover:bg-surface-elevated"
                            }`}
                          >
                            {gauge}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-2">
            <button
              type="button"
              onClick={handleBack}
              className="flex-1 py-3 px-4 border border-surface-border rounded-lg text-sm font-medium text-gray-300 hover:bg-surface-elevated transition-colors"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={submitting || !dose}
              className="flex-1 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-500 hover:bg-primary-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? "Logging..." : "Log Dose"}
            </button>
          </div>
        </form>
      )}

      {/* Custom Protocol Modal */}
      <QuickProtocolModal
        isOpen={showCustomProtocolModal}
        onClose={() => setShowCustomProtocolModal(false)}
        onProtocolCreated={handleCustomProtocolCreated}
      />
    </div>
  );
}
