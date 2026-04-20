import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const KB = {
  'what is gpu': {
    title: 'What is a GPU?',
    content: `A GPU (Graphics Processing Unit) is a specialized processor designed for massive parallel computation. 
Unlike a CPU with 4–32 cores, a modern GPU like NVIDIA's A100 has 6,912 CUDA cores executing simultaneously.
GPUs were originally built for graphics rendering but are now the backbone of AI, scientific simulation, and HPC.`,
    tags: ['GPU', 'Parallel', 'CUDA'],
  },
  'difference cpu gpu': {
    title: 'CPU vs GPU Architecture',
    content: `CPU: 4–64 powerful cores, optimized for sequential tasks, large cache, high clock frequency.
GPU: Thousands of smaller cores (CUDA/OpenCL), optimized for parallel tasks, high memory bandwidth.
Rule of thumb: CPU is a few expert workers. GPU is thousands of simple workers doing the same task simultaneously.`,
    tags: ['Architecture', 'Comparison'],
  },
  'precision issue': {
    title: 'Floating-Point Precision Issues',
    content: `IEEE 754 standard defines float (32-bit) and double (64-bit) representations.
Decimal numbers like 0.1 cannot be stored exactly in binary → tiny rounding errors accumulate.
Float: ~7 significant digits | Double: ~15-16 significant digits.
Solutions: Use epsilon tolerance, integer arithmetic, or arbitrary precision libraries.`,
    tags: ['IEEE 754', 'Precision', 'Rounding'],
  },
  'cuda': {
    title: 'CUDA Programming Model',
    content: `CUDA (Compute Unified Device Architecture) by NVIDIA allows C/C++ code to run on GPUs.
Key concepts: Threads → Warps (32 threads) → Blocks → Grids.
Host code runs on CPU, device (kernel) code runs on GPU.
Memory hierarchy: Registers → Shared Memory → L2 Cache → Global Memory.`,
    tags: ['CUDA', 'NVIDIA', 'Kernel'],
  },
  'opencl': {
    title: 'OpenCL Overview',
    content: `OpenCL (Open Computing Language) is a cross-platform parallel computing framework.
Works on CPUs, GPUs, FPGAs, and DSPs from any vendor (AMD, Intel, NVIDIA, Apple).
Programs are called kernels and are compiled at runtime for the target device.
More portable than CUDA but typically requires more boilerplate code.`,
    tags: ['OpenCL', 'Cross-platform'],
  },
  'amat': {
    title: 'AMAT Formula',
    content: `AMAT = Hit Time + Miss Rate × Miss Penalty
Average Memory Access Time measures efficiency of the memory hierarchy.
Hit Time: Time to access data in cache.
Miss Rate: Fraction of accesses not found in cache.
Miss Penalty: Extra time to fetch data from lower memory level.
GPU optimization: minimize global memory access, maximize shared memory reuse.`,
    tags: ['AMAT', 'Cache', 'Memory'],
  },
  'memory': {
    title: 'GPU Memory Hierarchy',
    content: `Registers: Fastest, private per thread (~16KB per SM).
Shared Memory: Fast scratchpad shared within a block (~48–96KB per SM).
L1/L2 Cache: Automatic caching of global memory access.
Global Memory: Largest but slowest (GDDR6/HBM2) — up to 80GB on A100.
Optimization tip: Coalesced memory access patterns dramatically improve throughput.`,
    tags: ['Memory', 'Cache', 'Optimization'],
  },
  'speedup': {
    title: 'GPU Speedup Calculations',
    content: `Speedup = CPU Execution Time / GPU Execution Time
Amdahl's Law: Maximum speedup limited by the sequential fraction of a program.
If 5% of code is sequential → max speedup = 1/(0.05) = 20×.
Real GPU speedups range from 10× to over 100× for highly parallel workloads like matrix multiplication.`,
    tags: ['Speedup', 'Amdahl', 'Performance'],
  },
}

function findAnswer(query) {
  const q = query.toLowerCase().trim()
  for (const [key, val] of Object.entries(KB)) {
    if (q.includes(key)) return val
  }
  // Partial match
  for (const [key, val] of Object.entries(KB)) {
    const words = key.split(' ')
    if (words.some(w => q.includes(w) && w.length > 3)) return val
  }
  return null
}

