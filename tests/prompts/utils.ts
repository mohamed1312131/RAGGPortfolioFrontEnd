export type ResponseChunk =
  | { id?: string; type: "text-start" }
  | { id?: string; type: "text-delta"; delta: string }
  | { id?: string; type: "text-end" }
  | {
      type: "finish";
      finishReason: "stop" | "length" | string;
      usage?: { inputTokens?: number; outputTokens?: number; totalTokens?: number };
    };

export function getResponseChunksByPrompt(prompt: unknown, isReasoning = false): ResponseChunk[] {
  const id = isReasoning ? "r1" : "1";
  const text = isReasoning ? "Reasoned response" : "Hello from mock!";

  return [
    { id, type: "text-start" },
    { id, type: "text-delta", delta: text },
    { id, type: "text-end" },
    {
      type: "finish",
      finishReason: "stop",
      usage: { inputTokens: 3, outputTokens: text.length, totalTokens: text.length + 3 },
    },
  ];
}
