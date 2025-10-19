import { JsonToSseTransformStream } from "ai";

export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const message = body?.message ?? body;

    // Prefer history provided by the client; otherwise derive from messages
    let history = Array.isArray(body?.history) ? body.history : undefined;
    if (!history || history.length === 0) {
      const msgs = Array.isArray(body?.messages) ? body.messages : [message].filter(Boolean);
      history = (msgs || [])
        .map((m: any) => {
          if (!m) return null;
          const role = m.role || "user";
          let content: string | undefined = m.text || m.content;
          if (!content && Array.isArray(m.parts)) {
            content = m.parts
              .filter((p: any) => p && p.type === "text" && typeof p.text === "string")
              .map((p: any) => p.text)
              .join("");
          }
          if (!content || !String(content).trim()) return null;
          return { role, content };
        })
        .filter(Boolean);
    }

    if (!history || history.length === 0) {
      return new Response(
        JSON.stringify({ error: "Invalid request: missing history" }),
        { status: 400 }
      );
    }

    // Forward the user's prompt to the Spring backend
    const backendRes = await fetch("http://localhost:8080/api/chat/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // Spring controller expects { history: [{ role, content }] }
      body: JSON.stringify({
        history,
        totalTokensUsedSoFar: Number(body?.totalTokensUsedSoFar || 0),
      }),
    });

    if (!backendRes.ok) {
      const errText = await backendRes.text().catch(() => "");
      return new Response(
        JSON.stringify({ error: `Backend error ${backendRes.status}: ${errText}` }),
        { status: 502 }
      );
    }

    // Expecting: { answer: string, totalTokensUsed: number, limitReached: boolean }
    const backendJson = await backendRes.json();
    const answerText: string = backendJson?.answer ?? "";
    const totalTokensUsed: number = Number(backendJson?.totalTokensUsed || 0);
    const limitReached: boolean = Boolean(backendJson?.limitReached);

    // Stream the single response back as SSE so the existing UI continues to work
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const id = (globalThis as any).crypto?.randomUUID?.() || Math.random().toString(36).slice(2);

        // Match the event sequence used by tests and AI SDK expectations
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "start-step" })}\n\n`));
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "text-start", id })}\n\n`));
        // Fast typing animation: emit multiple small deltas with short delays
        const chunkSize = 18; // characters per tick (tune for speed)
        const delayMs = 100; // delay between ticks (lower is faster)
        for (let i = 0; i < answerText.length; i += chunkSize) {
          const delta = answerText.slice(i, i + chunkSize);
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: "text-delta", id, delta })}\n\n`
            )
          );
          // small delay to simulate typing
          // eslint-disable-next-line no-await-in-loop
          await new Promise((r) => setTimeout(r, delayMs));
        }
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "text-end", id })}\n\n`));

        // Emit usage and limit status so the client can track and disable input
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ type: "data-usage", data: { totalTokensUsed } })}\n\n`
          )
        );
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ type: "limit-status", data: { limitReached } })}\n\n`
          )
        );

        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "finish-step" })}\n\n`));
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "finish" })}\n\n`));
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (error) {
    console.error("Static chat error:", error);
    return new Response("Internal error", { status: 500 });
  }
}

export async function DELETE() {
  return new Response("Static mode — delete not implemented", { status: 200 });
}
