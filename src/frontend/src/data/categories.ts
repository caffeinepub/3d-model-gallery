export interface CategoryDef {
  name: string;
  color: string;
  icon: string;
}

export const CATEGORIES: CategoryDef[] = [
  { name: "All", color: "#22C7C7", icon: "LayoutGrid" },
  { name: "Human Anatomy", color: "#e07a5f", icon: "User" },
  { name: "Architecture", color: "#4a9eca", icon: "Building2" },
  { name: "Vehicles", color: "#e63946", icon: "Car" },
  { name: "Furniture", color: "#b08968", icon: "Armchair" },
  { name: "Electronics", color: "#4361ee", icon: "Smartphone" },
  { name: "Food", color: "#f4a261", icon: "UtensilsCrossed" },
  { name: "Sports", color: "#2d936c", icon: "Trophy" },
  { name: "Weapons", color: "#778da9", icon: "Swords" },
];

export function getCategoryDef(name: string): CategoryDef {
  return CATEGORIES.find((c) => c.name === name) ?? CATEGORIES[0];
}

export function getCategoryColor(name: string): string {
  return getCategoryDef(name).color;
}

export interface MaterialConfig {
  color: string;
  roughness: number;
  metalness: number;
}

export function parseMaterialConfig(configStr: string): MaterialConfig {
  try {
    const parsed = JSON.parse(configStr) as Partial<MaterialConfig>;
    return {
      color: parsed.color ?? "#ffffff",
      roughness: parsed.roughness ?? 0.5,
      metalness: parsed.metalness ?? 0.1,
    };
  } catch {
    return { color: "#ffffff", roughness: 0.5, metalness: 0.1 };
  }
}

export function serializeMaterialConfig(config: MaterialConfig): string {
  return JSON.stringify(config);
}
