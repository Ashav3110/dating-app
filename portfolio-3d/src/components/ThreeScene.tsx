'use client';

import { useRef, Suspense, useState, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  Environment,
  ContactShadows,
  Float,
  MeshTransmissionMaterial,
  PerformanceMonitor,
  Preload,
  Stars,
} from '@react-three/drei';
import * as THREE from 'three';

// ─────────────────────────────────────────────
// Orbiting accent sphere around the knot
// ─────────────────────────────────────────────
function OrbitingSphere({ radius, speed, color, size }: {
  radius: number;
  speed: number;
  color: string;
  size: number;
}) {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed;
    ref.current.position.set(
      Math.cos(t) * radius,
      Math.sin(t * 0.7) * 0.5,
      Math.sin(t) * radius
    );
  });

  return (
    <mesh ref={ref} castShadow>
      <sphereGeometry args={[size, 16, 16]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={3}
        roughness={0}
        metalness={0.8}
        toneMapped={false}
      />
    </mesh>
  );
}

// ─────────────────────────────────────────────
// Main torus knot mesh — mouse-reactive + auto-rotate
// ─────────────────────────────────────────────
function TorusKnotMesh({ perfMode }: { perfMode: boolean }) {
  const groupRef = useRef<THREE.Group>(null!);
  const knotRef = useRef<THREE.Mesh>(null!);

  // Smooth lerp state stored in ref (no re-renders)
  const lerpedPointer = useRef({ x: 0, y: 0 });
  const baseRotation = useRef(0);

  useFrame((state, delta) => {
    const { pointer } = state;

    // Auto-rotation accumulates on the base
    baseRotation.current += delta * 0.22;

    // Smooth lerp toward pointer
    lerpedPointer.current.x = THREE.MathUtils.lerp(
      lerpedPointer.current.x,
      pointer.x,
      0.04
    );
    lerpedPointer.current.y = THREE.MathUtils.lerp(
      lerpedPointer.current.y,
      pointer.y,
      0.04
    );

    // Apply: base auto-spin + mouse lean
    if (groupRef.current) {
      groupRef.current.rotation.y = baseRotation.current + lerpedPointer.current.x * 0.7;
      groupRef.current.rotation.x = lerpedPointer.current.y * -0.5;
    }
  });

  return (
    <group ref={groupRef}>
      <Float
        speed={1.6}
        rotationIntensity={0.15}
        floatIntensity={0.4}
        floatingRange={[-0.12, 0.12]}
      >
        {/* ── Torus Knot ── */}
        <mesh ref={knotRef} castShadow receiveShadow>
          <torusKnotGeometry
            args={[
              1,
              0.33,
              perfMode ? 128 : 288, // tubular segments
              perfMode ? 18 : 32,   // radial segments
              2,                     // p windings
              3,                     // q windings
            ]}
          />
          <MeshTransmissionMaterial
            backside
            backsideThickness={1.5}
            samples={perfMode ? 3 : 5}
            resolution={perfMode ? 128 : 256}
            transmission={0.96}
            roughness={0.05}
            thickness={2.5}
            ior={1.65}
            chromaticAberration={0.04}
            anisotropy={0.5}
            distortion={0.04}
            distortionScale={0.1}
            temporalDistortion={0.08}
            color="#c4b5fd"
            attenuationColor="#7c3aed"
            attenuationDistance={0.6}
          />
        </mesh>
      </Float>

      {/* ── Orbiting accent spheres ── */}
      <OrbitingSphere radius={1.9} speed={0.8} color="#06b6d4" size={0.12} />
      <OrbitingSphere radius={1.6} speed={-1.1} color="#ec4899" size={0.09} />
      <OrbitingSphere radius={2.1} speed={0.55} color="#a78bfa" size={0.07} />
    </group>
  );
}

// ─────────────────────────────────────────────
// Scene lighting — key, fill, rim, top, ambient
// ─────────────────────────────────────────────
function SceneLights() {
  return (
    <>
      {/* Soft ambient fill */}
      <ambientLight intensity={0.35} color="#1a0533" />

      {/* Key light — warm white, casts crisp shadows */}
      <directionalLight
        position={[6, 9, 6]}
        intensity={3.5}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={0.5}
        shadow-camera-far={30}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
        shadow-bias={-0.0008}
        color="#fff8f0"
      />

      {/* Fill light — cool cyan from lower left */}
      <pointLight position={[-6, -2, 4]} intensity={6} color="#06b6d4" decay={2} />

      {/* Rim light — pink/magenta from behind */}
      <pointLight position={[3, 1, -6]} intensity={5} color="#ec4899" decay={2} />

      {/* Top purple bounce */}
      <pointLight position={[0, 7, 0]} intensity={4} color="#8b5cf6" decay={2} />

      {/* Subtle warm point at camera level */}
      <pointLight position={[0, 0, 6]} intensity={1.5} color="#fde68a" decay={2} />
    </>
  );
}

// ─────────────────────────────────────────────
// Loading fallback (shown inside Canvas via Suspense)
// ─────────────────────────────────────────────
function Loader() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 2;
  });
  return (
    <mesh ref={ref}>
      <octahedronGeometry args={[0.6, 0]} />
      <meshBasicMaterial color="#8b5cf6" wireframe />
    </mesh>
  );
}

// ─────────────────────────────────────────────
// Exported ThreeScene component
// ─────────────────────────────────────────────
export interface ThreeSceneProps {
  /** Tailwind / CSS class applied to the wrapper div */
  className?: string;
  /** Show the starfield background (default: true) */
  showStars?: boolean;
  /** Show the contact shadow plane beneath the knot (default: true) */
  showShadow?: boolean;
}

export default function ThreeScene({
  className = '',
  showStars = true,
  showShadow = true,
}: ThreeSceneProps) {
  // Adaptive performance — degrades gracefully on low-end GPUs
  const [perfMode, setPerfMode] = useState(false);
  const onDecline = useCallback(() => setPerfMode(true), []);
  const onIncline = useCallback(() => setPerfMode(false), []);

  return (
    <div className={`w-full h-full ${className}`} aria-label="3D torus knot scene">
      <Canvas
        shadows
        camera={{ position: [0, 0, 5.5], fov: 48, near: 0.1, far: 120 }}
        dpr={[1, 2]}
        frameloop="always"
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.3,
        }}
        style={{ background: 'transparent' }}
      >
        {/* ── Adaptive quality monitor ── */}
        <PerformanceMonitor
          onDecline={onDecline}
          onIncline={onIncline}
          flipflops={4}
          threshold={0.9}
          step={0.2}
        >
          <Suspense fallback={<Loader />}>
            {/* Lights */}
            <SceneLights />

            {/* Main scene content */}
            <TorusKnotMesh perfMode={perfMode} />

            {/* Soft purple contact shadow on an invisible ground plane */}
            {showShadow && (
              <ContactShadows
                position={[0, -2.4, 0]}
                opacity={0.55}
                scale={10}
                blur={3}
                far={5}
                color="#4c1d95"
                frames={1}
              />
            )}

            {/* Image-based lighting for realistic reflections */}
            <Environment preset="studio" />

            {/* Starfield */}
            {showStars && (
              <Stars
                radius={80}
                depth={40}
                count={perfMode ? 2000 : 5000}
                factor={2.5}
                saturation={0}
                fade
                speed={0.4}
              />
            )}

            {/* Preload all assets */}
            <Preload all />
          </Suspense>
        </PerformanceMonitor>
      </Canvas>
    </div>
  );
}
