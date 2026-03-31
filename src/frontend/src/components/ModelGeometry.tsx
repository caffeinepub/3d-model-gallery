import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { Model } from "../backend";
import type { MaterialConfig } from "../data/categories";

interface Props {
  model: Model;
  materialConfig: MaterialConfig;
  autoRotate?: boolean;
  showBones?: boolean;
  scale?: number;
}

export default function ModelGeometry({
  model,
  materialConfig,
  autoRotate = false,
  showBones = false,
  scale = 1,
}: Props) {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame((_, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.4;
    }
  });

  const { color, roughness, metalness } = materialConfig;

  // Derive a stable variant index from the model id
  const variantIndex = useMemo(() => {
    const parts = model.id.split("_");
    const n = Number.parseInt(parts[parts.length - 1], 10);
    return Number.isNaN(n) ? 0 : n;
  }, [model.id]);

  const renderModel = () => {
    switch (model.category) {
      case "Human Anatomy":
        return (
          <HumanModel
            variant={variantIndex % 10}
            color={color}
            roughness={roughness}
            metalness={metalness}
            showBones={showBones}
            hasBones={model.boneCount > 0}
          />
        );
      case "Architecture":
        return (
          <BuildingModel
            variant={variantIndex % 8}
            color={color}
            roughness={roughness}
            metalness={metalness}
          />
        );
      case "Vehicles":
        return (
          <VehicleModel
            variant={variantIndex % 8}
            color={color}
            roughness={roughness}
            metalness={metalness}
          />
        );
      case "Furniture":
        return (
          <FurnitureModel
            variant={variantIndex % 8}
            color={color}
            roughness={roughness}
            metalness={metalness}
          />
        );
      case "Electronics":
        return (
          <ElectronicsModel
            variant={variantIndex % 8}
            color={color}
            roughness={roughness}
            metalness={metalness}
          />
        );
      case "Food":
        return (
          <FoodModel
            variant={variantIndex % 8}
            color={color}
            roughness={roughness}
            metalness={metalness}
          />
        );
      case "Sports":
        return (
          <SportsModel
            variant={variantIndex % 8}
            color={color}
            roughness={roughness}
            metalness={metalness}
          />
        );
      case "Weapons":
        return (
          <WeaponModel
            variant={variantIndex % 8}
            color={color}
            roughness={roughness}
            metalness={metalness}
          />
        );
      default:
        return (
          <mesh>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial
              color={color}
              roughness={roughness}
              metalness={metalness}
            />
          </mesh>
        );
    }
  };

  return (
    <group ref={groupRef} scale={scale}>
      {renderModel()}
    </group>
  );
}

type MatProps = { color: string; roughness: number; metalness: number };
type VariantProps = MatProps & { variant: number };

// ─── Human Anatomy ──────────────────────────────────────────────────────────
function HumanModel({
  variant,
  color,
  roughness,
  metalness,
  showBones,
  hasBones,
}: VariantProps & { showBones: boolean; hasBones: boolean }) {
  switch (variant) {
    case 0:
    case 1:
    case 2:
      return (
        <HumanBody
          color={color}
          roughness={roughness}
          metalness={metalness}
          showBones={showBones && hasBones}
          bodyType={variant}
        />
      );
    case 3:
      return (
        <HumanSkeleton
          color={color}
          roughness={roughness}
          metalness={metalness}
          showBones={showBones || hasBones}
        />
      );
    case 4:
      return (
        <HumanSkull color={color} roughness={roughness} metalness={metalness} />
      );
    case 5:
      return (
        <HumanHeart roughness={roughness} metalness={metalness} color={color} />
      );
    case 6:
      return (
        <HumanBrain color={color} roughness={roughness} metalness={metalness} />
      );
    case 7:
      return (
        <HumanLungs color={color} roughness={roughness} metalness={metalness} />
      );
    case 8:
      return (
        <HumanHand color={color} roughness={roughness} metalness={metalness} />
      );
    case 9:
      return (
        <HumanSpine color={color} roughness={roughness} metalness={metalness} />
      );
    default:
      return (
        <HumanBody
          color={color}
          roughness={roughness}
          metalness={metalness}
          showBones={showBones && hasBones}
          bodyType={0}
        />
      );
  }
}

// Full body human with bone overlay
function HumanBody({
  color,
  roughness,
  metalness,
  showBones,
  bodyType,
}: MatProps & { showBones: boolean; bodyType: number }) {
  // bodyType: 0=male, 1=female, 2=child
  const scale = bodyType === 2 ? 0.65 : 1;
  const shoulderW = bodyType === 1 ? 0.48 : bodyType === 2 ? 0.42 : 0.55;
  const hipW = bodyType === 1 ? 0.5 : bodyType === 2 ? 0.38 : 0.45;

  const boneLines = useMemo(() => {
    const pts: number[] = [
      // spine
      0, 1.2, 0, 0, 0.6, 0, 0, 0.6, 0, 0, 0.0, 0,
      // collar
      -0.4, 0.9, 0, 0.4, 0.9, 0,
      // left arm
      -0.4, 0.9, 0, -0.65, 0.45, 0, -0.65, 0.45, 0, -0.75, 0.0, 0,
      // right arm
      0.4, 0.9, 0, 0.65, 0.45, 0, 0.65, 0.45, 0, 0.75, 0.0, 0,
      // left leg
      -0.2, 0.0, 0, -0.25, -0.6, 0, -0.25, -0.6, 0, -0.25, -1.2, 0,
      // right leg
      0.2, 0.0, 0, 0.25, -0.6, 0, 0.25, -0.6, 0, 0.25, -1.2, 0,
      // ribs
      0, 0.75, 0, -0.3, 0.55, 0.1, 0, 0.75, 0, 0.3, 0.55, 0.1, 0, 0.6, 0, -0.28,
      0.42, 0.1, 0, 0.6, 0, 0.28, 0.42, 0.1,
    ];
    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(pts), 3),
    );
    return new THREE.LineSegments(
      geo,
      new THREE.LineBasicMaterial({ color: "#22C7C7", linewidth: 2 }),
    );
  }, []);

  return (
    <group scale={scale}>
      {/* Head */}
      <mesh position={[0, 1.45, 0]}>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshStandardMaterial
          color={color}
          roughness={roughness}
          metalness={metalness}
        />
      </mesh>
      {/* Neck */}
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.07, 0.08, 0.2, 8]} />
        <meshStandardMaterial
          color={color}
          roughness={roughness}
          metalness={metalness}
        />
      </mesh>
      {/* Torso */}
      <mesh position={[0, 0.55, 0]}>
        <boxGeometry args={[shoulderW, 0.7, 0.22]} />
        <meshStandardMaterial
          color={color}
          roughness={roughness}
          metalness={metalness}
        />
      </mesh>
      {/* Pelvis */}
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[hipW, 0.22, 0.2]} />
        <meshStandardMaterial
          color={color}
          roughness={roughness}
          metalness={metalness}
        />
      </mesh>
      {/* Left upper arm */}
      <mesh
        position={[-(shoulderW / 2 + 0.1), 0.67, 0]}
        rotation={[0, 0, -0.35]}
      >
        <cylinderGeometry args={[0.065, 0.055, 0.46, 8]} />
        <meshStandardMaterial
          color={color}
          roughness={roughness}
          metalness={metalness}
        />
      </mesh>
      {/* Right upper arm */}
      <mesh position={[shoulderW / 2 + 0.1, 0.67, 0]} rotation={[0, 0, 0.35]}>
        <cylinderGeometry args={[0.065, 0.055, 0.46, 8]} />
        <meshStandardMaterial
          color={color}
          roughness={roughness}
          metalness={metalness}
        />
      </mesh>
      {/* Left forearm */}
      <mesh position={[-0.72, 0.23, 0]} rotation={[0, 0, -0.12]}>
        <cylinderGeometry args={[0.05, 0.04, 0.46, 8]} />
        <meshStandardMaterial
          color={color}
          roughness={roughness}
          metalness={metalness}
        />
      </mesh>
      {/* Right forearm */}
      <mesh position={[0.72, 0.23, 0]} rotation={[0, 0, 0.12]}>
        <cylinderGeometry args={[0.05, 0.04, 0.46, 8]} />
        <meshStandardMaterial
          color={color}
          roughness={roughness}
          metalness={metalness}
        />
      </mesh>
      {/* Left hand */}
      <mesh position={[-0.76, -0.06, 0]}>
        <boxGeometry args={[0.1, 0.14, 0.05]} />
        <meshStandardMaterial
          color={color}
          roughness={roughness}
          metalness={metalness}
        />
      </mesh>
      {/* Right hand */}
      <mesh position={[0.76, -0.06, 0]}>
        <boxGeometry args={[0.1, 0.14, 0.05]} />
        <meshStandardMaterial
          color={color}
          roughness={roughness}
          metalness={metalness}
        />
      </mesh>
      {/* Left thigh */}
      <mesh position={[-0.2, -0.45, 0]}>
        <cylinderGeometry args={[0.09, 0.075, 0.62, 8]} />
        <meshStandardMaterial
          color={color}
          roughness={roughness}
          metalness={metalness}
        />
      </mesh>
      {/* Right thigh */}
      <mesh position={[0.2, -0.45, 0]}>
        <cylinderGeometry args={[0.09, 0.075, 0.62, 8]} />
        <meshStandardMaterial
          color={color}
          roughness={roughness}
          metalness={metalness}
        />
      </mesh>
      {/* Left shin */}
      <mesh position={[-0.22, -1.05, 0]}>
        <cylinderGeometry args={[0.065, 0.05, 0.58, 8]} />
        <meshStandardMaterial
          color={color}
          roughness={roughness}
          metalness={metalness}
        />
      </mesh>
      {/* Right shin */}
      <mesh position={[0.22, -1.05, 0]}>
        <cylinderGeometry args={[0.065, 0.05, 0.58, 8]} />
        <meshStandardMaterial
          color={color}
          roughness={roughness}
          metalness={metalness}
        />
      </mesh>
      {/* Left foot */}
      <mesh position={[-0.22, -1.37, 0.06]}>
        <boxGeometry args={[0.1, 0.08, 0.22]} />
        <meshStandardMaterial
          color={color}
          roughness={roughness}
          metalness={metalness}
        />
      </mesh>
      {/* Right foot */}
      <mesh position={[0.22, -1.37, 0.06]}>
        <boxGeometry args={[0.1, 0.08, 0.22]} />
        <meshStandardMaterial
          color={color}
          roughness={roughness}
          metalness={metalness}
        />
      </mesh>
      {/* Bone overlay */}
      {showBones && <primitive object={boneLines} />}
    </group>
  );
}

