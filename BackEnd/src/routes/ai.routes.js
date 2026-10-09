const express = require('express')
const aiController = require("../controllers/ai.controller")
const { validateReviewRequest } = require("../middleware/validation.middleware")

const router = express.Router()

router.post("/get-review", validateReviewRequest, aiController.getReview)

module.exports = router