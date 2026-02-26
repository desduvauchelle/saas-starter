/**
 * Account Billing page — shows current subscription and manage billing.
 */

import { auth } from "@/lib/auth/config"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import { Button, ButtonLink } from "@/components/ui"

export const metadata = {
	title: "Billing",
}

export default async function BillingPage() {
	const session = await auth()
	if (!session?.user) redirect("/login")

	const subscription = await prisma.subscription.findFirst({
		where: { userId: session.user.id, status: "ACTIVE" },
		include: { product: true },
		orderBy: { createdAt: "desc" },
	})

	return (
		<div className="max-w-2xl mx-auto space-y-6">
			<h1 className="text-2xl font-bold">Billing</h1>

			{/* Current Plan */}
			<div className="card bg-base-100 shadow-sm">
				<div className="card-body">
					<h2 className="card-title text-lg">Current Plan</h2>
					{subscription ? (
						<div className="space-y-2">
							<div className="flex items-center gap-2">
								<span className="font-medium text-lg">
									{subscription.product.name}
								</span>
								<span className="badge badge-success">{subscription.status}</span>
							</div>
							<p className="text-sm text-base-content/70">
								${(subscription.product.price / 100).toFixed(2)}/
								{subscription.product.interval?.toLowerCase() ?? "month"}
							</p>
							{subscription.currentPeriodEnd && (
								<p className="text-xs text-base-content/50">
									{subscription.cancelAtPeriodEnd
										? "Cancels"
										: "Renews"}{" "}
									on{" "}
									{new Date(subscription.currentPeriodEnd).toLocaleDateString()}
								</p>
							)}

							{process.env.STRIPE_SECRET_KEY && (
								<form action="/api/billing/portal" method="POST">
									<Button type="submit" size="sm" outline className="mt-2">
										Manage Subscription
									</Button>
								</form>
							)}
						</div>
					) : (
						<div>
							<p className="text-base-content/70 mb-4">
								You are currently on the Free plan.
							</p>
							<ButtonLink href="/#pricing" variant="primary" size="sm">
								Upgrade
							</ButtonLink>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
