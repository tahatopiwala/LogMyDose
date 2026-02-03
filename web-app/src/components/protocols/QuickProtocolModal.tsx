import { useState, useEffect } from "react";
import { Modal } from "../ui/Modal";
import { ProductSelector } from "../products/ProductSelector";
import { apiClient } from "../../lib/api-client";
import { Substance, Protocol, Product } from "../../types/domain";

interface QuickProtocolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProtocolCreated: (protocolSubstanceId: string) => void;
  preselectedSubstance?: Substance | null;
}

const FREQUENCIES = [
  { value: "daily", label: "Daily" },
  { value: "2x_daily", label: "2x Daily" },
  { value: "3x_weekly", label: "3x Weekly" },
  { value: "weekly", label: "Weekly" },
  { value: "as_needed", label: "As Needed" },
];

type Step = "substance" | "product" | "details";

export function QuickProtocolModal({
  isOpen,
  onClose,
  onProtocolCreated,
  preselectedSubstance,
}: QuickProtocolModalProps) {
  const [substances, setSubstances] = useState<Substance[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Multi-step state
  const [step, setStep] = useState<Step>("substance");

  // Form state
  const [selectedSubstance, setSelectedSubstance] = useState<Substance | null>(
    null,
  );
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [substanceSearch, setSubstanceSearch] = useState("");
  const [protocolName, setProtocolName] = useState<string>("");
  const [protocolDescription, setProtocolDescription] = useState<string>("");
  const [dose, setDose] = useState<string>("");
  const [doseUnit, setDoseUnit] = useState<string>("mcg");
  const [frequency, setFrequency] = useState<string>("daily");
  const [startDate, setStartDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );
  const [endDate, setEndDate] = useState<string>("");

  // Fetch substances on mount
  useEffect(() => {
    if (isOpen && !preselectedSubstance) {
      fetchSubstances();
    }
  }, [isOpen, preselectedSubstance]);

  // Pre-fill form when substance is preselected
  useEffect(() => {
    if (preselectedSubstance) {
      setSelectedSubstance(preselectedSubstance);
      if (preselectedSubstance.defaultDose) {
        setDose(String(preselectedSubstance.defaultDose));
      }
      if (preselectedSubstance.doseUnit) {
        setDoseUnit(preselectedSubstance.doseUnit);
      }
      if (preselectedSubstance.defaultFrequency) {
        setFrequency(preselectedSubstance.defaultFrequency);
      }
      // Skip to product step since substance is preselected
      setStep("product");
    }
  }, [preselectedSubstance]);

  const fetchSubstances = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get<{
        substances: Substance[];
      }>("/substances?limit=100");
      setSubstances(response.substances);
    } catch {
      setError("Failed to load substances");
    } finally {
      setLoading(false);
    }
  };

  const handleSubstanceSelect = (substance: Substance) => {
    setSelectedSubstance(substance);
    // Pre-fill defaults from substance
    if (substance.defaultDose) {
      setDose(String(substance.defaultDose));
    }
    if (substance.doseUnit) {
      setDoseUnit(substance.doseUnit);
    }
    if (substance.defaultFrequency) {
      setFrequency(substance.defaultFrequency);
    }
    // Clear product selection when substance changes
    setSelectedProduct(null);
  };

  const handleProductSelect = (product: Product | null) => {
    setSelectedProduct(product);
    // Pre-fill dose from product if available
    if (product?.defaultDose) {
      setDose(String(product.defaultDose));
    }
    if (product?.doseUnit) {
      setDoseUnit(product.doseUnit);
    }
  };

  const handleProductCreate = (product: Product) => {
    setSelectedProduct(product);
    // Pre-fill dose from newly created product
    if (product.defaultDose) {
      setDose(String(product.defaultDose));
    }
    if (product.doseUnit) {
      setDoseUnit(product.doseUnit);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      if (!selectedSubstance) {
        throw new Error("Please select a substance");
      }

      const response = await apiClient.post<{ protocol: Protocol }>(
        "/protocols",
        {
          source: "custom",
          name: protocolName || undefined,
          description: protocolDescription || undefined,
          startDate,
          endDate: endDate || undefined,
          substances: [
            {
              substanceId: selectedSubstance.id,
              productId: selectedProduct?.id || undefined,
              dose: Number(dose),
              doseUnit,
              frequency,
            },
          ],
        },
      );

      // Find the protocol substance ID from the created protocol
      const createdProtocolSubstance = response.protocol.substances.find(
        (s) => s.substanceId === selectedSubstance.id,
      );

      if (createdProtocolSubstance) {
        onProtocolCreated(createdProtocolSubstance.id);
      }

      // Reset form
      resetForm();
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create protocol",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setStep("substance");
    setSelectedSubstance(null);
    setSelectedProduct(null);
    setSubstanceSearch("");
    setProtocolName("");
    setProtocolDescription("");
    setDose("");
    setDoseUnit("mcg");
    setFrequency("daily");
    setStartDate(new Date().toISOString().split("T")[0]);
    setEndDate("");
    setError(null);
  };

  // Filter substances by search
  const filteredSubstances = substances.filter(
    (s) =>
      s.name.toLowerCase().includes(substanceSearch.toLowerCase()) ||
      s.category?.displayName
        ?.toLowerCase()
        .includes(substanceSearch.toLowerCase()),
  );

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const goToNextStep = () => {
    if (step === "substance" && selectedSubstance) {
      setStep("product");
    } else if (step === "product") {
      setStep("details");
    }
  };

  const goToPreviousStep = () => {
    if (step === "details") {
      setStep("product");
    } else if (step === "product" && !preselectedSubstance) {
      setStep("substance");
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case "substance":
        return "Step 1: Select Substance";
      case "product":
        return "Step 2: Select Product";
      case "details":
        return "Step 3: Protocol Details";
    }
  };

  const renderStepIndicator = () => {
    const steps = preselectedSubstance
      ? [
          { key: "product", label: "Product" },
          { key: "details", label: "Details" },
        ]
      : [
          { key: "substance", label: "Substance" },
          { key: "product", label: "Product" },
          { key: "details", label: "Details" },
        ];

    const currentIndex = steps.findIndex((s) => s.key === step);

    return (
      <div className="flex items-center justify-center mb-6">
        {steps.map((s, i) => (
          <div key={s.key} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                i <= currentIndex
                  ? "bg-primary-500 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {i + 1}
            </div>
            {i < steps.length - 1 && (
              <div
                className={`w-12 h-0.5 ${
                  i < currentIndex ? "bg-primary-500" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={getStepTitle()}
      size="lg"
    >
      <div>
        {renderStepIndicator()}

        {error && (
          <div className="mb-4 p-3 text-sm text-red-600 bg-red-900/30 rounded-lg">
            {error}
          </div>
        )}

        {/* Step 1: Substance Selection */}
        {step === "substance" && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Select a substance to create a protocol for:
              </label>
              {/* Search Input */}
              <div className="relative mb-3">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
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
                <input
                  type="text"
                  placeholder="Search substances..."
                  value={substanceSearch}
                  onChange={(e) => setSubstanceSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-surface-border rounded-lg text-sm bg-surface-raised text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
                </div>
              ) : filteredSubstances.length === 0 ? (
                <div className="py-8 text-center text-sm text-gray-500">
                  No substances found matching "{substanceSearch}"
                </div>
              ) : (
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {filteredSubstances.map((substance) => (
                    <button
                      key={substance.id}
                      type="button"
                      onClick={() => handleSubstanceSelect(substance)}
                      className={`w-full p-3 rounded-lg border text-left transition-colors ${
                        selectedSubstance?.id === substance.id
                          ? "border-primary-600 bg-primary-500/20"
                          : "border-surface-border hover:border-surface-border"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-100">
                            {substance.name}
                          </div>
                          {substance.category && (
                            <div className="text-sm text-gray-500">
                              {substance.category.displayName}
                            </div>
                          )}
                        </div>
                        {selectedSubstance?.id === substance.id && (
                          <svg
                            className="w-5 h-5 text-primary-500"
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
              )}
            </div>

            <div className="flex gap-3 pt-4 border-t border-surface-border">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 py-2.5 px-4 border border-surface-border rounded-lg text-sm font-medium text-gray-300 hover:bg-surface-elevated transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={goToNextStep}
                disabled={!selectedSubstance}
                className="flex-1 py-2.5 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-primary-500 hover:bg-primary-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Product Selection */}
        {step === "product" && selectedSubstance && (
          <div className="space-y-4">
            <div className="p-3 bg-surface-elevated rounded-lg border border-surface-border mb-4">
              <div className="text-sm text-gray-500">Selected substance:</div>
              <div className="font-medium text-gray-100">
                {selectedSubstance.name}
              </div>
            </div>

            <ProductSelector
              substanceId={selectedSubstance.id}
              substanceName={selectedSubstance.name}
              selectedProductId={selectedProduct?.id || null}
              onProductSelect={handleProductSelect}
              onProductCreate={handleProductCreate}
            />

            <div className="flex gap-3 pt-4 border-t border-surface-border">
              {!preselectedSubstance && (
                <button
                  type="button"
                  onClick={goToPreviousStep}
                  className="flex-1 py-2.5 px-4 border border-surface-border rounded-lg text-sm font-medium text-gray-300 hover:bg-surface-elevated transition-colors"
                >
                  Back
                </button>
              )}
              <button
                type="button"
                onClick={goToNextStep}
                className={`py-2.5 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-primary-500 hover:bg-primary-400 transition-colors ${preselectedSubstance ? "flex-1" : "flex-1"}`}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Protocol Details */}
        {step === "details" && selectedSubstance && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Summary */}
            <div className="p-3 bg-surface-elevated rounded-lg border border-surface-border">
              <div className="text-sm text-gray-500">Creating protocol for:</div>
              <div className="font-medium text-gray-100">
                {selectedProduct
                  ? `${selectedProduct.name} (${selectedSubstance.name})`
                  : selectedSubstance.name}
              </div>
            </div>

            {/* Protocol Name */}
            <div>
              <label
                htmlFor="protocolName"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Protocol Name{" "}
                <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                id="protocolName"
                value={protocolName}
                onChange={(e) => setProtocolName(e.target.value)}
                placeholder="e.g., My Semaglutide Protocol"
                className="block w-full px-3 py-2 border border-surface-border rounded-lg bg-surface-raised text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Protocol Description */}
            <div>
              <label
                htmlFor="protocolDescription"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Description{" "}
                <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <textarea
                id="protocolDescription"
                value={protocolDescription}
                onChange={(e) => setProtocolDescription(e.target.value)}
                placeholder="Add any notes about this protocol..."
                rows={2}
                className="block w-full px-3 py-2 border border-surface-border rounded-lg bg-surface-raised text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 resize-none"
              />
            </div>

            {/* Dose Amount */}
            <div>
              <label
                htmlFor="dose"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Dose Amount
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  id="dose"
                  step="any"
                  value={dose}
                  onChange={(e) => setDose(e.target.value)}
                  placeholder="250"
                  className="flex-1 px-3 py-2 border border-surface-border rounded-lg bg-surface-raised text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  required
                />
                <select
                  value={doseUnit}
                  onChange={(e) => setDoseUnit(e.target.value)}
                  className="w-24 px-3 py-2 border border-surface-border rounded-lg bg-surface-raised text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="mcg">mcg</option>
                  <option value="mg">mg</option>
                  <option value="ml">ml</option>
                  <option value="iu">IU</option>
                  <option value="units">units</option>
                </select>
              </div>
            </div>

            {/* Frequency */}
            <div>
              <label
                htmlFor="frequency"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Frequency
              </label>
              <select
                id="frequency"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="block w-full px-3 py-2 border border-surface-border rounded-lg bg-surface-raised text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                {FREQUENCIES.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="startDate"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="block w-full px-3 py-2 border border-surface-border rounded-lg bg-surface-raised text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="endDate"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  End Date{" "}
                  <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  type="date"
                  id="endDate"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate}
                  className="block w-full px-3 py-2 border border-surface-border rounded-lg bg-surface-raised text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-surface-border">
              <button
                type="button"
                onClick={goToPreviousStep}
                className="flex-1 py-2.5 px-4 border border-surface-border rounded-lg text-sm font-medium text-gray-300 hover:bg-surface-elevated transition-colors"
                disabled={submitting}
              >
                Back
              </button>
              <button
                type="submit"
                disabled={submitting || !dose}
                className="flex-1 py-2.5 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-primary-500 hover:bg-primary-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? "Creating..." : "Create Protocol"}
              </button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}
