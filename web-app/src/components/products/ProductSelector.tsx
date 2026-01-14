import { useState, useEffect } from "react";
import { apiClient } from "../../lib/api-client";
import { Product } from "../../types/domain";

interface ProductSelectorProps {
  substanceId: string;
  substanceName: string;
  selectedProductId: string | null;
  onProductSelect: (product: Product | null) => void;
  onProductCreate: (product: Product) => void;
}

interface CreateProductForm {
  name: string;
  defaultDose: string;
  doseUnit: string;
}

export function ProductSelector({
  substanceId,
  substanceName,
  selectedProductId,
  onProductSelect,
  onProductCreate,
}: ProductSelectorProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [createForm, setCreateForm] = useState<CreateProductForm>({
    name: "",
    defaultDose: "",
    doseUnit: "mcg",
  });

  // Filter products by search query
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  useEffect(() => {
    if (substanceId) {
      fetchProducts();
    }
  }, [substanceId]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<{ products: Product[] }>(
        `/products/by-substance/${substanceId}`,
      );
      setProducts(response.products);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setError(null);

    try {
      const response = await apiClient.post<{ product: Product }>("/products", {
        substanceId,
        name: createForm.name,
        defaultDose: createForm.defaultDose
          ? Number(createForm.defaultDose)
          : undefined,
        doseUnit: createForm.doseUnit || undefined,
      });

      // Add to local list and select it
      setProducts((prev) => [...prev, response.product]);
      onProductCreate(response.product);
      onProductSelect(response.product);

      // Reset form
      setCreateForm({ name: "", defaultDose: "", doseUnit: "mcg" });
      setShowCreateForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create product");
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600"></div>
        <span className="ml-2 text-sm text-gray-500">Loading products...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Product{" "}
          <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <p className="text-xs text-gray-500 mb-3">
          Select a branded product for {substanceName}, or skip to use the
          generic substance.
        </p>
      </div>

      {error && (
        <div className="p-2 text-sm text-red-600 bg-red-50 rounded-lg">
          {error}
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
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
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      {/* Product Options */}
      <div className="max-h-64 overflow-y-auto space-y-2">
        {/* No Product Option */}
        <button
          type="button"
          onClick={() => onProductSelect(null)}
          className={`w-full p-3 rounded-lg border-2 text-left transition-colors ${
            selectedProductId === null
              ? "border-primary-600 bg-primary-50"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">
                No specific product
              </div>
              <div className="text-sm text-gray-500">
                Use generic {substanceName}
              </div>
            </div>
            {selectedProductId === null && (
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

        {/* Global Products */}
        {filteredProducts
          .filter((p) => p.isGlobal)
          .map((product) => (
            <button
              key={product.id}
              type="button"
              onClick={() => onProductSelect(product)}
              className={`w-full p-3 rounded-lg border-2 text-left transition-colors ${
                selectedProductId === product.id
                  ? "border-primary-600 bg-primary-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">{product.name}</div>
                  <div className="text-sm text-gray-500">
                    {product.defaultDose && product.doseUnit
                      ? `${product.defaultDose} ${product.doseUnit}`
                      : "No default dose"}
                  </div>
                </div>
                {selectedProductId === product.id && (
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

        {/* Custom Products (user's own) */}
        {filteredProducts.filter((p) => !p.isGlobal).length > 0 && (
          <>
            <div className="text-xs text-gray-400 uppercase tracking-wide pt-2">
              Your Custom Products
            </div>
            {filteredProducts
              .filter((p) => !p.isGlobal)
              .map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => onProductSelect(product)}
                  className={`w-full p-3 rounded-lg border-2 text-left transition-colors ${
                    selectedProductId === product.id
                      ? "border-primary-600 bg-primary-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">
                        {product.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {product.defaultDose && product.doseUnit
                          ? `${product.defaultDose} ${product.doseUnit}`
                          : "No default dose"}{" "}
                        <span className="text-xs text-gray-400">(custom)</span>
                      </div>
                    </div>
                    {selectedProductId === product.id && (
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
          </>
        )}

        {/* Empty state for search */}
        {searchQuery && filteredProducts.length === 0 && (
          <div className="py-4 text-center text-sm text-gray-500">
            No products found matching "{searchQuery}"
          </div>
        )}
      </div>

      {/* Create Custom Product */}
      {!showCreateForm ? (
        <button
          type="button"
          onClick={() => setShowCreateForm(true)}
          className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-gray-400 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
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
          Create custom product
        </button>
      ) : (
        <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            Create Custom Product
          </h4>
          <form onSubmit={handleCreateProduct} className="space-y-3">
            <div>
              <label
                htmlFor="productName"
                className="block text-xs font-medium text-gray-700 mb-1"
              >
                Product Name *
              </label>
              <input
                type="text"
                id="productName"
                value={createForm.name}
                onChange={(e) =>
                  setCreateForm((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="e.g., Ozempic 0.25mg"
                className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label
                  htmlFor="productDose"
                  className="block text-xs font-medium text-gray-700 mb-1"
                >
                  Default Dose
                </label>
                <input
                  type="number"
                  id="productDose"
                  step="any"
                  value={createForm.defaultDose}
                  onChange={(e) =>
                    setCreateForm((prev) => ({
                      ...prev,
                      defaultDose: e.target.value,
                    }))
                  }
                  placeholder="250"
                  className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label
                  htmlFor="productUnit"
                  className="block text-xs font-medium text-gray-700 mb-1"
                >
                  Unit
                </label>
                <select
                  id="productUnit"
                  value={createForm.doseUnit}
                  onChange={(e) =>
                    setCreateForm((prev) => ({
                      ...prev,
                      doseUnit: e.target.value,
                    }))
                  }
                  className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="mcg">mcg</option>
                  <option value="mg">mg</option>
                  <option value="ml">ml</option>
                  <option value="iu">IU</option>
                  <option value="units">units</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  setCreateForm({ name: "", defaultDose: "", doseUnit: "mcg" });
                }}
                className="flex-1 py-2 px-3 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                disabled={creating}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={creating || !createForm.name}
                className="flex-1 py-2 px-3 text-sm border border-transparent rounded-lg text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {creating ? "Creating..." : "Create"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
