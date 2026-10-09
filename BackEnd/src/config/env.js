const dotenv = require('dotenv')

dotenv.config()

const config = {
  port: process.env.PORT || 3000,
  geminiKey: process.env.GOOGLE_GEMINI_KEY || ''
}

module.exports = config