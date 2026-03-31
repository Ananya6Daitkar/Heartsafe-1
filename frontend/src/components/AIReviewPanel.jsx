import { motion, AnimatePresence } from 'framer-motion';
import { useECGStore } from '../hooks/useStore';

export function AIReviewPanel() {
  const aiReview = useECGStore((state) => state.aiReview);
  const analysisStatus = useECGStore((state) => state.analysisStatus);

  const isVisible = analysisStatus === 'complete' && aiReview;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="absolute bottom-8 left-8 w-80 z-10"
        >
          <div className="p-6 rounded-2xl backdrop-blur-md bg-white/10 border border-white/20">
            <p className="text-sm text-gray-300 leading-relaxed">
              <span className="font-semibold text-cyan-400">AI Review:</span>{' '}
              {aiReview}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
