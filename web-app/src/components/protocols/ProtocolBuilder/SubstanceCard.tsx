import { SubstanceConfig } from "./types";
import { useProtocolBuilder } from "./ProtocolBuilderContext";

interface SubstanceCardProps {
  config: SubstanceConfig;
}

export function SubstanceCard({ config }: SubstanceCardProps) {
  const { setEditingSubstance, removeSubstance, state } = useProtocolBuilder();
  const isEditing = state.editingSubstanceId === config.tempId;

  const frequencyLabel =
    config.frequency?.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) ||
    "Daily";

  return (
    <div
      className={`bg-surface-card rounded-xl border p-4 transition-all ${
        isEditing
          ? "border-primary-500 ring-1 ring-primary-500/50"
          : "border-surface-border hover:border-surface-hover"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* Substance name */}
          <h3 className="font-semibold text-gray-100 truncate">
            {config.substance.name}
          </h3>

          {/* Dose summary */}
          <p className="text-sm text-gray-400 mt-0.5">
            {config.dose} {config.doseUnit} · {frequencyLabel}
            {config.substance.administrationRoute && (
              <span className="text-gray-500">
                {" "}
                · {config.substance.administrationRoute}
              </span>
            )}
          </p>

          {/* Smart defaults badges */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {config.cyclingEnabled && (
              <SmartDefaultBadge
                label={`${config.cycleOnWeeks}wk on / ${config.cycleOffWeeks}wk off`}
                autoApplied={config.cyclingAutoApplied}
                icon="cycle"
              />
            )}
            {config.titrationEnabled && config.titrationPlan && (
              <SmartDefaultBadge
                label={`Titration to ${config.titrationPlan.targetDose}${config.titrationPlan.doseUnit}`}
                autoApplied={config.titrationAutoApplied}
                icon="titration"
              />
            )}
            {config.product && (
              <span className="inline-flex items-center px-2 py-0.5 bg-surface-elevated rounded text-xs text-gray-400">
                {config.product.name}
              </span>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() =>
              setEditingSubstance(isEditing ? null : config.tempId)
            }
            className="p-1.5 text-gray-400 hover:text-primary-400 hover:bg-surface-elevated rounded-lg transition-colors"
            title={isEditing ? "Close" : "Edit"}
          >
            {isEditing ? (
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            )}
          </button>
          <button
            type="button"
            onClick={() => removeSubstance(config.tempId)}
            className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            title="Remove"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

interface SmartDefaultBadgeProps {
  label: string;
  autoApplied: boolean;
  icon: "cycle" | "titration";
}

function SmartDefaultBadge({ label, autoApplied, icon }: SmartDefaultBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs ${
        autoApplied
          ? "bg-primary-500/20 text-primary-400"
          : "bg-surface-elevated text-gray-400"
      }`}
      title={autoApplied ? "Auto-applied based on substance" : "Manually configured"}
    >
      {icon === "cycle" ? (
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      ) : (
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
        </svg>
      )}
      {label}
    </span>
  );
}
