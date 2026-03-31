import { useState } from 'react';
import { uploadECGFile } from '../utils/api';
import { useECGStore } from '../hooks/useStore';

export function ECGUpload() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const setECGData = useECGStore((state) => state.setECGData);
  const setAnalysisResults = useECGStore((state) => state.setAnalysisResults);

  const handleFile = async (file) => {
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const result = await uploadECGFile(file);
      
      // Update store with results
      setECGData(result.signal_data);
      setAnalysisResults({
        classification: result.arrhythmia_class === 'N' ? 'normal' : 'arrhythmia',
        confidence: result.confidence,
        aiReview: `${result.diagnosis}. Heart rate: ${result.bpm} BPM. QRS interval: ${result.qrs_interval_ms}ms. Ischemia risk: ${(result.ischemia_risk * 100).toFixed(1)}%.`,
        recommendations: generateRecommendations(result),
        detectedAnomalies: []
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateRecommendations = (result) => {
    const recs = [];
    
    if (result.arrhythmia_class !== 'N') {
      recs.push('Consult with a cardiologist for further evaluation');
    }
    
    if (result.ischemia_flag) {
      recs.push('Monitor for signs of cardiac stress');
    }
    
    if (result.bpm > 100) {
      recs.push('Reduce caffeine intake and practice relaxation techniques');
    }
    
    if (result.bpm < 60) {
      recs.push('Increase physical activity gradually');
    }
    
    recs.push('Schedule regular ECG monitoring');
    
    return recs.slice(0, 5);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`p-12 rounded-2xl border-2 border-dashed transition cursor-pointer ${
          dragActive
            ? 'border-cyan-400 bg-cyan-500/10'
            : 'border-white/20 bg-white/5 hover:bg-white/10'
        }`}
      >
        <input
          type="file"
          accept=".csv,.json"
          onChange={handleChange}
          disabled={loading}
          className="hidden"
          id="ecg-upload"
        />
        
        <label htmlFor="ecg-upload" className="cursor-pointer block text-center">
          <div className="text-4xl mb-4">📁</div>
          <h3 className="text-xl font-semibold text-cyan-400 mb-2">
            {loading ? 'Analyzing...' : 'Upload ECG File'}
          </h3>
          <p className="text-gray-400 mb-4">
            Drag and drop your CSV or JSON file here, or click to browse
          </p>
          <p className="text-sm text-gray-500">
            Supported formats: .csv, .json (186 ECG features)
          </p>
        </label>

        {error && (
          <div className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {loading && (
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        )}
      </div>
    </div>
  );
}