function HumanSkeleton({
  color,
  roughness,
  metalness,
  showBones,
}: MatProps & { showBones: boolean }) {
  const boneLines = useMemo(() => {
    const pts: number[] = [
      0, 1.2, 0, 0, 0.6, 0, 0, 0.6, 0, 0, 0, 0, -0.4, 0.9, 0, 0.4, 0.9, 0, -0.4,
      0.9, 0, -0.65, 0.45, 0, -0.65, 0.45, 0, -0.75, 0, 0, 0.4, 0.9, 0, 0.65,
      0.45, 0, 0.65, 0.45, 0, 0.75, 0, 0, -0.2, 0, 0, -0.25, -0.6, 0, -0.25,
      -0.6, 0, -0.25, -1.2, 0, 0.2, 0, 0, 0.25, -0.6, 0, 0.25, -0.6, 0, 0.25,
      -1.2, 0, 0, 0.7, 0, -0.3, 0.5, 0.1, 0, 0.7, 0, 0.3, 0.5, 0.1, 0, 0.6, 0,
      -0.3, 0.4, 0.1, 0, 0.6, 0, 0.3, 0.4, 0.1,
    ];
    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(pts), 3),
    );
    return new THREE.LineSegments(
      geo,
      new THREE.LineBasicMaterial({ color: "#22C7C7" }),
    );
  }, []);

  return (
    <group>
      <mesh position={[0, 1.45, 0]}>
        <sphereGeometry args={[0.22, 8, 8]} />
        <meshStandardMaterial
          color={color}
          roughness={roughness}
          metalness={metalness}
        />
      </mesh>
      <mesh position={[0, 1.15, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 0.2, 6]} />
        <meshStandardMaterial
          color={color}
          roughness={roughness}
          metalness={metalness}
        />
      </mesh>
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[0.55, 0.7, 0.2]} />
        <meshStandardMaterial
          color={color}
          roughness={roughness}
          metalness={metalness}
        />
      </mesh>
      <mesh position={[0, -0.05, 0]}>
        <boxGeometry args={[0.45, 0.2, 0.18]} />
        <meshStandardMaterial
          color={color}
          roughness={roughness}
          metalness={metalness}
        />
      </mesh>
      <mesh position={[-0.55, 0.67, 0]} rotation={[0, 0, -0.4]}>
        <cylinderGeometry args={[0.06, 0.05, 0.45, 6]} />
        <meshStandardMaterial
          color={color}
          roughness={roughness}
          metalness={metalness}
        />
      </mesh>
      <mesh position={[0.55, 0.67, 0]} rotation={[0, 0, 0.4]}>
        <cylinderGeometry args={[0.06, 0.05, 0.45, 6]} />
        <meshStandardMaterial
          color={color}
          roughness={roughness}
          metalness={metalness}
        />
      </mesh>
      <mesh position={[-0.72, 0.22, 0]} rotation={[0, 0, -0.15]}>
        <cylinderGeometry args={[0.05, 0.04, 0.45, 6]} />
        <meshStandardMaterial
          color={color}
          roughness={roughness}
          metalness={metalness}
        />
      </mesh>
      <mesh position={[0.72, 0.22, 0]} rotation={[0, 0, 0.15]}>
        <cylinderGeometry args={[0.05, 0.04, 0.45, 6]} />
        <meshStandardMaterial
          color={color}
          roughness={roughness}
          metalness={metalness}
        />
      </mesh>
      <mesh position={[-0.22, -0.45, 0]}>
        <cylinderGeometry args={[0.08, 0.07, 0.6, 6]} />
        <meshStandardMaterial
          color={color}
          roughness={roughness}
          metalness={metalness}
        />
      </mesh>
      <mesh position={[0.22, -0.45, 0]}>
        <cylinderGeometry args={[0.08, 0.07, 0.6, 6]} />
        <meshStandardMaterial
          color={color}
          roughness={roughness}
          metalness={metalness}
        />
      </mesh>
      <mesh position={[-0.25, -1.05, 0]}>
        <cylinderGeometry args={[0.06, 0.05, 0.55, 6]} />
        <meshStandardMaterial
          color={color}
          roughness={roughness}
          metalness={metalness}
        />
      </mesh>
      <mesh position={[0.25, -1.05, 0]}>
        <cylinderGeometry args={[0.06, 0.05, 0.55, 6]} />
        <meshStandardMaterial
          color={color}
          roughness={roughness}
          metalness={metalness}
        />
      </mesh>
      {showBones && <primitive object={boneLines} />}
    </group>
  );
}

function HumanSkull({ color, roughness, metalness }: MatProps) {
  return (
    <group>
      {/* Cranium */}
      <mesh position={[0, 0.15, 0]}>
        <sphereGeometry args={[0.52, 16, 12]} />
        <meshStandardMaterial
          color={color}
          roughness={roughness}
          metalness={metalness}
        />
      </mesh>
      {/* Face / Jaw */}
      <mesh position={[0, -0.3, 0.2]}>
        <boxGeometry args={[0.45, 0.3, 0.35]} />
        <meshStandardMaterial
          color={color}
          roughness={roughness}
          metalness={metalness}
        />
      </mesh>
      {/* Eye sockets */}
      <mesh position={[-0.17, 0.05, 0.48]}>
        <sphereGeometry args={[0.11, 8, 8]} />
        <meshStandardMaterial color="#111111" roughness={1} metalness={0} />
      </mesh>
      <mesh position={[0.17, 0.05, 0.48]}>
        <sphereGeometry args={[0.11, 8, 8]} />
        <meshStandardMaterial color="#111111" roughness={1} metalness={0} />
      </mesh>
      {/* Nasal cavity */}
      <mesh position={[0, -0.12, 0.5]}>
        <boxGeometry args={[0.1, 0.14, 0.05]} />
        <meshStandardMaterial color="#111111" roughness={1} metalness={0} />
      </mesh>
      {/* Teeth row */}
      {[-0.15, -0.07, 0, 0.07, 0.15].map((x) => (
        <mesh key={x} position={[x, -0.35, 0.38]}>
          <boxGeometry args={[0.055, 0.08, 0.05]} />
          <meshStandardMaterial
            color="#fffff0"
            roughness={0.3}
            metalness={0.1}
          />
        </mesh>
      ))}
    </group>
  );
}

