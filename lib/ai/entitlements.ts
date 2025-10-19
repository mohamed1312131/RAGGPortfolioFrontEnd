// lib/ai/entitlements.ts
// Local static version — no auth or user types

import type { ChatModel } from "./models";

type Entitlements = {
  maxMessagesPerDay: number;
  availableChatModelIds: ChatModel["id"][];
};

export const entitlementsByUserType: Record<string, Entitlements> = {
  /*
   * Local demo user — unlimited and static model list
   */
  local: {
    maxMessagesPerDay: 9999,
    availableChatModelIds: ["chat-model", "chat-model-reasoning"],
  },
};
