const request = require('supertest')
const app = require('../src/app')

describe('POST /ai/get-review', () => {
  it('should return 400 for missing code', async () => {
    const response = await request(app)
      .post('/ai/get-review')
      .send({})

    expect(response.status).toBe(400)
    expect(response.body.success).toBe(false)
    expect(response.body.error.code).toBe('MISSING_CODE')
  })

  it('should return 400 for empty code', async () => {
    const response = await request(app)
      .post('/ai/get-review')
      .send({ code: '' })

    expect(response.status).toBe(400)
    expect(response.body.success).toBe(false)
    expect(response.body.error.code).toBe('EMPTY_CODE')
  })

  it('should return 400 for non-string code', async () => {
    const response = await request(app)
      .post('/ai/get-review')
      .send({ code: 123 })

    expect(response.status).toBe(400)
    expect(response.body.success).toBe(false)
    expect(response.body.error.code).toBe('INVALID_CODE_TYPE')
  })

  it('should return structured response for valid code', async () => {
    // We won't test the actual AI response as it requires a real API key
    // Just test that the endpoint responds and returns structured data when AI works
    const response = await request(app)
      .post('/ai/get-review')
      .send({ code: 'function test() { return true; }' })

    // The response might succeed or fail depending on API availability
    // Either way, it should be structured
    expect(response.body).toHaveProperty('success')
    if (response.body.success) {
      expect(response.body).toHaveProperty('data')
      expect(response.body.data).toHaveProperty('summary')
      expect(response.body.data).toHaveProperty('score')
      expect(Array.isArray(response.body.data.issues)).toBe(true)
      expect(Array.isArray(response.body.data.security)).toBe(true)
      expect(Array.isArray(response.body.data.performance)).toBe(true)
      expect(Array.isArray(response.body.data.maintainability)).toBe(true)
      expect(Array.isArray(response.body.data.suggestions)).toBe(true)
      expect(response.body.data).toHaveProperty('improvedCode')
    }
  })

  it('should handle large code with 400 error', async () => {
    const largeCode = 'a'.repeat(50001)
    const response = await request(app)
      .post('/ai/get-review')
      .send({ code: largeCode })

    expect(response.status).toBe(400)
    expect(response.body.success).toBe(false)
    expect(response.body.error.code).toBe('CODE_TOO_LARGE')
  })
})