function HumanHeart({ roughness, metalness, color: _c }: MatProps) {
  return (
    <group>
      <mesh position={[-0.25, 0.15, 0]}>
        <sphereGeometry args={[0.42, 12, 12]} />
        <meshStandardMaterial
          color="#c1440e"
          roughness={roughness}
          metalness={metalness}
        />
      </mesh>
      <mesh position={[0.25, 0.15, 0]}>
        <sphereGeometry args={[0.42, 12, 12]} />
        <meshStandardMaterial
          color="#c1440e"
          roughness={roughness}
          metalness={metalness}
        />
      </mesh>
      <mesh position={[0, -0.3, 0]}>
        <coneGeometry args={[0.4, 0.7, 12]} />
        <meshStandardMaterial
          color="#a0360a"
          roughness={roughness}
          metalness={metalness}
        />
      </mesh>
      {/* Aorta */}
      <mesh position={[0.1, 0.55, 0]} rotation={[0.3, 0, 0.2]}>
        <cylinderGeometry args={[0.07, 0.07, 0.4, 8]} />
        <meshStandardMaterial color="#cc4422" roughness={0.5} metalness={0.1} />
      </mesh>
    </group>
  );
}

function HumanBrain({ color, roughness, metalness }: MatProps) {
  return (
    <group>
      {/* Cerebrum left */}
      <mesh position={[-0.28, 0.05, 0]}>
        <sphereGeometry args={[0.42, 12, 10]} />
        <meshStandardMaterial
          color={color}
          roughness={roughness}
          metalness={metalness}
        />
      </mesh>
      {/* Cerebrum right */}
      <mesh position={[0.28, 0.05, 0]}>
        <sphereGeometry args={[0.42, 12, 10]} />
        <meshStandardMaterial
          color={color}
          roughness={roughness}
          metalness={metalness}
        />
      </mesh>
      {/* Cerebellum */}
      <mesh position={[0, -0.38, -0.25]}>
        <sphereGeometry args={[0.25, 10, 8]} />
        <meshStandardMaterial
          color={color}
          roughness={roughness}
          metalness={metalness}
        />
      </mesh>
      {/* Brain stem */}
      <mesh position={[0, -0.55, -0.1]}>
        <cylinderGeometry args={[0.09, 0.07, 0.3, 8]} />
        <meshStandardMaterial
          color={color}
          roughness={roughness}
          metalness={metalness}
        />
      </mesh>
    </group>
  );
}

function HumanLungs({ color, roughness, metalness }: MatProps) {
  return (
    <group>
      {/* Left lung */}
      <mesh position={[-0.38, 0, 0]} scale={[0.8, 1, 0.7]}>
        <sphereGeometry args={[0.38, 12, 10]} />
        <meshStandardMaterial
          color={color}
          roughness={roughness}
          metalness={metalness}
        />
      </mesh>
      <mesh position={[-0.35, -0.4, 0]} scale={[0.7, 0.6, 0.65]}>
        <sphereGeometry args={[0.32, 10, 8]} />
        <meshStandardMaterial
          color={color}
          roughness={roughness}
          metalness={metalness}
        />
      </mesh>
      {/* Right lung */}
      <mesh position={[0.38, 0, 0]} scale={[0.8, 1, 0.7]}>
        <sphereGeometry args={[0.38, 12, 10]} />
        <meshStandardMaterial
          color={color}
          roughness={roughness}
          metalness={metalness}
        />
      </mesh>
      <mesh position={[0.35, -0.4, 0]} scale={[0.7, 0.6, 0.65]}>
        <sphereGeometry args={[0.32, 10, 8]} />
        <meshStandardMaterial
          color={color}
          roughness={roughness}
          metalness={metalness}
        />
      </mesh>
      {/* Trachea */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.07, 0.08, 0.4, 8]} />
        <meshStandardMaterial
          color={color}
          roughness={roughness}
          metalness={metalness}
        />
      </mesh>
    </group>
  );
}

function HumanHand({ color, roughness, metalness }: MatProps) {
  return (
    <group>
      {/* Palm */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.55, 0.6, 0.12]} />
        <meshStandardMaterial
          color={color}
          roughness={roughness}
          metalness={metalness}
        />
      </mesh>
      {/* Fingers */}
      {([-0.22, -0.1, 0.03, 0.16, 0.28] as const).map((x, fi) => (
        <group key={x}>
          <mesh position={[x, 0.55, 0]}>
            <cylinderGeometry args={[0.04, 0.04, fi === 0 ? 0.22 : 0.3, 6]} />
            <meshStandardMaterial
              color={color}
              roughness={roughness}
              metalness={metalness}
            />
          </mesh>
          <mesh position={[x, fi === 0 ? 0.77 : 0.82, 0]}>
            <cylinderGeometry
              args={[0.035, 0.035, fi === 0 ? 0.18 : 0.24, 6]}
            />
            <meshStandardMaterial
              color={color}
              roughness={roughness}
              metalness={metalness}
            />
          </mesh>
        </group>
      ))}
      {/* Thumb */}
      <mesh position={[-0.35, 0.12, 0]} rotation={[0, 0, 1.1]}>
        <cylinderGeometry args={[0.045, 0.04, 0.28, 6]} />
        <meshStandardMaterial
          color={color}
          roughness={roughness}
          metalness={metalness}
        />
      </mesh>
    </group>
  );
}

function HumanSpine({ color, roughness, metalness }: MatProps) {
  const vertebrae = Array.from({ length: 12 }, (_, i) => i);
  return (
    <group>
      {vertebrae.map((i) => (
        <group key={i}>
          <mesh position={[0, 0.9 - i * 0.17, 0]}>
            <cylinderGeometry args={[0.14, 0.14, 0.12, 8]} />
            <meshStandardMaterial
              color={color}
              roughness={roughness}
              metalness={metalness}
            />
          </mesh>
          {/* Spinous process */}
          <mesh position={[0, 0.9 - i * 0.17, -0.16]}>
            <boxGeometry args={[0.06, 0.08, 0.14]} />
            <meshStandardMaterial
              color={color}
              roughness={roughness}
              metalness={metalness}
            />
          </mesh>
          {/* Disc between vertebrae */}
          {i < 11 && (
            <mesh position={[0, 0.835 - i * 0.17, 0]}>
              <cylinderGeometry args={[0.13, 0.13, 0.04, 8]} />
              <meshStandardMaterial
                color="#d0c0a0"
                roughness={0.7}
                metalness={0.0}
              />
            </mesh>
          )}
        </group>
      ))}
    </group>
  );
}

