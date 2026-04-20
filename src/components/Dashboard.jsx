import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const MetricCard = ({ title, value, unit, icon, color, delay }) => {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    const target = parseFloat(value) || 0
    const duration = 1500
    const steps = 60
    const increment = target / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        current = target
        clearInterval(timer)
      }
      setDisplayValue(current)
    }, duration / steps)
    return () => clearInterval(timer)
  }, [value])

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: delay * 0.1 }}
      className="neon-card glow-border p-6 relative overflow-hidden group"
    >
      {/* Scan line effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 scan-line" />
      
      <div className="flex items-start justify-between mb-4">
        <span className="text-2xl">{icon}</span>
        <span className={`text-xs font-mono px-2 py-1 rounded-full bg-${color}-500/10 text-${color}-400`}>
          LIVE
        </span>
      </div>
      <p className="text-xs text-slate-500 font-inter uppercase tracking-widest mb-2">{title}</p>
      <p className={`text-3xl font-orbitron font-bold`} style={{ color: `var(--${color})` }}>
        <span className="gradient-text">
          {typeof value === 'number' ? displayValue.toFixed(value < 1 ? 6 : 1) : value}
        </span>
        <span className="text-sm text-slate-500 ml-2">{unit}</span>
      </p>
    </motion.div>
  )
}

export default function Dashboard({ simResults }) {
  const metrics = simResults ? [
    { title: 'Execution Time (CPU)', value: simResults.cpuTime, unit: 'ms', icon: '🖥️', color: 'red' },
    { title: 'Execution Time (GPU)', value: simResults.gpuTime, unit: 'ms', icon: '🎮', color: 'cyan' },
    { title: 'Speedup', value: simResults.speedup, unit: 'x', icon: '⚡', color: 'yellow' },
    { title: 'Precision Error', value: simResults.error, unit: '%', icon: '🎯', color: 'purple' },
    { title: 'Parallel Threads', value: simResults.threads, unit: '', icon: '🧵', color: 'green' },
    { title: 'GPU Utilization', value: simResults.utilization, unit: '%', icon: '📊', color: 'blue' },
  ] : [
    { title: 'Execution Time (CPU)', value: '—', unit: '', icon: '🖥️', color: 'red' },
    { title: 'Execution Time (GPU)', value: '—', unit: '', icon: '🎮', color: 'cyan' },
    { title: 'Speedup', value: '—', unit: '', icon: '⚡', color: 'yellow' },
    { title: 'Precision Error', value: '—', unit: '', icon: '🎯', color: 'purple' },
    { title: 'Parallel Threads', value: '—', unit: '', icon: '🧵', color: 'green' },
    { title: 'GPU Utilization', value: '—', unit: '', icon: '📊', color: 'blue' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="font-orbitron text-xl md:text-2xl font-bold gradient-text mb-2">
          LIVE DASHBOARD
        </h2>
        <p className="text-slate-500 text-sm">Real-time performance metrics</p>
      </motion.div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((m, i) => (
          <MetricCard key={i} {...m} delay={i} />
        ))}
      </div>
    </div>
  )
}