const SUGGESTIONS = [
  'what is gpu',
  'difference cpu gpu',
  'precision issue',
  'cuda',
  'amat',
  'memory',
  'speedup',
]

export default function AIInputBox({ addLog }) {
  const [query, setQuery] = useState('')
  const [response, setResponse] = useState(null)
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState([])

  const ask = async () => {
    if (!query.trim()) return
    setLoading(true)
    const q = query
    setHistory(prev => [{ q, r: null }, ...prev].slice(0, 5))
    addLog(`AI Query: "${q}"`)

    await new Promise(r => setTimeout(r, 800 + Math.random() * 600))

    const ans = findAnswer(q)
    const res = ans || {
      title: 'GPU Computing AI',
      content: `I found relevant info about GPU computing for your query: "${q}". Try asking about: GPU, CPU vs GPU, CUDA, OpenCL, precision issues, AMAT, memory, or speedup.`,
      tags: ['General'],
    }
    setResponse(res)
    setHistory(prev => {
      const updated = [...prev]
      updated[0] = { q, r: res }
      return updated
    })
    addLog(`AI Response: ${res.title}`)
    setLoading(false)
    setQuery('')
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
          AI KNOWLEDGE CONSOLE
        </h2>
        <p className="text-slate-500 text-sm">Ask anything about GPU computing</p>
      </motion.div>

      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="neon-card glow-border p-8"
        >
          {/* Input Row */}
          <div className="flex gap-3 mb-6">
            <div className="flex-1 relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neon-blue text-sm">›</span>
              <input
                id="ai-query-input"
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && ask()}
                placeholder="Ask anything about GPU computing..."
                className="w-full bg-black/50 border border-neon-blue/20 rounded-xl pl-8 pr-4 py-3 text-sm font-mono text-slate-200 focus:outline-none focus:border-neon-blue/60 placeholder-slate-600 transition-colors"
              />
            </div>
            <motion.button
              id="ai-ask-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={ask}
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-white text-xs font-orbitron font-bold hover:shadow-neon transition-all disabled:opacity-50"
            >
              {loading ? '...' : 'ASK'}
            </motion.button>
          </div>

          {/* Quick Suggestions */}
          <div className="flex flex-wrap gap-2 mb-8">
            {SUGGESTIONS.map(s => (
              <button
                key={s}
                onClick={() => { setQuery(s); }}
                className="px-3 py-1 rounded-full border border-neon-blue/15 text-xs text-slate-400 hover:border-neon-blue/40 hover:text-neon-blue transition-all font-mono"
              >
                {s}
              </button>
            ))}
          </div>

          {/* Loading */}
          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3 mb-6"
              >
                <div className="flex gap-1">
                  {[0, 1, 2].map(i => (
                    <motion.div
                      key={i}
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                      className="w-2 h-2 rounded-full bg-neon-blue"
                    />
                  ))}
                </div>
                <span className="text-xs text-slate-500 font-mono">Computing response...</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Response */}
          <AnimatePresence mode="wait">
            {response && !loading && (
              <motion.div
                key={response.title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="p-6 rounded-xl bg-black/40 border border-neon-blue/15"
              >
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-orbitron text-sm text-neon-blue">{response.title}</h4>
                  <div className="flex gap-1 flex-wrap justify-end">
                    {response.tags.map(t => (
                      <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-neon-purple/10 text-neon-purple font-mono">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-slate-300 text-sm font-inter leading-relaxed whitespace-pre-line">
                  {response.content}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* History */}
          {history.length > 1 && (
            <div className="mt-6 border-t border-slate-800 pt-6">
              <p className="text-xs text-slate-600 mb-3 font-mono">QUERY HISTORY</p>
              <div className="space-y-2">
                {history.slice(1).map((h, i) => (
                  <button
                    key={i}
                    onClick={() => h.r && setResponse(h.r)}
                    className="block w-full text-left px-3 py-2 rounded-lg bg-slate-900/50 text-xs text-slate-500 hover:text-slate-300 font-mono transition-colors"
                  >
                    › {h.q}
                  </button>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
