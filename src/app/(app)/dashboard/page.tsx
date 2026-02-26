/**
 * Dashboard — authenticated landing page.
 *
 * Simple page confirming user is authenticated.
 * Shows user name and role badge.
 */

import { auth } from "@/lib/auth/config"
import { redirect } from "next/navigation"

export const metadata = {
	title: "Dashboard",
}

export default async function DashboardPage() {
	const session = await auth()
	if (!session?.user) redirect("/login")

	const { user } = session

	const roleBadgeClass =
		user.role === "OWNER"
			? "badge-primary"
			: user.role === "ADMIN"
				? "badge-secondary"
				: "badge-ghost"

	return (
		<div className="space-y-6">
			<div className="flex items-center gap-4">
				<h1 className="text-3xl font-bold">Dashboard</h1>
				<span className={`badge ${roleBadgeClass}`}>{user.role}</span>
			</div>

			<div className="card bg-base-100 shadow-sm">
				<div className="card-body">
					<h2 className="card-title">
						Welcome back, {user.name ?? "there"}! 👋
					</h2>
					<p className="text-base-content/70">
						You are signed in as{" "}
						<span className="font-medium">{user.email}</span>.
					</p>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<div className="card bg-base-100 shadow-sm">
					<div className="card-body">
						<h3 className="card-title text-lg">Account</h3>
						<p className="text-sm text-base-content/70">
							Manage your profile, security, and billing.
						</p>
					</div>
				</div>
				<div className="card bg-base-100 shadow-sm">
					<div className="card-body">
						<h3 className="card-title text-lg">Getting Started</h3>
						<p className="text-sm text-base-content/70">
							This is your SaaS boilerplate. Start building!
						</p>
					</div>
				</div>
				<div className="card bg-base-100 shadow-sm">
					<div className="card-body">
						<h3 className="card-title text-lg">Documentation</h3>
						<p className="text-sm text-base-content/70">
							Check the /docs folder for architecture guides.
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}
