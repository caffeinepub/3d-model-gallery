import { Environment, Grid, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import type * as THREE from "three";
import type { Model } from "../backend";
import { parseMaterialConfig } from "../data/categories";
import type { MaterialConfig } from "../data/categories";
import ModelGeometry from "./ModelGeometry";

interface ModelViewerProps {
  model: Model;
  materialConfig: MaterialConfig;
  showBones: boolean;
  showGrid: boolean;
  onSceneReady?: (scene: THREE.Object3D) => void;
}

export default function ModelViewer({
  model,
  materialConfig,
  showBones,
  showGrid,
}: ModelViewerProps) {
  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [3, 2, 3], fov: 45, near: 0.01, far: 1000 }}
        gl={{ antialias: true, alpha: false }}
        shadows
        style={{
          background: "linear-gradient(180deg, #0a0f18 0%, #0d1420 100%)",
        }}
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.5} />
          <directionalLight
            position={[5, 8, 5]}
            intensity={1.5}
            castShadow
            shadow-mapSize={[2048, 2048]}
          />
          <pointLight position={[-4, 4, -4]} intensity={0.6} color="#4466ff" />
          <pointLight position={[4, -2, 4]} intensity={0.4} color="#22C7C7" />

          {/* Model */}
          <ModelGeometry
            model={model}
            materialConfig={materialConfig}
            autoRotate={false}
            showBones={showBones}
            scale={1}
          />

          {/* Environment */}
          <Environment preset="city" />

          {/* Optional grid */}
          {showGrid && (
            <Grid
              infiniteGrid
              cellSize={0.5}
              cellThickness={0.5}
              cellColor="#2A3646"
              sectionSize={2}
              sectionThickness={1}
              sectionColor="#3a4a60"
              fadeDistance={20}
              position={[0, -1.5, 0]}
            />
          )}

          {/* Controls */}
          <OrbitControls
            makeDefault
            enablePan
            enableZoom
            enableRotate
            dampingFactor={0.08}
            rotateSpeed={0.6}
            zoomSpeed={0.8}
            minDistance={0.5}
            maxDistance={20}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
