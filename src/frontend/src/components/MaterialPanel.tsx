import type { MaterialConfig } from "../data/categories";
import { serializeMaterialConfig } from "../data/categories";

const PRESET_COLORS = [
  "#22C7C7",
  "#e07a5f",
  "#4a9eca",
  "#e63946",
  "#b08968",
  "#4361ee",
  "#f4a261",
  "#2d936c",
  "#778da9",
  "#ffffff",
  "#aaaaaa",
  "#333333",
];

interface MaterialPanelProps {
  materialConfig: MaterialConfig;
  onChange: (config: MaterialConfig) => void;
  onSave: (serialized: string) => void;
}

export default function MaterialPanel({
  materialConfig,
  onChange,
  onSave,
}: MaterialPanelProps) {
  const update = (partial: Partial<MaterialConfig>) => {
    const updated = { ...materialConfig, ...partial };
    onChange(updated);
    onSave(serializeMaterialConfig(updated));
  };

  return (
    <div className="space-y-4">
      {/* Color */}
      <div>
        <p className="text-xs font-semibold text-[#A8B3C2] uppercase tracking-wider mb-2">
          Base Color
        </p>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {PRESET_COLORS.map((color) => (
            <button
              type="button"
              key={color}
              onClick={() => update({ color })}
              aria-label={`Set color ${color}`}
              className="w-6 h-6 rounded-md border-2 transition-all hover:scale-110"
              style={{
                backgroundColor: color,
                borderColor:
                  materialConfig.color === color ? "#22C7C7" : "transparent",
              }}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <input
            id="base-color-picker"
            type="color"
            value={materialConfig.color}
            onChange={(e) => update({ color: e.target.value })}
            className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border border-[#2A3646] p-0.5"
          />
          <span className="text-xs text-[#6F7B8C] font-mono">
            {materialConfig.color.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Roughness */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label
            htmlFor="roughness-slider"
            className="text-xs font-semibold text-[#A8B3C2] uppercase tracking-wider"
          >
            Roughness
          </label>
          <span className="text-xs text-[#22C7C7] font-mono">
            {materialConfig.roughness.toFixed(2)}
          </span>
        </div>
        <input
          id="roughness-slider"
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={materialConfig.roughness}
          onChange={(e) =>
            update({ roughness: Number.parseFloat(e.target.value) })
          }
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #22C7C7 ${materialConfig.roughness * 100}%, #2A3646 ${materialConfig.roughness * 100}%)`,
          }}
        />
      </div>

      {/* Metalness */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label
            htmlFor="metalness-slider"
            className="text-xs font-semibold text-[#A8B3C2] uppercase tracking-wider"
          >
            Metalness
          </label>
          <span className="text-xs text-[#22C7C7] font-mono">
            {materialConfig.metalness.toFixed(2)}
          </span>
        </div>
        <input
          id="metalness-slider"
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={materialConfig.metalness}
          onChange={(e) =>
            update({ metalness: Number.parseFloat(e.target.value) })
          }
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #22C7C7 ${materialConfig.metalness * 100}%, #2A3646 ${materialConfig.metalness * 100}%)`,
          }}
        />
      </div>
    </div>
  );
}
