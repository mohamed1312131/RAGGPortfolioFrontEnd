# Mohamed's AI Portfolio Assistant (Frontend)

Welcome! This is the repository for the Next.js frontend that powers my interactive AI portfolio assistant.

[ > Try the Live Demo Here < ]

(Please add a screenshot of your chatbot UI here!)
![Screenshot of the chatbot UI](./chatbot-demo.png)

---

## Why an AI Assistant?

A static PDF resume is one-dimensional. A recruiter (like you!) might have specific, nuanced questions that aren't explicitly answered.

This project solves that. I built a Retrieval-Augmented Generation (RAG) system that indexes my entire professional life—my work experience, personal projects, technical skills, and even my engineering philosophy. This frontend provides a clean, fast, and intuitive chat interface for you to query that system. You get answers grounded only in my personal data, complete with token tracking to manage costs.

---

## What to Ask

Try asking any of these. The AI is trained on all my portfolio data.

- "Tell me about your most recent job."
- "What technologies did you use in the CareForElders project?"
- "Summarize your experience with Spring Boot and microservices."
- "What are you studying at ESPRIT?"
- "How can I contact you?"

---

## Tech Stack

- **Framework**: Next.js 15, React 19
- **Language**: TypeScript
- **UI**: Tailwind CSS & shadcn/ui
- **State**: React Hooks & Context

---

## Architecture: Frontend + Backend

This project is decoupled into two distinct parts:

- **Frontend (This Repo)**: A modern Next.js 15 application responsible for the user interface. It sends the chat history and token count to a proxy.
- **Backend (Separate Repo)**: A Spring Boot & Java API I built that handles the entire RAG pipeline:
  - Receives the chat history.
  - Generates a context-aware embedding of the last question.
  - Queries a **ChromaDB** vector store to find the most relevant documents.
  - Sends the history, question, and retrieved context to the **Azure OpenAI** chat model (e.g., gpt-3.5-turbo / GPT-4o depending on your deployment).
  - Returns the final answer and token usage.

This frontend proxies all requests through a Next.js API route (`/api/chat`) to protect the backend URL and avoid CORS issues.

---

## How it works (RAG overview)

1. User asks a question in the chat UI.
2. Frontend sends the chat history to the backend.
3. Backend embeds the latest question, retrieves supporting context from **ChromaDB**, and crafts a prompt for **Azure OpenAI**.
4. Azure OpenAI returns a grounded answer.
5. Frontend streams and renders the answer with token usage info.

---

## API contract (expected by the frontend)

The frontend posts to your backend chat endpoint (configure the path in `app/(chat)/api/chat/route.ts`).

- Request (example):
```json
{
  "history": [
    { "role": "user", "content": "Who is Mohamed?" }
  ],
  "totalTokensUsedSoFar": 0
}
```
- Response (example):
```json
{
  "answer": "Mohamed is a ... with experience in ...",
  "totalTokensUsed": 154,
  "limitReached": false
}
```
- Streaming is supported by the UI (optional on backend).

> Note: If your backend path differs, update it inside `app/(chat)/api/chat/route.ts` to point to your deployed API URL.

---

## Environment variables

Create a `.env.local` (do not commit this). Typical variables:

```bash
# Frontend config
NEXT_PUBLIC_APP_NAME="Mohamed AI Portfolio Assistant"
# If you directly call your backend from the client (not via Next API route), set:
# NEXT_PUBLIC_BACKEND_URL="https://your-backend.example.com"

# Optional: Project identifier shown in UI/headers if you want to track deployments
NEXT_PUBLIC_PROJECT_ID="ragg-portfolio-frontend"
```

## Project ID

- The UI can display or log a project identifier for traceability across environments.
- Set `NEXT_PUBLIC_PROJECT_ID` in `.env.local`. Example: `ragg-portfolio-frontend`.
- You can reference it in the UI anywhere you prefer (e.g., footer or request headers).

---

## Running locally

```bash
# install deps
npm install

# start dev server
npm run dev
# App runs on http://localhost:3000 (or next free port)
```

If you proxy requests through Next API routes, ensure the internal route in `app/(chat)/api/chat/route.ts` points to your backend.


---

## Customization

- **Branding**: Replace icons/colors in `components/`
- **Model switch**: Update `lib/ai/models.ts` if you expose multiple models
- **Rate/Token limits**: Coordinate with backend and adjust UI messaging if needed

---

## Privacy & data

- This frontend does not store chat history by default.
- All prompts and responses are sent to your backend. Ensure your backend complies with privacy requirements and handles PII securely.

---

## Repository structure (selected)

- `app/` – Next.js routes and API proxies
- `components/` – Chat UI components
- `lib/` – Types, utilities, model constants
- `public/` – Static assets

---

## Recruiter guide (what to ask)

- **Experience**: "Summarize Mohamed’s experience with [tech]."
- **Projects**: "What are the key projects and what impact did they have?"
- **Skills**: "What are Mohamed’s primary skills and recent focus areas?"
- **Contact**: "How can I contact Mohamed?"

The chatbot is designed to answer clearly and concisely, grounded in the curated portfolio data indexed in ChromaDB.

---

## License

MIT License
