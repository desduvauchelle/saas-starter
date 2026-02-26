/**
 * PricingTable — displays available products/plans in a responsive grid.
 *
 * Can be used on public landing pages (with a sign-up CTA) or inside
 * the authenticated app (with a checkout CTA). Pass `mode` to control
 * the button behaviour.
 */

"use client"

import { useState } from "react"
import { Button, ButtonLink } from "@/components/ui"

interface PricingPlan {
	id: string
	name: string
	description: string | null
	price: number
	currency: string
	interval: string | null
	tier: string | null
	features: string[]
	recommended: boolean
}

interface PricingTableProps {
	/** Array of active products to display */
	plans: PricingPlan[]
	/** "landing" shows Sign Up CTA, "app" triggers checkout */
	mode: "landing" | "app"
	/** Called when user clicks a plan in "app" mode */
	onSelectPlan?: (planId: string) => void
	/** Show loading state on a specific plan */
	loadingPlanId?: string | null
}

function formatPrice(cents: number, currency: string): string {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: currency.toUpperCase(),
		minimumFractionDigits: 0,
		maximumFractionDigits: 2,
	}).format(cents / 100)
}

export function PricingTable({
	plans,
	mode,
	onSelectPlan,
	loadingPlanId,
}: PricingTableProps) {
	const [billingInterval, setBillingInterval] = useState<"MONTHLY" | "YEARLY">(
		"MONTHLY"
	)

	const hasIntervals =
		plans.some((p) => p.interval === "MONTHLY") &&
		plans.some((p) => p.interval === "YEARLY")

	const filteredPlans = hasIntervals
		? plans.filter(
			(p) => p.interval === billingInterval || p.interval === "LIFETIME"
		)
		: plans

	return (
		<div className="w-full">
			{/* Interval toggle */}
			{hasIntervals && (
				<div className="flex justify-center mb-8">
					<div className="join">
						<Button
							variant={billingInterval === "MONTHLY" ? "primary" : "ghost"}
							size="sm"
							className="join-item"
							onClick={() => setBillingInterval("MONTHLY")}
						>
							Monthly
						</Button>
						<Button
							variant={billingInterval === "YEARLY" ? "primary" : "ghost"}
							size="sm"
							className="join-item"
							onClick={() => setBillingInterval("YEARLY")}
						>
							Yearly
						</Button>
					</div>
				</div>
			)}

			{/* Plans grid */}
			<div
				className={`grid gap-6 mx-auto ${filteredPlans.length === 1
						? "max-w-sm grid-cols-1"
						: filteredPlans.length === 2
							? "max-w-2xl grid-cols-1 md:grid-cols-2"
							: filteredPlans.length === 3
								? "max-w-4xl grid-cols-1 md:grid-cols-3"
								: "max-w-5xl grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
					}`}
			>
				{filteredPlans.map((plan) => (
					<div
						key={plan.id}
						className={`card bg-base-200 shadow-lg ${plan.recommended
								? "border-2 border-primary ring-2 ring-primary/20"
								: "border border-base-300"
							}`}
					>
						{plan.recommended && (
							<div className="absolute -top-3 left-1/2 -translate-x-1/2">
								<span className="badge badge-primary badge-sm">
									Recommended
								</span>
							</div>
						)}

						<div className="card-body text-center">
							{/* Plan name */}
							<h3 className="card-title justify-center text-lg">
								{plan.name}
							</h3>

							{/* Description */}
							{plan.description && (
								<p className="text-sm text-base-content/60">
									{plan.description}
								</p>
							)}

							{/* Price */}
							<div className="py-4">
								<span className="text-4xl font-bold">
									{formatPrice(plan.price, plan.currency)}
								</span>
								{plan.interval && (
									<span className="text-base-content/60 ml-1">
										/{plan.interval === "MONTHLY" ? "mo" : plan.interval === "YEARLY" ? "yr" : "once"}
									</span>
								)}
							</div>

							{/* Features */}
							{plan.features.length > 0 && (
								<ul className="space-y-2 text-sm text-left">
									{plan.features.map((feature, i) => (
										<li key={i} className="flex items-start gap-2">
											<i className="fa-solid fa-check text-success mt-0.5 shrink-0" />
											<span>{feature}</span>
										</li>
									))}
								</ul>
							)}

							{/* CTA */}
							<div className="card-actions mt-4">
								{mode === "landing" ? (
									<ButtonLink
										href="/auth/register"
										variant={plan.recommended ? "primary" : undefined}
										outline={!plan.recommended}
										modifier="block"
									>
										Get Started
									</ButtonLink>
								) : (
									<Button
										variant={plan.recommended ? "primary" : undefined}
										outline={!plan.recommended}
										modifier="block"
										disabled={loadingPlanId !== undefined && loadingPlanId !== null}
										loading={loadingPlanId === plan.id}
										onClick={() => onSelectPlan?.(plan.id)}
									>
										Subscribe
									</Button>
								)}
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}
