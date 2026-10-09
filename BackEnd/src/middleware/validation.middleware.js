const logger = require('../utils/logger')

const MAX_CODE_LENGTH = 50000

const validateReviewRequest = (req, res, next) => {
  try {
    const { code } = req.body

    if (code === undefined || code === null) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_CODE',
          message: 'The code field is required'
        }
      })
    }

    if (typeof code !== 'string') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_CODE_TYPE',
          message: 'The code field must be a string'
        }
      })
    }

    if (code.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'EMPTY_CODE',
          message: 'The code field must not be empty'
        }
      })
    }

    if (code.length > MAX_CODE_LENGTH) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'CODE_TOO_LARGE',
          message: `Code must not exceed ${MAX_CODE_LENGTH} characters`
        }
      })
    }

    next()
  } catch (error) {
    logger.error(`Validation error: ${error.message}`)
    res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request format'
      }
    })
  }
}

module.exports = { validateReviewRequest }