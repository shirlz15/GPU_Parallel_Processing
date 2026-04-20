import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const THREAD_COUNT = 64

export default function ThreadVisualizer() {
  const [running, setRunning] = useState(false)
  const [threads, setThreads] = useState(
    Array.from({ length: THREAD_COUNT }, (_, i) => ({ id: i, state: 'idle', progress: 0 }))
  )
  const [completedCount, setCompletedCount] = useState(0)
  const intervalsRef = useRef([])

  const startVisualization = () => {
    if (running) return
    setRunning(true)
    setCompletedCount(0)

    let temp = Array.from({ length: THREAD_COUNT }, (_, i) => ({ id: i, state: 'idle', progress: 0 }));
    temp = temp.map(t => ({ ...t, state: "ready" }));
    setThreads([...temp]);

    let i = 0;

    intervalsRef.current.forEach(clearInterval)
    intervalsRef.current = [];

    const interval = setInterval(() => {
      if (i >= temp.length) {
        clearInterval(interval);
        setRunning(false);
        return;
      }

      const currentIndex = i;
      setThreads(prev => {
        const next = [...prev];
        next[currentIndex] = { ...next[currentIndex], state: "running", progress: 50 };
        return next;
      });

      setTimeout(() => {
        setThreads(prev => {
          const next = [...prev];
          next[currentIndex] = { ...next[currentIndex], state: "done", progress: 100 };
          return next;
        });
        setCompletedCount(c => c + 1);
      }, 500);

      i++;
    }, 100);

    intervalsRef.current.push(interval);
  }

  const resetVisualization = () => {
    intervalsRef.current.forEach(clearInterval)
    intervalsRef.current = []
    setRunning(false)
    setCompletedCount(0)
    setThreads(Array.from({ length: THREAD_COUNT }, (_, i) => ({ id: i, state: 'idle', progress: 0 })))
  }

  const stateColor = (state) => {
    switch (state) {
      case 'idle': return 'bg-slate-700'
      case 'ready': return 'bg-yellow-500/70'
      case 'running': return 'bg-neon-blue'
      case 'done': return 'bg-green-400'
      default: return 'bg-slate-700'
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="font-orbitron text-xl md:text-2xl font-bold gradient-text mb-2">
          LIVE THREAD VISUALIZER
        </h2>
        <p className="text-slate-500 text-sm">Watch {THREAD_COUNT} GPU threads execute in parallel</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="neon-card glow-border p-8"
      >
        {/* Controls & Stats */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex gap-3">
            <motion.button
              id="start-threads-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startVisualization}
              disabled={running}
              className={`px-6 py-2.5 rounded-xl font-orbitron text-xs font-bold transition-all ${
                running
                  ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-neon-blue to-neon-purple text-white hover:shadow-neon'
              }`}
            >
              {running ? '▶ RUNNING...' : '▶ LAUNCH THREADS'}
            </motion.button>
            <motion.button
              id="reset-threads-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetVisualization}
              className="px-6 py-2.5 rounded-xl font-orbitron text-xs font-bold border border-slate-600 text-slate-400 hover:border-neon-blue/40 transition-all"
            >
              ↺ RESET
            </motion.button>
          </div>
          <div className="flex gap-6 text-xs font-mono">
            <span className="flex items-center gap-2 text-neon-blue">
              <span className="w-3 h-3 rounded-full bg-neon-blue animate-pulse" />
              Running: {threads.filter(t => t.state === 'running').length}
            </span>
            <span className="flex items-center gap-2 text-green-400">
              <span className="w-3 h-3 rounded-full bg-green-400" />
              Done: {completedCount}
            </span>
            <span className="flex items-center gap-2 text-yellow-400">
              <span className="w-3 h-3 rounded-full bg-yellow-500" />
              Ready: {threads.filter(t => t.state === 'ready').length}
            </span>
          </div>
        </div>

        {/* Thread Grid */}
        <div className="grid grid-cols-8 sm:grid-cols-16 gap-2 mb-8">
          {threads.map(t => (
            <motion.div
              key={t.id}
              title={`Thread ${t.id}: ${t.state} (${t.progress.toFixed(0)}%)`}
              animate={t.state === 'running' ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.5, repeat: t.state === 'running' ? Infinity : 0 }}
              className={`w-full aspect-square rounded-lg transition-all duration-300 ${stateColor(t.state)} cursor-pointer relative overflow-hidden`}
            >
              {t.state === 'running' && (
                <div
                  className="absolute bottom-0 left-0 right-0 bg-neon-blue/30"
                  style={{ height: `${t.progress}%` }}
                />
              )}
            </motion.div>
          ))}
        </div>

        {/* Progress bar */}
        <div>
          <div className="flex justify-between text-xs text-slate-500 mb-1">
            <span className="font-mono">Overall Completion</span>
            <span className="font-mono">{completedCount}/{THREAD_COUNT} threads</span>
          </div>
          <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              style={{ width: `${(completedCount / THREAD_COUNT) * 100}%` }}
              className="h-full bg-gradient-to-r from-neon-blue to-green-400 rounded-full"
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-6 mt-6 text-xs font-mono">
          {[
            { color: 'bg-slate-700', label: 'Idle' },
            { color: 'bg-yellow-500/70', label: 'Ready' },
            { color: 'bg-neon-blue', label: 'Running' },
            { color: 'bg-green-400', label: 'Completed' },
          ].map(l => (
            <span key={l.label} className="flex items-center gap-2 text-slate-400">
              <span className={`w-3 h-3 rounded-sm ${l.color}`} />
              {l.label}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
