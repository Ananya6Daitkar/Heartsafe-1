import { useECGStore } from '../hooks/useStore';

export function AnalysisDashboard() {
  const ecgData = useECGStore((state) => state.ecgData);
  const aiReview = useECGStore((state) => state.aiReview);
  const recommendations = useECGStore((state) => state.recommendations);
  const showWarning = useECGStore((state) => state.showArrhythmiaWarning);

  if (!aiReview) {
    return null;
  }

  // Extract metrics from aiReview
  const extractMetrics = () => {
    const metrics = {
      heartRate: 72,
      qrsInterval: 100,
      ischemiaRisk: 0,
      status: 'Normal'
    };

    const bpmMatch = aiReview.match(/Heart rate: (\d+) BPM/);
    if (bpmMatch) metrics.heartRate = parseInt(bpmMatch[1]);

    const qrsMatch = aiReview.match(/QRS interval: ([\d.]+)ms/);
    if (qrsMatch) metrics.qrsInterval = parseFloat(qrsMatch[1]);

    const riskMatch = aiReview.match(/Ischemia risk: ([\d.]+)%/);
    if (riskMatch) metrics.ischemiaRisk = parseFloat(riskMatch[1]);

    metrics.status = showWarning ? 'Arrhythmia Detected' : 'Normal Rhythm';

    return metrics;
  };

  const metrics = extractMetrics();

  return (
    <div className="w-full py-12 px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-cyan-400">Analysis Results</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Heart Rate */}
          <div className="p-6 rounded-2xl backdrop-blur-md bg-white/10 border border-white/20">
            <p className="text-gray-400 text-sm mb-2">Heart Rate</p>
            <p className="text-3xl font-bold text-cyan-400">{metrics.heartRate}</p>
            <p className="text-gray-500 text-xs mt-2">BPM</p>
          </div>

          {/* QRS Interval */}
          <div className="p-6 rounded-2xl backdrop-blur-md bg-white/10 border border-white/20">
            <p className="text-gray-400 text-sm mb-2">QRS Interval</p>
            <p className="text-3xl font-bold text-cyan-400">{metrics.qrsInterval}</p>
            <p className="text-gray-500 text-xs mt-2">milliseconds</p>
          </div>

          {/* Ischemia Risk */}
          <div className="p-6 rounded-2xl backdrop-blur-md bg-white/10 border border-white/20">
            <p className="text-gray-400 text-sm mb-2">Ischemia Risk</p>
            <p className="text-3xl font-bold text-cyan-400">{metrics.ischemiaRisk.toFixed(1)}%</p>
            <p className="text-gray-500 text-xs mt-2">Risk Level</p>
          </div>

          {/* Status */}
          <div className="p-6 rounded-2xl backdrop-blur-md bg-white/10 border border-white/20">
            <p className="text-gray-400 text-sm mb-2">Rhythm Status</p>
            <p className={`text-3xl font-bold ${showWarning ? 'text-red-400' : 'text-cyan-400'}`}>
              {metrics.status === 'Normal Rhythm' ? '✓' : '⚠️'}
            </p>
            <p className={`text-xs mt-2 ${showWarning ? 'text-red-400' : 'text-gray-500'}`}>
              {metrics.status}
            </p>
          </div>
        </div>

        {/* AI Review */}
        <div className="p-8 rounded-2xl backdrop-blur-md bg-white/10 border border-white/20 mb-8">
          <h3 className="text-xl font-semibold text-cyan-400 mb-4">AI Clinical Review</h3>
          <p className="text-gray-300 leading-relaxed">{aiReview}</p>
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="p-8 rounded-2xl backdrop-blur-md bg-white/10 border border-white/20">
            <h3 className="text-xl font-semibold text-cyan-400 mb-4">Recommendations</h3>
            <ul className="space-y-3">
              {recommendations.map((rec, idx) => (
                <li key={idx} className="flex items-start gap-3 text-gray-300">
                  <span className="text-cyan-400 mt-1 flex-shrink-0">✓</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Waveform Visualization */}
        {ecgData.length > 0 && (
          <div className="mt-8 p-8 rounded-2xl backdrop-blur-md bg-white/10 border border-white/20">
            <h3 className="text-xl font-semibold text-cyan-400 mb-4">ECG Waveform</h3>
            <div className="w-full h-64 bg-black/30 rounded-lg p-4 flex items-end gap-1 overflow-x-auto">
              {ecgData.slice(0, 200).map((value, idx) => {
                const normalized = (value - Math.min(...ecgData)) / (Math.max(...ecgData) - Math.min(...ecgData) + 0.001);
                return (
                  <div
                    key={idx}
                    className="flex-1 bg-gradient-to-t from-cyan-400 to-cyan-300 rounded-t opacity-80 hover:opacity-100 transition"
                    style={{ height: `${normalized * 100}%`, minHeight: '2px' }}
                  />
                );
              })}
            </div>
            <p className="text-gray-400 text-sm mt-4">
              Showing first 200 samples of {ecgData.length} total ECG features
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
