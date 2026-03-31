import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ModelInput {
    id: string;
    name: string;
    tags: Array<string>;
    materialConfig: string;
    polygonCount: bigint;
    description: string;
    boneCount: bigint;
    category: string;
    textureInfo: string;
}
export interface Model {
    id: string;
    name: string;
    createdAt: bigint;
    tags: Array<string>;
    materialConfig: string;
    polygonCount: bigint;
    description: string;
    boneCount: bigint;
    category: string;
    textureInfo: string;
}
export interface backendInterface {
    deleteModel(id: string): Promise<void>;
    filterModelsByName(name: string): Promise<Array<Model>>;
    getAllModels(): Promise<Array<Model>>;
    getCategories(): Promise<Array<[string, bigint]>>;
    getModel(id: string): Promise<Model>;
    getModelCount(): Promise<bigint>;
    listByCategory(category: string): Promise<Array<Model>>;
    saveModel(modelInput: ModelInput): Promise<void>;
    searchModels(searchTerm: string): Promise<Array<Model>>;
    updateMaterialConfig(id: string, newConfig: string): Promise<void>;
}
