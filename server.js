import express from "express";
import cors from "cors";
import * as math from "mathjs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(cors());
app.use(express.json());

/* ================================
   1. GPU / CPU SIMULATION
================================ */
app.post("/compute", (req, res) => {
  const { expression, size } = req.body;

  try {
    const A = Array.from({ length: size }, () => Math.random());
    const B = Array.from({ length: size }, () => Math.random());

    let C_cpu = new Array(size);

    // CPU (sequential)
    const cpuStart = Date.now();
    for (let i = 0; i < size; i++) {
      C_cpu[i] = eval(expression);
    }
    const cpuTime = Date.now() - cpuStart;

    // GPU (simulated parallel)
    const gpuStart = Date.now();
    const C_gpu = A.map((_, i) => eval(expression));
    const gpuTime = Date.now() - gpuStart;

    const speedup = cpuTime / (gpuTime || 1);

    let error = 0;
    for (let i = 0; i < size; i++) {
      error += Math.abs(C_cpu[i] - C_gpu[i]);
    }
    error /= size;

    res.json({
      cpuTime,
      gpuTime,
      speedup: +(speedup).toFixed(2),
      error: +(error * 100).toFixed(6),
      threads: Math.min(size, 4096),
      sample: C_gpu.slice(0, 5),
      utilization: +(85 + Math.random() * 12).toFixed(1)
    });

  } catch (err) {
    res.status(400).json({ error: "Invalid JS expression: " + err.message });
  }
});

/* ================================
   2. FLOATING POINT ANALYSIS
================================ */
app.post("/float", (req, res) => {
  const { expression } = req.body;

  try {
    // mathjs gives a precise rational result
    const result = math.evaluate(expression);
    // JS native eval gives the floated (imprecise) result
    let precise;
    try { precise = eval(expression); } catch { precise = result; }

    const error = Math.abs(result - precise);

    res.json({
      result: typeof result === "number" ? result : Number(result),
      precise: typeof precise === "number" ? precise : Number(precise),
      error,
      explanation:
        "Floating-point error occurs due to binary representation (IEEE 754). Numbers like 0.1 cannot be stored exactly in base-2."
    });

  } catch (err) {
    res.status(400).json({ error: "Invalid expression: " + err.message });
  }
});

/* ================================
   3. AI CONSOLE
================================ */
app.post("/ai", (req, res) => {
  const { query } = req.body;
  const q = query.toLowerCase();

  const KB = [
    { keys: ["what is gpu", "gpu is", "gpu?"], title: "What is a GPU?", answer: "A GPU (Graphics Processing Unit) is a specialized processor designed for massive parallel computation. Unlike a CPU with 4–32 cores, a modern GPU like NVIDIA's A100 has 6,912 CUDA cores executing simultaneously. GPUs are the backbone of AI, simulations, and HPC." },
    { keys: ["cpu vs gpu", "difference cpu", "cpu gpu"], title: "CPU vs GPU Architecture", answer: "CPU: 4–64 powerful cores, optimized for sequential tasks, large cache, high clock. GPU: Thousands of smaller cores (CUDA/OpenCL), optimized for parallel tasks, high memory bandwidth. Rule of thumb: CPU = expert workers; GPU = thousands of distributed workers." },
    { keys: ["speedup", "faster", "performance"], title: "Speedup Formula", answer: "Speedup = CPU Execution Time / GPU Execution Time. By Amdahl's Law, maximum speedup is limited by the sequential fraction. If 5% is sequential → max speedup = 20×. Real GPU speedups: 10× to 100× for parallel workloads." },
    { keys: ["precision", "float", "rounding", "ieee"], title: "Floating-Point Precision", answer: "IEEE 754 defines float (32-bit) and double (64-bit) formats. Decimals like 0.1 cannot be stored exactly in binary, causing rounding errors. Float: ~7 sig digits. Double: ~15-16 sig digits. Fix: use Math.abs(a - b) < epsilon instead of a === b." },
    { keys: ["cuda"], title: "CUDA Programming Model", answer: "CUDA (Compute Unified Device Architecture) by NVIDIA lets you write C/C++ kernels that run on GPU cores. Hierarchy: Thread → Warp (32 threads) → Block → Grid. Host code runs on CPU; device (kernel) code runs on GPU." },
    { keys: ["opencl"], title: "OpenCL Overview", answer: "OpenCL is a cross-platform parallel computing framework that works on CPUs, GPUs, FPGAs from any vendor. Programs (kernels) compile at runtime for the target device. More portable than CUDA but more verbose." },
    { keys: ["amat", "memory access", "cache"], title: "AMAT Formula", answer: "AMAT = Hit Time + Miss Rate × Miss Penalty. It measures memory hierarchy efficiency. Optimize: minimize global memory access and maximize shared memory reuse on GPU SMs." },
    { keys: ["thread", "warp", "parallel"], title: "GPU Threading Model", answer: "GPU threads are grouped into warps of 32. All threads in a warp execute the same instruction (SIMT model). Blocks contain many warps; grids contain many blocks. Maximize occupancy by tuning block size and register usage." },
  ];

  const match = KB.find(entry => entry.keys.some(k => q.includes(k)));
  const result = match || { title: "GPU Computing AI", answer: `I received your query: "${query}". Try asking about: GPU, CPU vs GPU, CUDA, OpenCL, speedup, precision, AMAT, or threads.` };

  res.json({ answer: result.answer, title: result.title });
});

const isProd = process.env.NODE_ENV === "production";

if (isProd) {
  app.use(express.static(path.join(__dirname, "dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
  });
}

const PORT = process.env.PORT || (isProd ? 5000 : 3001);
const HOST = isProd ? "0.0.0.0" : "127.0.0.1";
app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running on ${HOST}:${PORT}`);
});
