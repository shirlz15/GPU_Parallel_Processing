import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

/* -------------------------------
   GPU SIMULATION ENGINE
--------------------------------*/
app.post("/compute", (req, res) => {
    const { expression, size } = req.body;

    try {
        // Generate arrays
        const A = Array.from({ length: size }, () => Math.random());
        const B = Array.from({ length: size }, () => Math.random());

        let C_cpu = new Array(size);
        let C_gpu = new Array(size);

        /* ---------- CPU (Sequential) ---------- */
        const cpuStart = Date.now();

        for (let i = 0; i < size; i++) {
            C_cpu[i] = eval(expression); 
        }

        const cpuTime = Date.now() - cpuStart;

        /* ---------- GPU (Simulated Parallel) ---------- */
        const gpuStart = Date.now();

        // Simulate parallel using map (faster)
        C_gpu = A.map((_, i) => eval(expression));

        const gpuTime = Date.now() - gpuStart;

        /* ---------- METRICS ---------- */
        const speedup = cpuTime / (gpuTime || 1);

        // Floating-point error
        let error = 0;
        for (let i = 0; i < size; i++) {
            error += Math.abs(C_cpu[i] - C_gpu[i]);
        }
        error /= size;

        res.json({
            cpuTime,
            gpuTime,
            speedup: +(speedup).toFixed(2),
            error: +(error * 100).toFixed(6), // as percentage
            sample: C_gpu.slice(0, 5),
            threads: Math.min(size, 4096),
            utilization: +(85 + Math.random() * 12).toFixed(1) // match frontend mock structure
        });

    } catch (err) {
        res.status(400).json({ error: "Invalid JS expression" });
    }
});

/* -------------------------------*/
app.listen(5000, () => {
    console.log("🚀 Backend running on port 5000");
});
