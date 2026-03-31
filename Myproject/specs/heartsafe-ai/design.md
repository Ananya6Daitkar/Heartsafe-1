# Design Document: HeartSafe AI

## Overview

HeartSafe AI is a premium, clinical-grade ECG analysis interface built with React, Three.js, and WebGL. The design prioritizes visual clarity, real-time performance, and user trust through a minimalist, immersive 3D experience. The interface guides users through a data flow: ECG Input → AI Detection → AI Review → Patient Recommendations, with each stage visually represented through carefully orchestrated animations and glassmorphic UI elements.

The design uses a dark navy theme with cyan blue and soft red accents, creating a professional medical aesthetic. All animations run at 60fps with GPU acceleration, and the interface maintains maximum 3 UI elements visible at once to ensure focus and clarity.

## Architecture

### Technology Stack

- **Frontend Framework**: React 18+ with Vite
- **3D Graphics**: Three.js with React Three Fiber (R3F)
- **UI Components**: React with CSS-in-JS (Styled Components or Tailwind CSS)
- **State Management**: React Context API or Zustand
- **Real-time Data**: WebSocket connection to Python backend
- **Animation**: Framer Motion for UI transitions, Three.js for 3D animations
- **Performance**: GPU acceleration via WebGL, instanced rendering for neural network visualization

### Data Flow Architecture

```
Backend (Python ML Model)
    ↓
WebSocket API
    ↓
React State Management
    ↓
ECG Visualization (Three.js)
    ↓
AI Detection Engine
    ↓
UI Panels (AI Review + Recommendations)
```

### Component Hierarchy

```
App
├── HeroSection
│   ├── ThreeJSCanvas (3D Scene)
│   │   ├── Heart3D (Beating heart model)
│   │   ├── ECGWaveform (Animated waveform)
│   │   ├── ParticleSystem (Background particles)
│   │   └── Lighting (Volumetric lighting)
│   ├── ArrhythmiaWarning (Conditional label)
│   └── UIOverlay
│       ├── AIReviewPanel (Glassmorphism)
│       ├── RecommendationsPanel (Glassmorphism)
│       └── NeuralNetworkViz (Explainable AI)
├── TrustSection
│   ├── StatCard (87,000+ ECG Beats)
│   ├── StatCard (Clinical-grade Accuracy)
│   └── StatCard (Real-time Detection)
└── DataConnection (WebSocket handler)
```

## Components and Interfaces

### 1. HeroSection Component

**Purpose**: Main visual container for 3D heart, ECG waveform, and AI analysis results.

**Props**:
```typescript
interface HeroSectionProps {
  ecgData: number[];           // Real-time ECG samples
  heartRate: number;           // BPM
  isArrhythmiaDetected: boolean;
  aiReview: string;            // AI interpretation
  recommendations: string[];   // Lifestyle advice
  analysisStatus: 'idle' | 'analyzing' | 'complete';
}
```

**Responsibilities**:
- Render Three.js canvas with 3D scene
- Manage ECG data stream and visualization
- Coordinate animation timing between heart and waveform
- Display conditional UI panels based on analysis state
- Handle responsive sizing

### 2. Heart3D Component (Three.js)

**Purpose**: Render a realistic, glowing 3D heart model with beating animation.

**Features**:
- Procedurally generated or pre-modeled heart geometry
- Smooth beating animation synchronized to heartbeat
- Volumetric lighting with heart as light source
- Glow effect using post-processing (bloom)
- Subtle rotation for depth perception

**Animation Timing**:
- Heartbeat cycle: 60-100 BPM (adjustable based on input)
- Systole (contraction): 0.3s
- Diastole (relaxation): 0.4s
- Smooth easing: cubic-bezier(0.4, 0.0, 0.2, 1.0)

### 3. ECGWaveform Component (Three.js)

**Purpose**: Render real-time ECG waveform with color-coded rhythm detection.

