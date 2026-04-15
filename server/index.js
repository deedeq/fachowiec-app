import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import fachowcyRouter from './routes/fachowcy.js'
import authRouter from './routes/auth.js'
import opinieRouter from './routes/opinie.js'
import zapisaniRouter from './routes/zapisani.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// ── Middleware ────────────────────────────────────────────────
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}))
app.use(express.json())

// ── Routes ────────────────────────────────────────────────────
app.use('/api/fachowcy',  fachowcyRouter)
app.use('/api/auth',      authRouter)
app.use('/api/opinie',    opinieRouter)
app.use('/api/zapisani',  zapisaniRouter)

// ── Health check ──────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() })
})

// ── 404 handler ───────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Endpoint nie znaleziony' })
})

// ── Global error handler ──────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err)
  res.status(500).json({ error: 'Wewnętrzny błąd serwera' })
})

// ── Start ─────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Fachowiec API running on http://localhost:${PORT}`)
})
