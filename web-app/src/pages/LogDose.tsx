import { useState } from "react";
import { useNavigate } from "react-router-dom";

const substances = [
  { id: 1, name: "BPC-157", defaultDose: "250", unit: "mcg" },
  { id: 2, name: "TB-500", defaultDose: "2.5", unit: "mg" },
  { id: 3, name: "GHK-Cu", defaultDose: "200", unit: "mcg" },
];

const injectionSites = [
  "Subcutaneous - Abdomen",
  "Subcutaneous - Thigh",
  "Subcutaneous - Arm",
  "Intramuscular - Deltoid",
  "Intramuscular - Gluteal",
];

export function LogDose() {
  const navigate = useNavigate();
  const [selectedSubstance, setSelectedSubstance] = useState(substances[0]);
  const [dose, setDose] = useState(selectedSubstance.defaultDose);
  const [site, setSite] = useState(injectionSites[0]);
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement dose logging
    console.log("Log dose:", {
      substance: selectedSubstance,
      dose,
      site,
      notes,
    });
    navigate("/dashboard");
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900">Log Dose</h1>
      <p className="text-gray-600 mt-1">Record your dose quickly and easily.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {/* Substance Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Substance
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {substances.map((substance) => (
              <button
                key={substance.id}
                type="button"
                onClick={() => {
                  setSelectedSubstance(substance);
                  setDose(substance.defaultDose);
                }}
                className={`p-4 rounded-xl border-2 text-left transition-colors ${
                  selectedSubstance.id === substance.id
                    ? "border-primary-600 bg-primary-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="font-medium text-gray-900">
                  {substance.name}
                </div>
                <div className="text-sm text-gray-500">
                  {substance.defaultDose} {substance.unit}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Dose Amount */}
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
            />
            <span className="inline-flex items-center px-4 border border-l-0 border-gray-300 bg-gray-50 text-gray-500 rounded-r-lg">
              {selectedSubstance.unit}
            </span>
          </div>
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
            {injectionSites.map((s) => (
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

        {/* Submit */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
          >
            Log Dose
          </button>
        </div>
      </form>
    </div>
  );
}
