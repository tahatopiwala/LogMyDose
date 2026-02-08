import { useState, useEffect, useMemo } from "react";
import { useProtocolBuilder } from "./ProtocolBuilderContext";
import { applySmartDefaults } from "./types";
import { apiClient } from "@/lib/api-client";
import { Substance, SubstanceCategory } from "@/types/domain";

type Tab = "search" | "browse";

export function AddSubstanceDrawer() {
  const { state, addSubstance, closeAddDrawer } = useProtocolBuilder();
  const [tab, setTab] = useState<Tab>("search");
  const [searchQuery, setSearchQuery] = useState("");
  const [substances, setSubstances] = useState<Substance[]>([]);
  const [categories, setCategories] = useState<SubstanceCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [addedId, setAddedId] = useState<string | null>(null);

  // Fetch substances and categories on mount
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [substancesRes, categoriesRes] = await Promise.all([
          apiClient.get<{ substances: Substance[] }>("/substances?limit=100"),
          apiClient.get<{ categories: SubstanceCategory[] }>(
            "/substances/categories"
          ),
        ]);
        setSubstances(substancesRes.substances || []);
        setCategories(categoriesRes.categories || []);
      } catch (error) {
        console.error("Failed to fetch substances:", error);
      } finally {
        setLoading(false);
      }
    }
    if (state.addDrawerOpen) {
      fetchData();
    }
  }, [state.addDrawerOpen]);

  // Filter substances based on search or category
  const filteredSubstances = useMemo(() => {
    let result = substances;

    // Exclude already added substances
    const addedIds = new Set(state.substances.map((s) => s.substanceId));
    result = result.filter((s) => !addedIds.has(s.id));

    if (tab === "search" && searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(query) ||
          s.aliases?.some((a) => a.toLowerCase().includes(query))
      );
    }

    if (tab === "browse" && selectedCategory) {
      result = result.filter((s) => s.categoryId === selectedCategory);
    }

    return result;
  }, [substances, state.substances, tab, searchQuery, selectedCategory]);

  const handleSelectSubstance = (substance: Substance) => {
    const config = applySmartDefaults(substance);
    addSubstance(config);
    setAddedId(substance.id);
    // Show brief confirmation then close
    setTimeout(() => {
      setAddedId(null);
    }, 1000);
  };

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeAddDrawer();
      }
    };
    if (state.addDrawerOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [state.addDrawerOpen, closeAddDrawer]);

  if (!state.addDrawerOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={closeAddDrawer}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-surface-base border-l border-surface-border z-50 flex flex-col shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-surface-border">
          <h2 className="text-lg font-semibold text-gray-100">Add Substance</h2>
          <button
            type="button"
            onClick={closeAddDrawer}
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

        {/* Tabs */}
        <div className="flex border-b border-surface-border">
          <button
            type="button"
            onClick={() => setTab("search")}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              tab === "search"
                ? "text-primary-400 border-b-2 border-primary-500"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            Search
          </button>
          <button
            type="button"
            onClick={() => setTab("browse")}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              tab === "browse"
                ? "text-primary-400 border-b-2 border-primary-500"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            Browse
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-pulse text-gray-500">Loading...</div>
            </div>
          ) : (
            <>
              {/* Search Tab */}
              {tab === "search" && (
                <div className="space-y-4">
                  {/* Search Input */}
                  <div className="relative">
                    <svg
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
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
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-surface-raised border border-surface-border rounded-lg text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500"
                      autoFocus
                    />
                  </div>

                  {/* Results */}
                  <SubstanceList
                    substances={filteredSubstances}
                    onSelect={handleSelectSubstance}
                    addedId={addedId}
                    emptyMessage={
                      searchQuery
                        ? "No substances match your search"
                        : "Type to search substances"
                    }
                  />
                </div>
              )}

              {/* Browse Tab */}
              {tab === "browse" && (
                <div className="space-y-4">
                  {/* Category Pills */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedCategory(null)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        selectedCategory === null
                          ? "bg-primary-500 text-white"
                          : "bg-surface-elevated text-gray-300 hover:bg-surface-hover"
                      }`}
                    >
                      All
                    </button>
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => setSelectedCategory(category.id)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                          selectedCategory === category.id
                            ? "bg-primary-500 text-white"
                            : "bg-surface-elevated text-gray-300 hover:bg-surface-hover"
                        }`}
                      >
                        {category.displayName}
                      </button>
                    ))}
                  </div>

                  {/* Results */}
                  <SubstanceList
                    substances={filteredSubstances}
                    onSelect={handleSelectSubstance}
                    addedId={addedId}
                    emptyMessage="No substances in this category"
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

interface SubstanceListProps {
  substances: Substance[];
  onSelect: (substance: Substance) => void;
  addedId: string | null;
  emptyMessage: string;
}

function SubstanceList({
  substances,
  onSelect,
  addedId,
  emptyMessage,
}: SubstanceListProps) {
  if (substances.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 text-sm">{emptyMessage}</div>
    );
  }

  return (
    <div className="space-y-2">
      {substances.map((substance) => {
        const isAdded = addedId === substance.id;
        return (
          <button
            key={substance.id}
            type="button"
            onClick={() => !isAdded && onSelect(substance)}
            disabled={isAdded}
            className={`w-full text-left p-3 rounded-lg border transition-all ${
              isAdded
                ? "bg-green-500/20 border-green-500/50"
                : "bg-surface-card border-surface-border hover:border-primary-500/50 hover:bg-surface-elevated"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-100">{substance.name}</h4>
                <p className="text-xs text-gray-500 mt-0.5">
                  {substance.defaultDose && (
                    <span>
                      {String(substance.defaultDose)} {substance.doseUnit}
                    </span>
                  )}
                  {substance.defaultFrequency && (
                    <span>
                      {" "}
                      · {substance.defaultFrequency.replace(/_/g, " ")}
                    </span>
                  )}
                  {substance.requiresCycling && (
                    <span className="ml-2 text-primary-400">• Cycling</span>
                  )}
                </p>
              </div>
              {isAdded ? (
                <span className="flex items-center gap-1 text-green-400 text-sm">
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
                  Added
                </span>
              ) : (
                <svg
                  className="w-5 h-5 text-gray-500"
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
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
