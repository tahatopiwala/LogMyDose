import { useState } from "react";
import { useProtocolBuilder } from "./ProtocolBuilderContext";
import {
  SubstanceConfig,
  FREQUENCY_OPTIONS,
  DOSE_UNIT_OPTIONS,
  findTitrationPlan,
} from "./types";
import { ProductSelector } from "../../products/ProductSelector";
import { Product } from "@/types/domain";

interface SubstanceConfigPanelProps {
  config: SubstanceConfig;
}

export function SubstanceConfigPanel({ config }: SubstanceConfigPanelProps) {
  const { updateSubstance, setEditingSubstance } = useProtocolBuilder();
  const [showAdvanced, setShowAdvanced] = useState(
    config.cyclingEnabled || config.titrationEnabled || config.productId !== null
  );

  const titrationPlan = findTitrationPlan(config.substance.name);
  const hasTitrationOption = !!titrationPlan;

  const handleDoseChange = (value: string) => {
    const dose = parseFloat(value) || 0;
    updateSubstance(config.tempId, { dose });
  };

  const handleDoseUnitChange = (value: string) => {
    updateSubstance(config.tempId, { doseUnit: value });
  };

  const handleFrequencyChange = (value: string) => {
    updateSubstance(config.tempId, { frequency: value });
  };

  const handleCyclingToggle = (enabled: boolean) => {
    updateSubstance(config.tempId, {
      cyclingEnabled: enabled,
      cycleOnWeeks: enabled
        ? config.cycleOnWeeks || config.substance.commonCycleOnWeeks || 4
        : null,
      cycleOffWeeks: enabled
        ? config.cycleOffWeeks || config.substance.commonCycleOffWeeks || 4
        : null,
      cyclingAutoApplied: false,
    });
  };

  const handleCycleWeeksChange = (
    field: "cycleOnWeeks" | "cycleOffWeeks",
    value: string
  ) => {
    const weeks = parseInt(value) || 0;
    updateSubstance(config.tempId, {
      [field]: weeks,
      cyclingAutoApplied: false,
    });
  };

  const handleTitrationToggle = (enabled: boolean) => {
    if (enabled && titrationPlan) {
      updateSubstance(config.tempId, {
        titrationEnabled: true,
        titrationPlan,
        dose: titrationPlan.steps[0].doseAmount,
        doseUnit: titrationPlan.steps[0].doseUnit,
        titrationAutoApplied: false,
      });
    } else {
      updateSubstance(config.tempId, {
        titrationEnabled: false,
        titrationPlan: null,
        titrationAutoApplied: false,
      });
    }
  };

  const handleProductSelect = (product: Product | null) => {
    updateSubstance(config.tempId, {
      productId: product?.id || null,
      product,
    });
  };

  const handleProductCreate = (product: Product) => {
    updateSubstance(config.tempId, {
      productId: product.id,
      product,
    });
  };

  return (
    <div className="bg-surface-elevated rounded-xl border border-surface-border p-4 mt-2 space-y-4">
      {/* Basic Settings */}
      <div className="grid grid-cols-2 gap-4">
        {/* Dose */}
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">
            Dose
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              value={config.dose}
              onChange={(e) => handleDoseChange(e.target.value)}
              className="flex-1 px-3 py-2 bg-surface-raised border border-surface-border rounded-lg text-gray-100 text-sm focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500"
              min="0"
              step="any"
            />
            <select
              value={config.doseUnit}
              onChange={(e) => handleDoseUnitChange(e.target.value)}
              className="px-3 py-2 bg-surface-raised border border-surface-border rounded-lg text-gray-100 text-sm focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500"
            >
              {DOSE_UNIT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Frequency */}
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">
            Frequency
          </label>
          <select
            value={config.frequency}
            onChange={(e) => handleFrequencyChange(e.target.value)}
            className="w-full px-3 py-2 bg-surface-raised border border-surface-border rounded-lg text-gray-100 text-sm focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500"
          >
            {FREQUENCY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Advanced Settings Toggle */}
      <button
        type="button"
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-300 transition-colors"
      >
        <svg
          className={`w-4 h-4 transition-transform ${showAdvanced ? "rotate-90" : ""}`}
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
        Advanced Settings
      </button>

      {/* Advanced Settings Content */}
      {showAdvanced && (
        <div className="space-y-4 pt-2 border-t border-surface-border">
          {/* Cycling */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={config.cyclingEnabled}
                onChange={(e) => handleCyclingToggle(e.target.checked)}
                className="w-4 h-4 rounded border-surface-border bg-surface-raised text-primary-500 focus:ring-primary-500/50"
              />
              <span className="text-sm text-gray-300">
                Cycling
                {config.substance.requiresCycling && (
                  <span className="ml-1 text-xs text-primary-400">
                    (recommended)
                  </span>
                )}
              </span>
            </label>
            {config.cyclingEnabled && (
              <div className="flex items-center gap-2 ml-6">
                <input
                  type="number"
                  value={config.cycleOnWeeks || ""}
                  onChange={(e) =>
                    handleCycleWeeksChange("cycleOnWeeks", e.target.value)
                  }
                  className="w-16 px-2 py-1.5 bg-surface-raised border border-surface-border rounded text-gray-100 text-sm text-center"
                  min="1"
                />
                <span className="text-sm text-gray-400">weeks on</span>
                <input
                  type="number"
                  value={config.cycleOffWeeks || ""}
                  onChange={(e) =>
                    handleCycleWeeksChange("cycleOffWeeks", e.target.value)
                  }
                  className="w-16 px-2 py-1.5 bg-surface-raised border border-surface-border rounded text-gray-100 text-sm text-center"
                  min="1"
                />
                <span className="text-sm text-gray-400">weeks off</span>
              </div>
            )}
          </div>

          {/* Titration */}
          {hasTitrationOption && (
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.titrationEnabled}
                  onChange={(e) => handleTitrationToggle(e.target.checked)}
                  className="w-4 h-4 rounded border-surface-border bg-surface-raised text-primary-500 focus:ring-primary-500/50"
                />
                <span className="text-sm text-gray-300">
                  Standard Titration
                  <span className="ml-1 text-xs text-gray-500">
                    ({titrationPlan.steps.length} steps to{" "}
                    {titrationPlan.targetDose}
                    {titrationPlan.doseUnit})
                  </span>
                </span>
              </label>
              {config.titrationEnabled && titrationPlan && (
                <div className="ml-6 p-2 bg-surface-raised rounded-lg">
                  <p className="text-xs text-gray-400 mb-1">
                    {titrationPlan.notes}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {titrationPlan.steps.map((step, idx) => (
                      <span
                        key={idx}
                        className={`text-xs px-1.5 py-0.5 rounded ${
                          idx === 0
                            ? "bg-primary-500/30 text-primary-300"
                            : "bg-surface-elevated text-gray-500"
                        }`}
                      >
                        {step.doseAmount}
                        {step.doseUnit}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Product Selection */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={config.productId !== null}
                onChange={(e) => {
                  if (!e.target.checked) {
                    handleProductSelect(null);
                  }
                }}
                className="w-4 h-4 rounded border-surface-border bg-surface-raised text-primary-500 focus:ring-primary-500/50"
              />
              <span className="text-sm text-gray-300">Link to Product</span>
            </label>
            {config.productId !== null && (
              <div className="ml-6">
                <ProductSelector
                  substanceId={config.substanceId}
                  substanceName={config.substance.name}
                  selectedProductId={config.productId}
                  onProductSelect={handleProductSelect}
                  onProductCreate={handleProductCreate}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Done button */}
      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={() => setEditingSubstance(null)}
          className="px-4 py-2 bg-primary-500 text-white text-sm font-medium rounded-lg hover:bg-primary-400 transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  );
}
