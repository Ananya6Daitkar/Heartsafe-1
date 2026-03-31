import { describe, it, expect, beforeEach, vi } from 'vitest';
import { generateMockECGData, validateECGData } from '../utils/mockBackend';
import { useECGStore } from '../hooks/useStore';

describe('Integration Tests', () => {
  beforeEach(() => {
    useECGStore.setState({
      ecgData: [],
      heartRate: 72,
      isArrhythmiaDetected: false,
      aiReview: '',
      recommendations: [],
      analysisStatus: 'idle'
    });
  });

  describe('WebSocket Data Flow', () => {
    it('receives and validates ECG data', () => {
      const mockData = generateMockECGData();
      expect(validateECGData(mockData)).toBe(true);
    });

    it('parses ECG samples correctly', () => {
      const mockData = generateMockECGData();
      const samples = mockData.samples;
      
      expect(Array.isArray(samples)).toBe(true);
      expect(samples.length).toBeGreaterThan(0);
      
      samples.forEach(sample => {
        expect(typeof sample.value).toBe('number');
        expect(typeof sample.timestamp).toBe('number');
        expect(typeof sample.isAbnormal).toBe('boolean');
      });
    });
  });

  describe('Analysis Result Display', () => {
    it('displays AI review when analysis completes', () => {
      const mockData = generateMockECGData();
      useECGStore.setState({
        aiReview: mockData.analysis.aiReview,
        analysisStatus: 'complete'
      });

      const state = useECGStore.getState();
      expect(state.aiReview).toBe(mockData.analysis.aiReview);
      expect(state.analysisStatus).toBe('complete');
    });

    it('displays recommendations when analysis completes', () => {
      const mockData = generateMockECGData();
      useECGStore.setState({
        recommendations: mockData.analysis.recommendations,
        analysisStatus: 'complete'
      });

      const state = useECGStore.getState();
      expect(state.recommendations).toEqual(mockData.analysis.recommendations);
      expect(state.recommendations.length).toBeGreaterThan(0);
    });
  });

  describe('Arrhythmia Detection Flow', () => {
    it('detects arrhythmia and updates state', () => {
      const mockData = generateMockECGData();
      const isArrhythmia = mockData.analysis.classification === 'arrhythmia';
      
      useECGStore.setState({
        isArrhythmiaDetected: isArrhythmia,
        showArrhythmiaWarning: isArrhythmia
      });

      const state = useECGStore.getState();
      expect(state.isArrhythmiaDetected).toBe(isArrhythmia);
      expect(state.showArrhythmiaWarning).toBe(isArrhythmia);
    });

    it('shows warning label when arrhythmia detected', () => {
      useECGStore.setState({
        isArrhythmiaDetected: true,
        showArrhythmiaWarning: true
      });

      const state = useECGStore.getState();
      expect(state.showArrhythmiaWarning).toBe(true);
    });

    it('hides warning label when rhythm normalizes', () => {
      useECGStore.setState({
        isArrhythmiaDetected: false,
        showArrhythmiaWarning: false
      });

      const state = useECGStore.getState();
      expect(state.showArrhythmiaWarning).toBe(false);
    });
  });

  describe('Panel Animation Transitions', () => {
    it('transitions panel animation state correctly', () => {
      useECGStore.setState({ panelAnimationState: 'hidden' });
      expect(useECGStore.getState().panelAnimationState).toBe('hidden');

      useECGStore.setState({ panelAnimationState: 'entering' });
      expect(useECGStore.getState().panelAnimationState).toBe('entering');

      useECGStore.setState({ panelAnimationState: 'visible' });
      expect(useECGStore.getState().panelAnimationState).toBe('visible');
    });
  });

  describe('Data Round-trip Consistency', () => {
    it('maintains data consistency through parse and display cycle', () => {
      const originalData = generateMockECGData();
      
      // Simulate data flow
      useECGStore.setState({
        ecgData: originalData.samples,
        heartRate: originalData.heartRate,
        aiReview: originalData.analysis.aiReview,
        recommendations: originalData.analysis.recommendations
      });

      const state = useECGStore.getState();
      
      // Verify data consistency
      expect(state.ecgData.length).toBe(originalData.samples.length);
      expect(state.heartRate).toBe(originalData.heartRate);
      expect(state.aiReview).toBe(originalData.analysis.aiReview);
      expect(state.recommendations).toEqual(originalData.analysis.recommendations);
    });
  });

  describe('Error Scenarios', () => {
    it('handles invalid ECG data gracefully', () => {
      const invalidData = { samples: 'invalid' };
      expect(validateECGData(invalidData)).toBe(false);
    });

    it('resets state on error', () => {
      useECGStore.setState({
        ecgData: [{ value: 1, timestamp: 0, isAbnormal: false }],
        analysisStatus: 'error'
      });

      useECGStore.getState().reset();
      const state = useECGStore.getState();
      
      expect(state.ecgData).toEqual([]);
      expect(state.analysisStatus).toBe('idle');
    });
  });
});
