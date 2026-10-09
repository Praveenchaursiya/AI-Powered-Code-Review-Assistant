# AI Code Review API Documentation

## Base URL

```
Development: http://localhost:3000
Production:  https://your-domain.com
```

## Endpoints

### Health Check

#### GET /health

Check if the API service is running.

**Response**: 200 OK
```json
{
  "status": "ok",
  "service": "ai-code-review-api"
}
```

---

### Code Review

#### POST /ai/get-review

Submit code for AI-powered review analysis.

**Request Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "code": "function sum(a, b) { return a + b; }"
}
```

**Request Parameters**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| code  | string | Yes | JavaScript code to review. Max 50,000 characters. |

**Validation Rules**:
- `code` must be present in request body
- `code` must be a string
- `code` must not be empty (after trim)
- `code` must not exceed 50,000 characters

**Response**: 200 OK
```json
{
  "success": true,
  "data": {
    "summary": "Brief summary of the code quality assessment",
    "score": 8,
    "issues": [
      "List of correctness issues and bugs found"
    ],
    "security": [
      "List of security vulnerabilities detected"
    ],
    "performance": [
      "List of performance optimization opportunities"
    ],
    "maintainability": [
      "List of maintainability concerns"
    ],
    "suggestions": [
      "List of actionable improvement suggestions"
    ],
    "improvedCode": "Refactored version of the submitted code with improvements applied"
  }
}
```

**Response Fields**:
| Field | Type | Description |
|-------|------|-------------|
| success | boolean | Always true for successful responses |
| data | object | Review result object |
| data.summary | string | 1-2 sentence summary of code quality |
| data.score | integer | Overall quality score (1-10) |
| data.issues | array | Correctness issues and bugs |
| data.security | array | Security vulnerabilities |
| data.performance | array | Performance issues |
| data.maintainability | array | Maintainability concerns |
| data.suggestions | array | Actionable suggestions |
| data.improvedCode | string | Refactored code with improvements |

**Error Responses**:

| Status | Error Code | Message | Description |
|--------|------------|---------|-------------|
| 400 | MISSING_CODE | The code field is required | `code` field not provided in request |
| 400 | INVALID_CODE_TYPE | The code field must be a string | `code` is not a string type |
| 400 | EMPTY_CODE | The code field must not be empty | `code` is empty or whitespace only |
| 400 | CODE_TOO_LARGE | Code must not exceed 50000 characters | `code` exceeds maximum length |
| 400 | MALFORMED_JSON | Invalid JSON in request body | Request body is not valid JSON |
| 413 | REQUEST_TOO_LARGE | Request body too large | Payload exceeds 1MB limit |
| 502 | AI_SERVICE_ERROR | Unable to generate the review... | Gemini API failure or misconfiguration |
| 504 | AI_TIMEOUT | The AI review service timed out | AI request exceeded 60 second timeout |
| 500 | INTERNAL_ERROR | An internal error occurred | Unexpected server error |

---

## HTTP Status Codes

| Code | Name | Description |
|------|------|-------------|
| 200 | OK | Successful response |
| 400 | Bad Request | Invalid request format or validation failure |
| 404 | Not Found | Endpoint does not exist |
| 413 | Payload Too Large | Request body exceeds size limit |
| 502 | Bad Gateway | AI service error |
| 504 | Gateway Timeout | AI service timeout |
| 500 | Internal Server Error | Unexpected server error |

---

## Rate Limiting

Currently no rate limiting is implemented. Consider adding rate limiting in production:
- 60 requests/minute per IP
- Burst allowance for authenticated users

---

## Authentication

No authentication currently implemented. For production deployment:
- Add API key authentication
- Implement JWT-based user sessions
- Add role-based access control

---

## CORS Policy

The API accepts requests from:
- `http://localhost:5173` (Vite development server)
- Configured `FRONTEND_URL` environment variable

Headers allowed: `Content-Type`
Methods allowed: `GET`, `POST`

---

## Example Usage

### cURL
```bash
curl -X POST http://localhost:3000/ai/get-review \
  -H "Content-Type: application/json" \
  -d '{
    "code": "function sum(a,b){ return a+b; }"
  }'
```

### JavaScript (Frontend)
```javascript
const response = await fetch('http://localhost:3000/ai/get-review', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ code: 'function test() { return true; }' })
});

const data = await response.json();
console.log(data.data.summary); // "The function is simple but lacks..."
console.log(data.data.score); // 8
```

### Python
```python
import requests

response = requests.post(
    'http://localhost:3000/ai/get-review',
    json={'code': 'function add(a,b) { return a+b; }'}
)

result = response.json()
print(f"Score: {result['data']['score']}/10")
print(f"Summary: {result['data']['summary']}")
```

---

## Error Handling Guide

### Client-Side Validation
```javascript
// Validate before sending
if (!code || code.trim().length === 0) {
  showError('Please enter some code to review');
  return;
}

if (code.length > 50000) {
  showError('Code exceeds maximum length of 50,000 characters');
  return;
}
```

### Server Response Handling
```javascript
try {
  const response = await api.post('/ai/get-review', { code });
  if (response.data.success) {
    displayReview(response.data.data);
  } else {
    showError(response.data.error.message);
  }
} catch (error) {
  if (error.response) {
    // Server responded with error status
    showError(error.response.data.error.message);
  } else if (error.request) {
    // Network error
    showError('Unable to connect to server. Is the backend running?');
  } else {
    // Other error
    showError('An unexpected error occurred');
  }
}
```

---

## Testing the API

### Health Check
```bash
curl http://localhost:3000/health
```

### Valid Review Request
```bash
curl -X POST http://localhost:3000/ai/get-review \
  -H "Content-Type: application/json" \
  -d '{"code": "function add(a,b) { return a+b; }"}'
```

### Invalid Requests (should return 400)
```bash
# Missing code
curl -X POST http://localhost:3000/ai/get-review \
  -H "Content-Type: application/json" \
  -d '{}'

# Empty code
curl -X POST http://localhost:3000/ai/get-review \
  -H "Content-Type: application/json" \
  -d '{"code": ""}'

# Non-string code
curl -X POST http://localhost:3000/ai/get-review \
  -H "Content-Type: application/json" \
  -d '{"code": 123}'
```

---

## Configuration

### Environment Variables (Backend)
| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| PORT | No | 3000 | Server port |
| GOOGLE_GEMINI_KEY | Yes | - | Google Gemini API key |
| FRONTEND_URL | No | http://localhost:5173 | CORS allowed origin |

### Environment Variables (Frontend)
| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| VITE_API_URL | No | http://localhost:3000 | Backend API base URL |