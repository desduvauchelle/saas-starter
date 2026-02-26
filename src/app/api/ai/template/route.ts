/**
 * POST /api/ai/template — Execute a typed AI prompt template.
 *
 * Looks up a registered template by name, validates the input against
 * the template's Zod schema, sends the built messages to the model,
 * and returns the parsed + validated output.
 *
 * Requires authentication.
 *
 * @example Request
 * ```json
 * {
 *   "template": "summarize",
 *   "input": {
 *     "text": "Long article content here...",
 *     "maxWords": 100
 *   }
 * }
 * ```
 *
 * @example Response
 * ```json
 * {
 *   "success": true,
 *   "data": {
 *     "output": {
 *       "summary": "A concise summary of the article..."
 *     },
 *     "template": "summarize"
 *   }
 * }
 * ```
 */

import { generateText } from "ai"
import { z } from "zod"
import { getAIModel } from "@/lib/ai/client"
import { getTemplate, listTemplates } from "@/lib/ai/templates"
import { requireAuth, AuthError } from "@/lib/auth/guards"
import { successResponse, errorResponse } from "@/lib/api/response"

/* -------------------------------------------------------------------------- */
/*  Request validation                                                         */
/* -------------------------------------------------------------------------- */

const bodySchema = z.object({
	/** Name of the registered template to execute */
	template: z.string().min(1, "Template name is required"),
	/** Input data — validated against the template's own inputSchema */
	input: z.unknown(),
})

/* -------------------------------------------------------------------------- */
/*  Handler                                                                    */
/* -------------------------------------------------------------------------- */

export async function POST(req: Request) {
	try {
		// ── Auth ────────────────────────────────────────────────────
		await requireAuth()

		// ── Validate body ──────────────────────────────────────────
		const body = await req.json().catch(() => null)
		const parsed = bodySchema.safeParse(body)

		if (!parsed.success) {
			const details: Record<string, string[]> = {}
			for (const issue of parsed.error.issues) {
				const path = issue.path.join(".") || "_root"
				details[path] = details[path] ?? []
				details[path].push(issue.message)
			}
			return errorResponse(
				"Invalid request body",
				"VALIDATION_ERROR",
				400,
				details
			)
		}

		// ── Look up template ───────────────────────────────────────
		const { template: templateName, input } = parsed.data
		const template = getTemplate(templateName)

		if (!template) {
			return errorResponse(
				`Template "${templateName}" not found. Available: ${listTemplates().join(", ") || "(none)"}`,
				"NOT_FOUND",
				404
			)
		}

		// ── Validate input against template schema ─────────────────
		const inputResult = template.inputSchema.safeParse(input)

		if (!inputResult.success) {
			const details: Record<string, string[]> = {}
			for (const issue of inputResult.error.issues) {
				const path = issue.path.join(".") || "_root"
				details[path] = details[path] ?? []
				details[path].push(issue.message)
			}
			return errorResponse(
				`Invalid input for template "${templateName}"`,
				"VALIDATION_ERROR",
				400,
				details
			)
		}

		// ── Build messages & call model ─────────────────────────────
		const messages = template.buildMessages(inputResult.data)

		const result = await generateText({
			model: getAIModel(),
			messages,
		})

		// ── Parse & validate output ─────────────────────────────────
		let output: unknown

		try {
			output = template.parseOutput(result.text)
		} catch (parseError) {
			console.error(
				`[api/ai/template] Failed to parse output for "${templateName}":`,
				parseError
			)
			return errorResponse(
				"Failed to parse AI response",
				"PARSE_ERROR",
				502
			)
		}

		// Optional output schema validation
		if (template.outputSchema) {
			const outputResult = template.outputSchema.safeParse(output)
			if (!outputResult.success) {
				console.error(
					`[api/ai/template] Output validation failed for "${templateName}":`,
					outputResult.error.issues
				)
				return errorResponse(
					"AI response did not match expected format",
					"OUTPUT_VALIDATION_ERROR",
					502
				)
			}
			output = outputResult.data
		}

		return successResponse({ output, template: templateName })
	} catch (error) {
		if (error instanceof AuthError) {
			return errorResponse(error.message, error.code, error.statusCode)
		}

		console.error("[api/ai/template] Error:", error)

		// Surface missing API key errors clearly
		if (error instanceof Error && error.message.includes("OPENROUTER_API_KEY")) {
			return errorResponse(
				"AI is not configured. Please set OPENROUTER_API_KEY.",
				"AI_NOT_CONFIGURED",
				503
			)
		}

		return errorResponse("Internal server error", "INTERNAL_ERROR", 500)
	}
}
