import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiClient } from "@/lib/api-client";
import { ProtocolTemplate, SubstanceCategory } from "@/types/domain";
import { ProtocolBuilder } from "@/components/protocols/ProtocolBuilder";

export function AddProtocol() {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<ProtocolTemplate[]>([]);
  const [categories, setCategories] = useState<SubstanceCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Protocol Builder state
  const [showBuilder, setShowBuilder] = useState(false);
  const [selectedTemplate, setSelectedTemplate] =
    useState<ProtocolTemplate | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [templatesRes, categoriesRes] = await Promise.all([
          apiClient.get<{ templates: ProtocolTemplate[] }>(
            "/protocols/templates?limit=50"
          ),
          apiClient.get<{ categories: SubstanceCategory[] }>(
            "/substances/categories"
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

  function handleProtocolCreated() {
    setShowBuilder(false);
    setSelectedTemplate(null);
    navigate("/dashboard");
  }

  function handleOpenCustomBuilder() {
    setSelectedTemplate(null);
    setShowBuilder(true);
  }

  function handleOpenTemplateBuilder(template: ProtocolTemplate) {
    setSelectedTemplate(template);
    setShowBuilder(true);
  }

  function handleCloseBuilder() {
    setShowBuilder(false);
    setSelectedTemplate(null);
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
            Choose a template or create your own custom protocol.
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
              : "bg-surface-elevated text-gray-300 hover:bg-surface-hover"
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
                : "bg-surface-elevated text-gray-300 hover:bg-surface-hover"
            }`}
          >
            {category.displayName}
          </button>
        ))}
      </div>

      {/* Custom Protocol Option */}
      <div className="mb-6">
        <button
          onClick={handleOpenCustomBuilder}
          className="w-full bg-surface-card rounded-xl border-2 border-dashed border-surface-border p-6 hover:border-primary-500 hover:bg-surface-elevated transition-all text-left group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center group-hover:bg-primary-500/30 transition-colors">
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
            <div>
              <h3 className="font-semibold text-gray-100">
                Create Custom Protocol
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                Build your own protocol with multiple substances and smart
                defaults
              </p>
            </div>
          </div>
        </button>
      </div>

      {/* Templates Grid */}
      {filteredTemplates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onStart={() => handleOpenTemplateBuilder(template)}
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

      {/* Protocol Builder Modal */}
      <ProtocolBuilder
        isOpen={showBuilder}
        onClose={handleCloseBuilder}
        onProtocolCreated={handleProtocolCreated}
        template={selectedTemplate}
      />
    </div>
  );
}

function TemplateCard({
  template,
  onStart,
}: {
  template: ProtocolTemplate;
  onStart: () => void;
}) {
  const difficultyColors: Record<string, string> = {
    beginner: "bg-green-900/40 text-green-400",
    intermediate: "bg-amber-900/40 text-amber-400",
    advanced: "bg-red-900/40 text-red-400",
  };

  return (
    <div className="bg-surface-card rounded-xl border border-surface-border p-5 hover:border-primary-500/50 hover:shadow-sm transition-all">
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
          className="px-4 py-2 bg-primary-500 text-white text-sm font-medium rounded-lg hover:bg-primary-400 transition-colors"
        >
          Start Protocol
        </button>
      </div>
    </div>
  );
}
