# AI Code Review Application Architecture

## Overview

This document describes the architecture of the AI Code Review application, a professional tool for analyzing JavaScript/Node.js code using Google's Gemini AI. The application follows a client-server architecture with React/Vite frontend and Node.js/Express backend.

## System Components

### Frontend (React + Vite)
- **Framework**: React 18 with Vite build tool
- **State Management**: React hooks (useState, useCallback, custom hooks)
- **Styling**: CSS3 with modern variables and responsive design
- **Code Editor**: react-simple-code-editor with PrismJS syntax highlighting
- **HTTP Client**: Axios for API communication
- **Markdown Rendering**: react-markdown with rehype-highlight for formatted output

### Backend (Node.js + Express)
- **Runtime**: Node.js with Express web framework
- **AI Integration**: Google Gemini API (@google/generative-ai)
- **Security**: Helmet.js for HTTP headers, CORS configuration
- **Validation**: Custom request validation middleware
- **Error Handling**: Centralized error middleware
- **Configuration**: Environment-based configuration with dotenv
- **Logging**: Custom logger utility

### AI Service Layer
- **Model**: Gemini 2.0 Flash
- **System Instruction**: Senior code reviewer persona with expertise in:
  - Code quality and best practices
  - Security vulnerability detection
  - Performance optimization
  - Maintainability improvements
  - SOLID principles and DRY
  - Error handling and testing practices
- **Response Format**: Structured JSON with consistent schema
- **Timeout Handling**: Configurable timeouts for AI requests

## Data Flow

1. **User Interaction**:
   - User writes/pastes code in the editor
   - User clicks "Review Code" button
   - Frontend validates input and shows loading state

2. **Request Processing**:
   - Frontend sends POST request to `/ai/get-review` with code payload
   - Backend receives request and validates it
   - Validation middleware checks for required fields, type, size limits
   - Request forwarded to AI controller

3. **AI Analysis**:
   - Controller calls AI service with validated code
   - AI service constructs prompt with system instruction
   - Gemini model analyzes code and returns structured JSON response
   - Service parses and validates AI response
   - Service returns structured response to controller

4. **Response Handling**:
   - Controller sends JSON response to frontend
   - Frontend updates review panel with results
   - Loading state removed, error states handled appropriately
   - Review panel displays structured feedback

## Security Considerations

- **API Key Protection**: Gemini API key stored only in backend environment variables
- **Input Validation**: All inputs validated for type, size, and content
- **CORS Policy**: Restricted to frontend origin only
- **Request Limits**: JSON payload size limited to 1MB
- **Headers**: Helmet.js provides secure HTTP headers
- **Error Responses**: Generic error messages prevent information leakage
- **No Secrets in Frontend**: Zero API keys or secrets exposed to client

## Scalability and Performance

- **Stateless Backend**: Horizontal scaling possible with load balancer
- **Efficient AI Calls**: Temperature set to 0.3 for consistent results
- **Response Caching**: Opportunity for caching frequent code patterns
- **Async Processing**: Non-blocking I/O throughout the stack
- **Resource Limits**: Request size and timeouts prevent abuse

## Technology Stack

### Frontend
- React 18
- Vite 6
- Axios
- PrismJS
- react-simple-code-editor
- react-markdown
- rehype-highlight

### Backend
- Node.js
- Express.js
- Google Generative AI SDK
- dotenv
- helmet
- cors
- Jest (testing)
- Supertest (API testing)

### Development Tools
- ESLint
- npm scripts
- Environment variable management

## Deployment Considerations

1. **Environment Variables**:
   - Backend: PORT, GOOGLE_GEMINI_KEY
   - Frontend: VITE_API_URL

2. **Production Build**:
   - Frontend: `npm run build` produces static assets
   - Backend: Node.js server serves API endpoints

3. **Reverse Proxy**:
   - Recommended: Nginx for SSL termination and static file serving
   - Alternative: Deploy frontend and backend on same domain

4. **Monitoring**:
   - Health check endpoint: GET /health
   - Logging: Console-based with timestamped levels
   - Error tracking: Centralized error handling

## Future Enhancements

- Support for additional programming languages
- Authentication and user profiles
- Review history and tracking
- Integration with GitHub/GitLab
- Customizable review rules
- Team collaboration features
- Export reviews as PDF/HTML
- IDE plugin integration

## Diagrams

### Component Relationship

```
Frontend                          Backend
┌─────────────┐    HTTP/API    ┌──────────────┐
│   Header    │◄──────────────►│ Health Endpoint│
└─────────────┘                └──────────────┘
┌─────────────┐                              
│ Code Editor │◄──────────────►│ Validation   │
└─────────────┘                │ Middleware   │
┌─────────────┐                └──────────────┘
│  ReviewBtn  │◄──────────────►│   Routes     │
└─────────────┘                │ (health, ai) │
                               └──────────────┘
                               │ AI Controller│
                               └──────────────┘
                               │  AI Service  │
                               └──────────────┘
                               │ Gemini API   │
                               └──────────────┘
```

### Data Flow

```
User Action → Frontend Validation → HTTP Request → 
Backend Validation → AI Controller → AI Service → 
Gemini AI → Structured Response → Controller → 
HTTP Response → Frontend State Update → UI Render
```