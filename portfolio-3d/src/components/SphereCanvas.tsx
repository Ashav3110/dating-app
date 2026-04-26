'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Stars, Float, Environment } from '@react-three/drei';
import * as THREE from 'three';

function DistortSphere() {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock, mouse }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.18;
      meshRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.12) * 0.15;
      // Subtle mouse parallax
      meshRef.current.rotation.y += mouse.x * 0.004;
      meshRef.current.rotation.x += mouse.y * 0.004;
    }
  });

  return (
    <Float speed={1.4} rotationIntensity={0.4} floatIntensity={0.8}>
      <mesh ref={meshRef} scale={1}>
        {/* Outer glow ring */}
        <mesh scale={1.18}>
          <torusGeometry args={[1, 0.015, 16, 120]} />
          <meshBasicMaterial color="#8b5cf6" transparent opacity={0.35} />
        </mesh>
        {/* Second ring */}
        <mesh scale={1.35} rotation={[Math.PI / 2.5, 0, 0]}>
          <torusGeometry args={[1, 0.008, 16, 120]} />
          <meshBasicMaterial color="#06b6d4" transparent opacity={0.25} />
        </mesh>

        {/* Core sphere */}
        <sphereGeometry args={[1, 64, 64]} />
        <MeshDistortMaterial
          color="#0d0a1f"
          envMapIntensity={0.4}
          clearcoat={1}
          clearcoatRoughness={0}
          metalness={0.1}
          roughness={0.2}
          distort={0.45}
          speed={2.5}
          transparent
          opacity={0.95}
        />
      </mesh>

      {/* Inner glow light */}
    </Float>
  );
}

function Particles() {
  const count = 180;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const r = 1.6 + Math.random() * 0.6;
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);

  const ref = useRef<THREE.Points>(null!);
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.06;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial size={0.025} color="#a78bfa" transparent opacity={0.8} sizeAttenuation />
    </points>
  );
}

export default function SphereCanvas() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 3], fov: 55 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={2} color="#8b5cf6" />
        <pointLight position={[-5, -5, -5]} intensity={1.5} color="#06b6d4" />
        <pointLight position={[0, 0, 3]} intensity={1} color="#ec4899" />
        <Stars radius={100} depth={50} count={4000} factor={3} saturation={0} fade speed={0.5} />
        <DistortSphere />
        <Particles />
        <Environment preset="night" />
      </Canvas>
    </div>
  );
}