**Features**:
- Canvas-based or Three.js line rendering
- Real-time data streaming with circular buffer
- Color coding: Blue (normal) → Red (abnormal)
- Synchronized with heartbeat animation
- Smooth scrolling effect (right-to-left)

**Data Structure**:
```typescript
interface ECGDataPoint {
  value: number;        // mV reading
  timestamp: number;    // ms
  isAbnormal: boolean;  // Arrhythmia flag
}
```

**Rendering Strategy**:
- Use Three.js Line geometry with dynamic vertex updates
- Implement circular buffer for memory efficiency
- Update 100-500 points per second (configurable)
- Color segments based on abnormality detection

### 4. AIReviewPanel Component

**Purpose**: Display AI's medical interpretation in glassmorphic panel.

**Design**:
- Glassmorphism: `background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px);`
- Border: `1px solid rgba(255, 255, 255, 0.2)`
- Padding: 24px
- Border-radius: 16px
- Position: Bottom-left of hero section
- Width: 300-400px (responsive)

**Content Format**:
```
AI Review:
[2-3 lines of simple, non-technical explanation]
```

**Animation**:
- Fade-in: 0.5s ease-out
- Slide-up: 20px offset
- Trigger: When analysis completes

### 5. RecommendationsPanel Component

**Purpose**: Display lifestyle and monitoring recommendations.

**Design**:
- Glassmorphism: Same as AIReviewPanel
- Position: Bottom-right of hero section
- Width: 300-400px (responsive)
- Max height: 400px (scrollable if needed)

**Content Format**:
```
Recommendations:
• [Recommendation 1]
• [Recommendation 2]
• [Recommendation 3]
• [Recommendation 4]
• [Recommendation 5]
```

**Constraints**:
- No medication suggestions
- No alarming language
- Focus on: lifestyle changes, monitoring frequency, doctor consultation timing
- Simple, actionable advice

**Animation**:
- Fade-in: 0.5s ease-out (staggered 0.2s after AI Review)
- Slide-up: 20px offset

### 6. NeuralNetworkViz Component

**Purpose**: Show how AI processes ECG data through neural network layers.

**Design**:
- Minimal, subtle visualization
- Position: Center-top of hero section (above heart)
- Size: 200x100px (small)
- Opacity: 0.6 (subtle)

**Architecture**:
- Input layer: ECG waveform representation
- 2-3 hidden layers: Nodes with connecting lines
- Output layer: "Normal" or "Arrhythmia" label

**Animation**:
- Data flows left-to-right through layers
- Layers glow as data passes (0.3s per layer)
- Final output highlights with color (blue/red)
- Loop duration: 2-3 seconds
- Trigger: During analysis phase

**Implementation**:
- Use Three.js instanced rendering for nodes
- Lines rendered with Three.js Line geometry
- Glow effect via post-processing

### 7. ArrhythmiaWarning Component

**Purpose**: Display conditional warning label when abnormality detected.

