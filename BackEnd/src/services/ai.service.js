const { GoogleGenerativeAI } = require("@google/generative-ai")
const config = require("../config/env")
const logger = require("../utils/logger")

const genAI = new GoogleGenerativeAI(config.geminiKey)

const SYSTEM_INSTRUCTION = `
You are a senior software code reviewer with 7+ years of experience in JavaScript and Node.js development. Your expertise includes:

- Code Quality: Ensuring clean, maintainable, and well-structured code
- Best Practices: Suggesting industry-standard coding practices
- Efficiency & Performance: Identifying areas to optimize execution time and resource usage
- Error Detection: Spotting potential bugs, security risks, and logical flaws
- Scalability: Advising on how to make code adaptable for future growth
- Readability & Maintainability: Ensuring that the code is easy to understand and modify
- SOLID Principles: Applying object-oriented design principles
- DRY: Identifying code duplication
- Error Handling: Checking for proper try-catch and error propagation
- Input Validation: Verifying defensive programming practices
- Testing: Assessing test coverage and suggesting improvements
- Documentation: Recommending meaningful comments and docstrings
- Security: Detecting XSS, SQL injection, CSRF, and other vulnerabilities
- Performance: Identifying inefficiencies and bottlenecks
- Complexity: Simplifying overly complex code

Return your review in STRICT JSON format with the following structure:
{
  "summary": "Brief 1-2 sentence summary of the code quality",
  "score": <integer 1-10>,
  "issues": ["list of correctness issues and bugs"],
  "security": ["list of security vulnerabilities"],
  "performance": ["list of performance issues"],
  "maintainability": ["list of maintainability concerns"],
  "suggestions": ["list of actionable improvement suggestions"],
  "improvedCode": "refactored version of the code with improvements applied"
}

Do NOT fabricate test results or claim testing coverage that doesn't exist. Be honest and thorough in your analysis.
`

const model = genAI.getGenerativeModel({
  model: "gemini-3.8-flash",
  systemInstruction: SYSTEM_INSTRUCTION
})

const TIMEOUT_MS = 60000

async function generateReview(code) {
  if (!config.geminiKey) {
    throw new Error("GOOGLE_GEMINI_KEY not configured")
  }

  const prompt = `Please review the following JavaScript code and return your analysis in the structured JSON format specified in the system instruction:\n\n\`\`\`javascript\n${code}\n\`\`\``

  try {
    // Wrap with Promise.race for timeout since the SDK doesn't support timeout in request body
    const generateContentPromise = model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.3,
        responseMimeType: "application/json"
      }
    })

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timeout")), TIMEOUT_MS)
    )

    const result = await Promise.race([generateContentPromise, timeoutPromise])

    const responseText = result.response.text()

    // Parse the JSON response from Gemini
    const parsed = JSON.parse(responseText)

    // Validate the response structure
    if (!parsed.summary || !parsed.score) {
      throw new Error("Invalid response structure from AI")
    }

    // Ensure all arrays exist
    const review = {
      summary: parsed.summary || "No summary provided",
      score: parsed.score || 5,
      issues: Array.isArray(parsed.issues) ? parsed.issues : [],
      security: Array.isArray(parsed.security) ? parsed.security : [],
      performance: Array.isArray(parsed.performance) ? parsed.performance : [],
      maintainability: Array.isArray(parsed.maintainability) ? parsed.maintainability : [],
      suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : [],
      improvedCode: parsed.improvedCode || code
    }

    return {
      success: true,
      data: review
    }
  } catch (error) {
    logger.error(`AI Review error: ${error.message}`)

    if (error.message.includes("JSON")) {
      throw new Error("Failed to parse AI response")
    }

    if (error.name === "TimeoutError" || error.message.includes("timeout")) {
      throw Object.assign(new Error("AI service timeout"), { code: "AI_TIMEOUT" })
    }

    throw Object.assign(new Error("AI service error"), { code: "AI_API_ERROR" })
  }
}

module.exports = generateReview