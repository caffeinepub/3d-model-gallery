import type { Model } from "../backend";
import { CATEGORIES } from "../data/categories";
import ModelCard from "./ModelCard";

interface GalleryGridProps {
  models: Model[];
  selectedModel: Model | null;
  onSelectModel: (model: Model) => void;
  loading: boolean;
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
}

const SKELETON_KEYS = Array.from({ length: 12 }, (_, i) => `skeleton-${i}`);

export default function GalleryGrid({
  models,
  selectedModel,
  onSelectModel,
  loading,
  activeCategory,
  onCategoryChange,
}: GalleryGridProps) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden min-w-0">
      <div className="flex-none px-4 py-3 border-b border-[#2A3646] bg-[#0F141B]">
        <div className="flex gap-2 overflow-x-auto pb-0.5">
          {CATEGORIES.map((cat) => (
            <button
              type="button"
              key={cat.name}
              onClick={() => onCategoryChange(cat.name)}
              className={[
                "flex-none px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap border",
                activeCategory === cat.name
                  ? "border-[#22C7C7] text-[#22C7C7] bg-[#22C7C7]/10"
                  : "border-[#2A3646] text-[#A8B3C2] hover:border-[#3a4a60] hover:text-[#E8EEF6]",
              ].join(" ")}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
            {SKELETON_KEYS.map((k) => (
              <div
                key={k}
                className="rounded-2xl bg-[#1A2330] border border-[#2A3646] overflow-hidden animate-pulse"
              >
                <div className="h-40 bg-[#1E2734]" />
                <div className="p-3 space-y-2">
                  <div className="h-3 bg-[#2A3646] rounded w-3/4" />
                  <div className="h-2 bg-[#2A3646] rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : models.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#1A2330] flex items-center justify-center mb-4">
              <span className="text-3xl">&#9650;</span>
            </div>
            <p className="text-[#A8B3C2] font-medium">No models found</p>
            <p className="text-[#6F7B8C] text-sm mt-1">
              Try adjusting your search or category filter
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
            {models.map((model) => (
              <ModelCard
                key={model.id}
                model={model}
                isSelected={selectedModel?.id === model.id}
                onSelect={() => onSelectModel(model)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
