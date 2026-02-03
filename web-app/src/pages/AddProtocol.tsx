import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiClient } from "@/lib/api-client";
import {
  ProtocolTemplate,
  SubstanceCategory,
} from "@/types/domain";

export function AddProtocol() {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<ProtocolTemplate[]>([]);
  const [categories, setCategories] = useState<SubstanceCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [templatesRes, categoriesRes] = await Promise.all([
          apiClient.get<{ templates: ProtocolTemplate[] }>(
            "/protocols/templates?limit=50",
          ),
          apiClient.get<{ categories: SubstanceCategory[] }>(
            "/substances/categories",
          ),
        ]);
        setTemplates(templatesRes.templates || []);
        setCategories(categoriesRes.categories || []);
      } catch (error) {
        console.error("Failed to fetch templates:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const filteredTemplates = templates.filter((t) => {
    const matchesCategory =
      !selectedCategory || t.categoryId === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.substance?.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  async function handleStartProtocol(template: ProtocolTemplate) {
    if (!template.substanceId) {
      console.error("Template has no substance");
      return;
    }

    setCreating(template.id);
    try {
      await apiClient.post("/protocols", {
        source: "template",
        templateId: template.id,
        startDate: new Date().toISOString().split("T")[0],
        status: "active",
        substances: [
          {
            substanceId: template.substanceId,
            dose: Number(template.defaultDose) || 250,
            doseUnit: template.doseUnit || "mcg",
            frequency: template.frequency || "daily",
          },
        ],
      });
      navigate("/dashboard");
    } catch (error) {
      console.error("Failed to create protocol:", error);
      setCreating(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-gray-500">Loading templates...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            to="/dashboard"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-300 mb-2"
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-gray-100">Add a Protocol</h1>
          <p className="text-gray-400 mt-1">
            Choose from our curated protocol templates to get started.
          </p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
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
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-surface-border rounded-lg bg-surface-raised text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedCategory === null
              ? "bg-primary-500 text-white"
              : "bg-surface-elevated text-gray-300 hover:bg-gray-200"
          }`}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category.id
                ? "bg-primary-500 text-white"
                : "bg-surface-elevated text-gray-300 hover:bg-gray-200"
            }`}
          >
            {category.displayName}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      {filteredTemplates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onStart={() => handleStartProtocol(template)}
              isCreating={creating === template.id}
            />
          ))}
        </div>
      ) : (
        <div className="bg-surface-elevated rounded-xl p-8 text-center border border-dashed border-surface-border">
          <svg
            className="w-12 h-12 mx-auto text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-4 text-base font-medium text-gray-100">
            No templates found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}
    </div>
  );
}

function TemplateCard({
  template,
  onStart,
  isCreating,
}: {
  template: ProtocolTemplate;
  onStart: () => void;
  isCreating: boolean;
}) {
  const difficultyColors: Record<string, string> = {
    beginner: "bg-green-900/40 text-green-400",
    intermediate: "bg-amber-900/40 text-amber-400",
    advanced: "bg-red-900/40 text-red-400",
  };

  return (
    <div className="bg-surface-card rounded-xl border border-surface-border p-5 hover:border-primary-300 hover:shadow-sm transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-100">{template.name}</h3>
          {template.substance && (
            <p className="text-sm text-primary-500 mt-0.5">
              {template.substance.name}
            </p>
          )}
        </div>
        {template.difficultyLevel && (
          <span
            className={`px-2 py-0.5 text-xs font-medium rounded-full ${difficultyColors[template.difficultyLevel] || "bg-surface-elevated text-gray-300"}`}
          >
            {template.difficultyLevel}
          </span>
        )}
      </div>

      {template.description && (
        <p className="text-sm text-gray-400 mb-4 line-clamp-2">
          {template.description}
        </p>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        {template.defaultDose && (
          <span className="inline-flex items-center px-2 py-1 bg-surface-elevated rounded text-xs text-gray-300">
            {String(template.defaultDose)} {template.doseUnit}
          </span>
        )}
        {template.frequency && (
          <span className="inline-flex items-center px-2 py-1 bg-surface-elevated rounded text-xs text-gray-300">
            {template.frequency.replace(/_/g, " ")}
          </span>
        )}
        {template.cycleOnWeeks && template.cycleOffWeeks && (
          <span className="inline-flex items-center px-2 py-1 bg-surface-elevated rounded text-xs text-gray-300">
            {template.cycleOnWeeks}wk on / {template.cycleOffWeeks}wk off
          </span>
        )}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-surface-border">
        <span className="text-xs text-gray-500">
          {template.useCount.toLocaleString()} users
        </span>
        <button
          onClick={onStart}
          disabled={isCreating}
          className="px-4 py-2 bg-primary-500 text-white text-sm font-medium rounded-lg hover:bg-primary-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCreating ? "Starting..." : "Start Protocol"}
        </button>
      </div>
    </div>
  );
}