// ─── Architecture ────────────────────────────────────────────────────────────
function BuildingModel({ variant, color, roughness, metalness }: VariantProps) {
  switch (variant % 8) {
    case 0: // House
      return (
        <group>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[1.6, 1.0, 1.2]} />
            <meshStandardMaterial
              color={color}
              roughness={roughness}
              metalness={metalness}
            />
          </mesh>
          <mesh position={[0, 0.75, 0]}>
            <boxGeometry args={[1.7, 0.45, 1.3]} />
            <meshStandardMaterial
              color="#8B4513"
              roughness={0.8}
              metalness={0}
            />
          </mesh>
          <mesh position={[0, 0.1, 0.61]}>
            <boxGeometry args={[0.25, 0.5, 0.02]} />
            <meshStandardMaterial
              color="#5c3317"
              roughness={0.6}
              metalness={0}
            />
          </mesh>
        </group>
      );
    case 1: // Tower / Castle
      return (
        <group>
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.5, 0.55, 1.8, 8]} />
            <meshStandardMaterial
              color={color}
              roughness={roughness}
              metalness={metalness}
            />
          </mesh>
          <mesh position={[0, 1.05, 0]}>
            <coneGeometry args={[0.55, 0.6, 8]} />
            <meshStandardMaterial
              color="#8B4513"
              roughness={0.7}
              metalness={0}
            />
          </mesh>
        </group>
      );
    case 2: // Skyscraper
      return (
        <group>
          <mesh position={[0, 0.3, 0]}>
            <boxGeometry args={[0.7, 2.4, 0.7]} />
            <meshStandardMaterial
              color={color}
              roughness={roughness}
              metalness={metalness}
            />
          </mesh>
          <mesh position={[0, 1.55, 0]}>
            <boxGeometry args={[0.55, 0.5, 0.55]} />
            <meshStandardMaterial
              color="#aaddff"
              roughness={0.1}
              metalness={0.6}
              transparent
              opacity={0.8}
            />
          </mesh>
        </group>
      );
    case 3: // Pyramid
      return (
        <group>
          <mesh position={[0, 0, 0]}>
            <coneGeometry args={[1.2, 1.5, 4]} />
            <meshStandardMaterial
              color={color}
              roughness={roughness}
              metalness={metalness}
            />
          </mesh>
        </group>
      );
    case 4: // Arch/Bridge
      return (
        <group>
          <mesh position={[-0.6, 0, 0]}>
            <boxGeometry args={[0.3, 0.6, 0.5]} />
            <meshStandardMaterial
              color={color}
              roughness={roughness}
              metalness={metalness}
            />
          </mesh>
          <mesh position={[0.6, 0, 0]}>
            <boxGeometry args={[0.3, 0.6, 0.5]} />
            <meshStandardMaterial
              color={color}
              roughness={roughness}
              metalness={metalness}
            />
          </mesh>
          <mesh position={[0, 0.5, 0]}>
            <torusGeometry args={[0.6, 0.12, 8, 16, Math.PI]} />
            <meshStandardMaterial
              color={color}
              roughness={roughness}
              metalness={metalness}
            />
          </mesh>
          <mesh position={[0, 0.05, 0]}>
            <boxGeometry args={[1.5, 0.1, 0.5]} />
            <meshStandardMaterial
              color={color}
              roughness={roughness}
              metalness={metalness}
            />
          </mesh>
        </group>
      );
    case 5: // Church / Cathedral
      return (
        <group>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[1.2, 1.0, 0.8]} />
            <meshStandardMaterial
              color={color}
              roughness={roughness}
              metalness={metalness}
            />
          </mesh>
          <mesh position={[0, 0.9, 0]}>
            <coneGeometry args={[0.25, 0.8, 4]} />
            <meshStandardMaterial
              color="#8B4513"
              roughness={0.8}
              metalness={0}
            />
          </mesh>
          <mesh position={[0.5, 0.5, 0]}>
            <cylinderGeometry args={[0.18, 0.2, 1.2, 6]} />
            <meshStandardMaterial
              color={color}
              roughness={roughness}
              metalness={metalness}
            />
          </mesh>
          <mesh position={[0.5, 1.2, 0]}>
            <coneGeometry args={[0.2, 0.4, 6]} />
            <meshStandardMaterial
              color="#8B4513"
              roughness={0.7}
              metalness={0}
            />
          </mesh>
        </group>
      );
    case 6: // Lighthouse
      return (
        <group>
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.35, 0.45, 2.0, 10]} />
            <meshStandardMaterial
              color={color}
              roughness={roughness}
              metalness={metalness}
            />
          </mesh>
          <mesh position={[0, 1.2, 0]}>
            <cylinderGeometry args={[0.3, 0.3, 0.4, 10]} />
            <meshStandardMaterial
              color="#aaddff"
              roughness={0.1}
              metalness={0.5}
              transparent
              opacity={0.85}
            />
          </mesh>
          <mesh position={[0, 1.5, 0]}>
            <coneGeometry args={[0.35, 0.3, 10]} />
            <meshStandardMaterial
              color="#cc0000"
              roughness={0.5}
              metalness={0.3}
            />
          </mesh>
        </group>
      );
    default: // Windmill
      return (
        <group>
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.3, 0.45, 1.8, 8]} />
            <meshStandardMaterial
              color={color}
              roughness={roughness}
              metalness={metalness}
            />
          </mesh>
          {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle) => (
            <mesh
              key={angle}
              position={[Math.cos(angle) * 0.5, 1.0, Math.sin(angle) * 0.5]}
              rotation={[0, angle, 0]}
            >
              <boxGeometry args={[0.08, 0.8, 0.15]} />
              <meshStandardMaterial
                color="#deb887"
                roughness={0.7}
                metalness={0}
              />
            </mesh>
          ))}
        </group>
      );
  }
}

// ─── Vehicles ────────────────────────────────────────────────────────────────
function VehicleModel({ variant, color, roughness, metalness }: VariantProps) {
  const wheels = (positions: [number, number, number][]) =>
    positions.map((pos) => (
      <mesh key={pos.join(",")} position={pos} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.25, 0.1, 8, 16]} />
        <meshStandardMaterial color="#222222" roughness={0.8} metalness={0.2} />
      </mesh>
    ));

  switch (variant % 8) {
    case 0: // Sports car
      return (
        <group>
          <mesh position={[0, -0.05, 0]}>
            <boxGeometry args={[1.8, 0.35, 0.85]} />
            <meshStandardMaterial
              color={color}
              roughness={roughness}
              metalness={metalness}
            />
          </mesh>
          <mesh position={[0, 0.25, 0]}>
            <boxGeometry args={[1.0, 0.28, 0.78]} />
            <meshStandardMaterial
              color={color}
              roughness={roughness}
              metalness={metalness}
            />
          </mesh>
          {wheels([
            [-0.65, -0.28, 0.5],
            [0.65, -0.28, 0.5],
            [-0.65, -0.28, -0.5],
            [0.65, -0.28, -0.5],
          ])}
        </group>
      );
    case 1: // Truck
      return (
        <group>
          <mesh position={[0.2, 0, 0]}>
            <boxGeometry args={[1.8, 0.55, 0.9]} />
            <meshStandardMaterial
              color={color}
              roughness={roughness}
              metalness={metalness}
            />
          </mesh>
          <mesh position={[-0.7, 0.4, 0]}>
            <boxGeometry args={[0.6, 0.5, 0.85]} />
            <meshStandardMaterial
              color={color}
              roughness={roughness}
              metalness={metalness}
            />
          </mesh>
          {wheels([
            [-0.7, -0.38, 0.5],
            [0.6, -0.38, 0.5],
            [-0.7, -0.38, -0.5],
            [0.6, -0.38, -0.5],
          ])}
        </group>
      );
    case 2: // Airplane
      return (
        <group>
          <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
            <cylinderGeometry args={[0.2, 0.15, 2.5, 10]} />
            <meshStandardMaterial
              color={color}
              roughness={roughness}
              metalness={metalness}
            />
          </mesh>
          {/* Wings */}
          <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <boxGeometry args={[2.4, 0.06, 0.35]} />
            <meshStandardMaterial
              color={color}
              roughness={roughness}
              metalness={metalness}
            />
          </mesh>
          {/* Tail */}
          <mesh position={[-1.0, 0.25, 0]}>
            <boxGeometry args={[0.08, 0.55, 0.08]} />
            <meshStandardMaterial
              color={color}
              roughness={roughness}
              metalness={metalness}
            />
          </mesh>
        </group>
      );
    case 3: // Motorbike
      return (
        <group>
          <mesh position={[0, 0.15, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.2, 0.15, 0.5, 8]} />
            <meshStandardMaterial
              color={color}
              roughness={roughness}
              metalness={metalness}
            />
          </mesh>
          <mesh position={[0.6, -0.25, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.32, 0.1, 8, 20]} />
            <meshStandardMaterial
              color="#222222"
              roughness={0.7}
              metalness={0.3}
            />
          </mesh>
          <mesh position={[-0.6, -0.25, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.32, 0.1, 8, 20]} />
            <meshStandardMaterial
              color="#222222"
              roughness={0.7}
              metalness={0.3}
            />
          </mesh>
        </group>
      );
    case 4: // Boat
      return (
        <group>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[2.0, 0.35, 0.7]} />
            <meshStandardMaterial
              color={color}
              roughness={roughness}
              metalness={metalness}
            />
          </mesh>
          <mesh position={[-0.3, 0.3, 0]}>
            <boxGeometry args={[0.8, 0.4, 0.65]} />
            <meshStandardMaterial
              color={color}
              roughness={roughness}
              metalness={metalness}
            />
          </mesh>
          {/* Mast */}
          <mesh position={[0.3, 0.85, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 1.2, 6]} />
            <meshStandardMaterial
              color="#8B4513"
              roughness={0.6}
              metalness={0}
            />
          </mesh>
        </group>
      );
    case 5: // Helicopter
      return (
        <group>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[1.2, 0.5, 0.6]} />
            <meshStandardMaterial
              color={color}
              roughness={roughness}
              metalness={metalness}
            />
          </mesh>
          <mesh position={[-0.8, 0.1, 0]} rotation={[0, 0, 0.2]}>
            <boxGeometry args={[0.7, 0.15, 0.3]} />
            <meshStandardMaterial
              color={color}
              roughness={roughness}
              metalness={metalness}
            />
          </mesh>
          {/* Rotor */}
          <mesh position={[0, 0.38, 0]}>
            <boxGeometry args={[1.8, 0.04, 0.1]} />
            <meshStandardMaterial
              color="#888"
              roughness={0.3}
              metalness={0.6}
            />
          </mesh>
        </group>
      );
    case 6: // Tank
      return (
        <group>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[1.6, 0.4, 0.9]} />
            <meshStandardMaterial
              color={color}
              roughness={roughness}
              metalness={metalness}
            />
          </mesh>
          <mesh position={[0, 0.35, 0]}>
            <boxGeometry args={[0.9, 0.3, 0.7]} />
            <meshStandardMaterial
              color={color}
              roughness={roughness}
              metalness={metalness}
            />
          </mesh>
          {/* Barrel */}
          <mesh position={[0.85, 0.35, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.06, 0.06, 0.9, 8]} />
            <meshStandardMaterial
              color={color}
              roughness={roughness}
              metalness={metalness}
            />
          </mesh>
        </group>
      );
    default: // Bicycle
      return (
        <group>
          <mesh position={[0.5, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.38, 0.06, 8, 20]} />
            <meshStandardMaterial
              color={color}
              roughness={roughness}
              metalness={metalness}
            />
          </mesh>
          <mesh position={[-0.5, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.38, 0.06, 8, 20]} />
            <meshStandardMaterial
              color={color}
              roughness={roughness}
              metalness={metalness}
            />
          </mesh>
          <mesh position={[0, 0.1, 0]} rotation={[0, 0, 0.3]}>
            <cylinderGeometry args={[0.025, 0.025, 1.1, 6]} />
            <meshStandardMaterial
              color={color}
              roughness={roughness}
              metalness={metalness}
            />
          </mesh>
        </group>
      );
  }
}

