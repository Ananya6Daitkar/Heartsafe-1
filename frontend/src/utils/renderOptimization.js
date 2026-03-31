import * as THREE from 'three';

// Optimize geometry for rendering
export function optimizeGeometry(geometry) {
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  geometry.computeVertexNormals();
  return geometry;
}

// Create instanced geometry for particles
export function createInstancedParticles(count = 100) {
  const geometry = new THREE.BufferGeometry();
  
  const positions = new Float32Array(count * 3);
  const scales = new Float32Array(count);
  
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    scales[i] = Math.random() * 0.5 + 0.5;
  }
  
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));
  
  return geometry;
}

// Optimize material for performance
export function createOptimizedMaterial(config = {}) {
  return new THREE.MeshStandardMaterial({
    color: config.color || '#FF6B6B',
    emissive: config.emissive || '#FF6B6B',
    emissiveIntensity: config.emissiveIntensity || 0.5,
    metalness: config.metalness || 0.3,
    roughness: config.roughness || 0.4,
    side: THREE.FrontSide,
    toneMapped: true,
    ...config
  });
}

// Enable frustum culling
export function enableFrustumCulling(object) {
  object.frustumCulled = true;
  if (object.children) {
    object.children.forEach(child => enableFrustumCulling(child));
  }
}

// Optimize renderer settings
export function optimizeRenderer(renderer) {
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = false; // Disable shadows for performance
  renderer.shadowMap.type = THREE.PCFShadowShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  return renderer;
}
