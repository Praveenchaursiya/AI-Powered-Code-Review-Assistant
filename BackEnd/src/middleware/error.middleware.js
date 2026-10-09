const logger = require('../utils/logger')

const errorMiddleware = (err, req, res, next) => {
  // Log the error for debugging (server-side only)
  logger.error(`API Error: ${err.message}`)
  logger.error(`Stack: ${err.stack}`)

  // Malformed JSON body
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      success: false,
      error: {
        code: 'MALFORMED_JSON',
        message: 'Invalid JSON in request body'
      }
    })
  }

  // Request body too large
  if (err.type === 'entity.too.large') {
    return res.status(413).json({
      success: false,
      error: {
        code: 'REQUEST_TOO_LARGE',
        message: 'Request body too large'
      }
    })
  }

  // AI Service specific errors
  if (err.code === 'AI_API_ERROR') {
    return res.status(502).json({
      success: false,
      error: {
        code: 'AI_SERVICE_ERROR',
        message: 'Unable to generate the review. Please check that the backend server and Gemini API configuration are available.'
      }
    })
  }

  // Timeout errors
  if (err.code === 'AI_TIMEOUT' || err.name === 'TimeoutError') {
    return res.status(504).json({
      success: false,
      error: {
        code: 'AI_TIMEOUT',
        message: 'The AI review service timed out. Please try again.'
      }
    })
  }

  // Default error response (don't expose internal details)
  const status = err.statusCode || err.status || 500
  const message = err.message || 'An unexpected error occurred'

  return res.status(status).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An internal error occurred. Please try again later.'
    }
  })
}

module.exports = errorMiddleware