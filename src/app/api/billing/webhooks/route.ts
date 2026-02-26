/**
 * POST /api/billing/webhooks
 *
 * Handles Stripe webhook events.
 * Verifies the Stripe signature and processes relevant events
 * to keep subscriptions in sync.
 */

import { NextRequest, NextResponse } from "next/server"
import { requireStripe } from "@/lib/payment/stripe"
import { syncSubscription } from "@/lib/payment/subscriptions"
import { env } from "@/env"
import type Stripe from "stripe"

/**
 * Stripe sends the body as raw text — we must NOT parse it as JSON
 * so the signature verification works.
 */
export async function POST(req: NextRequest) {
	const stripe = requireStripe()
	const body = await req.text()
	const sig = req.headers.get("stripe-signature")

	if (!sig) {
		return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 })
	}

	if (!env.STRIPE_WEBHOOK_SECRET) {
		console.error("STRIPE_WEBHOOK_SECRET is not set")
		return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 })
	}

	let event: Stripe.Event

	try {
		event = stripe.webhooks.constructEvent(body, sig, env.STRIPE_WEBHOOK_SECRET)
	} catch (err) {
		const message = err instanceof Error ? err.message : "Invalid signature"
		console.error(`Webhook signature verification failed: ${message}`)
		return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
	}

	try {
		switch (event.type) {
			case "customer.subscription.created":
			case "customer.subscription.updated":
			case "customer.subscription.deleted": {
				const subscription = event.data.object as Stripe.Subscription
				await syncSubscription(subscription)
				break
			}

			case "checkout.session.completed": {
				const session = event.data.object as Stripe.Checkout.Session

				// If it's a subscription checkout, the subscription webhook handles it.
				// For one-time payments, log the purchase.
				if (session.mode === "payment") {
					console.log(`One-time payment completed: ${session.id}`)
					// TODO: Handle one-time purchase fulfillment
				}
				break
			}

			case "invoice.payment_failed": {
				const invoice = event.data.object as Stripe.Invoice
				console.warn(`Payment failed for invoice ${invoice.id}`)
				// TODO: Send payment failed email to customer
				break
			}

			default:
				// Unhandled event type — log for debugging
				console.log(`Unhandled Stripe event: ${event.type}`)
		}
	} catch (err) {
		console.error(`Error processing webhook ${event.type}:`, err)
		return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
	}

	return NextResponse.json({ received: true })
}
