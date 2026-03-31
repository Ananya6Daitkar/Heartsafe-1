import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function BackgroundWaves() {
  const meshRef = useRef();

  const geometry = new THREE.PlaneGeometry(20, 20, 100, 100);
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color('#00D9FF') }
    },
    vertexShader: `
      uniform float uTime;
      varying float vWave;
      
      void main() {
        vec3 pos = position;
        float wave = sin(pos.x * 0.5 + uTime) * 0.3;
        wave += sin(pos.y * 0.3 + uTime * 0.7) * 0.2;
        pos.z = wave;
        
        vWave = wave;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      varying float vWave;
      
      void main() {
        float alpha = 0.1 + vWave * 0.05;
        gl_FragColor = vec4(uColor, alpha);
      }
    `,
    transparent: true,
    side: THREE.DoubleSide
  });

  useFrame((state) => {
    if (meshRef.current) {
      material.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh ref={meshRef} geometry={geometry} material={material} position={[0, 0, -5]} />
  );
}
