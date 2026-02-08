import { useState } from "react";
import { Modal } from "../../ui/Modal";
import {
  ProtocolBuilderProvider,
  useProtocolBuilder,
} from "./ProtocolBuilderContext";
import { SubstanceCard } from "./SubstanceCard";
import { SubstanceConfigPanel } from "./SubstanceConfigPanel";
import { AddSubstanceDrawer } from "./AddSubstanceDrawer";
import { SubstanceConfig, applySmartDefaults } from "./types";
import { apiClient } from "@/lib/api-client";
import { Protocol, ProtocolTemplate, Substance } from "@/types/domain";

interface ProtocolBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  onProtocolCreated: (protocolId: string) => void;
  template?: ProtocolTemplate | null;
}

export function ProtocolBuilder({
  isOpen,
  onClose,
  onProtocolCreated,
  template,
}: ProtocolBuilderProps) {
  // Initialize from template if provided
  const initialSubstances: SubstanceConfig[] = [];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ProtocolBuilderProvider initialSubstances={initialSubstances}>
        <ProtocolBuilderContent
          onClose={onClose}
          onProtocolCreated={onProtocolCreated}
          template={template}
        />
      </ProtocolBuilderProvider>
    </Modal>
  );
}

interface ProtocolBuilderContentProps {
  onClose: () => void;
  onProtocolCreated: (protocolId: string) => void;
  template?: ProtocolTemplate | null;
}

function ProtocolBuilderContent({
  onClose,
  onProtocolCreated,
  template,
}: ProtocolBuilderContentProps) {
  const {
    state,
    setName,
    setStartDate,
    openAddDrawer,
    addSubstance,
  } = useProtocolBuilder();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [templateLoaded, setTemplateLoaded] = useState(false);

  // Load template substance if provided
  if (template && !templateLoaded && template.substanceId) {
    setTemplateLoaded(true);
    // Fetch the substance and add it
    apiClient
      .get<{ substance: Substance }>(`/substances/${template.substanceId}`)
      .then((res) => {
        const config = applySmartDefaults(res.substance);
        // Override with template values
        if (template.defaultDose) {
          config.dose = Number(template.defaultDose);
        }
        if (template.doseUnit) {
          config.doseUnit = template.doseUnit;
        }
        if (template.frequency) {
          config.frequency = template.frequency;
        }
        if (template.cycleOnWeeks && template.cycleOffWeeks) {
          config.cyclingEnabled = true;
          config.cycleOnWeeks = template.cycleOnWeeks;
          config.cycleOffWeeks = template.cycleOffWeeks;
        }
        addSubstance(config);
        if (template.name) {
          setName(template.name);
        }
      })
      .catch((err) => {
        console.error("Failed to load template substance:", err);
      });
  }

  const handleSubmit = async () => {
    setError(null);

    if (state.substances.length === 0) {
      setError("Please add at least one substance");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        source: template ? "template" : "custom",
        templateId: template?.id,
        name: state.name || undefined,
        description: state.description || undefined,
        startDate: state.startDate,
        endDate: state.endDate || undefined,
        status: "active",
        substances: state.substances.map((s) => ({
          substanceId: s.substanceId,
          productId: s.productId || undefined,
          dose: s.dose,
          doseUnit: s.doseUnit,
          frequency: s.frequency,
          cycleOnWeeks: s.cyclingEnabled ? s.cycleOnWeeks : undefined,
          cycleOffWeeks: s.cyclingEnabled ? s.cycleOffWeeks : undefined,
          titrationPlan: s.titrationEnabled ? s.titrationPlan : undefined,
          notes: s.notes || undefined,
        })),
      };

      const response = await apiClient.post<{ protocol: Protocol }>(
        "/protocols",
        payload
      );
      onProtocolCreated(response.protocol.id);
    } catch (err) {
      console.error("Failed to create protocol:", err);
      setError("Failed to create protocol. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const editingSubstance = state.editingSubstanceId
    ? state.substances.find((s) => s.tempId === state.editingSubstanceId)
    : null;

  return (
    <div className="flex flex-col max-h-[85vh]">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-surface-border">
        <div>
          <h2 className="text-xl font-semibold text-gray-100">
            {template ? "Start Protocol" : "Create Protocol"}
          </h2>
          {template && (
            <p className="text-sm text-gray-400 mt-0.5">
              Based on: {template.name}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-gray-300 hover:bg-surface-elevated rounded-lg transition-colors"
        >
          <svg
            className="w-5 h-5"
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

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Substances Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-300 uppercase tracking-wide">
              Substances ({state.substances.length})
            </h3>
            <button
              type="button"
              onClick={openAddDrawer}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-primary-400 hover:text-primary-300 hover:bg-primary-500/10 rounded-lg transition-colors"
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Substance
            </button>
          </div>

          {state.substances.length === 0 ? (
            <button
              type="button"
              onClick={openAddDrawer}
              className="w-full p-8 border-2 border-dashed border-surface-border rounded-xl text-center hover:border-primary-500/50 hover:bg-surface-elevated transition-all group"
            >
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-primary-500/20 flex items-center justify-center group-hover:bg-primary-500/30 transition-colors">
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
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
              <p className="text-gray-400 text-sm">
                Add your first substance to get started
              </p>
            </button>
          ) : (
            <div className="space-y-3">
              {state.substances.map((config) => (
                <div key={config.tempId}>
                  <SubstanceCard config={config} />
                  {editingSubstance?.tempId === config.tempId && (
                    <SubstanceConfigPanel config={config} />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Divider */}
        <hr className="border-surface-border" />

        {/* Protocol Details Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-300 uppercase tracking-wide">
            Protocol Details
          </h3>

          {/* Name */}
          <div>
            <label
              htmlFor="protocol-name"
              className="block text-sm text-gray-400 mb-1"
            >
              Name (optional)
            </label>
            <input
              id="protocol-name"
              type="text"
              value={state.name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., My Recovery Stack"
              className="w-full px-3 py-2 bg-surface-raised border border-surface-border rounded-lg text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500"
            />
          </div>

          {/* Start Date */}
          <div>
            <label
              htmlFor="start-date"
              className="block text-sm text-gray-400 mb-1"
            >
              Start Date
            </label>
            <input
              id="start-date"
              type="date"
              value={state.startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 bg-surface-raised border border-surface-border rounded-lg text-gray-100 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500"
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end gap-3 p-6 border-t border-surface-border">
        <button
          type="button"
          onClick={onClose}
          disabled={submitting}
          className="px-4 py-2 text-gray-300 hover:text-gray-100 hover:bg-surface-elevated rounded-lg transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting || state.substances.length === 0}
          className="px-6 py-2 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? "Creating..." : "Create Protocol"}
        </button>
      </div>

      {/* Add Substance Drawer */}
      <AddSubstanceDrawer />
    </div>
  );
}
