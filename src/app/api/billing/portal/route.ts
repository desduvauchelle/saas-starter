/**
 * POST /api/billing/portal
 *
 * Creates a Stripe Customer Portal session so the user can manage
 * their subscriptions, payment methods, and invoices.
 * Requires authentication.
 */

import { requireAuth } from "@/lib/auth/guards"
import { createPortalSession } from "@/lib/payment/subscriptions"
import { successResponse, errorResponse } from "@/lib/api/response"

export async function POST() {
	try {
		const session = await requireAuth()

		const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"

		const portalSession = await createPortalSession({
			userId: session.user.id,
			returnUrl: `${appUrl}/app/account/billing`,
		})

		return successResponse({ url: portalSession.url })
	} catch (err) {
		const message = err instanceof Error ? err.message : "Failed to create portal session"
		return errorResponse(message, "PORTAL_ERROR", 500)
	}
}
