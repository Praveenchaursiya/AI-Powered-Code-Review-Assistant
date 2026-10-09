const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const path = require('path')
const healthRoutes = require('./routes/health.routes')
const aiRoutes = require('./routes/ai.routes')
const errorMiddleware = require('./middleware/error.middleware')
const logger = require('./utils/logger')

const app = express()

// Security headers
app.use(helmet())

// Restrict CORS to frontend only
app.use(cors({
  origin: process.env.FRONTEND_URL || true,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}))

// Request size limits
app.use(express.json({ limit: '1mb' }))

// Health check
app.use('/health', healthRoutes)

// AI review routes
app.use('/ai', aiRoutes)

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'AI Code Review API',
    version: '1.0.0',
    status: 'running'
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Endpoint not found'
    }
  })
})

// Centralized error handler (must be last)
app.use(errorMiddleware)

module.exports = app