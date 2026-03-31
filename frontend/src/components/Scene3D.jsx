import { Canvas } from '@react-three/fiber';
import { Bloom, EffectComposer } from '@react-three/drei';
import { Heart3D } from './Heart3D';
import { ECGWaveform } from './ECGWaveform';
import { ParticleSystem } from './ParticleSystem';
import { BackgroundWaves } from './BackgroundWaves';

export function Scene3D() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 50 }}
      style={{ width: '100%', height: '100%' }}
      dpr={[1, 2]}
      performance={{ min: 0.5 }}
      onCreated={(state) => {
        state.gl.setClearColor('#0F1419');
      }}
    >
      {/* Lighting */}
      <ambientLight intensity={0.4} color="#0F1419" />
      <pointLight position={[0, 0, 3]} intensity={1.5} color="#00D9FF" />
      <pointLight position={[-5, 5, 5]} intensity={0.8} color="#FF6B6B" />

      {/* 3D Components */}
      <BackgroundWaves />
      <ParticleSystem />
      <Heart3D />
      <ECGWaveform />

      {/* Post-processing */}
      <EffectComposer>
        <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} intensity={1.2} />
      </EffectComposer>
    </Canvas>
  );
}
