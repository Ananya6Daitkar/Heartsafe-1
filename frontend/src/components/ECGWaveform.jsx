import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useECGStore } from '../hooks/useStore';

export function ECGWaveform() {
  const lineRef = useRef();
  const ecgData = useECGStore((state) => state.ecgData);

  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    
    const positions = new Float32Array(500 * 3);
    for (let i = 0; i < 500; i++) {
      positions[i * 3] = (i / 500) * 8 - 4;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = 0;
    }
    
    const colors = new Float32Array(500 * 3);
    for (let i = 0; i < 500; i++) {
      colors[i * 3] = 0;
      colors[i * 3 + 1] = 0.85;
      colors[i * 3 + 2] = 1;
    }
    
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    return geom;
  }, []);

  useFrame(() => {
    if (!lineRef.current || ecgData.length === 0) return;

    const positions = geometry.attributes.position.array;
    const colors = geometry.attributes.color.array;
    
    const dataLength = Math.min(ecgData.length, 500);
    for (let i = 0; i < dataLength; i++) {
      const sample = ecgData[i];
      positions[i * 3 + 1] = sample.value * 2;
      
      if (sample.isAbnormal) {
        colors[i * 3] = 1;
        colors[i * 3 + 1] = 0.42;
        colors[i * 3 + 2] = 0.42;
      } else {
        colors[i * 3] = 0;
        colors[i * 3 + 1] = 0.85;
        colors[i * 3 + 2] = 1;
      }
    }
    
    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.color.needsUpdate = true;
  });

  return (
    <line ref={lineRef} geometry={geometry}>
      <lineBasicMaterial vertexColors linewidth={2} fog={false} />
    </line>
  );
}
