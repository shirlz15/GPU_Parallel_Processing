import { motion } from 'framer-motion'

export default function HeroSection() {
  return (
    <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ 
            x: [0, 100, -50, 0],
            y: [0, -80, 60, 0],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.12) 0%, transparent 70%)' }}
        />
        <motion.div
          animate={{ 
            x: [0, -80, 100, 0],
            y: [0, 100, -60, 0],
            scale: [1, 0.8, 1.3, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)' }}
        />
        <motion.div
          animate={{ 
            x: [-50, 50, 0],
            y: [50, -50, 50],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)' }}
        />
      </div>

      <div className="relative z-10 text-center px-4 max-w-5xl">
        {/* Status badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-neon-blue/30 bg-neon-blue/5 mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs font-mono text-neon-blue">SYSTEM ONLINE — GPU CORES ACTIVE</span>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="font-orbitron text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight"
        >
          <span className="gradient-text animate-glow">Parallel Programming</span>
          <br />
          <span className="text-white">&</span>
          <br />
          <span className="gradient-text animate-glow">Floating-Point Computation</span>
          <br />
          <span className="text-neon-blue text-2xl sm:text-3xl md:text-4xl font-bold">on GPUs</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="text-slate-400 text-sm md:text-lg max-w-3xl mx-auto mb-8 leading-relaxed"
        >
          High-performance computing powered by massive parallelism. 
          Explore real-time simulations, precision analysis, and GPU acceleration.
        </motion.p>

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex flex-wrap justify-center gap-4 md:gap-8 text-sm md:text-base"
        >
          <span className="flex items-center gap-2 text-yellow-400">
            <span className="text-lg">⚡</span> Faster than CPU
          </span>
          <span className="flex items-center gap-2 text-cyan-400">
            <span className="text-lg">🔬</span> Accurate like science
          </span>
          <span className="flex items-center gap-2 text-purple-400">
            <span className="text-lg">🚀</span> Built for the future
          </span>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="flex flex-wrap justify-center gap-4 mt-10"
        >
          <a
            href="#simulation"
            className="px-8 py-3 rounded-xl font-orbitron text-sm font-bold bg-gradient-to-r from-neon-blue to-neon-purple text-white hover:shadow-neon-strong transition-all duration-300 hover:scale-105"
          >
            Run Simulation
          </a>
          <a
            href="#dashboard"
            className="px-8 py-3 rounded-xl font-orbitron text-sm font-bold border border-neon-blue/30 text-neon-blue hover:bg-neon-blue/10 transition-all duration-300"
          >
            View Dashboard
          </a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="mt-16"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-slate-500 text-2xl"
          >
            ↓
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
