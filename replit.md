# GPU Visualizer

GPU Parallel Programming & Floating-Point Computation Visualizer.

## Stack
- Frontend: React 18 + Vite 5 + TailwindCSS, Chart.js, Framer Motion
- Backend: Express 5 + mathjs
- Package manager: npm

## Layout
- `index.html`, `src/` — Vite React app
- `server.js` — Express API (`/compute`, `/float`, `/ai`)
- `vite.config.js` — Vite dev server (port 5000, host 0.0.0.0, allowedHosts: true) with proxy to backend on port 3001

## Replit setup
- Workflow `Start application`: `npm run dev` on port 5000 (webview)
- Workflow `Backend`: `node server.js` on 127.0.0.1:3001 (console)
- Frontend uses relative URLs (`/compute`, `/float`, `/ai`); Vite proxies them to the backend.

## Deployment
- Target: autoscale
- Build: `npm run build`
- Run: `NODE_ENV=production node server.js` — Express serves the built `dist/` and the API on `0.0.0.0:5000`.
