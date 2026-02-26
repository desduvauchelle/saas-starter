/**
 * Email client — Resend-based email sender.
 *
 * Provides a typed, centralized interface for sending transactional
 * emails. All email content is inline HTML (no external templates)
 * so the project stays dependency-light.
 */

import { Resend } from "resend"
import { env } from "@/env"

let resendInstance: Resend | null = null

/** Get the Resend client. Returns null if not configured. */
export function getResend(): Resend | null {
	if (!env.RESEND_API_KEY) return null

	if (!resendInstance) {
		resendInstance = new Resend(env.RESEND_API_KEY)
	}

	return resendInstance
}

/** Shared "from" address. */
function getFrom(): string {
	return env.EMAIL_FROM ?? `noreply@${env.NEXT_PUBLIC_APP_URL?.replace(/^https?:\/\//, "") ?? "example.com"}`
}

/* -------------------------------------------------------------------------- */
/*  Public helpers                                                             */
/* -------------------------------------------------------------------------- */

interface SendEmailOptions {
	to: string
	subject: string
	html: string
	text?: string
}

/**
 * Low-level send. All other helpers call this.
 * Returns `true` on success, `false` if email is not configured or send fails.
 */
export async function sendEmail(options: SendEmailOptions): Promise<boolean> {
	const resend = getResend()
	if (!resend) {
		console.warn("Email not configured — RESEND_API_KEY is missing. Skipping email send.")
		return false
	}

	try {
		const result = await resend.emails.send({
			from: getFrom(),
			to: options.to,
			subject: options.subject,
			html: options.html,
			text: options.text,
		})

		if (result.error) {
			console.error("Failed to send email:", result.error)
			return false
		}

		return true
	} catch (err) {
		console.error("Email send error:", err)
		return false
	}
}
