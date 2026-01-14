import { useState, useEffect } from "react";
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

export function LogDose() {
  const navigate = useNavigate();

  // Data state
  const [protocolSubstances, setProtocolSubstances] = useState<
    ActiveProtocolSubstance[]
  >([]);
  const [substances, setSubstances] = useState<Substance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [selectedProtocolSubstance, setSelectedProtocolSubstance] =
    useState<ActiveProtocolSubstance | null>(null);
  const [dose, setDose] = useState<string>("");
  const [site, setSite] = useState(INJECTION_SITES[0]);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Modal state
  const [showQuickProtocolModal, setShowQuickProtocolModal] = useState(false);
  const [selectedSubstanceForProtocol, setSelectedSubstanceForProtocol] =
    useState<Substance | null>(null);

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
          "/protocols/my-substances",
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

  const handleProtocolSubstanceSelect = (ps: ActiveProtocolSubstance) => {
    setSelectedProtocolSubstance(ps);
    setDose(String(ps.dose));
  };

  const handleAddNewSubstance = (substance: Substance) => {
    setSelectedSubstanceForProtocol(substance);
    setShowQuickProtocolModal(true);
  };

  const handleProtocolCreated = async (protocolSubstanceId: string) => {
    // Refresh the list and select the new protocol substance
    await fetchData();
    setShowQuickProtocolModal(false);
    setSelectedSubstanceForProtocol(null);

    // Find and select the newly created protocol substance
    const newPs = protocolSubstances.find(
      (ps) => ps.id === protocolSubstanceId,
    );
    if (newPs) {
      handleProtocolSubstanceSelect(newPs);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedProtocolSubstance) {
      setError("Please select a substance to log");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await apiClient.post<{ dose: Dose }>("/doses", {
        protocolSubstanceId: selectedProtocolSubstance.id,
        substanceId: selectedProtocolSubstance.substanceId,
        dose: Number(dose),
        doseUnit: selectedProtocolSubstance.doseUnit,
        status: "taken",
        administrationSite: site,
        notes: notes || undefined,
      });

      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to log dose");
    } finally {
      setSubmitting(false);
    }
  };

  // Group substances by whether user has active protocol for them
  const substancesWithProtocol = new Set(
    protocolSubstances.map((ps) => ps.substanceId),
  );
  const substancesWithoutProtocol = substances.filter(
    (s) => !substancesWithProtocol.has(s.id),
  );

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900">Log Dose</h1>
        <p className="text-gray-600 mt-1">Loading your protocols...</p>
        <div className="mt-8 flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900">Log Dose</h1>
      <p className="text-gray-600 mt-1">Record your dose quickly and easily.</p>

      {error && (
        <div className="mt-4 p-3 text-sm text-red-600 bg-red-50 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {/* Protocol Substance Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select Substance
          </label>

          {protocolSubstances.length > 0 ? (
            <>
              <p className="text-sm text-gray-500 mb-3">
                Your active protocol substances:
              </p>
              <div className="grid grid-cols-1 gap-3">
                {protocolSubstances.map((ps) => (
                  <button
                    key={ps.id}
                    type="button"
                    onClick={() => handleProtocolSubstanceSelect(ps)}
                    className={`p-4 rounded-xl border-2 text-left transition-colors ${
                      selectedProtocolSubstance?.id === ps.id
                        ? "border-primary-600 bg-primary-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-gray-900">
                          {ps.substance.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {ps.dose} {ps.doseUnit || ps.substance.doseUnit} •{" "}
                          {ps.frequency?.replace("_", " ") || "as needed"}
                        </div>
                      </div>
                      {selectedProtocolSubstance?.id === ps.id && (
                        <svg
                          className="w-5 h-5 text-primary-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-center">
              <p className="text-gray-600">
                You don't have any active protocols yet.
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Create a protocol below to start logging doses.
              </p>
            </div>
          )}

          {/* Add New Substance Section */}
          {substancesWithoutProtocol.length > 0 && (
            <div className="mt-6">
              <p className="text-sm text-gray-500 mb-3">
                Or start a new protocol for:
              </p>
              <div className="flex flex-wrap gap-2">
                {substancesWithoutProtocol.slice(0, 6).map((substance) => (
                  <button
                    key={substance.id}
                    type="button"
                    onClick={() => handleAddNewSubstance(substance)}
                    className="px-3 py-1.5 text-sm border border-gray-300 rounded-full text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-colors"
                  >
                    + {substance.name}
                  </button>
                ))}
                {substancesWithoutProtocol.length > 6 && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedSubstanceForProtocol(null);
                      setShowQuickProtocolModal(true);
                    }}
                    className="px-3 py-1.5 text-sm border border-dashed border-gray-300 rounded-full text-gray-500 hover:bg-gray-50 hover:border-gray-400 transition-colors"
                  >
                    + More...
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Dose Amount (shown when substance selected) */}
        {selectedProtocolSubstance && (
          <>
            <div>
              <label
                htmlFor="dose"
                className="block text-sm font-medium text-gray-700"
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
                  className="flex-1 block w-full px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  required
                />
                <span className="inline-flex items-center px-4 border border-l-0 border-gray-300 bg-gray-50 text-gray-500 rounded-r-lg">
                  {selectedProtocolSubstance.doseUnit ||
                    selectedProtocolSubstance.substance.doseUnit ||
                    "units"}
                </span>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Protocol dose: {selectedProtocolSubstance.dose}{" "}
                {selectedProtocolSubstance.doseUnit ||
                  selectedProtocolSubstance.substance.doseUnit}
              </p>
            </div>

            {/* Injection Site */}
            <div>
              <label
                htmlFor="site"
                className="block text-sm font-medium text-gray-700"
              >
                Injection Site
              </label>
              <select
                id="site"
                value={site}
                onChange={(e) => setSite(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500"
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
                className="block text-sm font-medium text-gray-700"
              >
                Notes (optional)
              </label>
              <textarea
                id="notes"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any observations or side effects..."
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </>
        )}

        {/* Submit */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!selectedProtocolSubstance || submitting || !dose}
            className="flex-1 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? "Logging..." : "Log Dose"}
          </button>
        </div>
      </form>

      {/* Quick Protocol Modal */}
      <QuickProtocolModal
        isOpen={showQuickProtocolModal}
        onClose={() => {
          setShowQuickProtocolModal(false);
          setSelectedSubstanceForProtocol(null);
        }}
        onProtocolCreated={handleProtocolCreated}
        preselectedSubstance={selectedSubstanceForProtocol}
      />
    </div>
  );
}
