# Implementation Plan: HeartSafe AI

## Overview
Compact implementation plan focusing on core functionality. Each task is actionable and references specific requirements. No optional tasks—only essential features.

## Tasks

- [ ] 1. Project Setup
  - [x] 1.1 Initialize React + Vite with Three.js, React Three Fiber, Framer Motion
    - Install: three, @react-three/fiber, @react-three/drei, framer-motion, zustand
    - Configure Vite for React, set up TypeScript
    - Create basic folder structure: src/components, src/hooks, src/utils, src/styles
    - _Requirements: 12.1, 12.2_

  - [x] 1.2 Set up WebSocket service for backend ECG data
    - Create WebSocket connection handler with reconnect logic
    - Mock backend for development (generate fake ECG data)
    - Create data validation function
    - _Requirements: 10.1, 10.2_

  - [x] 1.3 Create global state management (Zustand)
    - Define store: ecgData, heartRate, isArrhythmiaDetected, aiReview, recommendations, analysisStatus
    - Create hooks: useECGStore, useAnalysisStore
    - _Requirements: 10.3, 10.4, 10.5_

- [ ] 2. 3D Scene & Heart Visualization
  - [x] 2.1 Create Three.js scene with camera, renderer, lighting
    - Set up PerspectiveCamera, WebGLRenderer with antialiasing
    - Dark navy background (#0F1419)
    - Add PointLight for volumetric effect
    - Handle window resize
    - _Requirements: 7.1, 12.2_

  - [x] 2.2 Implement Heart3D component with beating animation
    - Use icosahedron geometry (or load pre-made heart model)
    - Create MeshStandardMaterial with emissive glow
    - Animate scale: 1.0 → 1.1 → 1.0 (0.7s cycle, synced to heartRate)
    - Add bloom post-processing for glow effect
    - _Requirements: 1.1, 1.2, 7.4_

  - [x] 2.3 Implement ECGWaveform component (Three.js Line)
    - Create Line geometry with 500 points (circular buffer)
    - Update vertices in real-time from ecgData
    - Color: blue (#00D9FF) for normal, red (#FF6B6B) for abnormal
    - Sync animation with heartbeat (scroll right-to-left)
    - _Requirements: 1.3, 1.4, 2.1, 2.2_

- [ ] 3. Background & Particles
  - [x] 3.1 Create animated background
    - Procedural wave pattern using sine waves (shader or geometry)
    - Subtle opacity, navy + cyan colors
    - Seamless looping animation
    - _Requirements: 8.3, 8.6_

  - [x] 3.2 Implement particle system
    - 50-100 particles with instanced rendering
    - Slow random motion, subtle glow
    - Optimize for 60fps
    - _Requirements: 8.4, 12.2_

- [ ] 4. UI Panels & Warnings
  - [x] 4.1 Create ArrhythmiaWarning component
    - Conditional render: "⚠️ Arrhythmia Detected"
    - Fade-in (0.3s), pulse animation (1.5s loop)
    - Soft red color (#FF6B6B)
    - _Requirements: 2.3, 2.4_

  - [x] 4.2 Create AIReviewPanel component (glassmorphism)
    - Glassmorphism: rgba(255,255,255,0.1), blur(10px), border 1px rgba(255,255,255,0.2)
    - Display: "AI Review: <text>" (2-3 lines)
    - Fade-in (0.5s), slide-up (20px)
    - Position: bottom-left
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

  - [x] 4.3 Create RecommendationsPanel component (glassmorphism)
    - Same glassmorphism styling as AIReviewPanel
    - Display: "Recommendations: • ... • ..." (3-5 items)
    - Fade-in (0.5s, staggered 0.2s after AI Review), slide-up (20px)
    - Position: bottom-right
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [ ] 5. Explainable AI Visualization
  - [x] 5.1 Create NeuralNetworkViz component
    - Minimal design: input layer → 2 hidden layers → output layer
    - Position: center-top (200x100px), opacity 0.6
    - Animate data flow left-to-right (2-3s loop)
    - Layers glow as data passes (0.3s per layer)
    - Output: "Normal" (blue) or "Arrhythmia" (red)
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ] 6. Trust Section
  - [x] 6.1 Create TrustSection component
    - 3 stat cards (glassmorphism): "87,000+ ECG Beats Analyzed", "Clinical-grade Accuracy", "Real-time Detection"
    - Responsive layout (3 cols → 1 col on mobile)
    - Fade-in (0.6s), slide-up (30px), staggered (0.1s between cards)
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [ ] 7. Design System & Theming
  - [x] 7.1 Create design tokens
    - Colors: navy (#0F1419), cyan (#00D9FF), red (#FF6B6B), white (rgba)
    - Typography: font-family, sizes, weights
    - Spacing: 8px base unit
    - Create CSS variables or Tailwind config
    - _Requirements: 7.1, 7.2, 7.3_

  - [x] 7.2 Create glassmorphism utility
    - Reusable CSS class/component for all panels
    - Consistent blur, opacity, border
    - _Requirements: 7.2, 7.3_

- [ ] 8. Accessibility
  - [x] 8.1 Add semantic HTML & ARIA labels
    - Use semantic elements (main, section, article)
    - Add ARIA labels to interactive elements
    - Proper heading hierarchy
    - _Requirements: 11.1, 11.2_

  - [x] 8.2 Implement keyboard navigation & prefers-reduced-motion
    - Focus management, visible focus indicators
    - Detect prefers-reduced-motion, disable animations
    - _Requirements: 11.3, 11.5_

  - [x] 8.3 Verify color contrast
    - Ensure WCAG AA minimum (4.5:1 for text)
    - Test all color combinations
    - _Requirements: 11.4_

- [ ] 9. Error Handling & Resilience
  - [x] 9.1 Implement network error handling
    - WebSocket reconnect with exponential backoff
    - Error boundary component
    - User-friendly error messages
    - _Requirements: 10.1, 10.2_

  - [x] 9.2 Implement data validation & browser compatibility
    - Validate ECG data format
    - Detect WebGL support, show fallback message
    - _Requirements: 10.2, 12.2_

- [ ] 10. Performance Optimization
  - [x] 10.1 Optimize 3D rendering
    - Use instanced rendering for particles
    - Optimize geometry and materials
    - Profile and optimize shaders
    - _Requirements: 12.2, 12.3, 12.4_

  - [x] 10.2 Implement code splitting & lazy loading
    - Split Three.js into separate chunk
    - Lazy load components below fold
    - _Requirements: 12.1_

  - [x] 10.3 Optimize bundle size
    - Minify and compress assets
    - Optimize 3D model files
    - _Requirements: 12.1_

- [ ] 11. Testing
  - [x] 11.1 Write unit tests (Vitest + React Testing Library)
    - Test component rendering with various props
    - Test state management and updates
    - Test data validation
    - Test accessibility attributes
    - _Requirements: All_

  - [x] 11.2 Write property-based tests (fast-check)
    - Property 1: ECG Waveform Synchronization (Requirements 1.2, 1.4)
    - Property 2: Arrhythmia Detection Accuracy (Requirements 2.1, 2.2)
    - Property 3: Arrhythmia Warning Label Presence (Requirements 2.3, 2.4)
    - Property 4: AI Review Panel Content Consistency (Requirements 3.1-3.4)
    - Property 5: Recommendations Panel Completeness (Requirements 4.1-4.4)
    - Property 6: Neural Network Visualization Data Flow (Requirements 5.1-5.4)
    - Property 7: Trust Section Statistics Display (Requirements 6.1-6.4)
    - Property 8: Animation Performance Consistency (Requirements 1.5, 8.1-8.6)
    - Property 9: UI Minimalism Constraint (Requirements 9.1-9.5)
    - Property 10: Data Flow Round-trip Consistency (Requirements 10.1-10.5)
    - Property 11: Accessibility Semantic Structure (Requirements 11.1-11.5)
    - Property 12: Performance Load Time (Requirements 12.1-12.5)
    - _Requirements: All_

  - [x] 11.3 Integration tests
    - Test WebSocket connection and data streaming
    - Test ECG data parsing and display
    - Test analysis result display
    - Test panel animations
    - _Requirements: 10.1-10.5_

- [ ] 12. Cross-browser & Device Testing
  - [x] 12.1 Test on multiple browsers (Chrome, Firefox, Safari, Edge)
    - Verify WebGL support and rendering
    - Test keyboard navigation
    - _Requirements: 11.5, 12.2_

  - [x] 12.2 Test on various devices (desktop, tablet, mobile)
    - Verify responsive layout
    - Test touch interactions
    - _Requirements: 7.1, 9.1_

  - [x] 12.3 Test with assistive technologies
    - Screen readers (NVDA, JAWS, VoiceOver)
    - Keyboard-only navigation
    - _Requirements: 11.1, 11.2, 11.5_

- [ ] 13. Final QA & Deployment
  - [x] 13.1 Run full test suite
    - All unit tests passing
    - All property-based tests passing (100+ iterations)
    - All integration tests passing
    - _Requirements: All_

  - [x] 13.2 Performance profiling
    - Verify 60fps during animations
    - Verify <3s load time
    - Verify <150MB memory usage
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

  - [x] 13.3 Accessibility audit
    - Run axe DevTools
    - Verify WCAG 2.1 AA compliance
    - Verify color contrast ratios
    - _Requirements: 11.1-11.5_

  - [x] 13.4 Manual QA
    - Test all user workflows
    - Verify visual design matches spec
    - Test error scenarios
    - Verify animations are smooth
    - _Requirements: All_

## Notes
- All tasks are required (no optional tasks)
- Each task references specific requirements for traceability
- Property-based tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- Focus on simplicity and performance throughout
- All animations target 60fps with GPU acceleration
