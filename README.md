# AI Code Review Application

A professional, industry-level AI-powered code review application that analyzes JavaScript/Node.js code using Google's Gemini AI. Provides detailed feedback on code quality assessment, security analysis, performance optimization suggestions, and maintainability improvements.

![AI Code Review Screenshot](https://via.placeholder.com/800x400/1a1a2e/e0e0e0?text=AI+Code+Review+Application)

## Features

- 🔍 **Comprehensive Code Analysis**: Correctness, security, performance, and maintainability
- 📊 **Structured Feedback**: Clear scoring system (1-10) with actionable suggestions
- 💡 **Improved Code Generation**: AI-generated refactored code with improvements applied
- ⚡ **Real-time Analysis**: Fast response times with loading states
- 🛡️ **Security Focused**: Detects vulnerabilities and security anti-patterns
- 🎨 **Professional UI**: Modern, dark-theme developer interface
- 📝 **Markdown Formatted Output**: Readable, well-structured review results
- 🔐 **Secure by Design**: API keys never exposed to frontend

## Architecture

```
Frontend (React/Vite)  ←→  Backend (Node.js/Express)  ←→  Google Gemini AI
```

### Backend
- Express.js REST API
- Google Gemini 3.8 Flash integration
- Request validation and sanitization
- Centralized error handling
- Security headers (Helmet)
- Environment-based configuration

### Frontend
- React 18 with Vite
- Custom code editor with syntax highlighting
- Structured review panel display
- Loading and error states
- Responsive design
- Custom hooks for API logic

## System Requirements

- Node.js >= 18.0.0
- npm >= 9.0.0
- Google Gemini API key

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/ai-code-review.git
cd ai-code-review
```

### 2. Backend Setup
```bash
# Install backend dependencies
cd BackEnd
npm install

# Create environment file (NEVER commit this)
cp .env.example .env
# Edit .env and add your GOOGLE_GEMINI_KEY
```

### 3. Frontend Setup
```bash
# Install frontend dependencies
cd ../Frontend
npm install

# Create environment file
cp .env.example .env
# VITE_API_URL defaults to http://localhost:3000 (adjust if needed)
```

### 4. Get Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create an API key
3. Copy the key to `BackEnd/.env` as `GOOGLE_GEMINI_KEY=your_key_here`

## Running the Application

### Development Mode
```bash
# Terminal 1: Start backend
cd BackEnd
npm run dev

# Terminal 2: Start frontend
cd ../Frontend
npm run dev
```

Then visit:
- Frontend: http://localhost:5173
- Backend Health: http://localhost:3000/health

### Production Build
```bash
# Build frontend
cd Frontend
npm run build

# Start backend (serves built frontend)
cd ../BackEnd
npm start
```

## API Documentation

For detailed API documentation, see [docs/api.md](docs/api.md)

## Project Structure

```
ai-code-review/
├── BackEnd/                     # Node.js/Express backend
│   ├── src/
│   │   ├── controllers/         # Request handlers
│   │   ├── routes/              # API route definitions
│   │   ├── services/            # Business logic (AI service)
│   │   ├── middleware/          # Custom middleware (validation, error)
│   │   ├── config/              # Environment configuration
│   │   ├── utils/               # Utilities (logger)
│   │   └── app.js               # Express app setup
│   ├── tests/                   # Jest tests
│   ├── server.js                # Entry point
│   ├── package.json
│   └── .env.example
│
├── Frontend/                    # React/Vite frontend
│   ├── src/
│   │   ├── components/          # UI components
│   │   ├── hooks/               # Custom React hooks
│   │   ├── services/            # API service layer
│   │   ├── utils/               # Constants and utilities
│   │   ├── App.jsx              # Main application
│   │   ├── App.css              # Component styles
│   │   └── index.css            # Global styles
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── .env.example
│
├── docs/                        # Documentation
│   ├── architecture.md          # System architecture
│   └── api.md                   # API reference
│
├── README.md                    # This file
└── .gitignore                   # Git ignore rules
```

## Environment Variables

### Backend (.env)
```
PORT=3000
GOOGLE_GEMINI_KEY=your_gemini_api_key_here
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:3000
```

⚠️ **Never commit `.env` files** - they contain sensitive information

## Usage

1. Launch the application using the development or production instructions above
2. Write or paste JavaScript/Node.js code into the code editor
3. Click the "Review Code" button
4. Wait for analysis to complete (typically 5-15 seconds)
5. Review the structured feedback in the results panel
6. Review the "Improved Code" section for AI-suggested refactoring
7. Apply suggested improvements to your code as needed

## Testing

### Backend Tests
```bash
cd BackEnd
npm test
```

### Frontend Linting
```bash
cd Frontend
npm run lint
```

### Frontend Build
```bash
cd Frontend
npm run build
```

## Customization

### Adjusting Analysis Depth
Modify the system instruction in `BackEnd/src/services/ai.service.js` to change:
- Analysis focus areas
- Scoring criteria
- Feedback verbosity
- Specific rules to check

### Changing AI Model
Update the model name in `BackEnd/src/services/ai.service.js`:
```javascript
const model = genAI.getGenerativeModel({
    model: "gemini-3.8-flash", // or other available model
    systemInstruction: SYSTEM_INSTRUCTION
});
```

### UI Theming
Modify CSS variables in:
- `Frontend/src/App.css`
- `Frontend/src/index.css`
- Individual component CSS files

## Security Considerations

- ✅ API keys stored only in backend environment
- ✅ No secrets exposed to frontend bundle
- ✅ Input validation and sanitization
- ✅ Request size limits (1MB)
- ✅ CORS restrictions
- ✅ Secure HTTP headers (Helmet)
- ✅ Generic error messages (no stack traces)
- ✅ Timeout protection for AI requests

## Troubleshooting

### Backend Not Starting
```
Error: Cannot find module '@google/generative-ai'
```
→ Run `npm install` in BackEnd directory

### Connection Refused
```
Failed to fetch http://localhost:3000/ai/get-review
```
→ Ensure backend is running (`npm run dev` in BackEnd)
→ Check that `VITE_API_URL` in Frontend/.env matches backend URL

### AI Service Errors
```
Unable to generate the review...
```
→ Verify `GOOGLE_GEMINI_KEY` is correctly set in BackEnd/.env
→ Check API key validity at Google AI Studio
→ Ensure internet connectivity to Gemini API

### Build Failures
```
Module not found: Error: Can't resolve 'react-simple-code-editor'
```
→ Run `npm install` in Frontend directory
→ Clear node_modules and reinstall if persistent

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add: amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Google Gemini AI](https://ai.google.dev/) for powerful code understanding
- [React](https://reactjs.org/) and [Vite](https://vitejs.dev/) for modern frontend tooling
- [Express.js](https://expressjs.com/) for robust backend framework
- [PrismJS](https://prismjs.com/) for syntax highlighting
- [react-simple-code-editor](https://www.npmjs.com/package/react-simple-code-editor) for code editor component

---

**Ready to improve your code quality?** Get started by adding your Gemini API key and running the application!

> **Note**: This application uses AI for code analysis. While striving for accuracy, always use professional judgment when implementing suggestions. The AI may occasionally produce incorrect suggestions or miss context-specific considerations.