import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useECGStore } from '../hooks/useStore';

export function Heart3D() {
  const meshRef = useRef();
  const heartRate = useECGStore((state) => state.heartRate);
  const timeRef = useRef(0);

  const beatDuration = 60 / heartRate;

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    timeRef.current += delta;
    const cycleProgress = (timeRef.current % beatDuration) / beatDuration;

    let scale = 1;
    if (cycleProgress < 0.3) {
      scale = 1 + (cycleProgress / 0.3) * 0.15;
    } else {
      scale = 1.15 - ((cycleProgress - 0.3) / 0.7) * 0.15;
    }

    meshRef.current.scale.set(scale, scale, scale);
    meshRef.current.rotation.y += delta * 0.3;
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <icosahedronGeometry args={[1, 4]} />
      <meshStandardMaterial
        color="#FF6B6B"
        emissive="#FF6B6B"
        emissiveIntensity={0.8}
        metalness={0.3}
        roughness={0.4}
      />
    </mesh>
  );
}