**Design**:
- Text: "⚠️ Arrhythmia Detected"
- Color: Soft red (#FF6B6B or similar)
- Position: Top-center of hero section
- Font: Bold, 16-18px
- Opacity: 0 (hidden) → 1 (visible)

**Animation**:
- Fade-in: 0.3s ease-out
- Pulse effect: Subtle scale animation (1.0 → 1.05 → 1.0)
- Pulse interval: 1.5s
- Trigger: When arrhythmia detected
- Reverse: Fade-out when rhythm normalizes

### 8. TrustSection Component

**Purpose**: Display clinical credentials and statistics.

**Design**:
- Position: Below hero section
- Layout: 3 stat cards in a row (responsive to 1-2 columns on mobile)
- Card design: Glassmorphism with subtle border
- Spacing: 24px between cards

**Stats**:
1. "87,000+ ECG Beats Analyzed"
2. "Clinical-grade Accuracy"
3. "Real-time Detection"

**Animation**:
- Fade-in: 0.6s ease-out
- Slide-up: 30px offset
- Staggered: 0.1s between cards
- Trigger: On scroll into view

## Data Models

### ECG Data Model

```typescript
interface ECGReading {
  id: string;
  timestamp: number;
  heartRate: number;              // BPM
  samples: ECGSample[];           // Raw ECG data
  analysis: AnalysisResult;       // AI analysis
  metadata: {
    deviceId: string;
    userId: string;
    duration: number;             // seconds
  };
}

interface ECGSample {
  value: number;                  // mV
  timestamp: number;              // ms
  isAbnormal: boolean;
}

interface AnalysisResult {
  classification: 'normal' | 'arrhythmia' | 'unknown';
  confidence: number;             // 0-1
  aiReview: string;               // Medical interpretation
  recommendations: string[];      // Lifestyle advice
  detectedAnomalies: Anomaly[];
}

interface Anomaly {
  type: string;                   // e.g., "premature_beat", "irregular_rhythm"
  severity: 'low' | 'medium' | 'high';
  startTime: number;              // ms
  endTime: number;                // ms
}
```

### UI State Model

```typescript
interface UIState {
  analysisStatus: 'idle' | 'analyzing' | 'complete' | 'error';
  currentECGData: ECGReading | null;
  displayedReview: string;
  displayedRecommendations: string[];
  showArrhythmiaWarning: boolean;
  panelAnimationState: 'hidden' | 'entering' | 'visible' | 'exiting';
}
```

## Correctness Properties

A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.

### Property 1: ECG Waveform Synchronization

*For any* valid ECG data stream and heartbeat animation, the ECG waveform visualization should update in real-time synchronized with the heart's beating animation, such that visual peaks in the waveform correspond to systolic (contraction) phases of the heartbeat.

**Validates: Requirements 1.2, 1.4**

### Property 2: Arrhythmia Detection Accuracy

*For any* ECG sample marked as abnormal by the backend AI model, the System SHALL display that sample in soft red color in the waveform visualization, and for any sample marked as normal, the System SHALL display it in blue.

**Validates: Requirements 2.1, 2.2**

### Property 3: Arrhythmia Warning Label Presence

*For any* ECG analysis where arrhythmia is detected, the System SHALL display the "⚠️ Arrhythmia Detected" warning label, and when the analysis shows normal rhythm, the warning label SHALL NOT be displayed.

**Validates: Requirements 2.3, 2.4**

### Property 4: AI Review Panel Content Consistency

*For any* completed ECG analysis, the AI Review Panel SHALL display the exact text provided by the backend analysis result, formatted as "AI Review: <text>", with the explanation containing 2-3 lines of simple, non-technical language.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4**

### Property 5: Recommendations Panel Completeness

*For any* completed ECG analysis, the Recommendations Panel SHALL display all recommendations provided by the backend, formatted as "Recommendations: • ... • ...", with each recommendation containing only lifestyle, monitoring, or doctor consultation advice (no medications or alarming language).

**Validates: Requirements 4.1, 4.2, 4.3, 4.4**

### Property 6: Neural Network Visualization Data Flow

*For any* ECG analysis in progress, the neural network visualization SHALL show data flowing from the input layer through hidden layers to the output layer, with each layer glowing as data passes through, and the final output displaying either "Normal" or "Arrhythmia" matching the backend classification.

**Validates: Requirements 5.1, 5.2, 5.3, 5.4**

### Property 7: Trust Section Statistics Display

*For any* page load, the Trust Section SHALL display all three statistics ("87,000+ ECG Beats Analyzed", "Clinical-grade Accuracy", "Real-time Detection") in a professional, clinical manner without overwhelming the user.

**Validates: Requirements 6.1, 6.2, 6.3, 6.4**

### Property 8: Animation Performance Consistency

*For any* duration of interface usage, the System SHALL maintain 60fps animation performance without stuttering, and all animations (fade, slide, glow, heartbeat) SHALL execute smoothly with proper easing functions.

**Validates: Requirements 1.5, 8.1, 8.2, 8.3, 8.4, 8.5, 8.6**

### Property 9: UI Minimalism Constraint

*For any* state of the interface, the System SHALL display maximum 3 UI elements visible at once (e.g., heart + AI Review Panel + Recommendations Panel), avoiding clutter and maintaining focus on core information.

**Validates: Requirements 9.1, 9.2, 9.3, 9.4, 9.5**

### Property 10: Data Flow Round-trip Consistency

*For any* ECG data received from the backend, parsing and displaying the data in the visualization, then reading the displayed state, SHALL produce equivalent information to the original backend data (accounting for visualization transformations).

**Validates: Requirements 10.1, 10.2, 10.3, 10.4, 10.5**

### Property 11: Accessibility Semantic Structure

*For any* UI element in the interface, the System SHALL provide proper semantic HTML structure, ARIA labels, and keyboard navigation support, such that screen readers can accurately describe all content and interactive elements.

**Validates: Requirements 11.1, 11.2, 11.3, 11.4, 11.5**

### Property 12: Performance Load Time

*For any* page load, the System SHALL achieve initial page load in under 3 seconds, and maintain 60fps performance during real-time ECG streaming and animation rendering.

**Validates: Requirements 12.1, 12.2, 12.3, 12.4, 12.5**

## Error Handling

### Network Errors

**Scenario**: WebSocket connection fails or times out

**Handling**:
- Display subtle error message in UI: "Connection lost. Reconnecting..."
- Attempt automatic reconnection with exponential backoff (1s, 2s, 4s, 8s)
- Show offline indicator in top-right corner
- Disable analysis features until connection restored
- Log error to monitoring service

### Invalid ECG Data

**Scenario**: Backend sends malformed or invalid ECG data

**Handling**:
- Validate data structure before processing
- Skip invalid samples and continue with valid data
- Log validation error with sample data for debugging
- Display warning: "Some data could not be processed"
- Continue visualization with available data

### Analysis Errors

**Scenario**: AI model fails to analyze ECG data

**Handling**:
- Display error message: "Analysis unavailable. Please try again."
- Provide retry button
- Show last known good analysis if available
- Log error details for backend investigation

### Performance Degradation

**Scenario**: Frame rate drops below 30fps

**Handling**:
- Reduce particle count in background
- Simplify neural network visualization
- Lower ECG waveform resolution
- Disable bloom post-processing effect
- Log performance metrics for optimization

### Browser Compatibility

**Scenario**: Browser doesn't support WebGL or required APIs

**Handling**:
- Detect WebGL support on load
- Display fallback message: "Your browser doesn't support this interface"
- Provide link to supported browsers
- Offer alternative text-based interface

## Testing Strategy

### Unit Testing

**Framework**: Vitest + React Testing Library

**Test Coverage**:
- Component rendering with various props
- State management and updates
- Event handlers and user interactions
- Data validation and parsing
- Error boundary behavior
- Accessibility attributes

**Example Unit Tests**:
```typescript
// AIReviewPanel component
describe('AIReviewPanel', () => {
  it('renders with correct text format', () => {
    const review = "Normal sinus rhythm detected";
    render(<AIReviewPanel review={review} />);
    expect(screen.getByText(/AI Review:/)).toBeInTheDocument();
  });

  it('applies glassmorphism styling', () => {
    render(<AIReviewPanel review="test" />);
    const panel = screen.getByRole('region');
    expect(panel).toHaveStyle('backdrop-filter: blur(10px)');
  });
});
```

### Property-Based Testing

**Framework**: fast-check (JavaScript property-based testing library)

**Property Tests**:

#### Property 1: ECG Waveform Synchronization
- **Test**: For any valid ECG data stream, waveform peaks should align with heartbeat systolic phases
- **Generator**: Generate random ECG samples with known peak positions
- **Assertion**: Verify visual peak positions match expected systolic timing
- **Iterations**: 100+

#### Property 2: Arrhythmia Detection Accuracy
- **Test**: For any ECG sample, color coding should match abnormality flag
- **Generator**: Generate random ECG samples with abnormality flags
- **Assertion**: Verify rendered color matches expected color (blue/red)
- **Iterations**: 100+

#### Property 3: Arrhythmia Warning Label Presence
- **Test**: For any analysis result, warning label presence should match detection status
- **Generator**: Generate random analysis results with various classifications
- **Assertion**: Verify warning label visibility matches classification
- **Iterations**: 100+

#### Property 4: AI Review Panel Content Consistency
- **Test**: For any backend analysis result, displayed text should match exactly
- **Generator**: Generate random analysis results with various review texts
- **Assertion**: Verify displayed text matches backend text exactly
- **Iterations**: 100+

#### Property 5: Recommendations Panel Completeness
- **Test**: For any recommendation list, all items should be displayed
- **Generator**: Generate random recommendation lists (3-5 items)
- **Assertion**: Verify all recommendations rendered and formatted correctly
- **Iterations**: 100+

#### Property 6: Neural Network Visualization Data Flow
- **Test**: For any analysis in progress, data should flow through all layers
- **Generator**: Generate random analysis states at different progress points
- **Assertion**: Verify layer glow sequence matches data flow
- **Iterations**: 100+

#### Property 7: Trust Section Statistics Display
- **Test**: For any page load, all three statistics should be visible
- **Generator**: Generate various viewport sizes and device types
- **Assertion**: Verify all statistics rendered and visible
- **Iterations**: 100+

#### Property 8: Animation Performance Consistency
- **Test**: For any animation duration, frame rate should remain at 60fps
- **Generator**: Generate random animation sequences and durations
- **Assertion**: Verify frame rate stays above 55fps (accounting for variance)
- **Iterations**: 100+

#### Property 9: UI Minimalism Constraint
- **Test**: For any interface state, maximum 3 UI elements should be visible
- **Generator**: Generate random UI states with various element combinations
- **Assertion**: Verify visible element count ≤ 3
- **Iterations**: 100+

#### Property 10: Data Flow Round-trip Consistency
- **Test**: For any ECG data, parsed and displayed data should match original
- **Generator**: Generate random valid ECG data structures
- **Assertion**: Verify round-trip data consistency
- **Iterations**: 100+

#### Property 11: Accessibility Semantic Structure
- **Test**: For any UI element, semantic HTML and ARIA should be present
- **Generator**: Generate random UI element combinations
- **Assertion**: Verify semantic HTML and ARIA attributes present
- **Iterations**: 100+

#### Property 12: Performance Load Time
- **Test**: For any page load, initial load should be under 3 seconds
- **Generator**: Generate various network conditions and device capabilities
- **Assertion**: Verify load time < 3000ms
- **Iterations**: 100+

### Integration Testing

**Scope**: Test data flow from backend to visualization

**Test Cases**:
- WebSocket connection and data streaming
- ECG data parsing and validation
- Analysis result display
- Panel animations and transitions
- Error recovery and reconnection

### Performance Testing

**Metrics**:
- Frame rate (target: 60fps)
- Memory usage (target: < 150MB)
- Load time (target: < 3s)
- ECG update latency (target: < 100ms)

**Tools**: Chrome DevTools, Lighthouse, WebPageTest

### Accessibility Testing

**Standards**: WCAG 2.1 AA

**Tests**:
- Screen reader compatibility
- Keyboard navigation
- Color contrast ratios
- Motion sensitivity (prefers-reduced-motion)
- Focus management

**Tools**: axe DevTools, WAVE, Screen readers (NVDA, JAWS)

