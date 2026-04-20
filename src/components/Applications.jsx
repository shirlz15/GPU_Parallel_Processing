import { motion } from 'framer-motion'

const apps = [
  { icon: '🤖', title: 'AI / Machine Learning', desc: 'Training neural networks with matrix operations on GPU cores', color: 'neon-blue' },
  { icon: '🏥', title: 'Medical Imaging', desc: 'CT/MRI reconstruction and real-time diagnostic image processing', color: 'neon-purple' },
  { icon: '🔭', title: 'Scientific Simulation', desc: 'Weather modeling, molecular dynamics, CFD simulations at scale', color: 'cyan' },
  { icon: '💹', title: 'Finance Modeling', desc: 'Monte Carlo pricing, risk analysis, high-frequency trading algorithms', color: 'yellow' },
  { icon: '🎮', title: 'Gaming & Graphics', desc: 'Real-time ray tracing, physics simulation, 4K rendering pipelines', color: 'green' },
  { icon: '🚀', title: 'Space & Aerospace', desc: 'Orbital mechanics, satellite image processing, trajectory optimization', color: 'orange' },
]

export default function Applications() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="font-orbitron text-xl md:text-2xl font-bold gradient-text mb-2">
          REAL-WORLD APPLICATIONS
        </h2>
        <p className="text-slate-500 text-sm">Where GPU computing changes the world</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {apps.map((app, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="neon-card glow-border p-6 group cursor-default"
          >
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
              {app.icon}
            </div>
            <h3 className="font-orbitron text-sm font-bold text-slate-100 mb-2">{app.title}</h3>
            <p className="text-xs text-slate-500 font-inter leading-relaxed">{app.desc}</p>
            <div className="mt-4 h-0.5 bg-gradient-to-r from-neon-blue/20 to-transparent rounded-full group-hover:from-neon-blue/60 transition-all duration-500" />
          </motion.div>
        ))}
      </div>
    </div>
  )
}
