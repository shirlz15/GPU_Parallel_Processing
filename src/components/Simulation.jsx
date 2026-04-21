import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Simulation({ onResults, addLog }) {
  const [arraySize, setArraySize] = useState(100000)
  const [expression, setExpression] = useState("A[i] + B[i]")
  const [running, setRunning] = useState(false)
  const [results, setResults] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const runSimulation = async () => {
    setRunning(true)
    setErrorMessage(null)
    setResults(null)

    addLog(`Connecting to backend: size=${arraySize}, expr=${expression}`)

    try {
      const res = await fetch("/compute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expression: expression,
          size: parseInt(arraySize)
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Simulation failed");
      }

      const data = await res.json();
      setResults(data)
      onResults(data)

      addLog(`CPU Time: ${data.cpuTime}ms | GPU Time: ${data.gpuTime}ms | Speedup: ${data.speedup}x`)
      addLog(`Precision Error: ${data.error}% | Threads: ${data.threads.toLocaleString()}`)
      addLog('Simulation complete ✓')
    } catch (err) {
      setErrorMessage(err.message)
      addLog(`Error: ${err.message}`)
    } finally {
      setRunning(false)
    }
  }

  const exportResults = () => {
    if (!results) return
    const data = JSON.stringify(results, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'gpu_simulation_results.json'
    a.click()
    addLog('Results exported as JSON')
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
          INTERACTIVE SIMULATION
        </h2>
        <p className="text-slate-500 text-sm">Configure and run GPU vs CPU benchmark</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left — Controls */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="neon-card glow-border p-8 space-y-8"
        >
          <h3 className="font-orbitron text-sm text-neon-blue flex items-center gap-2">
            <span>⚙️</span> CONTROL PANEL
          </h3>

          {/* JS Expression Input */}
          <div>
            <label className="text-xs text-slate-400 font-inter uppercase tracking-wider block mb-3">JavaScript Expression</label>
            <input
              type="text"
              value={expression}
              onChange={e => setExpression(e.target.value)}
              placeholder="e.g. A[i] * B[i]"
              className="w-full bg-black/50 border border-neon-blue/20 rounded-xl px-4 py-3 text-neon-blue font-mono text-sm focus:outline-none focus:border-neon-blue/60 transition-colors"
              disabled={running}
            />
          </div>

          {/* Array Size Input Field */}
          <div>
            <label className="text-xs text-slate-400 font-inter uppercase tracking-wider block mb-3">Array Size</label>
            <input
              type="number"
              value={arraySize}
              onChange={e => setArraySize(e.target.value)}
              placeholder="100000"
              className="w-full bg-black/50 border border-neon-blue/20 rounded-xl px-4 py-3 text-neon-blue font-mono text-sm focus:outline-none focus:border-neon-blue/60 transition-colors"
              disabled={running}
            />
          </div>

          {/* Run Button */}
          <motion.button
            id="run-simulation-btn"
            whileHover={{ scale: running ? 1 : 1.02 }}
            whileTap={{ scale: running ? 1 : 0.98 }}
            onClick={runSimulation}
            disabled={running}
            className={`w-full py-4 rounded-xl font-orbitron text-sm font-black tracking-widest transition-all duration-300 ${
              running
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-neon-blue via-neon-purple to-neon-cyan text-white hover:shadow-neon-strong'
            }`}
          >
            {running ? (
              <span className="flex items-center justify-center gap-2">
                <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>⟳</motion.span>
                COMPUTING...
              </span>
            ) : '▶ RUN SIMULATION'}
          </motion.button>


        </motion.div>

        {/* Right — Results */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="neon-card glow-border p-8"
        >
          <h3 className="font-orbitron text-sm text-neon-blue flex items-center gap-2 mb-6">
            <span>📊</span> RESULTS OUTPUT
          </h3>

          <AnimatePresence mode="wait">
            {errorMessage ? (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-80 text-center"
              >
                <div className="text-6xl mb-6 opacity-20">❌</div>
                <p className="text-red-400 text-sm font-inter">Failed to compute:<br/>{errorMessage}</p>
              </motion.div>
            ) : !results ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-80 text-center"
              >
                <div className="text-6xl mb-6 opacity-20">🎮</div>
                <p className="text-slate-600 text-sm font-inter">Enter an expression and run simulation to see results</p>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {[
                  { label: 'CPU Time', value: `${results.cpuTime} ms`, color: '#f87171' },
                  { label: 'GPU Time', value: `${results.gpuTime} ms`, color: '#00D4FF' },
                  { label: 'Speedup Factor', value: `${results.speedup}×`, color: '#fbbf24' },
                  { label: 'Precision Error', value: `${results.error}%`, color: '#A855F7' },
                  { label: 'Active Threads', value: results.threads.toLocaleString(), color: '#22D3EE' },
                  { label: 'GPU Utilization', value: `${results.utilization}%`, color: '#34d399' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-black/30 border border-slate-800"
                  >
                    <span className="text-xs text-slate-400 font-inter">{item.label}</span>
                    <span className="font-mono text-sm font-bold" style={{ color: item.color }}>
                      {item.value}
                    </span>
                  </motion.div>
                ))}

                {/* Performance Bar */}
                <div className="mt-6 p-4 rounded-lg bg-black/30 border border-slate-800">
                  <p className="text-xs text-slate-500 mb-3 font-inter">CPU vs GPU Speed Comparison</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-400 w-8">CPU</span>
                      <div className="flex-1 h-3 bg-slate-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: '100%' }}
                          transition={{ duration: 0.8, delay: 0.3 }}
                          className="h-full bg-red-500 rounded-full"
                        />
                      </div>
                      <span className="text-xs font-mono text-red-400">{results.cpuTime}ms</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-400 w-8">GPU</span>
                      <div className="flex-1 h-3 bg-slate-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(1 / results.speedup) * 100}%` }}
                          transition={{ duration: 0.8, delay: 0.5 }}
                          className="h-full bg-gradient-to-r from-neon-blue to-neon-cyan rounded-full"
                        />
                      </div>
                      <span className="text-xs font-mono text-neon-blue">{results.gpuTime}ms</span>
                    </div>
                  </div>
                </div>

                {/* Sample Output */}
                <div className="mt-4 p-4 rounded-lg bg-black/30 border border-slate-800">
                  <p className="text-xs text-slate-500 mb-3 font-inter">Sample Computations (First 5)</p>
                  <div className="flex gap-2 flex-wrap">
                    {results.sample && results.sample.map((val, i) => (
                      <span key={i} className="px-3 py-1 bg-neon-purple/20 text-neon-purple text-xs font-mono rounded-md">
                        {typeof val === 'number' ? val.toFixed(4) : String(val)}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  id="export-btn"
                  onClick={exportResults}
                  className="w-full py-3 rounded-xl border border-neon-purple/30 text-neon-purple text-xs font-orbitron hover:bg-neon-purple/10 transition-all duration-300"
                >
                  📥 EXPORT RESULTS
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}
