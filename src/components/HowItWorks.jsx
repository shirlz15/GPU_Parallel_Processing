import { motion } from 'framer-motion'

const steps = [
  { icon: '🖥️', label: 'CPU sends data to GPU', desc: 'Host transfers arrays via PCIe bus to device memory' },
  { icon: '✂️', label: 'GPU splits tasks into threads', desc: 'Scheduler partitions workload into blocks and warps' },
  { icon: '⚡', label: 'Thousands of cores compute', desc: 'CUDA cores execute identical operations in parallel (SIMT)' },
  { icon: '🔢', label: 'Floating-point units process', desc: 'FP32/FP64 units handle arithmetic with IEEE 754 precision' },
  { icon: '📤', label: 'Output returns to CPU', desc: 'Results copied back from GPU global memory to host RAM' },
]

export default function HowItWorks() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="font-orbitron text-xl md:text-2xl font-bold gradient-text mb-2">
          HOW IT WORKS
        </h2>
        <p className="text-slate-500 text-sm">Simplified GPU execution pipeline</p>
      </motion.div>

      <div className="relative">
        {/* Connector line */}
        <div className="hidden md:block absolute top-10 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-blue/30 to-transparent" />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative flex flex-col items-center text-center"
            >
              {/* Step number bubble */}
              <div className="relative mb-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 border border-neon-blue/30 flex items-center justify-center text-2xl hover:scale-110 transition-transform duration-300">
                  {step.icon}
                </div>
                <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-neon-blue flex items-center justify-center text-[10px] font-orbitron font-bold text-gpu-dark">
                  {i + 1}
                </div>
              </div>
              <h4 className="font-orbitron text-xs text-slate-200 mb-2 leading-tight">{step.label}</h4>
              <p className="text-xs text-slate-500 font-inter leading-relaxed">{step.desc}</p>
              
              {/* Arrow */}
              {i < steps.length - 1 && (
                <div className="md:hidden text-neon-blue/30 text-2xl mt-4">↓</div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
