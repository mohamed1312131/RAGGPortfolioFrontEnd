import type { InferUITool, UIMessage } from "ai";
import { z } from "zod";
// Tool imports removed - no tools in demo mode
// Suggestion type removed - no database in demo mode
import type { AppUsage } from "./usage";

export type DataPart = { type: "append-message"; message: string };

export const messageMetadataSchema = z.object({
  createdAt: z.string(),
});

export type MessageMetadata = z.infer<typeof messageMetadataSchema>;

// Simplified types for demo mode
export type ChatTools = Record<string, never>;

export type CustomUIDataTypes = {
  textDelta: string;
  usage: AppUsage;
};

export type ChatMessage = UIMessage<
  MessageMetadata,
  CustomUIDataTypes,
  ChatTools
>;

export type Attachment = {
  name: string;
  url: string;
  contentType: string;
};
