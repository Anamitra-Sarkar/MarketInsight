# Market Insight

An AI-powered stock market analysis platform that provides comprehensive financial data and intelligent insights through a conversational interface.

## Overview

Market Insight leverages advanced AI agents to deliver real-time stock market information, financial analysis, and investment insights. The platform combines the power of LangChain and OpenAI's language models with Yahoo Finance data to create an intelligent assistant for stock market research.

## Features

### 🤖 AI-Powered Analysis
- Real-time stock market insights
- Comprehensive financial data analysis
- Conversational interface for natural interactions

### 🔐 User Authentication (New!)
- **Email/Password Login**: Secure account creation and authentication
- **Google Sign-In**: One-click authentication with Google account
- **Optional Login**: Full app functionality available without authentication
- **Chat History**: Automatic saving of conversations for logged-in users

### 💬 Chat History
- Conversations automatically saved to cloud
- Access past chats from sidebar
- Chronological organization (newest first)
- Works across devices when logged in

## Technology Stack

**Backend:**
- FastAPI for high-performance API endpoints
- LangChain & LangGraph for AI agent orchestration
- OpenAI GPT models for intelligent responses
- YFinance for financial data retrieval
- Langfuse for observability and tracing

**Frontend:**
- Modern React with TypeScript
- Firebase Authentication & Firestore
- Real-time streaming responses
- Responsive design for all devices
- Dark mode optimized UI

## Getting Started

### Prerequisites
- Python 3.x
- Node.js (for frontend)
- OpenAI API key
- Firebase account (for authentication features)

### Installation

1. Clone the repository
2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Set up environment variables in `.env` file
4. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```
5. **(Optional) Set up Firebase Authentication:**
   - Follow the [Firebase Setup Guide](./FIREBASE_SETUP.md)
   - Configure environment variables in `frontend/.env.local`
   - The app works without Firebase, but authentication features require it

6. Run the backend server:
   ```bash
   python main.py
   ```
7. Run the frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```
8. Access the API at `http://localhost:8000` and frontend at `http://localhost:5173`

## Project Structure

```
MarketInsight/
├── components/     # AI agent configuration
├── utils/          # Tools and utilities
├── config/         # Configuration files
├── frontend/       # React frontend application
└── main.py         # FastAPI server entry point
```

## API Capabilities

The platform provides 16 specialized tools for comprehensive stock analysis:
- Stock price tracking
- Historical data analysis
- Financial statements (Balance Sheet, Income Statement, Cash Flow)
- Company information and ratios
- Dividend and split history
- Ownership and holder data
- Insider transactions
- Analyst recommendations
- Company ticker lookup

## Documentation

- [Firebase Setup Guide](./FIREBASE_SETUP.md) - Complete guide for setting up authentication
- [Implementation Details](./IMPLEMENTATION.md) - Technical documentation of the authentication system

## Security & Privacy

- User authentication is optional - the app functions fully without login
- Firebase Authentication for secure user management
- Chat history is private and user-specific
- All data is encrypted in transit and at rest
- No sensitive data stored client-side
- Environment variables for secure configuration

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.