// ─── Furniture ───────────────────────────────────────────────────────────────
function FurnitureModel({
  variant,
  color,
  roughness,
  metalness,
}: VariantProps) {
  const legPositions: [number, number, number][] = [
    [-0.65, -0.3, 0.28],
    [0.65, -0.3, 0.28],
    [-0.65, -0.3, -0.28],
    [0.65, -0.3, -0.28],
  ];
  switch (variant % 8) {
    case 0: // Sofa
      return (
        <group>
          <mesh position={[0, -0.1, 0]}>
            <boxGeometry args={[1.6, 0.2, 0.7]} />
            <meshStandardMaterial
              color={color}
              roughness={roughness}
              metalness={metalness}
            />
          </mesh>
          <mesh position={[0, 0.3, -0.3]}>
            <boxGeometry args={[1.6, 0.6, 0.18]} />
            <meshStandardMaterial
              color={color}
              roughness={roughness}
              metalness={metalness}
            />
          </mesh>
          <mesh position={[-0.78, 0.1, 0]}>
            <boxGeometry args={[0.18, 0.35, 0.7]} />
            <meshStandardMaterial
              color={color}
              roughness={roughness}
              metalness={metalness}
            />
          </mesh>
          <mesh position={[0.78, 0.1, 0]}>
            <boxGeometry args={[0.18, 0.35, 0.7]} />
            <meshStandardMaterial
              color={color}
              roughness={roughness}
              metalness={metalness}
            />
          </mesh>
        </group>
      );
    case 1: // Desk
      return (
        <group>
          <mesh position={[0, 0.3, 0]}>
            <boxGeometry args={[1.8, 0.07, 0.85]} />
            <meshStandardMaterial
              color={color}
              roughness={roughness}
              metalness={metalness}
            />
          </mesh>
          {(
            [
              [-0.8, -0.1, 0.35],
              [0.8, -0.1, 0.35],
              [-0.8, -0.1, -0.35],
              [0.8, -0.1, -0.35],
            ] as [number, number, number][]
          ).map((pos) => (
            <mesh key={pos.join(",")} position={pos}>
              <cylinderGeometry args={[0.04, 0.04, 0.7, 6]} />
              <meshStandardMaterial
                color="#888888"
                roughness={0.3}
                metalness={0.8}
              />
            </mesh>
          ))}
        </group>
      );
    case 2: // Chair
      return (
        <group>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.65, 0.08, 0.65]} />
            <meshStandardMaterial
              color={color}
              roughness={roughness}
              metalness={metalness}
            />
          </mesh>
          <mesh position={[0, 0.45, -0.28]}>
            <boxGeometry args={[0.65, 0.8, 0.08]} />
            <meshStandardMaterial
              color={color}
              roughness={roughness}
              metalness={metalness}
            />
          </mesh>
          {(
            [
              [-0.28, -0.35, 0.28],
              [0.28, -0.35, 0.28],
              [-0.28, -0.35, -0.28],
              [0.28, -0.35, -0.28],
            ] as [number, number, number][]
          ).map((pos) => (
            <mesh key={pos.join(",")} position={pos}>
              <cylinderGeometry args={[0.03, 0.03, 0.65, 6]} />
              <meshStandardMaterial
                color={color}
                roughness={roughness}
                metalness={metalness}
              />
            </mesh>
          ))}
        </group>
      );
    case 3: // Bed
      return (
        <group>
          <mesh position={[0, -0.1, 0]}>
            <boxGeometry args={[1.4, 0.3, 2.0]} />
            <meshStandardMaterial
              color={color}
              roughness={roughness}
              metalness={metalness}
            />
          </mesh>
          <mesh position={[0, 0.15, 0]}>
            <boxGeometry args={[1.35, 0.22, 1.95]} />
            <meshStandardMaterial
              color="#ffffff"
              roughness={0.8}
              metalness={0}
            />
          </mesh>
          <mesh position={[0, 0.2, -0.9]}>
            <boxGeometry args={[1.4, 0.55, 0.1]} />
            <meshStandardMaterial
              color={color}
              roughness={roughness}
              metalness={metalness}
            />
          </mesh>
        </group>
      );
    case 4: // Bookshelf
      return (
        <group>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[1.1, 1.8, 0.3]} />
            <meshStandardMaterial
              color={color}
              roughness={roughness}
              metalness={metalness}
            />
          </mesh>
          {[-0.6, -0.15, 0.3, 0.75].map((y) => (
            <mesh key={y} position={[0, y, 0]}>
              <boxGeometry args={[1.05, 0.04, 0.28]} />
              <meshStandardMaterial
                color={color}
                roughness={roughness}
                metalness={metalness}
              />
            </mesh>
          ))}
          {[
            { x: 0.1, c: "#cc4444" },
            { x: 0.25, c: "#4488cc" },
            { x: 0.4, c: "#44cc88" },
            { x: -0.05, c: "#ccaa44" },
            { x: -0.2, c: "#884488" },
            { x: -0.35, c: "#448888" },
          ].map(({ x, c }) => (
            <mesh key={x} position={[x, 0.1, 0.01]}>
              <boxGeometry args={[0.1, 0.36, 0.22]} />
              <meshStandardMaterial color={c} roughness={0.8} metalness={0} />
            </mesh>
          ))}
        </group>
      );
    case 5: // Lamp
      return (
        <group>
          <mesh position={[0, -0.8, 0]}>
            <cylinderGeometry args={[0.25, 0.25, 0.05, 12]} />
            <meshStandardMaterial
              color={color}
              roughness={roughness}
              metalness={metalness}
            />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 1.5, 8]} />
            <meshStandardMaterial
              color={color}
              roughness={roughness}
              metalness={metalness}
            />
          </mesh>
          <mesh position={[0, 0.85, 0]}>
            <coneGeometry args={[0.4, 0.5, 12, 1, true]} />
            <meshStandardMaterial
              color="#ffffcc"
              roughness={0.5}
              metalness={0.1}
              side={THREE.DoubleSide}
            />
          </mesh>
          <mesh position={[0, 0.6, 0]}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshStandardMaterial
              color="#ffff88"
              roughness={0.2}
              metalness={0.1}
              emissive="#ffff44"
              emissiveIntensity={0.5}
            />
          </mesh>
        </group>
      );
    case 6: // Cabinet
      return (
        <group>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[1.2, 1.4, 0.45]} />
            <meshStandardMaterial
              color={color}
              roughness={roughness}
              metalness={metalness}
            />
          </mesh>
          {[-0.35, 0.35].map((x) =>
            [-0.3, 0.3].map((y) => (
              <mesh key={`${x},${y}`} position={[x, y, 0.23]}>
                <boxGeometry args={[0.48, 0.58, 0.02]} />
                <meshStandardMaterial
                  color={color}
                  roughness={roughness}
                  metalness={metalness}
                />
              </mesh>
            )),
          )}
          {[-0.35, 0.35].map((x) =>
            [-0.3, 0.3].map((y) => (
              <mesh key={`knob-${x},${y}`} position={[x, y, 0.25]}>
                <sphereGeometry args={[0.03, 8, 8]} />
                <meshStandardMaterial
                  color="#888"
                  roughness={0.3}
                  metalness={0.8}
                />
              </mesh>
            )),
          )}
        </group>
      );
    default: // Coffee table
      return (
        <group>
          <mesh position={[0, 0.2, 0]}>
            <boxGeometry args={[1.4, 0.06, 0.7]} />
            <meshStandardMaterial
              color={color}
              roughness={roughness}
              metalness={metalness}
            />
          </mesh>
          {legPositions.map((pos) => (
            <mesh key={pos.join(",")} position={pos}>
              <cylinderGeometry args={[0.04, 0.04, 0.45, 6]} />
              <meshStandardMaterial
                color={color}
                roughness={roughness}
                metalness={metalness}
              />
            </mesh>
          ))}
        </group>
      );
  }
}

