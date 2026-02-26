/**
 * AI client — OpenRouter via Vercel AI SDK.
 *
 * Uses `@ai-sdk/openai`'s `createOpenAI` with OpenRouter's base URL.
 * OpenRouter is fully OpenAI-compatible, so no dedicated adapter is needed.
 *
 * The model defaults to `google/gemini-flash-1.5` but can be overridden
 * via the `OPENROUTER_MODEL` environment variable.
 *
 * @see https://openrouter.ai/docs
 * @see https://sdk.vercel.ai/docs
 */

import { createOpenAI } from "@ai-sdk/openai"
import { env } from "@/env"

/* -------------------------------------------------------------------------- */
/*  Provider                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Lazily-initialised OpenRouter provider.
 * Throws a descriptive error if `OPENROUTER_API_KEY` is missing.
 */
function getProvider() {
	if (!env.OPENROUTER_API_KEY) {
		throw new Error(
			"OPENROUTER_API_KEY is not set. " +
			"AI features require an OpenRouter API key. " +
			"Get one at https://openrouter.ai/keys"
		)
	}

	return createOpenAI({
		baseURL: "https://openrouter.ai/api/v1",
		apiKey: env.OPENROUTER_API_KEY,
		// OpenRouter uses standard OpenAI-compatible headers
	})
}

/* -------------------------------------------------------------------------- */
/*  Model                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Returns the AI model instance configured for the current environment.
 *
 * Uses `OPENROUTER_MODEL` env var (defaults to `google/gemini-flash-1.5`).
 *
 * @example
 * ```ts
 * import { getAIModel } from "@/lib/ai/client"
 * import { streamText } from "ai"
 *
 * const result = streamText({
 *   model: getAIModel(),
 *   messages: [{ role: "user", content: "Hello!" }],
 * })
 * ```
 */
export function getAIModel() {
	const provider = getProvider()
	return provider(env.OPENROUTER_MODEL)
}
