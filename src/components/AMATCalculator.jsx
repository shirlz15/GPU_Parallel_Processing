import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function AMATCalculator({ addLog }) {
  const [hitTime, setHitTime] = useState(1)
  const [missRate, setMissRate] = useState(0.05)
  const [missPenalty, setMissPenalty] = useState(100)
  const [amat, setAmat] = useState(0)

  useEffect(() => {
    const result = +( hitTime + missRate * missPenalty ).toFixed(4)
    setAmat(result)
  }, [hitTime, missRate, missPenalty])

  const log = () => addLog(`AMAT = ${hitTime} + ${missRate} × ${missPenalty} = ${amat} cycles`)

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="font-orbitron text-xl md:text-2xl font-bold gradient-text mb-2">
          AMAT CALCULATOR
        </h2>
        <p className="text-slate-500 text-sm">Average Memory Access Time — live interactive formula</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto neon-card glow-border p-8"
      >
        {/* Formula Display */}
        <div className="text-center mb-10 p-6 rounded-xl bg-black/40 border border-neon-blue/15">
          <p className="text-xs text-slate-500 uppercase tracking-widest mb-3 font-mono">Formula</p>
          <p className="font-orbitron text-base md:text-xl text-slate-200">
            AMAT = <span className="text-neon-blue">Hit_Time</span> + <span className="text-yellow-400">Miss_Rate</span> × <span className="text-neon-purple">Miss_Penalty</span>
          </p>
          <div className="mt-4 font-orbitron text-2xl md:text-4xl font-black">
            <span className="gradient-text">{amat}</span>
            <span className="text-slate-500 text-base ml-2">cycles</span>
          </div>
          <p className="text-xs text-slate-600 mt-2 font-mono">
            = {hitTime} + {missRate} × {missPenalty}
          </p>
        </div>

        {/* Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-xs text-neon-blue font-orbitron uppercase">Hit Time</label>
              <span className="text-sm font-mono text-neon-blue font-bold">{hitTime} cy</span>
            </div>
            <input
              type="range" id="hit-time-slider"
              min="1" max="20" step="0.5"
              value={hitTime}
              onChange={e => { setHitTime(+e.target.value); log() }}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-slate-600 mt-1">
              <span>1</span><span>20</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-xs text-yellow-400 font-orbitron uppercase">Miss Rate</label>
              <span className="text-sm font-mono text-yellow-400 font-bold">{(missRate * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range" id="miss-rate-slider"
              min="0.01" max="0.5" step="0.01"
              value={missRate}
              onChange={e => { setMissRate(+e.target.value); log() }}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-slate-600 mt-1">
              <span>1%</span><span>50%</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-xs text-neon-purple font-orbitron uppercase">Miss Penalty</label>
              <span className="text-sm font-mono text-neon-purple font-bold">{missPenalty} cy</span>
            </div>
            <input
              type="range" id="miss-penalty-slider"
              min="10" max="500" step="10"
              value={missPenalty}
              onChange={e => { setMissPenalty(+e.target.value); log() }}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-slate-600 mt-1">
              <span>10</span><span>500</span>
            </div>
          </div>
        </div>

        {/* Interpretation */}
        <div className="mt-8 p-4 rounded-xl bg-black/30 border border-slate-800">
          <p className="text-xs text-slate-400 font-inter leading-relaxed">
            <span className="text-neon-blue font-bold">Interpretation: </span>
            {amat < 5 ? '✅ Excellent cache performance. Most accesses hit L1/L2.' :
             amat < 20 ? '⚠️ Average performance. Consider increasing cache utilization.' :
             '❌ Poor performance. High miss rate or large penalty — optimize memory access patterns.'}
          </p>
        </div>
      </motion.div>
    </div>
  )
}