// ─── Electronics ─────────────────────────────────────────────────────────────
function ElectronicsModel({
  variant,
  color,
  roughness,
  metalness,
}: VariantProps) {
  switch (variant % 8) {
    case 0: // TV
      return (
        <group>
          <mesh position={[0, 0.3, 0]}>
            <boxGeometry args={[1.8, 1.0, 0.08]} />
            <meshStandardMaterial
              color={color}
              roughness={roughness}
              metalness={metalness}
            />
          </mesh>
          <mesh position={[0, 0.3, 0.05]}>
            <boxGeometry args={[1.65, 0.88, 0.01]} />
            <meshStandardMaterial
              color="#0a1020"
              roughness={0.05}
              metalness={0.1}
            />
          </mesh>
          <mesh position={[0, -0.3, 0]}>
            <boxGeometry args={[0.3, 0.12, 0.3]} />
            <meshStandardMaterial
              color="#888888"
              roughness={0.3}
              metalness={0.7}
            />
          </mesh>
        </group>
      );
    case 1: // Laptop
      return (
        <group>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[1.4, 0.06, 0.95]} />
            <meshStandardMaterial
              color={color}
              roughness={roughness}
              metalness={metalness}
            />
          </mesh>
          <mesh position={[0, 0.4, -0.35]} rotation={[-1.1, 0, 0]}>
            <boxGeometry args={[1.38, 0.06, 0.85]} />
            <meshStandardMaterial
              color={color}
              roughness={roughness}
              metalness={metalness}
            />
          </mesh>
          <mesh position={[0, 0.4, -0.36]} rotation={[-1.1, 0, 0]}>
            <boxGeometry args={[1.2, 0.01, 0.7]} />
            <meshStandardMaterial
              color="#0a1020"
              roughness={0.05}
              metalness={0.1}
            />
          </mesh>
        </group>
      );
    case 2: // Smartphone
      return (
        <group>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.38, 0.78, 0.06]} />
            <meshStandardMaterial
              color={color}
              roughness={roughness}
              metalness={metalness}
            />
          </mesh>
          <mesh position={[0, 0, 0.035]}>
            <boxGeometry args={[0.32, 0.68, 0.005]} />
            <meshStandardMaterial
              color="#0a1020"
              roughness={0.05}
              metalness={0.1}
            />
          </mesh>
          <mesh position={[0, 0.3, 0.035]}>
            <cylinderGeometry args={[0.025, 0.025, 0.01, 12]} />
            <meshStandardMaterial
              color="#333"
              roughness={0.5}
              metalness={0.3}
            />
          </mesh>
        </group>
      );
    case 3: // VR Headset
      return (
        <group>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.8, 0.45, 0.4]} />
            <meshStandardMaterial
              color={color}
              roughness={roughness}
              metalness={metalness}
            />
          </mesh>
          <mesh position={[-0.22, 0, 0.22]}>
            <cylinderGeometry args={[0.12, 0.1, 0.05, 12]} />
            <meshStandardMaterial
              color="#111"
              roughness={0.2}
              metalness={0.4}
            />
          </mesh>
          <mesh position={[0.22, 0, 0.22]}>
            <cylinderGeometry args={[0.12, 0.1, 0.05, 12]} />
            <meshStandardMaterial
              color="#111"
              roughness={0.2}
              metalness={0.4}
            />
          </mesh>
        </group>
      );
    case 4: // Headphones
      return (
        <group>
          <mesh position={[0, 0.3, 0]}>
            <torusGeometry args={[0.35, 0.04, 8, 20, Math.PI]} />
            <meshStandardMaterial
              color={color}
              roughness={roughness}
              metalness={metalness}
            />
          </mesh>
          <mesh position={[-0.35, 0, 0]}>
            <cylinderGeometry args={[0.12, 0.1, 0.1, 10]} />
            <meshStandardMaterial
              color={color}
              roughness={roughness}
              metalness={metalness}
            />
          </mesh>
          <mesh position={[0.35, 0, 0]}>
            <cylinderGeometry args={[0.12, 0.1, 0.1, 10]} />
            <meshStandardMaterial
              color={color}
              roughness={roughness}
              metalness={metalness}
            />
          </mesh>
        </group>
      );
    case 5: // Camera
      return (
        <group>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.7, 0.5, 0.35]} />
            <meshStandardMaterial
              color={color}
              roughness={roughness}
              metalness={metalness}
            />
          </mesh>
          <mesh position={[0, 0, 0.3]}>
            <cylinderGeometry args={[0.15, 0.18, 0.25, 16]} />
            <meshStandardMaterial
              color="#222"
              roughness={0.2}
              metalness={0.6}
            />
          </mesh>
          <mesh position={[0.28, 0.18, 0.18]}>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshStandardMaterial
              color="#111"
              roughness={0.05}
              metalness={0.3}
            />
          </mesh>
        </group>
      );
    case 6: // Game console
      return (
        <group>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.9, 0.18, 0.6]} />
            <meshStandardMaterial
              color={color}
              roughness={roughness}
              metalness={metalness}
            />
          </mesh>
          <mesh position={[0, 0.1, 0.1]}>
            <cylinderGeometry args={[0.04, 0.04, 0.06, 8]} />
            <meshStandardMaterial
              color="#00aaff"
              roughness={0.1}
              metalness={0.4}
              emissive="#0044ff"
              emissiveIntensity={0.3}
            />
          </mesh>
          {[-0.3, 0.3].map((x) => (
            <mesh key={x} position={[x, 0.0, 0.31]}>
              <boxGeometry args={[0.22, 0.05, 0.02]} />
              <meshStandardMaterial
                color="#333"
                roughness={0.6}
                metalness={0.2}
              />
            </mesh>
          ))}
        </group>
      );
    default: // Speaker
      return (
        <group>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.55, 0.9, 0.5]} />
            <meshStandardMaterial
              color={color}
              roughness={roughness}
              metalness={metalness}
            />
          </mesh>
          <mesh position={[0, 0.1, 0.26]}>
            <cylinderGeometry args={[0.18, 0.2, 0.05, 16]} />
            <meshStandardMaterial
              color="#222"
              roughness={0.7}
              metalness={0.1}
            />
          </mesh>
          <mesh position={[0, -0.28, 0.26]}>
            <cylinderGeometry args={[0.07, 0.07, 0.04, 12]} />
            <meshStandardMaterial
              color="#333"
              roughness={0.5}
              metalness={0.2}
            />
          </mesh>
        </group>
      );
  }
}

