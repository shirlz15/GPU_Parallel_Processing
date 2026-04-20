import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import HeroSection from './components/HeroSection'
import Dashboard from './components/Dashboard'
import Simulation from './components/Simulation'
import FloatingPointDemo from './components/FloatingPointDemo'
import AIInputBox from './components/AIInputBox'
import Charts from './components/Charts'
import ThreadVisualizer from './components/ThreadVisualizer'
import HowItWorks from './components/HowItWorks'
import Applications from './components/Applications'
import AMATCalculator from './components/AMATCalculator'
import Particles from './components/Particles'

function App() {
  const [darkMode, setDarkMode] = useState(true)
  const [simResults, setSimResults] = useState(null)
  const [logs, setLogs] = useState([])

  const addLog = (msg) => {
    const time = new Date().toLocaleTimeString()
    setLogs(prev => [`[${time}] ${msg}`, ...prev].slice(0, 50))
  }

  useEffect(() => {
    addLog('System initialized')
    addLog('GPU driver loaded')
    addLog('CUDA runtime ready')
    addLog('Awaiting simulation parameters...')
  }, [])

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gpu-dark' : 'bg-slate-100'} transition-colors duration-500 grid-bg relative`}>
      <Particles />
      
      {/* Top Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-gpu-dark/80 border-b border-neon-blue/10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center">
              <span className="text-white font-bold text-sm">⚡</span>
            </div>
            <span className="font-orbitron text-sm font-bold gradient-text">GPU VISUALIZER</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-6 text-xs font-inter text-slate-400">
              <a href="#dashboard" className="hover:text-neon-blue transition-colors">Dashboard</a>
              <a href="#simulation" className="hover:text-neon-blue transition-colors">Simulation</a>
              <a href="#floating-point" className="hover:text-neon-blue transition-colors">Float Demo</a>
              <a href="#ai-box" className="hover:text-neon-blue transition-colors">AI Console</a>
              <a href="#thread-viz" className="hover:text-neon-blue transition-colors">Threads</a>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg border border-neon-blue/20 hover:border-neon-blue/50 transition-all text-sm"
              id="theme-toggle"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </nav>

      <main className="pt-16">
        <HeroSection />
        
        <section id="dashboard">
          <Dashboard simResults={simResults} />
        </section>

        <section id="simulation">
          <Simulation 
            onResults={setSimResults} 
            addLog={addLog} 
          />
        </section>

        <section id="how-it-works">
          <HowItWorks />
        </section>

        <section id="amat">
          <AMATCalculator addLog={addLog} />
        </section>

        <section id="floating-point">
          <FloatingPointDemo addLog={addLog} />
        </section>

        <section id="charts">
          <Charts simResults={simResults} />
        </section>

        <section id="thread-viz">
          <ThreadVisualizer />
        </section>

        <section id="ai-box">
          <AIInputBox addLog={addLog} />
        </section>

        <section id="applications">
          <Applications />
        </section>

        {/* Terminal Logs */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="neon-card p-6"
          >
            <h3 className="font-orbitron text-sm text-neon-blue mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              SYSTEM LOGS
            </h3>
            <div className="bg-black/50 rounded-lg p-4 h-48 overflow-y-auto font-mono text-xs space-y-1">
              {logs.map((log, i) => (
                <div key={i} className="text-green-400/80 hover:text-green-300 transition-colors">
                  {log}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Conclusion */}
        <div className="max-w-7xl mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="font-orbitron text-2xl md:text-3xl font-bold gradient-text mb-6">Conclusion</h2>
            <p className="text-slate-400 max-w-3xl mx-auto text-sm md:text-base leading-relaxed">
              GPU computing dramatically improves performance while maintaining acceptable numerical accuracy. 
              Proper optimization ensures reliable and scalable systems. By leveraging massive parallelism and 
              understanding floating-point nuances, we can build the next generation of high-performance applications.
            </p>
          </motion.div>
        </div>

        {/* Footer */}
        <footer className="border-t border-neon-blue/10 py-8 mt-8">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="font-orbitron text-xs text-slate-500">
              GPU PARALLEL PROGRAMMING & FLOATING-POINT VISUALIZER
            </p>
            <p className="text-xs text-slate-600 mt-2">
              ⚡ Faster than CPU · 🔬 Accurate like science · 🚀 Built for the future
            </p>
          </div>
        </footer>
      </main>
    </div>
  )
}

export default App
