/**
 * Billing-related types.
 */

import type {
	ProductType,
	SubscriptionInterval,
	SubscriptionStatus,
	SubscriptionTier,
} from "@prisma/client"

/** Public product info (displayed on pricing page) */
export interface ProductPublic {
	id: string
	name: string
	description: string | null
	price: number
	currency: string
	type: ProductType
	tier: SubscriptionTier | null
	interval: SubscriptionInterval | null
	isActive: boolean
	features: string[]
	recommended: boolean
}

/** Data for creating a product (admin) */
export interface ProductCreateInput {
	name: string
	description?: string
	price: number
	currency?: string
	type: ProductType
	tier?: SubscriptionTier
	interval?: SubscriptionInterval
	features?: string[]
	recommended?: boolean
}

/** Public subscription info (user account page) */
export interface SubscriptionPublic {
	id: string
	status: SubscriptionStatus
	currentPeriodStart: Date | null
	currentPeriodEnd: Date | null
	cancelAtPeriodEnd: boolean
	product: ProductPublic
}

/** Stripe checkout session creation params */
export interface CheckoutParams {
	productId: string
	successUrl: string
	cancelUrl: string
}
