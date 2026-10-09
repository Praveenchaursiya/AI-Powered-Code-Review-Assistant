const aiService = require("../services/ai.service")
const logger = require("../utils/logger")

const getReview = async (req, res, next) => {
  try {
    const { code } = req.body

    const review = await aiService(code)

    res.json(review)
  } catch (error) {
    logger.error(`Controller error: ${error.message}`)
    next(error)
  }
}

module.exports = { getReview }