// ─── Food ────────────────────────────────────────────────────────────────────
function FoodModel({
  variant,
  color,
  roughness: _r,
  metalness: _m,
}: VariantProps) {
  switch (variant % 8) {
    case 0: // Hamburger
      return (
        <group>
          {[
            { y: -0.35, h: 0.14, c: "#c8914a", r: 0.45 },
            { y: -0.2, h: 0.1, c: "#5a2e0e", r: 0.4 },
            { y: -0.09, h: 0.08, c: "#4caf50", r: 0.43 },
            { y: 0.02, h: 0.07, c: "#e53935", r: 0.42 },
            { y: 0.12, h: 0.16, c: "#d4a853", r: 0.44 },
          ].map((l) => (
            <mesh key={l.c + l.y} position={[0, l.y, 0]}>
              <cylinderGeometry args={[l.r, l.r, l.h, 20]} />
              <meshStandardMaterial
                color={l.c}
                roughness={0.8}
                metalness={0.05}
              />
            </mesh>
          ))}
        </group>
      );
    case 1: // Pizza
      return (
        <group rotation={[-Math.PI / 2, 0, 0]}>
          <mesh>
            <cylinderGeometry args={[0.8, 0.8, 0.1, 3]} />
            <meshStandardMaterial
              color="#e8c448"
              roughness={0.7}
              metalness={0.05}
            />
          </mesh>
          <mesh position={[0, 0.07, 0]}>
            <cylinderGeometry args={[0.72, 0.72, 0.04, 3]} />
            <meshStandardMaterial
              color="#cc3300"
              roughness={0.6}
              metalness={0}
            />
          </mesh>
        </group>
      );
    case 2: // Apple
      return (
        <group>
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.55, 16, 14]} />
            <meshStandardMaterial
              color={color}
              roughness={0.5}
              metalness={0.05}
            />
          </mesh>
          <mesh position={[0, 0.65, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.25, 6]} />
            <meshStandardMaterial
              color="#5c3317"
              roughness={0.8}
              metalness={0}
            />
          </mesh>
          <mesh position={[0.04, 0.62, 0.06]} rotation={[0.5, 0.3, 0.2]}>
            <boxGeometry args={[0.22, 0.08, 0.06]} />
            <meshStandardMaterial
              color="#44aa44"
              roughness={0.7}
              metalness={0}
            />
          </mesh>
        </group>
      );
    case 3: // Cake
      return (
        <group>
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.6, 0.6, 0.55, 16]} />
            <meshStandardMaterial
              color="#c8914a"
              roughness={0.7}
              metalness={0.05}
            />
          </mesh>
          <mesh position={[0, 0.32, 0]}>
            <cylinderGeometry args={[0.62, 0.62, 0.12, 16]} />
            <meshStandardMaterial color={color} roughness={0.5} metalness={0} />
          </mesh>
          {[-0.15, 0, 0.15].map((x) => (
            <mesh key={x} position={[x, 0.55, 0]}>
              <cylinderGeometry args={[0.025, 0.025, 0.28, 6]} />
              <meshStandardMaterial
                color="#ffddaa"
                roughness={0.5}
                metalness={0}
              />
            </mesh>
          ))}
        </group>
      );
    case 4: // Sushi
      return (
        <group>
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.3, 0.3, 0.22, 16]} />
            <meshStandardMaterial
              color="#f5f5dc"
              roughness={0.6}
              metalness={0}
            />
          </mesh>
          <mesh position={[0, 0.12, 0]}>
            <cylinderGeometry args={[0.28, 0.28, 0.06, 16]} />
            <meshStandardMaterial
              color="#ff6666"
              roughness={0.4}
              metalness={0}
            />
          </mesh>
          <mesh position={[0, 0.06, 0]}>
            <torusGeometry args={[0.28, 0.03, 6, 16]} />
            <meshStandardMaterial color="#111" roughness={0.5} metalness={0} />
          </mesh>
        </group>
      );
    case 5: // Ice cream cone
      return (
        <group>
          <mesh position={[0, -0.2, 0]}>
            <coneGeometry args={[0.32, 0.85, 12]} />
            <meshStandardMaterial
              color="#d2a679"
              roughness={0.7}
              metalness={0}
            />
          </mesh>
          <mesh position={[0, 0.35, 0]}>
            <sphereGeometry args={[0.38, 14, 12]} />
            <meshStandardMaterial color={color} roughness={0.5} metalness={0} />
          </mesh>
        </group>
      );
    case 6: // Donut
      return (
        <group>
          <mesh>
            <torusGeometry args={[0.4, 0.22, 10, 24]} />
            <meshStandardMaterial
              color={color}
              roughness={0.6}
              metalness={0.05}
            />
          </mesh>
          <mesh position={[0, 0.1, 0]}>
            <torusGeometry args={[0.4, 0.12, 8, 24]} />
            <meshStandardMaterial
              color="#cc3388"
              roughness={0.4}
              metalness={0}
            />
          </mesh>
        </group>
      );
    default: // Bowl of noodles
      return (
        <group>
          <mesh position={[0, -0.1, 0]}>
            <cylinderGeometry args={[0.55, 0.4, 0.45, 16, 1, true]} />
            <meshStandardMaterial
              color={color}
              roughness={0.4}
              metalness={0.1}
              side={THREE.DoubleSide}
            />
          </mesh>
          <mesh position={[0, 0.12, 0]}>
            <cylinderGeometry args={[0.52, 0.52, 0.04, 16]} />
            <meshStandardMaterial
              color="#f5d376"
              roughness={0.5}
              metalness={0}
            />
          </mesh>
        </group>
      );
  }
}

// ─── Sports ──────────────────────────────────────────────────────────────────
function SportsModel({ variant, color, roughness, metalness }: VariantProps) {
  switch (variant % 8) {
    case 0: // Soccer ball
      return (
        <group>
          <mesh>
            <sphereGeometry args={[0.6, 20, 20]} />
            <meshStandardMaterial
              color="#ffffff"
              roughness={roughness}
              metalness={metalness}
            />
          </mesh>
          {[
            [0, 0.6, 0],
            [0, -0.6, 0],
            [0.57, 0.2, 0.2],
            [-0.57, 0.2, 0.2],
          ].map((pos) => (
            <mesh
              key={pos.join(",")}
              position={pos as [number, number, number]}
            >
              <dodecahedronGeometry args={[0.15]} />
              <meshStandardMaterial
                color="#111"
                roughness={0.8}
                metalness={0.1}
              />
            </mesh>
          ))}
        </group>
      );
    case 1: // Tennis racket
      return (
        <group rotation={[0, 0, 0.3]}>
          <mesh position={[0, 0.5, 0]}>
            <torusGeometry args={[0.42, 0.05, 8, 24]} />
            <meshStandardMaterial
              color={color}
              roughness={roughness}
              metalness={metalness}
            />
          </mesh>
          <mesh position={[0, -0.45, 0]}>
            <cylinderGeometry args={[0.06, 0.05, 0.9, 8]} />
            <meshStandardMaterial
              color="#333333"
              roughness={0.8}
              metalness={0.1}
            />
          </mesh>
        </group>
      );
    case 2: // Baseball bat
      return (
        <group rotation={[0, 0, 0.3]}>
          <mesh position={[0, 0.3, 0]}>
            <cylinderGeometry args={[0.12, 0.05, 1.4, 12]} />
            <meshStandardMaterial
              color={color}
              roughness={roughness}
              metalness={metalness}
            />
          </mesh>
          <mesh position={[0, 1.05, 0]}>
            <sphereGeometry args={[0.13, 10, 8]} />
            <meshStandardMaterial
              color={color}
              roughness={roughness}
              metalness={metalness}
            />
          </mesh>
        </group>
      );
    case 3: // Basketball
      return (
        <group>
          <mesh>
            <sphereGeometry args={[0.6, 20, 20]} />
            <meshStandardMaterial
              color={color}
              roughness={roughness}
              metalness={metalness}
            />
          </mesh>
          <mesh>
            <torusGeometry args={[0.6, 0.015, 6, 32]} />
            <meshStandardMaterial color="#111" roughness={0.8} metalness={0} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.6, 0.015, 6, 32]} />
            <meshStandardMaterial color="#111" roughness={0.8} metalness={0} />
          </mesh>
        </group>
      );
    case 4: // Boxing gloves
      return (
        <group>
          {[-0.45, 0.45].map((x) => (
            <group key={x} position={[x, 0, 0]}>
              <mesh>
                <boxGeometry args={[0.38, 0.55, 0.3]} />
                <meshStandardMaterial
                  color={color}
                  roughness={roughness}
                  metalness={metalness}
                />
              </mesh>
              <mesh position={[x > 0 ? 0.08 : -0.08, 0.22, 0]}>
                <sphereGeometry args={[0.18, 10, 8]} />
                <meshStandardMaterial
                  color={color}
                  roughness={roughness}
                  metalness={metalness}
                />
              </mesh>
            </group>
          ))}
        </group>
      );
    case 5: // Skateboard
      return (
        <group>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[1.5, 0.08, 0.4]} />
            <meshStandardMaterial
              color={color}
              roughness={roughness}
              metalness={metalness}
            />
          </mesh>
          {(
            [
              [-0.5, -0.1, 0.2],
              [0.5, -0.1, 0.2],
              [-0.5, -0.1, -0.2],
              [0.5, -0.1, -0.2],
            ] as [number, number, number][]
          ).map((pos) => (
            <mesh
              key={pos.join(",")}
              position={pos}
              rotation={[Math.PI / 2, 0, 0]}
            >
              <torusGeometry args={[0.12, 0.05, 8, 12]} />
              <meshStandardMaterial
                color="#222"
                roughness={0.7}
                metalness={0.3}
              />
            </mesh>
          ))}
        </group>
      );
    case 6: // Barbell
      return (
        <group rotation={[0, 0, Math.PI / 2]}>
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 1.8, 8]} />
            <meshStandardMaterial
              color={color}
              roughness={roughness}
              metalness={metalness}
            />
          </mesh>
          {[-0.75, 0.75].map((y) => (
            <mesh key={y} position={[0, y, 0]}>
              <cylinderGeometry args={[0.28, 0.28, 0.18, 12]} />
              <meshStandardMaterial
                color="#222"
                roughness={0.4}
                metalness={0.7}
              />
            </mesh>
          ))}
        </group>
      );
    default: // Trophy
      return (
        <group>
          <mesh position={[0, 0.5, 0]}>
            <cylinderGeometry args={[0.35, 0.2, 0.7, 12]} />
            <meshStandardMaterial
              color={color}
              roughness={roughness}
              metalness={metalness}
            />
          </mesh>
          <mesh position={[0, 0.1, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.6, 8]} />
            <meshStandardMaterial
              color={color}
              roughness={roughness}
              metalness={metalness}
            />
          </mesh>
          <mesh position={[0, -0.22, 0]}>
            <boxGeometry args={[0.5, 0.12, 0.3]} />
            <meshStandardMaterial
              color={color}
              roughness={roughness}
              metalness={metalness}
            />
          </mesh>
          {[-0.38, 0.38].map((x) => (
            <mesh
              key={x}
              position={[x, 0.55, 0]}
              rotation={[0, 0, x < 0 ? -1.2 : 1.2]}
            >
              <torusGeometry args={[0.15, 0.03, 6, 12, Math.PI * 1.3]} />
              <meshStandardMaterial
                color={color}
                roughness={roughness}
                metalness={metalness}
              />
            </mesh>
          ))}
        </group>
      );
  }
}

