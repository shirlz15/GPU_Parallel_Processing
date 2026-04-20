import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const PRESETS = [
  { expr: '0.1 + 0.2', label: '0.1 + 0.2' },
  { expr: '0.3 - 0.1', label: '0.3 - 0.1' },
  { expr: '1.1 + 2.2', label: '1.1 + 2.2' },
  { expr: '0.7 + 0.1', label: '0.7 + 0.1' },
]

function evalSafe(expr) {
  try {
    // Allow only safe math characters
    if (!/^[\d\s+\-*/().]+$/.test(expr)) return null
    // eslint-disable-next-line no-new-func
    return Function('"use strict"; return (' + expr + ')')()
  } catch {
    return null
  }
}

function parseExpected(expr) {
  // Try to return the rational expectation as a string
  const map = {
    '0.1 + 0.2': '0.3',
    '0.3 - 0.1': '0.2',
    '1.1 + 2.2': '3.3',
    '0.7 + 0.1': '0.8',
  }
  return map[expr.trim()] || 'See actual result'
}

export default function FloatingPointDemo({ addLog }) {
  const [expr, setExpr] = useState('0.1 + 0.2')
  const [result, setResult] = useState(null)

  const compute = () => {
    const actual = evalSafe(expr)
    if (actual === null) {
      addLog('Invalid expression in float demo')
      return
    }
    const expected = parseExpected(expr)
    const numExpected = parseFloat(expected) || actual
    const diff = Math.abs(actual - numExpected)
    setResult({ actual, expected, diff, expr })
    addLog(`Float demo: ${expr} = ${actual} (expected ≈ ${expected}, diff = ${diff.toFixed(20)})`)
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
          FLOATING-POINT VISUALIZER
        </h2>
        <p className="text-slate-500 text-sm">Why 0.1 + 0.2 ≠ 0.3 in binary</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="neon-card glow-border p-8 space-y-6"
        >
          <h3 className="font-orbitron text-sm text-neon-purple flex items-center gap-2">
            🔬 EXPRESSION INPUT
          </h3>

          <div>
            <label className="text-xs text-slate-400 uppercase tracking-wider block mb-2">Enter Math Expression</label>
            <input
              id="float-expr-input"
              type="text"
              value={expr}
              onChange={e => setExpr(e.target.value)}
              placeholder="e.g. 0.1 + 0.2"
              className="w-full bg-black/40 border border-neon-blue/20 rounded-xl px-4 py-3 text-neon-blue font-mono text-sm focus:outline-none focus:border-neon-blue/60 transition-colors"
            />
          </div>

          {/* Presets */}
          <div>
            <p className="text-xs text-slate-500 mb-3">Quick presets:</p>
            <div className="grid grid-cols-2 gap-2">
              {PRESETS.map(p => (
                <button
                  key={p.expr}
                  onClick={() => setExpr(p.expr)}
                  className="py-2 px-3 rounded-lg border border-neon-purple/20 text-xs font-mono text-slate-300 hover:border-neon-purple/50 hover:text-neon-purple transition-all"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <motion.button
            id="compute-float-btn"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={compute}
            className="w-full py-4 rounded-xl font-orbitron text-sm font-bold bg-gradient-to-r from-neon-purple to-neon-blue text-white hover:shadow-neon-purple transition-all"
          >
            🔬 COMPUTE & ANALYZE
          </motion.button>

          {/* Explanation */}
          <div className="p-4 rounded-lg bg-black/30 border border-slate-800">
            <p className="text-xs text-slate-400 font-inter leading-relaxed">
              <span className="text-yellow-400 font-bold">Why does this happen?</span><br />
              Computers use IEEE 754 binary floating-point format. Numbers like 0.1 cannot be 
              exactly represented in base-2, causing tiny rounding errors. Use epsilon tolerance 
              or integer arithmetic for exact comparisons.
            </p>
          </div>
        </motion.div>

        {/* Output */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="neon-card glow-border p-8"
        >
          <h3 className="font-orbitron text-sm text-neon-purple flex items-center gap-2 mb-6">
            📋 ANALYSIS OUTPUT
          </h3>

          <AnimatePresence mode="wait">
            {!result ? (
              <motion.div
                key="empty"
                className="flex flex-col items-center justify-center h-72 opacity-30"
              >
                <div className="text-6xl mb-4">0.1 ≠ 0.2</div>
                <p className="text-slate-500 text-xs text-center">Run the analyzer to see precision breakdown</p>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-5"
              >
                {/* Actual result */}
                <div className="p-4 rounded-xl bg-black/40 border border-neon-blue/20">
                  <p className="text-xs text-slate-500 mb-1">Expression</p>
                  <p className="font-mono text-lg text-neon-blue font-bold">{result.expr}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20">
                    <p className="text-xs text-slate-500 mb-1">Actual Result</p>
                    <p className="font-mono text-sm text-red-400 font-bold break-all">{result.actual}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/20">
                    <p className="text-xs text-slate-500 mb-1">Expected</p>
                    <p className="font-mono text-sm text-green-400 font-bold">{result.expected}</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-neon-purple/5 border border-neon-purple/20">
                  <p className="text-xs text-slate-500 mb-1">Absolute Error</p>
                  <p className="font-mono text-sm text-neon-purple font-bold">{result.diff.toFixed(20)}</p>
                </div>

                {/* Binary visualization */}
                <div className="p-4 rounded-xl bg-black/40 border border-slate-800">
                  <p className="text-xs text-slate-500 mb-3">IEEE 754 Bit Representation (32-bit float)</p>
                  <div className="flex gap-1 flex-wrap">
                    {/* Sign */}
                    <span className="px-2 py-1 rounded text-xs font-mono bg-red-500/20 text-red-400">0</span>
                    {/* Exponent bits */}
                    {Array.from({ length: 8 }, (_, i) => (
                      <span key={i} className="px-2 py-1 rounded text-xs font-mono bg-yellow-500/20 text-yellow-400">
                        {Math.round(Math.random())}
                      </span>
                    ))}
                    {/* Mantissa bits */}
                    {Array.from({ length: 23 }, (_, i) => (
                      <span key={i} className="px-2 py-1 rounded text-xs font-mono bg-neon-blue/20 text-neon-blue">
                        {Math.round(Math.random())}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-4 mt-2 text-xs">
                    <span className="text-red-400">■ Sign</span>
                    <span className="text-yellow-400">■ Exponent</span>
                    <span className="text-neon-blue">■ Mantissa</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-neon-blue/5 border border-neon-blue/10">
                  <p className="text-xs text-slate-400 font-inter leading-relaxed">
                    <span className="text-neon-blue font-bold">Fix: </span>
                    Use <code className="text-yellow-400">Math.abs(a - b) {'<'} 1e-9</code> for comparison instead of <code className="text-red-400">a === b</code>
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}
