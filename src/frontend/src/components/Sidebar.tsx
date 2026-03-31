import {
  Armchair,
  Building2,
  Car,
  LayoutGrid,
  Smartphone,
  Swords,
  Trophy,
  User,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { CATEGORIES } from "../data/categories";

const ICONS: Record<
  string,
  React.ComponentType<{ size?: number; className?: string }>
> = {
  LayoutGrid,
  User,
  Building2,
  Car,
  Armchair,
  Smartphone,
  UtensilsCrossed,
  Trophy,
  Swords,
};

interface SidebarProps {
  categories: [string, bigint][];
  activeCategory: string;
  onCategorySelect: (cat: string) => void;
  isOpen: boolean;
  onClose: () => void;
  totalCount: number;
}

export default function Sidebar({
  categories,
  activeCategory,
  onCategorySelect,
  isOpen,
  onClose,
  totalCount,
}: SidebarProps) {
  const getCategoryCount = (name: string): number => {
    if (name === "All") return totalCount;
    const found = categories.find(([cat]) => cat === name);
    return found ? Number(found[1]) : 0;
  };

  return (
    <aside
      className={[
        "flex-none flex flex-col w-64 bg-[#0D1219] border-r border-[#2A3646] overflow-hidden transition-transform duration-200",
        "fixed inset-y-0 left-0 z-30 lg:relative lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full",
      ].join(" ")}
    >
      <div className="flex items-center justify-between px-4 py-4 border-b border-[#2A3646]">
        <span className="text-sm font-semibold text-[#E8EEF6] tracking-wide">
          Categories
        </span>
        <button
          type="button"
          onClick={onClose}
          className="lg:hidden p-1 rounded text-[#6F7B8C] hover:text-[#E8EEF6] transition-colors"
          aria-label="Close sidebar"
        >
          <X size={16} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-2">
        {CATEGORIES.map((cat) => {
          const Icon = ICONS[cat.icon];
          const count = getCategoryCount(cat.name);
          const isActive = activeCategory === cat.name;

          return (
            <button
              type="button"
              key={cat.name}
              onClick={() => onCategorySelect(cat.name)}
              className={[
                "w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left",
                isActive
                  ? "bg-[#1A2330] text-[#E8EEF6]"
                  : "text-[#A8B3C2] hover:bg-[#141B24] hover:text-[#E8EEF6]",
              ].join(" ")}
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center flex-none"
                style={{ backgroundColor: `${cat.color}22`, color: cat.color }}
              >
                {Icon && <Icon size={14} />}
              </div>
              <span className="flex-1 truncate">{cat.name}</span>
              {count > 0 && (
                <span
                  className="flex-none text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-[#1E2734] border border-[#2A3646]"
                  style={{ color: isActive ? cat.color : "#6F7B8C" }}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="flex-none px-4 py-3 border-t border-[#2A3646]">
        <p className="text-[10px] text-[#6F7B8C]">
          Procedurally generated 3D assets
        </p>
      </div>
    </aside>
  );
}
