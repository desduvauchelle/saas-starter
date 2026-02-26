/**
 * "summarize" — Example AI template.
 *
 * Takes a block of text and returns a concise summary.
 * Demonstrates the correct shape every new template should follow.
 *
 * Usage via API:
 * ```json
 * POST /api/ai/template
 * {
 *   "template": "summarize",
 *   "input": {
 *     "text": "Long article content...",
 *     "maxWords": 100
 *   }
 * }
 * ```
 */

import { z } from "zod"
import { defineTemplate } from "./types"

/* -------------------------------------------------------------------------- */
/*  Schemas                                                                    */
/* -------------------------------------------------------------------------- */

const inputSchema = z.object({
	/** The text to summarize */
	text: z.string().min(1, "Text is required"),
	/** Optional maximum word count for the summary */
	maxWords: z.number().int().positive().optional().default(150),
})

const outputSchema = z.object({
	/** The generated summary */
	summary: z.string(),
})

type SummarizeInput = z.infer<typeof inputSchema>
type SummarizeOutput = z.infer<typeof outputSchema>

/* -------------------------------------------------------------------------- */
/*  Template                                                                   */
/* -------------------------------------------------------------------------- */

export default defineTemplate<SummarizeInput, SummarizeOutput>({
	name: "summarize",
	description: "Summarize a block of text into a concise paragraph.",

	inputSchema,
	outputSchema,

	buildMessages: (input) => [
		{
			role: "system" as const,
			content: [
				"You are a concise summarisation assistant.",
				`Summarize the following text in at most ${input.maxWords} words.`,
				"Return ONLY a JSON object with a single key 'summary' containing the summary text.",
				"Do not include any other text, markdown formatting, or explanation.",
			].join(" "),
		},
		{
			role: "user" as const,
			content: input.text,
		},
	],

	parseOutput: (raw: string): SummarizeOutput => {
		// Try to parse as JSON first
		try {
			const parsed = JSON.parse(raw)
			if (typeof parsed.summary === "string") {
				return { summary: parsed.summary }
			}
		} catch {
			// If JSON parsing fails, treat the entire response as the summary
		}

		// Fallback: use the raw text as the summary
		return { summary: raw.trim() }
	},
})
