import { describe, it, expect } from 'vitest';
import {
  generateMockECGData,
  generateMockArrhythmiaData,
  validateECGData
} from '../mockBackend';

describe('Mock Backend', () => {
  describe('generateMockECGData', () => {
    it('generates valid ECG data', () => {
      const data = generateMockECGData();
      expect(data).toBeDefined();
      expect(data.samples).toBeDefined();
      expect(Array.isArray(data.samples)).toBe(true);
      expect(data.heartRate).toBe(72);
      expect(data.analysis.classification).toBe('normal');
    });

    it('generates samples with correct structure', () => {
      const data = generateMockECGData();
      data.samples.forEach(sample => {
        expect(typeof sample.value).toBe('number');
        expect(typeof sample.timestamp).toBe('number');
        expect(typeof sample.isAbnormal).toBe('boolean');
      });
    });
  });

  describe('generateMockArrhythmiaData', () => {
    it('generates arrhythmia data with abnormal samples', () => {
      const data = generateMockArrhythmiaData();
      expect(data.analysis.classification).toBe('arrhythmia');
      const abnormalSamples = data.samples.filter(s => s.isAbnormal);
      expect(abnormalSamples.length).toBeGreaterThan(0);
    });

    it('includes recommendations for arrhythmia', () => {
      const data = generateMockArrhythmiaData();
      expect(data.analysis.recommendations.length).toBeGreaterThan(0);
    });
  });

  describe('validateECGData', () => {
    it('validates correct ECG data', () => {
      const data = generateMockECGData();
      expect(validateECGData(data)).toBe(true);
    });

    it('rejects invalid data', () => {
      expect(validateECGData(null)).toBe(false);
      expect(validateECGData({})).toBe(false);
      expect(validateECGData({ samples: 'invalid' })).toBe(false);
    });

    it('validates sample structure', () => {
      const invalidData = {
        samples: [{ value: 'invalid', timestamp: 0, isAbnormal: false }],
        heartRate: 72,
        analysis: {}
      };
      expect(validateECGData(invalidData)).toBe(false);
    });
  });
});
