import { motion } from 'framer-motion';

const stats = [
  { label: '87,000+ ECG Beats Analyzed', icon: '📊' },
  { label: 'Clinical-grade Accuracy', icon: '✓' },
  { label: 'Real-time Detection', icon: '⚡' }
];

export function TrustSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  };

  return (
    <section className="py-20 px-8 bg-gradient-to-b from-transparent to-navy-900/50">
      <motion.div
        className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            variants={itemVariants}
            className="p-6 rounded-2xl backdrop-blur-md bg-white/10 border border-white/20 text-center"
          >
            <div className="text-3xl mb-3">{stat.icon}</div>
            <p className="text-gray-300 text-sm font-medium">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
