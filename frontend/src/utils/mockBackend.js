// Mock backend for development - generates fake ECG data
export function generateMockECGData() {
  const samples = [];
  const sampleRate = 250; // Hz
  const duration = 5; // seconds
  const totalSamples = sampleRate * duration;
  
  // Generate realistic ECG waveform (simplified)
  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;
    const heartRate = 72; // BPM
    const frequency = heartRate / 60; // Hz
    
    // Simulate ECG with P-QRS-T waves
    let value = 0;
    const phase = (t * frequency * 2 * Math.PI) % (2 * Math.PI);
    
    // QRS complex (main spike)
    if (phase < Math.PI * 0.3) {
      value = Math.sin(phase * 3) * 1.5;
    } else if (phase < Math.PI * 0.6) {
      value = Math.cos(phase * 2) * 0.8;
    } else {
      value = Math.sin(phase * 0.5) * 0.3;
    }
    
    // Add noise
    value += (Math.random() - 0.5) * 0.1;
    
    samples.push({
      value,
      timestamp: i * (1000 / sampleRate),
      isAbnormal: false
    });
  }
  
  return {
    id: `mock-${Date.now()}`,
    timestamp: Date.now(),
    heartRate: 72,
    samples,
    analysis: {
      classification: 'normal',
      confidence: 0.95,
      aiReview: 'Normal sinus rhythm detected. Heart rate is regular and within normal range.',
      recommendations: [
        'Maintain regular exercise routine',
        'Monitor heart rate during physical activity',
        'Schedule follow-up check in 6 months'
      ],
      detectedAnomalies: []
    },
    metadata: {
      deviceId: 'mock-device',
      userId: 'mock-user',
      duration: duration
    }
  };
}

export function generateMockArrhythmiaData() {
  const data = generateMockECGData();
  
  // Inject abnormal spikes
  const abnormalIndices = [50, 100, 150, 200, 250];
  abnormalIndices.forEach(idx => {
    if (data.samples[idx]) {
      data.samples[idx].value *= 2.5;
      data.samples[idx].isAbnormal = true;
    }
  });
  
  data.analysis.classification = 'arrhythmia';
  data.analysis.confidence = 0.87;
  data.analysis.aiReview = 'Irregular heartbeat detected. Premature beats observed. Recommend consultation with cardiologist.';
  data.analysis.recommendations = [
    'Reduce caffeine intake',
    'Practice stress management techniques',
    'Schedule appointment with cardiologist',
    'Monitor symptoms and keep a log'
  ];
  data.analysis.detectedAnomalies = [
    { type: 'premature_beat', severity: 'low', startTime: 200, endTime: 400 }
  ];
  
  return data;
}

// Validate ECG data format
export function validateECGData(data) {
  if (!data || typeof data !== 'object') return false;
  if (!Array.isArray(data.samples)) return false;
  if (typeof data.heartRate !== 'number') return false;
  if (!data.analysis || typeof data.analysis !== 'object') return false;
  
  return data.samples.every(sample => 
    typeof sample.value === 'number' &&
    typeof sample.timestamp === 'number' &&
    typeof sample.isAbnormal === 'boolean'
  );
}
