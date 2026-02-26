/**
 * Admin Dashboard — overview page with stats cards.
 *
 * Shows quick stats for users, posts, products, and subscriptions.
 * Accessible to both ADMIN and OWNER roles.
 */

import prisma from "@/lib/prisma"
import Link from "next/link"
import { ButtonLink } from "@/components/ui"

export default async function AdminDashboardPage() {
	const [userCount, postCount, productCount, subscriptionCount] =
		await Promise.all([
			prisma.user.count(),
			prisma.post.count(),
			prisma.product.count(),
			prisma.subscription.count({ where: { status: "ACTIVE" } }),
		])

	const stats = [
		{
			label: "Total Users",
			value: userCount,
			icon: "users",
			color: "text-primary",
			href: "/admin/users",
		},
		{
			label: "Blog Posts",
			value: postCount,
			icon: "newspaper",
			color: "text-secondary",
			href: "/admin/blog",
		},
		{
			label: "Products",
			value: productCount,
			icon: "box",
			color: "text-accent",
			href: "/admin/products",
		},
		{
			label: "Active Subscriptions",
			value: subscriptionCount,
			icon: "credit-card",
			color: "text-success",
			href: "/admin/subscriptions",
		},
	]

	return (
		<div>
			<h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

			{/* Stats Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
				{stats.map((stat) => (
					<Link
						key={stat.label}
						href={stat.href}
						className="card bg-base-200 hover:bg-base-300 transition-colors"
					>
						<div className="card-body">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm text-base-content/60">{stat.label}</p>
									<p className="text-3xl font-bold mt-1">{stat.value}</p>
								</div>
								<i
									className={`fa-solid fa-${stat.icon} text-2xl ${stat.color}`}
								/>
							</div>
						</div>
					</Link>
				))}
			</div>

			{/* Quick Actions */}
			<div className="card bg-base-200">
				<div className="card-body">
					<h2 className="card-title text-lg">Quick Actions</h2>
					<div className="flex flex-wrap gap-2 mt-2">
						<ButtonLink href="/admin/users" variant="primary" size="sm">
							<i className="fa-solid fa-user-plus mr-1" /> Manage Users
						</ButtonLink>
						<ButtonLink href="/admin/blog/new" variant="secondary" size="sm">
							<i className="fa-solid fa-plus mr-1" /> New Post
						</ButtonLink>
						<ButtonLink href="/admin/products/new" variant="accent" size="sm">
							<i className="fa-solid fa-plus mr-1" /> New Product
						</ButtonLink>
					</div>
				</div>
			</div>
		</div>
	)
}
