import { create } from 'zustand';

export const useECGStore = create((set) => ({
  // ECG Data
  ecgData: [],
  heartRate: 72,
  isArrhythmiaDetected: false,
  
  // Analysis Results
  aiReview: '',
  recommendations: [],
  analysisStatus: 'idle', // 'idle' | 'analyzing' | 'complete' | 'error'
  
  // UI State
  showArrhythmiaWarning: false,
  panelAnimationState: 'hidden', // 'hidden' | 'entering' | 'visible' | 'exiting'
  
  // Actions
  setECGData: (data) => set({ ecgData: data }),
  setHeartRate: (rate) => set({ heartRate: rate }),
  setArrhythmiaDetected: (detected) => set({ 
    isArrhythmiaDetected: detected,
    showArrhythmiaWarning: detected 
  }),
  
  setAnalysisResults: (results) => set({
    aiReview: results.aiReview || '',
    recommendations: results.recommendations || [],
    isArrhythmiaDetected: results.classification === 'arrhythmia',
    showArrhythmiaWarning: results.classification === 'arrhythmia',
    analysisStatus: 'complete',
    panelAnimationState: 'entering'
  }),
  
  setAnalysisStatus: (status) => set({ analysisStatus: status }),
  setPanelAnimationState: (state) => set({ panelAnimationState: state }),
  
  reset: () => set({
    ecgData: [],
    heartRate: 72,
    isArrhythmiaDetected: false,
    aiReview: '',
    recommendations: [],
    analysisStatus: 'idle',
    showArrhythmiaWarning: false,
    panelAnimationState: 'hidden'
  })
}));
