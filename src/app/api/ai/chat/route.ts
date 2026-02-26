/**
 * POST /api/ai/chat — Streaming AI conversation.
 *
 * Accepts a `messages` array (standard Vercel AI SDK CoreMessage format)
 * and streams the model's response back using the Data Stream protocol.
 *
 * Requires authentication.
 *
 * @example Request
 * ```json
 * {
 *   "messages": [
 *     { "role": "user", "content": "What is the meaning of life?" }
 *   ]
 * }
 * ```
 *
 * @example Client usage (with Vercel AI SDK React hooks)
 * ```tsx
 * import { useChat } from "ai/react"
 *
 * function ChatUI() {
 *   const { messages, input, handleInputChange, handleSubmit } = useChat({
 *     api: "/api/ai/chat",
 *   })
 *   // ...
 * }
 * ```
 */

import { streamText } from "ai"
import { z } from "zod"
import { getAIModel } from "@/lib/ai/client"
import { requireAuth, AuthError } from "@/lib/auth/guards"
import { errorResponse } from "@/lib/api/response"

/* -------------------------------------------------------------------------- */
/*  Request validation                                                         */
/* -------------------------------------------------------------------------- */

const messageSchema = z.object({
	role: z.enum(["user", "assistant", "system"]),
	content: z.string(),
})

const bodySchema = z.object({
	messages: z.array(messageSchema).min(1, "At least one message is required"),
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

		// ── Stream ─────────────────────────────────────────────────
		const result = streamText({
			model: getAIModel(),
			messages: parsed.data.messages,
		})

		return result.toTextStreamResponse()
	} catch (error) {
		if (error instanceof AuthError) {
			return errorResponse(error.message, error.code, error.statusCode)
		}

		console.error("[api/ai/chat] Error:", error)

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
