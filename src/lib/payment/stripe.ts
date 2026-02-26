/**
 * Stripe client singleton.
 *
 * Provides a configured Stripe SDK instance for server-side use.
 * Requires STRIPE_SECRET_KEY in environment variables.
 */

import Stripe from "stripe"
import { env } from "@/env"

let stripeInstance: Stripe | null = null

/**
 * Get the Stripe client. Returns null if STRIPE_SECRET_KEY is not configured.
 */
export function getStripe(): Stripe | null {
	if (!env.STRIPE_SECRET_KEY) return null

	if (!stripeInstance) {
		stripeInstance = new Stripe(env.STRIPE_SECRET_KEY, {
			apiVersion: "2026-02-25.clover",
			typescript: true,
		})
	}

	return stripeInstance
}

/**
 * Get the Stripe client or throw if not configured.
 */
export function requireStripe(): Stripe {
	const stripe = getStripe()
	if (!stripe) {
		throw new Error("Stripe is not configured. Set STRIPE_SECRET_KEY in your environment.")
	}
	return stripe
}
