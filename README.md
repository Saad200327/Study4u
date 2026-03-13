# Study4u

> Upload. Learn. Master.

An Apple-smooth, AI-powered study app that transforms your uploaded notes, PDFs, and images into interactive study materials.

## Features

- 📄 **AI Summaries** — Key concepts, definitions, and formulas extracted from your material
- 🃏 **Flashcards** — Flip-card interface with 20 cards per document
- ✏️ **Practice Q&A** — Open-ended questions with hidden answers
- 🧠 **Quiz Mode** — 20-question MCQ exam with instant grading

## Tech Stack

- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS** (Apple-like design system)
- **pdf-parse** — PDF text extraction
- **tesseract.js** — OCR for images
- **Any OpenAI-compatible LLM API** (Groq, Together AI, OpenAI, etc.)

## Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/Saad200327/Study4u.git
cd Study4u
npm install
```

### 2. Set up your free AI API key

**Recommended: Groq (100% free tier)**
1. Go to [console.groq.com](https://console.groq.com) and sign up
2. Create an API key
3. Copy `.env.local.example` to `.env.local`:
```bash
cp .env.local.example .env.local
```
4. Fill in your key:
```
AI_API_KEY=your_groq_api_key_here
MODEL_NAME=llama3-70b-8192
AI_BASE_URL=https://api.groq.com/openai/v1
```

### 3. Run
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

## Deploy to Vercel

1. Push this repo to GitHub (already done)
2. Go to [vercel.com](https://vercel.com), import the repo
3. Add environment variables in the Vercel dashboard:
   - `AI_API_KEY`
   - `MODEL_NAME`
   - `AI_BASE_URL`
4. Deploy — done!

## Environment Variables

| Variable | Description | Example |
|----------|-------------|--------|
| `AI_API_KEY` | Your LLM provider API key | `gsk_...` |
| `MODEL_NAME` | Model to use | `llama3-70b-8192` |
| `AI_BASE_URL` | Provider base URL | `https://api.groq.com/openai/v1` |

## License
MIT
