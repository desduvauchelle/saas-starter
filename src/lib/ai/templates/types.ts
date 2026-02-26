/**
 * AI Template type definitions.
 *
 * A template is a typed, reusable prompt that:
 *  1. Validates its input with a Zod schema
 *  2. Builds a set of messages to send to the model
 *  3. Parses the raw text response into a typed output
 *
 * Templates are auto-discovered from this directory by the registry.
 */

import type { z } from "zod"
import type { ModelMessage } from "ai"

/* -------------------------------------------------------------------------- */
/*  Template interface                                                         */
/* -------------------------------------------------------------------------- */

/**
 * Describes a typed AI prompt template.
 *
 * @template TInput  - The shape of the data the caller provides.
 * @template TOutput - The shape of the parsed response.
 */
export interface AITemplate<TInput, TOutput> {
	/** Unique identifier used in the API (e.g. "summarize", "extract-entities") */
	name: string

	/** Human-readable description of what this template does */
	description?: string

	/** Zod schema that validates the input at runtime */
	inputSchema: z.ZodType<TInput>

	/**
	 * Build the messages array sent to the model.
	 * Use system messages for instructions, user messages for the actual data.
	 */
	buildMessages: (input: TInput) => ModelMessage[]

	/**
	 * Parse the raw text response from the model into the typed output.
	 * Throw if the response cannot be parsed (the API route will catch it).
	 */
	parseOutput: (raw: string) => TOutput

	/**
	 * Optional Zod schema for validating the parsed output.
	 * When provided, the registry will validate `parseOutput`'s return value
	 * against this schema as an extra safety net.
	 */
	outputSchema?: z.ZodType<TOutput>
}

/* -------------------------------------------------------------------------- */
/*  Helper                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Type-safe identity function for defining templates.
 *
 * Provides IDE auto-complete and compile-time type checking without
 * requiring an explicit generic annotation at the call site.
 *
 * @example
 * ```ts
 * import { defineTemplate } from "./types"
 * import { z } from "zod"
 *
 * export default defineTemplate({
 *   name: "my-template",
 *   inputSchema: z.object({ text: z.string() }),
 *   buildMessages: (input) => [
 *     { role: "system", content: "You are a helpful assistant." },
 *     { role: "user", content: input.text },
 *   ],
 *   parseOutput: (raw) => ({ result: raw }),
 * })
 * ```
 */
export function defineTemplate<TInput, TOutput>(
	template: AITemplate<TInput, TOutput>
): AITemplate<TInput, TOutput> {
	return template
}
