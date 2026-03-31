import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function ParticleSystem() {
  const pointsRef = useRef();
  const velocityRef = useRef([]);

  const { geometry, material } = useMemo(() => {
    const count = 100;
    const positions = new Float32Array(count * 3);
    const velocities = [];

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;

      velocities.push({
        x: (Math.random() - 0.5) * 0.5,
        y: (Math.random() - 0.5) * 0.5,
        z: (Math.random() - 0.5) * 0.5
      });
    }

    velocityRef.current = velocities;

    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
      color: '#00D9FF',
      size: 0.1,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.6
    });

    return { geometry: geom, material: mat };
  }, []);

  useFrame(() => {
    if (!pointsRef.current) return;

    const positions = geometry.attributes.position.array;
    const velocities = velocityRef.current;

    for (let i = 0; i < velocities.length; i++) {
      positions[i * 3] += velocities[i].x * 0.01;
      positions[i * 3 + 1] += velocities[i].y * 0.01;
      positions[i * 3 + 2] += velocities[i].z * 0.01;

      if (Math.abs(positions[i * 3]) > 5) velocities[i].x *= -1;
      if (Math.abs(positions[i * 3 + 1]) > 5) velocities[i].y *= -1;
      if (Math.abs(positions[i * 3 + 2]) > 5) velocities[i].z *= -1;
    }

    geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} geometry={geometry} material={material} />
  );
}