// ─── Weapons ─────────────────────────────────────────────────────────────────
function WeaponModel({ variant, color, roughness, metalness }: VariantProps) {
  switch (variant % 8) {
    case 0: // Longsword
      return (
        <group rotation={[0, 0, 0.15]}>
          <mesh position={[0, 0.5, 0]}>
            <boxGeometry args={[0.06, 1.6, 0.015]} />
            <meshStandardMaterial
              color={color}
              roughness={roughness}
              metalness={metalness}
            />
          </mesh>
          <mesh position={[0, 1.36, 0]}>
            <coneGeometry args={[0.043, 0.2, 4]} />
            <meshStandardMaterial
              color={color}
              roughness={roughness}
              metalness={metalness}
            />
          </mesh>
          <mesh position={[0, -0.25, 0]}>
            <boxGeometry args={[0.55, 0.07, 0.055]} />
            <meshStandardMaterial
              color="#888844"
              roughness={0.4}
              metalness={0.7}
            />
          </mesh>
          <mesh position={[0, -0.6, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.6, 8]} />
            <meshStandardMaterial
              color="#5c3317"
              roughness={0.7}
              metalness={0.1}
            />
          </mesh>
        </group>
      );
    case 1: // Pistol
      return (
        <group>
          <mesh position={[0, 0.05, 0]}>
            <boxGeometry args={[0.65, 0.3, 0.13]} />
            <meshStandardMaterial
              color={color}
              roughness={roughness}
              metalness={metalness}
            />
          </mesh>
          <mesh position={[0.45, 0.12, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.04, 0.04, 0.5, 8]} />
            <meshStandardMaterial
              color={color}
              roughness={roughness}
              metalness={metalness}
            />
          </mesh>
          <mesh position={[-0.12, -0.32, 0]} rotation={[0, 0, 0.25]}>
            <boxGeometry args={[0.18, 0.42, 0.12]} />
            <meshStandardMaterial
              color="#333333"
              roughness={0.8}
              metalness={0.1}
            />
          </mesh>
        </group>
      );
    case 2: // Axe
      return (
        <group rotation={[0, 0, 0.2]}>
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.04, 0.05, 1.5, 8]} />
            <meshStandardMaterial
              color="#5c3317"
              roughness={0.7}
              metalness={0.1}
            />
          </mesh>
          <mesh position={[0.22, 0.55, 0]}>
            <boxGeometry args={[0.45, 0.6, 0.06]} />
            <meshStandardMaterial
              color={color}
              roughness={roughness}
              metalness={metalness}
            />
          </mesh>
        </group>
      );
    case 3: // Bow
      return (
        <group>
          <mesh position={[0, 0, 0]}>
            <torusGeometry args={[0.7, 0.04, 8, 20, Math.PI * 1.4]} />
            <meshStandardMaterial
              color="#5c3317"
              roughness={0.7}
              metalness={0.1}
            />
          </mesh>
          <mesh position={[0, 0, 0.02]}>
            <cylinderGeometry args={[0.01, 0.01, 1.38, 6]} />
            <meshStandardMaterial
              color="#dddddd"
              roughness={0.4}
              metalness={0.2}
            />
          </mesh>
        </group>
      );
    case 4: // Spear
      return (
        <group rotation={[0, 0, 0.1]}>
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 2.2, 8]} />
            <meshStandardMaterial
              color="#5c3317"
              roughness={0.7}
              metalness={0.1}
            />
          </mesh>
          <mesh position={[0, 1.2, 0]}>
            <coneGeometry args={[0.07, 0.45, 8]} />
            <meshStandardMaterial
              color={color}
              roughness={roughness}
              metalness={metalness}
            />
          </mesh>
        </group>
      );
    case 5: // Shield
      return (
        <group>
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.7, 0.7, 0.08, 6]} />
            <meshStandardMaterial
              color={color}
              roughness={roughness}
              metalness={metalness}
            />
          </mesh>
          <mesh position={[0, 0, 0.05]}>
            <cylinderGeometry args={[0.25, 0.25, 0.04, 6]} />
            <meshStandardMaterial
              color="#888844"
              roughness={0.4}
              metalness={0.7}
            />
          </mesh>
        </group>
      );
    case 6: // Dagger
      return (
        <group rotation={[0, 0, 0.2]}>
          <mesh position={[0, 0.3, 0]}>
            <boxGeometry args={[0.04, 0.8, 0.01]} />
            <meshStandardMaterial
              color={color}
              roughness={roughness}
              metalness={metalness}
            />
          </mesh>
          <mesh position={[0, 0.78, 0]}>
            <coneGeometry args={[0.028, 0.15, 4]} />
            <meshStandardMaterial
              color={color}
              roughness={roughness}
              metalness={metalness}
            />
          </mesh>
          <mesh position={[0, -0.12, 0]}>
            <boxGeometry args={[0.3, 0.05, 0.04]} />
            <meshStandardMaterial
              color="#888844"
              roughness={0.4}
              metalness={0.7}
            />
          </mesh>
          <mesh position={[0, -0.4, 0]}>
            <cylinderGeometry args={[0.03, 0.025, 0.45, 8]} />
            <meshStandardMaterial
              color="#333"
              roughness={0.7}
              metalness={0.1}
            />
          </mesh>
        </group>
      );
    default: // Rifle
      return (
        <group>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[1.5, 0.18, 0.1]} />
            <meshStandardMaterial
              color={color}
              roughness={roughness}
              metalness={metalness}
            />
          </mesh>
          <mesh position={[0.8, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.04, 0.035, 0.55, 8]} />
            <meshStandardMaterial
              color={color}
              roughness={roughness}
              metalness={metalness}
            />
          </mesh>
          <mesh position={[-0.5, -0.22, 0]} rotation={[0, 0, 0.3]}>
            <boxGeometry args={[0.45, 0.2, 0.09]} />
            <meshStandardMaterial
              color="#5c3317"
              roughness={0.7}
              metalness={0.1}
            />
          </mesh>
        </group>
      );
  }
}
