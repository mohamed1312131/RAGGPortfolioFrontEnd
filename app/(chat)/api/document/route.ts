// app/(chat)/api/document/route.ts
// Simplified local version — no auth, no database.

import { ChatSDKError } from "@/lib/errors";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new ChatSDKError(
      "bad_request:api",
      "Parameter 'id' is missing."
    ).toResponse();
  }

  // Return a fake static document
  return Response.json(
    [
      {
        id,
        title: "Static Demo Document",
        content: "This is a placeholder document for local demo mode.",
        kind: "note",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    { status: 200 }
  );
}

export async function POST(request: Request) {
  try {
    const { content, title, kind } = await request.json();

    // Just echo back what the frontend sent
    return Response.json(
      {
        id: "local-doc-1",
        title: title || "Untitled Document",
        content: content || "No content provided.",
        kind: kind || "note",
        saved: true,
        createdAt: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving document:", error);
    return new ChatSDKError("bad_request:chat").toResponse();
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new ChatSDKError(
      "bad_request:api",
      "Parameter 'id' is required."
    ).toResponse();
  }

  return Response.json(
    {
      message: `Document ${id} deleted (static mode).`,
      deleted: true,
    },
    { status: 200 }
  );
}
