import { motion, AnimatePresence } from 'framer-motion';
import { useECGStore } from '../hooks/useStore';

export function RecommendationsPanel() {
  const recommendations = useECGStore((state) => state.recommendations);
  const analysisStatus = useECGStore((state) => state.analysisStatus);

  const isVisible = analysisStatus === 'complete' && recommendations.length > 0;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="absolute bottom-8 right-8 w-80 z-10"
        >
          <div className="p-6 rounded-2xl backdrop-blur-md bg-white/10 border border-white/20 max-h-96 overflow-y-auto">
            <p className="text-sm text-gray-300 mb-4">
              <span className="font-semibold text-cyan-400">Recommendations:</span>
            </p>
            <ul className="space-y-2">
              {recommendations.map((rec, idx) => (
                <li key={idx} className="text-sm text-gray-300 flex items-start">
                  <span className="text-cyan-400 mr-3">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
