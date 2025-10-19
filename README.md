# AI Chatbot Demo

A clean, minimal AI chatbot interface built with Next.js and React. This is a simplified version focused on core chat functionality.

## Features

- 🤖 **Chat Interface** - Clean, responsive chat UI with message bubbles
- 🎨 **Dark/Light Mode** - Theme toggle with system preference detection
- 📱 **Responsive Design** - Works on desktop and mobile devices
- 🔒 **Token Limiting** - Built-in token usage tracking and limits
- ⚡ **Real-time Streaming** - Live message streaming from your AI backend
- 🎯 **Minimal Setup** - No database, no auth, just pure chat functionality

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **AI Integration**: Vercel AI SDK (for streaming)
- **Backend**: Your Spring Boot API (configurable endpoint)

## Quick Start

1. **Clone and install**:
   ```bash
   git clone <your-repo>
   cd ai-chatbot
   npm install
   ```

2. **Configure your backend**:
   - Update `app/(chat)/api/chat/route.ts` 
   - Change `http://localhost:8080/api/chat/query` to your API endpoint

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   - Navigate to `http://localhost:3000`
   - Start chatting with your AI assistant!

## Backend Integration

The frontend expects your backend to:

1. **Accept POST requests** with:
   ```json
   {
     "history": [{"role": "user", "content": "Hello"}],
     "totalTokensUsedSoFar": 0
   }
   ```

2. **Return JSON response** with:
   ```json
   {
     "answer": "Hello! How can I help you?",
     "totalTokensUsed": 15,
     "limitReached": false
   }
   ```

3. **Handle streaming** (optional) - The frontend streams the response with typing animation

## Customization

- **Styling**: Edit Tailwind classes in components
- **Models**: Update `lib/ai/models.ts` for different AI models
- **Limits**: Modify token limits in your backend logic
- **Branding**: Replace icons and colors in `components/` folder

## Deployment

This is a standard Next.js app that can be deployed to:
- Vercel (recommended)
- Netlify
- Any Node.js hosting platform

## License

MIT License - feel free to use for your projects!
