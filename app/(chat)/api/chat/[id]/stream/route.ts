// Simplified static route for local/demo mode

import { JsonToSseTransformStream } from "ai";

export async function GET() {
  const encoder = new TextEncoder();

  // Optional: a tiny fake streaming message for demo continuity
  const stream = new ReadableStream({
    async start(controller) {
      const lines = [
        "Resuming session...",
        "Currently running in static demo mode — no stored chat data.",
        "When backend integration is added, chat history will load here."
      ];

      for (const line of lines) {
        await new Promise((r) => setTimeout(r, 600));
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: "message", data: line })}\n\n`)
        );
      }

      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();
    },
  });

  return new Response(stream.pipeThrough(new JsonToSseTransformStream()), {
    headers: {
      "Content-Type": "text/event-stream",
    },
  });
}
