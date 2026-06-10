import 'express-async-errors'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'

import { errorHandler, notFoundHandler } from './middlewares/error.middleware.js'
import authRoutes       from './routes/auth.routes.js'
import challengeRoutes  from './routes/challenge.routes.js'
import assessmentRoutes from './routes/submission.routes.js'
import profileRoutes    from './routes/profile.routes.js'

const app = express()

// ─── Security & Logging ───────────────────────────────────────────────────────
app.use(helmet())
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }))
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'powork-backend', timestamp: new Date().toISOString() })
})

// ─── API v1 Routes — theo Module Routing Table trong API Contracts ────────────
//   IAM Module:        /api/v1/auth
//   Challenge Module:  /api/v1/challenges
//   Assessment Module: /api/v1/assessment
//   Profile Module:    /api/v1/profiles
app.use('/api/v1/auth',        authRoutes)
app.use('/api/v1/challenges',  challengeRoutes)
app.use('/api/v1/assessment',  assessmentRoutes)
app.use('/api/v1/profiles',    profileRoutes)

// ─── Error Handling ───────────────────────────────────────────────────────────
app.use(notFoundHandler)
app.use(errorHandler)

export default app
