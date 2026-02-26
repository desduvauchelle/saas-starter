/**
 * POST /api/billing/checkout
 *
 * Creates a Stripe Checkout Session for a product.
 * Requires authentication.
 */

import { NextRequest } from "next/server"
import { requireAuth } from "@/lib/auth/guards"
import { createCheckoutSession } from "@/lib/payment/subscriptions"
import { successResponse, errorResponse } from "@/lib/api/response"
import { z } from "zod"

const bodySchema = z.object({
	productId: z.string().min(1, "productId is required"),
})

export async function POST(req: NextRequest) {
	try {
		const session = await requireAuth()

		const body: unknown = await req.json()
		const parsed = bodySchema.safeParse(body)

		if (!parsed.success) {
			return errorResponse(
				parsed.error.issues[0]?.message ?? "Invalid request",
				"VALIDATION_ERROR",
				400
			)
		}

		const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"

		const checkoutSession = await createCheckoutSession({
			userId: session.user.id,
			productId: parsed.data.productId,
			successUrl: `${appUrl}/app/account/billing?success=true`,
			cancelUrl: `${appUrl}/app/account/billing?canceled=true`,
		})

		return successResponse({ url: checkoutSession.url })
	} catch (err) {
		const message = err instanceof Error ? err.message : "Failed to create checkout session"
		return errorResponse(message, "CHECKOUT_ERROR", 500)
	}
}
