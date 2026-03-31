import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useECGStore } from '../hooks/useStore';

export function NeuralNetworkViz() {
  const groupRef = useRef();
  const analysisStatus = useECGStore((state) => state.analysisStatus);
  const isArrhythmia = useECGStore((state) => state.isArrhythmiaDetected);
  const timeRef = useRef(0);

  const isVisible = analysisStatus === 'analyzing' || analysisStatus === 'complete';

  useFrame((state, delta) => {
    if (!groupRef.current || !isVisible) return;

    timeRef.current += delta;
    const loopTime = 3; // 3 second loop
    const progress = (timeRef.current % loopTime) / loopTime;

    // Animate layer glow based on progress
    groupRef.current.children.forEach((child, idx) => {
      if (child.userData.isLayer) {
        const layerProgress = (progress - idx * 0.25) % 1;
        const intensity = Math.max(0, 1 - Math.abs(layerProgress - 0.5) * 2);
        child.material.emissiveIntensity = intensity * 0.8;
      }
    });
  });

  if (!isVisible) return null;

  return (
    <group ref={groupRef} position={[0, 2.5, 0]} scale={0.6} opacity={0.6}>
      {/* Input Layer */}
      <mesh position={[-3, 0, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial
          color="#00D9FF"
          emissive="#00D9FF"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Hidden Layer 1 */}
      <mesh position={[-1, 0, 0]} userData={{ isLayer: true }}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial
          color="#00D9FF"
          emissive="#00D9FF"
          emissiveIntensity={0}
        />
      </mesh>

      {/* Hidden Layer 2 */}
      <mesh position={[1, 0, 0]} userData={{ isLayer: true }}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial
          color="#00D9FF"
          emissive="#00D9FF"
          emissiveIntensity={0}
        />
      </mesh>

      {/* Output Layer */}
      <mesh position={[3, 0, 0]} userData={{ isLayer: true }}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial
          color={isArrhythmia ? '#FF6B6B' : '#00D9FF'}
          emissive={isArrhythmia ? '#FF6B6B' : '#00D9FF'}
          emissiveIntensity={0}
        />
      </mesh>

      {/* Connection Lines */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={4}
            array={new Float32Array([-3, 0, 0, -1, 0, 0, -1, 0, 0, 1, 0, 0])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#00D9FF" opacity={0.3} transparent />
      </line>

      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={4}
            array={new Float32Array([1, 0, 0, 3, 0, 0, -1, 0, 0, 1, 0, 0])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#00D9FF" opacity={0.3} transparent />
      </line>
    </group>
  );
}
