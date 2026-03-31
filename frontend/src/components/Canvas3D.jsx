import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { useECGStore } from '../hooks/useStore';

export function Canvas3D() {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const heartRef = useRef(null);
  const particlesRef = useRef(null);
  const orbitsRef = useRef([]);
  const timeRef = useRef(0);
  const heartRate = useECGStore((state) => state.heartRate);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0F1419');
    scene.fog = new THREE.Fog('#0F1419', 50, 100);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      60,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 8;
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowShadowMap;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight('#ffffff', 0.3);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight('#00D9FF', 2);
    pointLight1.position.set(5, 5, 5);
    pointLight1.castShadow = true;
    pointLight1.shadow.mapSize.width = 2048;
    pointLight1.shadow.mapSize.height = 2048;
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight('#FF6B6B', 1.5);
    pointLight2.position.set(-5, -5, 5);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight('#00D9FF', 1);
    pointLight3.position.set(0, 0, 10);
    scene.add(pointLight3);

    // Background animated waves
    const waveGeometry = new THREE.PlaneGeometry(100, 100, 200, 200);
    const waveMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor1: { value: new THREE.Color('#00D9FF') },
        uColor2: { value: new THREE.Color('#FF6B6B') }
      },
      vertexShader: `
        uniform float uTime;
        varying float vWave;
        varying vec3 vPos;
        
        void main() {
          vec3 pos = position;
          float wave1 = sin(pos.x * 0.1 + uTime * 0.5) * 2.0;
          float wave2 = cos(pos.y * 0.1 + uTime * 0.3) * 2.0;
          float wave3 = sin((pos.x + pos.y) * 0.05 + uTime * 0.4) * 1.5;
          pos.z = wave1 + wave2 + wave3;
          
          vWave = (wave1 + wave2 + wave3) / 5.5;
          vPos = pos;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        varying float vWave;
        
        void main() {
          vec3 color = mix(uColor1, uColor2, vWave * 0.5 + 0.5);
          float alpha = 0.15 + vWave * 0.1;
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      wireframe: false
    });
    const waves = new THREE.Mesh(waveGeometry, waveMaterial);
    waves.position.z = -20;
    waves.rotation.x = -Math.PI * 0.3;
    scene.add(waves);

    // Particle system
    const particleCount = 200;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = [];

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 50;

      velocities.push({
        x: (Math.random() - 0.5) * 0.3,
        y: (Math.random() - 0.5) * 0.3,
        z: (Math.random() - 0.5) * 0.3
      });
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMaterial = new THREE.PointsMaterial({
      color: '#00D9FF',
      size: 0.15,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.6,
      sizeRange: [0.1, 0.5]
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);
    particlesRef.current = { mesh: particles, velocities, positions };

    // Orbiting spheres
    const orbitRadius = 6;
    const orbitCount = 3;
    for (let i = 0; i < orbitCount; i++) {
      const sphereGeometry = new THREE.SphereGeometry(0.3, 32, 32);
      const sphereMaterial = new THREE.MeshStandardMaterial({
        color: i % 2 === 0 ? '#00D9FF' : '#FF6B6B',
        emissive: i % 2 === 0 ? '#00D9FF' : '#FF6B6B',
        emissiveIntensity: 0.5,
        metalness: 0.7,
        roughness: 0.2
      });
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      sphere.castShadow = true;
      sphere.receiveShadow = true;
      scene.add(sphere);
      orbitsRef.current.push({
        mesh: sphere,
        radius: orbitRadius + i * 1.5,
        speed: 0.5 + i * 0.2,
        angle: (i / orbitCount) * Math.PI * 2
      });
    }

    // Create professional medical ECG visualization
    const createECGVisualization = () => {
      const group = new THREE.Group();

      // Create ECG waveform line
      const createECGLine = () => {
        const points = [];
        const samples = 200;
        
        for (let i = 0; i < samples; i++) {
          const x = (i / samples) * 8 - 4;
          const t = (i / samples) * Math.PI * 4;
          
          // Simulate ECG pattern: P-QRS-T waves
          let y = 0;
          
          // P wave
          if (t < Math.PI * 0.5) {
            y += 0.3 * Math.sin(t * 2);
          }
          
          // QRS complex
          if (t >= Math.PI * 0.8 && t < Math.PI * 1.5) {
            const qrsT = (t - Math.PI * 0.8) / (Math.PI * 0.7);
            y += Math.sin(qrsT * Math.PI) * 1.5;
          }
          
          // T wave
          if (t >= Math.PI * 1.8 && t < Math.PI * 2.5) {
            const tT = (t - Math.PI * 1.8) / (Math.PI * 0.7);
            y += 0.4 * Math.sin(tT * Math.PI);
          }
          
          // Baseline drift
          y += Math.sin(t * 0.3) * 0.1;
          
          points.push(new THREE.Vector3(x, y, 0));
        }
        
        const curve = new THREE.CatmullRomCurve3(points);
        const tubeGeometry = new THREE.TubeGeometry(curve, 100, 0.08, 8);
        
        const material = new THREE.MeshPhongMaterial({
          color: '#06B6D4',
          emissive: '#0891B2',
          emissiveIntensity: 0.5,
          shininess: 100
        });
        
        const mesh = new THREE.Mesh(tubeGeometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        return mesh;
      };

      const ecgLine = createECGLine();
      group.add(ecgLine);

      // Add grid background
      const gridHelper = new THREE.GridHelper(10, 20, '#1e293b', '#334155');
      gridHelper.position.z = -2;
      group.add(gridHelper);

      // Add axis lines
      const axisGeometry = new THREE.BufferGeometry();
      const axisPoints = [
        new THREE.Vector3(-5, 0, 0),
        new THREE.Vector3(5, 0, 0),
        new THREE.Vector3(0, -3, 0),
        new THREE.Vector3(0, 3, 0)
      ];
      axisGeometry.setFromPoints(axisPoints);
      
      const axisMaterial = new THREE.LineBasicMaterial({ color: '#475569', linewidth: 1 });
      const axisLines = new THREE.LineSegments(axisGeometry, axisMaterial);
      axisLines.position.z = -1.9;
      group.add(axisLines);

      return group;
    };

    const ecgViz = createECGVisualization();
    scene.add(ecgViz);
    heartRef.current = ecgViz;

    // Professional glow
    const glowGeometry = new THREE.SphereGeometry(6, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: '#06B6D4',
      transparent: true,
      opacity: 0.08,
      wireframe: false
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    scene.add(glow);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      timeRef.current += 0.016;
      const beatDuration = 60 / heartRate;
      const cycleProgress = (timeRef.current % beatDuration) / beatDuration;

      // ECG animation - pulsing effect
      let pulseIntensity = 0;
      
      if (cycleProgress < 0.15) {
        // QRS complex (main spike)
        pulseIntensity = (cycleProgress / 0.15);
      } else if (cycleProgress < 0.3) {
        // Decay
        pulseIntensity = 1 - ((cycleProgress - 0.15) / 0.15);
      } else {
        // Baseline
        pulseIntensity = 0;
      }

      if (ecgViz) {
        ecgViz.rotation.x += 0.0005;
        ecgViz.rotation.y += 0.0008;
        
        // Update ECG line glow
        if (ecgViz.children[0] && ecgViz.children[0].material) {
          ecgViz.children[0].material.emissiveIntensity = 0.5 + pulseIntensity * 0.8;
        }
      }
      
      if (glow) {
        glow.material.opacity = 0.08 + pulseIntensity * 0.12;
      }

      // Update wave shader
      waveMaterial.uniforms.uTime.value = timeRef.current;

      // Update particles
      if (particlesRef.current) {
        const { positions, velocities } = particlesRef.current;
        for (let i = 0; i < velocities.length; i++) {
          positions[i * 3] += velocities[i].x;
          positions[i * 3 + 1] += velocities[i].y;
          positions[i * 3 + 2] += velocities[i].z;

          if (Math.abs(positions[i * 3]) > 25) velocities[i].x *= -1;
          if (Math.abs(positions[i * 3 + 1]) > 25) velocities[i].y *= -1;
          if (Math.abs(positions[i * 3 + 2]) > 25) velocities[i].z *= -1;
        }
        particleGeometry.attributes.position.needsUpdate = true;
      }

      // Update orbiting spheres
      orbitsRef.current.forEach((orbit) => {
        orbit.angle += orbit.speed * 0.01;
        orbit.mesh.position.x = Math.cos(orbit.angle) * orbit.radius;
        orbit.mesh.position.y = Math.sin(orbit.angle) * orbit.radius * 0.5;
        orbit.mesh.position.z = Math.sin(orbit.angle * 0.5) * orbit.radius * 0.3;
        orbit.mesh.rotation.x += 0.01;
        orbit.mesh.rotation.y += 0.02;
      });

      // Camera slight movement
      camera.position.x = Math.sin(timeRef.current * 0.3) * 0.5;
      camera.position.y = Math.cos(timeRef.current * 0.2) * 0.3;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
      particleGeometry.dispose();
      waveMaterial.dispose();
    };
  }, [heartRate]);

  return <div ref={containerRef} className="w-full h-full" />;
}
