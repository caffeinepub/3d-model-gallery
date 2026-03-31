import * as THREE from "three";
import type { MaterialConfig } from "../data/categories";

export function exportModelOBJ(scene: THREE.Object3D, modelName: string): void {
  const lines: string[] = [
    `# 3D Model: ${modelName}`,
    "# Exported from 3D Model Gallery",
    "",
  ];
  let vertexOffset = 0;

  scene.updateMatrixWorld(true);

  scene.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;
    const geometry = child.geometry as THREE.BufferGeometry;
    if (!geometry) return;
    const positions = geometry.attributes.position;
    if (!positions) return;

    lines.push(`g ${child.name || "mesh"}`);

    for (let i = 0; i < positions.count; i++) {
      const v = new THREE.Vector3(
        positions.getX(i),
        positions.getY(i),
        positions.getZ(i),
      );
      v.applyMatrix4(child.matrixWorld);
      lines.push(`v ${v.x.toFixed(6)} ${v.y.toFixed(6)} ${v.z.toFixed(6)}`);
    }

    if (geometry.index) {
      for (let i = 0; i < geometry.index.count; i += 3) {
        const a = geometry.index.getX(i) + 1 + vertexOffset;
        const b = geometry.index.getX(i + 1) + 1 + vertexOffset;
        const c = geometry.index.getX(i + 2) + 1 + vertexOffset;
        lines.push(`f ${a} ${b} ${c}`);
      }
    } else {
      for (let i = 0; i < positions.count; i += 3) {
        lines.push(
          `f ${i + 1 + vertexOffset} ${i + 2 + vertexOffset} ${i + 3 + vertexOffset}`,
        );
      }
    }

    vertexOffset += positions.count;
    lines.push("");
  });

  triggerDownload(
    lines.join("\n"),
    `${modelName.replace(/\s+/g, "_")}.obj`,
    "text/plain",
  );
}

export function exportMTL(
  materialConfig: MaterialConfig,
  modelName: string,
): void {
  const hex = materialConfig.color.replace("#", "");
  const r = (Number.parseInt(hex.slice(0, 2), 16) / 255).toFixed(4);
  const g = (Number.parseInt(hex.slice(2, 4), 16) / 255).toFixed(4);
  const b = (Number.parseInt(hex.slice(4, 6), 16) / 255).toFixed(4);
  const ns = ((1 - materialConfig.roughness) * 1000).toFixed(1);
  const mtlName = modelName.replace(/\s+/g, "_");
  const ks = materialConfig.metalness.toFixed(4);

  const mtl = [
    `# Material for ${modelName}`,
    `newmtl ${mtlName}`,
    `Kd ${r} ${g} ${b}`,
    `Ks ${ks} ${ks} ${ks}`,
    `Ns ${ns}`,
    "d 1.0",
  ].join("\n");

  triggerDownload(mtl, `${mtlName}.mtl`, "text/plain");
}

function triggerDownload(
  content: string,
  filename: string,
  mimeType: string,
): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
