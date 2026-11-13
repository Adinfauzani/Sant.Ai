import { OpenRouter } from "@openrouter/sdk";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";

export const AI_MODEL = "openrouter/auto";

/** Official OpenRouter SDK client (server-side). Kept for provider-level access/extensibility. */
export const openrouterSdk = new OpenRouter({
  apiKey: process.env.op_key,
});

/** AI SDK provider configured for OpenRouter; used for streaming chat via `streamText`. */
export const openrouter = createOpenRouter({
  apiKey: process.env.op_key,
});

export const chatModel = openrouter(AI_MODEL);
