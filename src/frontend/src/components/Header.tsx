import { Box, Layers, Menu, Search } from "lucide-react";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onMenuToggle: () => void;
  modelCount: number;
}

export default function Header({
  searchQuery,
  onSearchChange,
  onMenuToggle,
  modelCount,
}: HeaderProps) {
  return (
    <header className="flex-none flex items-center gap-4 px-4 py-3 border-b border-[#2A3646] bg-[#141B24] z-10">
      <button
        type="button"
        onClick={onMenuToggle}
        className="lg:hidden p-2 rounded-lg text-[#A8B3C2] hover:text-[#E8EEF6] hover:bg-[#1E2734] transition-colors"
        aria-label="Toggle sidebar"
      >
        <Menu size={20} />
      </button>

      <div className="flex items-center gap-2 flex-none">
        <div className="w-8 h-8 rounded-lg bg-[#22C7C7]/20 flex items-center justify-center">
          <Box size={18} className="text-[#22C7C7]" />
        </div>
        <span className="font-bold text-[#E8EEF6] tracking-wide hidden sm:block text-sm">
          POLYVAULT <span className="text-[#22C7C7]">3D</span>
        </span>
      </div>

      <div className="flex-1 max-w-xl mx-auto">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6F7B8C] pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search models, categories, tags..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#1A2330] border border-[#2A3646] rounded-xl text-sm text-[#E8EEF6] placeholder-[#6F7B8C] focus:outline-none focus:border-[#22C7C7]/60 focus:ring-1 focus:ring-[#22C7C7]/30 transition-all"
          />
        </div>
      </div>

      <div className="hidden md:flex items-center gap-2 flex-none">
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1A2330] border border-[#2A3646] rounded-full">
          <Layers size={14} className="text-[#22C7C7]" />
          <span className="text-xs text-[#A8B3C2] font-medium">
            {modelCount} Models
          </span>
        </div>
      </div>
    </header>
  );
}
