import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import type { Model } from "../backend";
import { getCategoryColor, parseMaterialConfig } from "../data/categories";
import ModelGeometry from "./ModelGeometry";

interface ModelCardProps {
  model: Model;
  isSelected: boolean;
  onSelect: () => void;
}

export default function ModelCard({
  model,
  isSelected,
  onSelect,
}: ModelCardProps) {
  const materialConfig = parseMaterialConfig(model.materialConfig);
  const catColor = getCategoryColor(model.category);
  const polyCount = Number(model.polygonCount);
  const boneCount = Number(model.boneCount);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={[
        "w-full text-left rounded-2xl overflow-hidden border transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] group",
        isSelected
          ? "border-[#22C7C7] shadow-lg shadow-[#22C7C7]/10"
          : "border-[#2A3646] hover:border-[#3a4a60]",
      ].join(" ")}
      style={{ backgroundColor: "#1A2330" }}
    >
      <div className="relative h-40 bg-[#121925] overflow-hidden">
        <Canvas
          frameloop="demand"
          camera={{ position: [2, 1.5, 2], fov: 45 }}
          gl={{ antialias: true, alpha: false }}
          style={{ background: "#0a0f18" }}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.6} />
            <directionalLight position={[3, 5, 3]} intensity={1.2} />
            <pointLight
              position={[-3, -2, -2]}
              intensity={0.4}
              color="#22C7C7"
            />
            <ModelGeometry
              model={model}
              materialConfig={materialConfig}
              autoRotate={false}
              showBones={false}
              scale={0.8}
            />
          </Suspense>
        </Canvas>

        <div className="absolute top-2 left-2">
          <span
            className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
            style={{
              backgroundColor: `${catColor}33`,
              color: catColor,
              border: `1px solid ${catColor}55`,
            }}
          >
            {model.category}
          </span>
        </div>

        {boneCount > 0 && (
          <div className="absolute top-2 right-2">
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#22C7C7]/20 text-[#22C7C7] border border-[#22C7C7]/30">
              RIGGED
            </span>
          </div>
        )}
      </div>

      <div className="p-3">
        <h3 className="text-sm font-semibold text-[#E8EEF6] truncate group-hover:text-[#22C7C7] transition-colors">
          {model.name}
        </h3>
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-[11px] text-[#6F7B8C]">
            {polyCount.toLocaleString()} polys
          </span>
          {boneCount > 0 && (
            <span className="text-[11px] text-[#6F7B8C]">
              {boneCount} bones
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
