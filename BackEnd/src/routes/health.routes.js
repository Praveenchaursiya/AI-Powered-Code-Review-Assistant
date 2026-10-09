const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.json({
    status: 'ok',
    service: 'ai-code-review-api'
  })
})

module.exports = router