import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import type { Model } from "./backend";
import DetailsPanel from "./components/DetailsPanel";
import GalleryGrid from "./components/GalleryGrid";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import { MODEL_CATALOG, getCatalogCategories } from "./data/modelCatalog";
import { useActor } from "./hooks/useActor";

const INITIAL_MODELS: Model[] = MODEL_CATALOG as unknown as Model[];

export default function App() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  const [models, setModels] = useState<Model[]>(INITIAL_MODELS);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const categories = getCatalogCategories();

  const updateMaterialMutation = useMutation({
    mutationFn: ({ id, config }: { id: string; config: string }) =>
      actor ? actor.updateMaterialConfig(id, config) : Promise.resolve(),
    onSuccess: (_, vars) => {
      const { id, config } = vars;
      setModels((old) =>
        old.map((m) => (m.id === id ? { ...m, materialConfig: config } : m)),
      );
      setSelectedModel((prev) =>
        prev?.id === id ? { ...prev, materialConfig: config } : prev,
      );
      queryClient.invalidateQueries({ queryKey: ["models"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      actor ? actor.deleteModel(id) : Promise.resolve(),
    onSuccess: (_, id) => {
      setModels((old) => old.filter((m) => m.id !== id));
      setSelectedModel((prev) => (prev?.id === id ? null : prev));
    },
  });

  const filteredModels = models.filter((model) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      model.name.toLowerCase().includes(q) ||
      model.category.toLowerCase().includes(q) ||
      model.tags.some((t) => t.toLowerCase().includes(q));
    const matchesCategory =
      activeCategory === "All" || model.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCategorySelect = useCallback((cat: string) => {
    setActiveCategory(cat);
    setSidebarOpen(false);
  }, []);

  const closeOverlay = useCallback(() => setSidebarOpen(false), []);

  return (
    <div className="flex h-screen overflow-hidden bg-[#0F141B] text-[#E8EEF6]">
      {sidebarOpen && (
        <div
          role="presentation"
          className="fixed inset-0 z-20 bg-black/60 lg:hidden"
          onClick={closeOverlay}
          onKeyDown={closeOverlay}
        />
      )}

      <Sidebar
        categories={categories}
        activeCategory={activeCategory}
        onCategorySelect={handleCategorySelect}
        isOpen={sidebarOpen}
        onClose={closeOverlay}
        totalCount={models.length}
      />

      <div className="flex flex-col flex-1 overflow-hidden min-w-0">
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          modelCount={models.length}
        />

        <div className="flex flex-1 overflow-hidden">
          <GalleryGrid
            models={filteredModels}
            selectedModel={selectedModel}
            onSelectModel={setSelectedModel}
            loading={false}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />

          {selectedModel && (
            <DetailsPanel
              model={selectedModel}
              onClose={() => setSelectedModel(null)}
              onMaterialUpdate={(id, config) =>
                updateMaterialMutation.mutate({ id, config })
              }
              onDelete={(id) => deleteMutation.mutate(id)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
