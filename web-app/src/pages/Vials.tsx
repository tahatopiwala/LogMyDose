import { useState } from "react";
import {
  useVials,
  useCreateVial,
  useReconstituteVial,
  useMarkVialDepleted,
  useProducts,
} from "@/hooks/useVials";
import { Vial, VialStatus, DiluentType, Product } from "@/types/domain";

type FilterStatus = "all" | VialStatus;

const STATUS_STYLES: Record<VialStatus, string> = {
  active: "bg-green-500/20 text-green-400 border-green-500/30",
  depleted: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  expired: "bg-red-500/20 text-red-400 border-red-500/30",
  disposed: "bg-slate-500/20 text-slate-400 border-slate-500/30",
};

const DILUENT_LABELS: Record<DiluentType, string> = {
  bacteriostatic_water: "Bacteriostatic Water",
  saline: "Saline",
  sterile_water: "Sterile Water",
};

export function Vials() {
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showReconstituteModal, setShowReconstituteModal] = useState(false);
  const [selectedVial, setSelectedVial] = useState<Vial | null>(null);

  const { data, isLoading, error } = useVials({
    status: statusFilter === "all" ? undefined : statusFilter,
    limit: 50,
  });

  const vials = data?.vials || [];

  const handleReconstitute = (vial: Vial) => {
    setSelectedVial(vial);
    setShowReconstituteModal(true);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">Vial Inventory</h1>
          <p className="text-gray-400 mt-1">
            Track your peptide vials and reconstitution
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 bg-primary-500 text-surface-base font-semibold px-4 py-2 rounded-lg hover:bg-primary-400 transition-colors"
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
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Vial
        </button>
      </div>

      {/* Status Filter */}
      <div className="flex gap-2 mb-6">
        {(["all", "active", "depleted", "expired", "disposed"] as FilterStatus[]).map(
          (status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-full font-medium text-sm transition-colors ${
                statusFilter === status
                  ? "bg-primary-500 text-surface-base"
                  : "bg-surface-card text-gray-400 hover:bg-surface-elevated"
              }`}
            >
              {status === "all" ? "All" : status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          )
        )}
      </div>

      {/* Vials Grid */}
      {isLoading ? (
        <div className="bg-surface-card border border-surface-border rounded-xl p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
          <p className="text-gray-400 mt-4">Loading vials...</p>
        </div>
      ) : error ? (
        <div className="bg-red-900/20 border border-red-900/50 rounded-xl p-8 text-center">
          <p className="text-red-400">Failed to load vials</p>
        </div>
      ) : vials.length === 0 ? (
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
              d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
            />
          </svg>
          <p className="text-gray-300 mt-4">No vials found</p>
          <p className="text-gray-500 text-sm mt-1">
            Add a vial to start tracking your inventory
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vials.map((vial) => (
            <VialCard
              key={vial.id}
              vial={vial}
              onReconstitute={() => handleReconstitute(vial)}
            />
          ))}
        </div>
      )}

      {/* Create Vial Modal */}
      {showCreateModal && (
        <CreateVialModal onClose={() => setShowCreateModal(false)} />
      )}

      {/* Reconstitute Modal */}
      {showReconstituteModal && selectedVial && (
        <ReconstituteModal
          vial={selectedVial}
          onClose={() => {
            setShowReconstituteModal(false);
            setSelectedVial(null);
          }}
        />
      )}
    </div>
  );
}

interface VialCardProps {
  vial: Vial;
  onReconstitute: () => void;
}

function VialCard({ vial, onReconstitute }: VialCardProps) {
  const markDepleted = useMarkVialDepleted();

  const isReconstituted = !!vial.reconstitutedAt;
  const remainingPercent =
    vial.vialAmountMcg && vial.remainingAmountMcg
      ? (Number(vial.remainingAmountMcg) / Number(vial.vialAmountMcg)) * 100
      : null;

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const isExpiringSoon = () => {
    const expDate = vial.calculatedExpDate || vial.manufacturerExpDate;
    if (!expDate) return false;
    const daysUntilExp = Math.floor(
      (new Date(expDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    return daysUntilExp <= 7 && daysUntilExp > 0;
  };

  const handleMarkDepleted = () => {
    if (confirm("Mark this vial as depleted?")) {
      markDepleted.mutate(vial.id);
    }
  };

  return (
    <div className="bg-surface-card border border-surface-border rounded-xl p-5">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-100">
            {vial.product?.name || "Unknown Product"}
          </h3>
          <p className="text-sm text-gray-500">
            {vial.product?.substance?.name || "Unknown Substance"}
          </p>
        </div>
        <span
          className={`px-2 py-1 text-xs font-semibold rounded-full border ${STATUS_STYLES[vial.status]}`}
        >
          {vial.status.toUpperCase()}
        </span>
      </div>

      {/* Content Info */}
      <div className="space-y-3 mb-4">
        {vial.vialAmountMcg && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Vial Amount</span>
            <span className="text-gray-200">{vial.vialAmountMcg} mcg</span>
          </div>
        )}

        {isReconstituted && (
          <>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Concentration</span>
              <span className="text-gray-200">
                {vial.concentrationMcgMl} mcg/mL
              </span>
            </div>
            {vial.remainingAmountMcg !== null && (
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Remaining</span>
                  <span className="text-gray-200">
                    {vial.remainingAmountMcg} mcg
                  </span>
                </div>
                {remainingPercent !== null && (
                  <div className="h-2 bg-surface-elevated rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        remainingPercent > 50
                          ? "bg-green-500"
                          : remainingPercent > 20
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                      style={{ width: `${remainingPercent}%` }}
                    />
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {vial.lotNumber && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Lot Number</span>
            <span className="text-gray-200 font-mono">{vial.lotNumber}</span>
          </div>
        )}

        {vial.storageLocation && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Storage</span>
            <span className="text-gray-200">{vial.storageLocation}</span>
          </div>
        )}
      </div>

      {/* Dates */}
      <div className="border-t border-surface-border pt-3 mb-4">
        {isReconstituted && vial.reconstitutedAt && (
          <div className="flex items-center gap-2 text-xs text-blue-400 mb-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
            Reconstituted {formatDate(vial.reconstitutedAt)}
          </div>
        )}
        {(vial.calculatedExpDate || vial.manufacturerExpDate) && (
          <div
            className={`flex items-center gap-2 text-xs ${
              isExpiringSoon() ? "text-amber-400" : "text-gray-500"
            }`}
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Expires {formatDate(vial.calculatedExpDate || vial.manufacturerExpDate)}
            {isExpiringSoon() && " (Soon!)"}
          </div>
        )}
      </div>

      {/* Actions */}
      {vial.status === "active" && (
        <div className="flex gap-2">
          {!isReconstituted && (
            <button
              onClick={onReconstitute}
              className="flex-1 px-3 py-2 bg-blue-500/20 text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-500/30 transition-colors"
            >
              Reconstitute
            </button>
          )}
          <button
            onClick={handleMarkDepleted}
            disabled={markDepleted.isPending}
            className="flex-1 px-3 py-2 bg-surface-elevated text-gray-400 rounded-lg text-sm font-medium hover:bg-surface-hover transition-colors disabled:opacity-50"
          >
            {markDepleted.isPending ? "..." : "Mark Depleted"}
          </button>
        </div>
      )}
    </div>
  );
}

interface CreateVialModalProps {
  onClose: () => void;
}

function CreateVialModal({ onClose }: CreateVialModalProps) {
  const [productId, setProductId] = useState("");
  const [vialAmountMcg, setVialAmountMcg] = useState("");
  const [lotNumber, setLotNumber] = useState("");
  const [manufacturerExpDate, setManufacturerExpDate] = useState("");
  const [storageLocation, setStorageLocation] = useState("");
  const [requiresRefrigeration, setRequiresRefrigeration] = useState(true);
  const [notes, setNotes] = useState("");

  const { data: productsData } = useProducts();
  const createVial = useCreateVial();

  const products = productsData?.products || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId) return;

    createVial.mutate(
      {
        productId,
        vialAmountMcg: vialAmountMcg ? parseFloat(vialAmountMcg) : undefined,
        lotNumber: lotNumber || undefined,
        manufacturerExpDate: manufacturerExpDate
          ? new Date(manufacturerExpDate).toISOString()
          : undefined,
        storageLocation: storageLocation || undefined,
        requiresRefrigeration,
        notes: notes || undefined,
      },
      {
        onSuccess: () => onClose(),
      }
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-surface-card border border-surface-border rounded-2xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-100">Add New Vial</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-200">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Product Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Product *
            </label>
            <select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="w-full bg-surface-elevated border border-surface-border rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            >
              <option value="">Select a product...</option>
              {products.map((product: Product) => (
                <option key={product.id} value={product.id}>
                  {product.name} ({product.substance?.name})
                </option>
              ))}
            </select>
          </div>

          {/* Vial Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Vial Amount (mcg)
            </label>
            <input
              type="number"
              value={vialAmountMcg}
              onChange={(e) => setVialAmountMcg(e.target.value)}
              placeholder="e.g., 5000"
              className="w-full bg-surface-elevated border border-surface-border rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Lot Number */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Lot Number
            </label>
            <input
              type="text"
              value={lotNumber}
              onChange={(e) => setLotNumber(e.target.value)}
              placeholder="e.g., LOT2024A"
              className="w-full bg-surface-elevated border border-surface-border rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Expiration Date */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Manufacturer Expiration Date
            </label>
            <input
              type="date"
              value={manufacturerExpDate}
              onChange={(e) => setManufacturerExpDate(e.target.value)}
              className="w-full bg-surface-elevated border border-surface-border rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Storage Location */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Storage Location
            </label>
            <input
              type="text"
              value={storageLocation}
              onChange={(e) => setStorageLocation(e.target.value)}
              placeholder="e.g., Main Fridge"
              className="w-full bg-surface-elevated border border-surface-border rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Refrigeration Toggle */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-300">
              Requires Refrigeration
            </label>
            <button
              type="button"
              onClick={() => setRequiresRefrigeration(!requiresRefrigeration)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                requiresRefrigeration ? "bg-primary-500" : "bg-surface-elevated"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  requiresRefrigeration ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Any additional notes..."
              className="w-full bg-surface-elevated border border-surface-border rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!productId || createVial.isPending}
            className="w-full bg-primary-500 text-surface-base font-bold py-3 rounded-lg hover:bg-primary-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createVial.isPending ? "Creating..." : "Add Vial"}
          </button>
        </form>
      </div>
    </div>
  );
}

interface ReconstituteModalProps {
  vial: Vial;
  onClose: () => void;
}

function ReconstituteModal({ vial, onClose }: ReconstituteModalProps) {
  const [diluentType, setDiluentType] = useState<DiluentType>("bacteriostatic_water");
  const [diluentVolumeMl, setDiluentVolumeMl] = useState("");

  const reconstitute = useReconstituteVial();

  const calculatedConcentration =
    vial.vialAmountMcg && diluentVolumeMl
      ? (Number(vial.vialAmountMcg) / parseFloat(diluentVolumeMl)).toFixed(2)
      : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!diluentVolumeMl) return;

    reconstitute.mutate(
      {
        id: vial.id,
        data: {
          diluentType,
          diluentVolumeMl: parseFloat(diluentVolumeMl),
        },
      },
      {
        onSuccess: () => onClose(),
      }
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-surface-card border border-surface-border rounded-2xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-100">Reconstitute Vial</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-200">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Vial Info */}
        <div className="bg-surface-elevated rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-400">Product</p>
          <p className="font-medium text-gray-100">{vial.product?.name}</p>
          {vial.vialAmountMcg && (
            <p className="text-sm text-gray-400 mt-2">
              Amount: <span className="text-gray-200">{vial.vialAmountMcg} mcg</span>
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Diluent Type */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Diluent Type
            </label>
            <div className="grid grid-cols-1 gap-2">
              {(Object.keys(DILUENT_LABELS) as DiluentType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setDiluentType(type)}
                  className={`p-3 rounded-lg border text-left transition-colors ${
                    diluentType === type
                      ? "border-primary-500 bg-primary-500/20 text-primary-400"
                      : "border-surface-border bg-surface-elevated text-gray-400 hover:bg-surface-hover"
                  }`}
                >
                  {DILUENT_LABELS[type]}
                </button>
              ))}
            </div>
          </div>

          {/* Diluent Volume */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Diluent Volume (mL) *
            </label>
            <input
              type="number"
              step="0.1"
              value={diluentVolumeMl}
              onChange={(e) => setDiluentVolumeMl(e.target.value)}
              placeholder="e.g., 2"
              className="w-full bg-surface-elevated border border-surface-border rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>

          {/* Calculated Concentration */}
          {calculatedConcentration && (
            <div className="bg-primary-500/10 border border-primary-500/30 rounded-lg p-4">
              <p className="text-sm text-gray-400">Resulting Concentration</p>
              <p className="text-2xl font-bold text-primary-500">
                {calculatedConcentration} <span className="text-lg">mcg/mL</span>
              </p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={!diluentVolumeMl || reconstitute.isPending}
            className="w-full bg-blue-500 text-white font-bold py-3 rounded-lg hover:bg-blue-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {reconstitute.isPending ? "Reconstituting..." : "Reconstitute Vial"}
          </button>
        </form>
      </div>
    </div>
  );
}
