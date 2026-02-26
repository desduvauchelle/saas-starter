/**
 * POST /api/contact
 *
 * Handles contact form submissions.
 * Sends an email notification to the site owner.
 */

import { NextRequest } from "next/server"
import { z } from "zod"
import { sendEmail } from "@/lib/email/client"
import { contactFormEmail } from "@/lib/email/templates"
import { successResponse, errorResponse } from "@/lib/api/response"
import { env } from "@/env"

const bodySchema = z.object({
	name: z.string().min(1, "Name is required").max(200),
	email: z.string().email("Invalid email address"),
	subject: z.string().min(1, "Subject is required").max(500),
	message: z.string().min(1, "Message is required").max(5000),
})

export async function POST(req: NextRequest) {
	try {
		const body: unknown = await req.json().catch(() => null)

		if (!body) {
			return errorResponse("Invalid JSON body", "VALIDATION_ERROR", 400)
		}

		const parsed = bodySchema.safeParse(body)

		if (!parsed.success) {
			return errorResponse(
				parsed.error.issues[0]?.message ?? "Validation error",
				"VALIDATION_ERROR",
				400
			)
		}

		// Determine recipient — use OWNER_EMAILS or fallback to EMAIL_FROM
		const ownerEmails = env.OWNER_EMAILS?.split(",").map((e) => e.trim()).filter(Boolean) ?? []
		const recipient = ownerEmails[0] ?? env.EMAIL_FROM

		if (!recipient) {
			console.warn("No recipient configured for contact form submissions")
			// Still return success to the user — we don't want to expose config issues
			return successResponse({ sent: false })
		}

		const template = contactFormEmail(parsed.data)
		const sent = await sendEmail({
			to: recipient,
			subject: template.subject,
			html: template.html,
			text: template.text,
		})

		return successResponse({ sent })
	} catch (err) {
		console.error("Contact form error:", err)
		return errorResponse("Failed to send message", "SERVER_ERROR", 500)
	}
}
