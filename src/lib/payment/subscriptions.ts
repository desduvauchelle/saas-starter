/**
 * Stripe subscription and checkout helpers.
 *
 * Provides functions to create checkout sessions, manage subscriptions,
 * and create billing portal sessions.
 */

import type Stripe from "stripe"
import { requireStripe } from "./stripe"
import prisma from "@/lib/prisma"

/**
 * Ensure the user has a Stripe customer ID. Creates one if missing.
 */
export async function ensureStripeCustomer(userId: string): Promise<string> {
	const stripe = requireStripe()

	const user = await prisma.user.findUniqueOrThrow({
		where: { id: userId },
		select: { id: true, email: true, name: true, stripeCustomerId: true },
	})

	if (user.stripeCustomerId) return user.stripeCustomerId

	const customer = await stripe.customers.create({
		email: user.email ?? undefined,
		name: user.name ?? undefined,
		metadata: { userId: user.id },
	})

	await prisma.user.update({
		where: { id: userId },
		data: { stripeCustomerId: customer.id },
	})

	return customer.id
}

/**
 * Create a Stripe Checkout Session for a product.
 */
export async function createCheckoutSession(params: {
	userId: string
	productId: string
	successUrl: string
	cancelUrl: string
}): Promise<Stripe.Checkout.Session> {
	const stripe = requireStripe()
	const customerId = await ensureStripeCustomer(params.userId)

	const product = await prisma.product.findUniqueOrThrow({
		where: { id: params.productId },
	})

	if (!product.stripePriceId) {
		throw new Error("Product does not have a Stripe price ID. Configure it in Stripe first.")
	}

	const session = await stripe.checkout.sessions.create({
		customer: customerId,
		mode: product.type === "SUBSCRIPTION" ? "subscription" : "payment",
		line_items: [
			{
				price: product.stripePriceId,
				quantity: 1,
			},
		],
		success_url: params.successUrl,
		cancel_url: params.cancelUrl,
		metadata: {
			userId: params.userId,
			productId: params.productId,
		},
	})

	return session
}

/**
 * Create a Stripe Customer Portal session for managing subscriptions.
 */
export async function createPortalSession(params: {
	userId: string
	returnUrl: string
}): Promise<Stripe.BillingPortal.Session> {
	const stripe = requireStripe()
	const customerId = await ensureStripeCustomer(params.userId)

	const session = await stripe.billingPortal.sessions.create({
		customer: customerId,
		return_url: params.returnUrl,
	})

	return session
}

/**
 * Sync a Stripe subscription to the database.
 */
export async function syncSubscription(
	stripeSubscription: Stripe.Subscription
): Promise<void> {
	const customerId =
		typeof stripeSubscription.customer === "string"
			? stripeSubscription.customer
			: stripeSubscription.customer.id

	// Find user by Stripe customer ID
	const user = await prisma.user.findFirst({
		where: { stripeCustomerId: customerId },
	})

	if (!user) {
		console.error(`No user found for Stripe customer ${customerId}`)
		return
	}

	// Get the price ID from the subscription
	const priceId = stripeSubscription.items.data[0]?.price?.id

	if (!priceId) {
		console.error("No price ID found in subscription")
		return
	}

	// Find matching product
	const product = await prisma.product.findFirst({
		where: { stripePriceId: priceId },
	})

	if (!product) {
		console.error(`No product found for Stripe price ${priceId}`)
		return
	}

	// Map Stripe status to our enum
	const statusMap: Record<string, string> = {
		active: "ACTIVE",
		canceled: "CANCELED",
		past_due: "PAST_DUE",
		trialing: "TRIALING",
		incomplete: "INCOMPLETE",
		incomplete_expired: "CANCELED",
		unpaid: "PAST_DUE",
		paused: "CANCELED",
	}

	const status = statusMap[stripeSubscription.status] ?? "INCOMPLETE"

	// In newer Stripe API versions, period dates live on subscription items
	const firstItem = stripeSubscription.items.data[0]
	const periodStart = firstItem
		? new Date(firstItem.current_period_start * 1000)
		: new Date()
	const periodEnd = firstItem
		? new Date(firstItem.current_period_end * 1000)
		: new Date()

	await prisma.subscription.upsert({
		where: { stripeSubscriptionId: stripeSubscription.id },
		create: {
			userId: user.id,
			productId: product.id,
			stripeSubscriptionId: stripeSubscription.id,
			status: status as "ACTIVE" | "CANCELED" | "PAST_DUE" | "TRIALING" | "INCOMPLETE",
			currentPeriodStart: periodStart,
			currentPeriodEnd: periodEnd,
			cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
		},
		update: {
			status: status as "ACTIVE" | "CANCELED" | "PAST_DUE" | "TRIALING" | "INCOMPLETE",
			currentPeriodStart: periodStart,
			currentPeriodEnd: periodEnd,
			cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
		},
	})
}
