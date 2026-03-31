import {
  Bone,
  Cpu,
  Download,
  Grid3x3,
  Layers,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import * as THREE from "three";
import type { Model } from "../backend";
import { getCategoryColor, parseMaterialConfig } from "../data/categories";
import type { MaterialConfig } from "../data/categories";
import { exportMTL, exportModelOBJ } from "../utils/ExportUtils";
import MaterialPanel from "./MaterialPanel";
import ModelViewer from "./ModelViewer";

interface DetailsPanelProps {
  model: Model;
  onClose: () => void;
  onMaterialUpdate: (id: string, config: string) => void;
  onDelete: (id: string) => void;
}

type TabId = "viewer" | "details" | "materials";

const MESH_DATA_LABELS = [
  "Polygon Count",
  "Texture Info",
  "Bone Count",
  "File Format",
  "Model ID",
] as const;

const MATERIAL_LABELS = ["Base Color", "Roughness", "Metalness"] as const;

export default function DetailsPanel({
  model,
  onClose,
  onMaterialUpdate,
  onDelete,
}: DetailsPanelProps) {
  const [activeTab, setActiveTab] = useState<TabId>("viewer");
  const [showBones, setShowBones] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [materialConfig, setMaterialConfig] = useState<MaterialConfig>(
    parseMaterialConfig(model.materialConfig),
  );
  const sceneRef = useRef<THREE.Object3D | null>(null);

  const catColor = getCategoryColor(model.category);
  const polyCount = Number(model.polygonCount);
  const boneCount = Number(model.boneCount);
  const hasBonesSupport = model.category === "Human Anatomy";

  const handleDelete = () => {
    if (window.confirm("Delete this model from the gallery?")) {
      onDelete(model.id);
    }
  };

  const handleExportOBJ = () => {
    const tempGroup = new THREE.Group();
    tempGroup.name = model.name;
    const geo = new THREE.BoxGeometry(1, 1, 1);
    const mat = new THREE.MeshStandardMaterial({ color: materialConfig.color });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.name = model.name.replace(/\s+/g, "_");
    tempGroup.add(mesh);
    exportModelOBJ(tempGroup, model.name);
  };

  const handleExportMTL = () => {
    exportMTL(materialConfig, model.name);
  };

  const tabs: { id: TabId; label: string }[] = [
    { id: "viewer", label: "Viewer" },
    { id: "details", label: "Details" },
    { id: "materials", label: "Materials" },
  ];

  const meshDataValues = [
    polyCount.toLocaleString(),
    model.textureInfo,
    boneCount > 0 ? boneCount.toString() : "No rig",
    "OBJ / MTL",
    model.id,
  ];

  const materialValues = [
    materialConfig.color.toUpperCase(),
    materialConfig.roughness.toFixed(2),
    materialConfig.metalness.toFixed(2),
  ];

  return (
    <aside className="flex-none flex flex-col w-full sm:w-96 bg-[#0D1219] border-l border-[#2A3646] overflow-hidden">
      {/* Header */}
      <div className="flex-none flex items-center justify-between px-4 py-3 border-b border-[#2A3646]">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className="w-2.5 h-2.5 rounded-full flex-none"
            style={{ backgroundColor: catColor }}
          />
          <h2 className="text-sm font-semibold text-[#E8EEF6] truncate">
            {model.name}
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close panel"
          className="flex-none p-1.5 rounded-lg text-[#6F7B8C] hover:text-[#E8EEF6] hover:bg-[#1A2330] transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex-none flex border-b border-[#2A3646]">
        {tabs.map((tab) => (
          <button
            type="button"
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={[
              "flex-1 py-2.5 text-xs font-semibold transition-colors border-b-2",
              activeTab === tab.id
                ? "text-[#22C7C7] border-[#22C7C7]"
                : "text-[#6F7B8C] border-transparent hover:text-[#A8B3C2]",
            ].join(" ")}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "viewer" && (
          <div className="flex flex-col h-full">
            <div className="h-72 relative flex-none">
              <ModelViewer
                model={model}
                materialConfig={materialConfig}
                showBones={showBones}
                showGrid={showGrid}
                onSceneReady={(s) => {
                  sceneRef.current = s;
                }}
              />
              <div className="absolute top-3 right-3 flex flex-col gap-2">
                {hasBonesSupport && (
                  <button
                    type="button"
                    onClick={() => setShowBones(!showBones)}
                    title={showBones ? "Hide Bones" : "Show Bones"}
                    className={[
                      "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                      showBones
                        ? "bg-[#22C7C7]/20 border border-[#22C7C7] text-[#22C7C7]"
                        : "bg-[#1A2330]/80 border border-[#2A3646] text-[#A8B3C2] hover:text-[#E8EEF6]",
                    ].join(" ")}
                  >
                    <Bone size={14} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowGrid(!showGrid)}
                  title="Toggle Grid"
                  className={[
                    "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                    showGrid
                      ? "bg-[#22C7C7]/20 border border-[#22C7C7] text-[#22C7C7]"
                      : "bg-[#1A2330]/80 border border-[#2A3646] text-[#A8B3C2] hover:text-[#E8EEF6]",
                  ].join(" ")}
                >
                  <Grid3x3 size={14} />
                </button>
              </div>
              <div className="absolute bottom-2 left-2">
                <span className="text-[9px] text-[#6F7B8C] bg-[#0D1219]/80 px-1.5 py-0.5 rounded">
                  Drag to rotate · Scroll to zoom
                </span>
              </div>
            </div>

            <div className="p-4 border-t border-[#2A3646] space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <StatBadge
                  icon={<Cpu size={12} />}
                  label="Polygons"
                  value={polyCount.toLocaleString()}
                />
                <StatBadge
                  icon={<Layers size={12} />}
                  label="Category"
                  value={model.category}
                />
                {boneCount > 0 && (
                  <StatBadge
                    icon={<Bone size={12} />}
                    label="Bones"
                    value={boneCount.toString()}
                  />
                )}
                <StatBadge
                  icon={<Tag size={12} />}
                  label="Texture"
                  value={model.textureInfo}
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleExportOBJ}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#22C7C7] hover:bg-[#1aadad] text-[#0F141B] text-xs font-bold rounded-xl transition-colors"
                >
                  <Download size={14} />
                  Download OBJ
                </button>
                <button
                  type="button"
                  onClick={handleExportMTL}
                  title="Export MTL"
                  className="px-3 py-2.5 bg-[#1A2330] hover:bg-[#1E2734] border border-[#2A3646] hover:border-[#3a4a60] text-[#A8B3C2] text-xs rounded-xl transition-colors"
                >
                  MTL
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  title="Delete model"
                  className="px-3 py-2.5 bg-[#1A2330] hover:bg-red-900/30 border border-[#2A3646] hover:border-red-700/50 text-[#6F7B8C] hover:text-red-400 text-xs rounded-xl transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "details" && (
          <div className="p-4 space-y-4">
            <div
              className="px-3 py-2 rounded-xl text-xs font-bold"
              style={{ backgroundColor: `${catColor}22`, color: catColor }}
            >
              {model.category}
            </div>

            {model.description && (
              <div>
                <p className="text-xs font-semibold text-[#A8B3C2] uppercase tracking-wider mb-1.5">
                  Description
                </p>
                <p className="text-sm text-[#E8EEF6]">{model.description}</p>
              </div>
            )}

            <div>
              <p className="text-xs font-semibold text-[#A8B3C2] uppercase tracking-wider mb-2">
                Mesh Data
              </p>
              <div className="rounded-xl border border-[#2A3646] overflow-hidden">
                {MESH_DATA_LABELS.map((label, i) => (
                  <div
                    key={label}
                    className={[
                      "flex items-center justify-between px-3 py-2.5 text-xs",
                      i > 0 ? "border-t border-[#2A3646]" : "",
                    ].join(" ")}
                  >
                    <span className="text-[#6F7B8C]">{label}</span>
                    <span className="text-[#E8EEF6] font-mono truncate max-w-[140px] text-right">
                      {meshDataValues[i]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {model.tags.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-[#A8B3C2] uppercase tracking-wider mb-2">
                  Tags
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {model.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-[11px] rounded-full bg-[#1A2330] border border-[#2A3646] text-[#A8B3C2]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "materials" && (
          <div className="p-4 space-y-4">
            <p className="text-xs text-[#6F7B8C]">
              Adjust material properties and see the 3D model update in
              real-time.
            </p>
            <MaterialPanel
              materialConfig={materialConfig}
              onChange={setMaterialConfig}
              onSave={(config) => onMaterialUpdate(model.id, config)}
            />
            <div className="pt-2 border-t border-[#2A3646]">
              <p className="text-xs font-semibold text-[#A8B3C2] uppercase tracking-wider mb-2">
                Current Material
              </p>
              <div className="rounded-xl border border-[#2A3646] overflow-hidden">
                {MATERIAL_LABELS.map((label, i) => (
                  <div
                    key={label}
                    className={[
                      "flex items-center justify-between px-3 py-2.5 text-xs",
                      i > 0 ? "border-t border-[#2A3646]" : "",
                    ].join(" ")}
                  >
                    <span className="text-[#6F7B8C]">{label}</span>
                    <span className="text-[#E8EEF6] font-mono">
                      {materialValues[i]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

function StatBadge({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2 px-2.5 py-2 bg-[#1A2330] rounded-xl border border-[#2A3646]">
      <span className="text-[#22C7C7] flex-none">{icon}</span>
      <div className="min-w-0">
        <p className="text-[10px] text-[#6F7B8C] truncate">{label}</p>
        <p className="text-xs text-[#E8EEF6] truncate font-medium">{value}</p>
      </div>
    </div>
  );
}
