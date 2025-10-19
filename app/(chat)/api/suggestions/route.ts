// app/(chat)/api/suggestions/route.ts
// Static local demo version — no auth, no database

import { ChatSDKError } from "@/lib/errors";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const documentId = searchParams.get("documentId");

  if (!documentId) {
    return new ChatSDKError(
      "bad_request:api",
      "Parameter 'documentId' is required."
    ).toResponse();
  }

  // Static fake data (pretending suggestions are generated)
  const suggestions = [
    {
      id: `suggestion-${documentId}-1`,
      documentId,
      title: "Improve paragraph flow",
      content:
        "Consider shortening long sentences to improve readability and clarity.",
      createdAt: new Date().toISOString(),
    },
    {
      id: `suggestion-${documentId}-2`,
      documentId,
      title: "Enhance structure",
      content:
        "Add a short summary section at the end to recap key points clearly.",
      createdAt: new Date().toISOString(),
    },
  ];

  return Response.json(suggestions, { status: 200 });
}
