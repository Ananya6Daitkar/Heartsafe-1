import { motion, AnimatePresence } from 'framer-motion';
import { useECGStore } from '../hooks/useStore';

export function ArrhythmiaWarning() {
  const showWarning = useECGStore((state) => state.showArrhythmiaWarning);

  return (
    <AnimatePresence>
      {showWarning && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="absolute top-8 left-1/2 transform -translate-x-1/2 z-20"
        >
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="px-6 py-3 bg-red-500/20 border border-red-500/50 rounded-lg backdrop-blur-md"
          >
            <span className="text-red-400 font-semibold text-lg">
              ⚠️ Arrhythmia Detected
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
