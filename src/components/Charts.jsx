import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Bar, Line } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale, LinearScale, BarElement, LineElement, PointElement,
  Title, Tooltip, Legend, Filler
)

const chartOptions = (title) => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: { color: '#94a3b8', font: { family: 'JetBrains Mono', size: 11 } },
    },
    title: { display: false },
    tooltip: {
      backgroundColor: '#111827',
      borderColor: 'rgba(0,212,255,0.3)',
      borderWidth: 1,
      titleColor: '#00D4FF',
      bodyColor: '#94a3b8',
    },
  },
  scales: {
    x: {
      grid: { color: 'rgba(255,255,255,0.04)' },
      ticks: { color: '#475569', font: { family: 'JetBrains Mono', size: 10 } },
    },
    y: {
      grid: { color: 'rgba(255,255,255,0.04)' },
      ticks: { color: '#475569', font: { family: 'JetBrains Mono', size: 10 } },
    },
  },
})

export default function Charts({ simResults }) {
  const arraySizes = ['100', '1K', '10K', '100K', '500K', '1M']

  const barData = {
    labels: arraySizes,
    datasets: [
      {
        label: 'CPU Time (ms)',
        data: [0.08, 0.8, 8, 80, 400, 800],
        backgroundColor: 'rgba(248, 113, 113, 0.7)',
        borderColor: '#f87171',
        borderWidth: 1,
        borderRadius: 6,
      },
      {
        label: 'GPU Time (ms)',
        data: [0.01, 0.06, 0.6, 5, 24, 48],
        backgroundColor: 'rgba(0, 212, 255, 0.7)',
        borderColor: '#00D4FF',
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  }

  const errorData = {
    labels: ['1', '2', '3', '4', '5', '6', '7', '8'],
    datasets: [
      {
        label: 'Float32 Error',
        data: [0.0001, 0.00012, 0.00009, 0.00015, 0.00011, 0.00013, 0.0001, 0.00014],
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245,158,11,0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#f59e0b',
        pointRadius: 4,
      },
      {
        label: 'Float64 Error',
        data: [2e-10, 3e-10, 1.5e-10, 4e-10, 2.5e-10, 3.5e-10, 2e-10, 3e-10],
        borderColor: '#A855F7',
        backgroundColor: 'rgba(168,85,247,0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#A855F7',
        pointRadius: 4,
      },
    ],
  }

  const performanceTable = [
    { metric: 'Execution Time', cpu: 'High (sequential)', gpu: 'Low (parallel)' },
    { metric: 'Parallelism', cpu: 'Limited (4–64 cores)', gpu: 'Massive (1000s of cores)' },
    { metric: 'Throughput', cpu: 'Moderate', gpu: 'Very High' },
    { metric: 'Memory Bandwidth', cpu: '50–100 GB/s', gpu: '900+ GB/s (HBM3)' },
    { metric: 'Power Efficiency', cpu: 'Good for serial', gpu: 'Best for parallel' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 space-y-12">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <h2 className="font-orbitron text-xl md:text-2xl font-bold gradient-text mb-2">
          PERFORMANCE INSIGHTS
        </h2>
        <p className="text-slate-500 text-sm">CPU vs GPU benchmark charts</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bar Chart */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="neon-card glow-border p-6"
        >
          <h3 className="font-orbitron text-xs text-neon-blue mb-4">📊 EXECUTION TIME — CPU vs GPU</h3>
          <div style={{ height: 260 }}>
            <Bar data={barData} options={chartOptions('Execution Time')} />
          </div>
        </motion.div>

        {/* Line Chart */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="neon-card glow-border p-6"
        >
          <h3 className="font-orbitron text-xs text-neon-blue mb-4">📈 PRECISION ERROR OVER ITERATIONS</h3>
          <div style={{ height: 260 }}>
            <Line data={errorData} options={chartOptions('Error Chart')} />
          </div>
        </motion.div>
      </div>

      {/* Performance Table */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="neon-card glow-border p-8"
      >
        <h3 className="font-orbitron text-xs text-neon-blue mb-6">🔍 PERFORMANCE COMPARISON TABLE</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left py-3 px-4 text-xs text-slate-400 font-inter uppercase tracking-widest">Metric</th>
                <th className="text-left py-3 px-4 text-xs text-red-400 font-inter uppercase tracking-widest">CPU</th>
                <th className="text-left py-3 px-4 text-xs text-neon-blue font-inter uppercase tracking-widest">GPU</th>
              </tr>
            </thead>
            <tbody>
              {performanceTable.map((row, i) => (
                <motion.tr
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="border-b border-slate-800/50 hover:bg-neon-blue/5 transition-colors"
                >
                  <td className="py-3 px-4 text-slate-300 font-inter text-xs">{row.metric}</td>
                  <td className="py-3 px-4 text-red-400/80 font-mono text-xs">{row.cpu}</td>
                  <td className="py-3 px-4 text-neon-blue/80 font-mono text-xs">{row.gpu}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}
