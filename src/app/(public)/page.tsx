/**
 * Landing page — the public home page at `/`.
 *
 * Uses the (public) route group layout so it gets the public navbar/footer.
 * Includes Hero, Features, Pricing, Testimonials, and CTA sections.
 */

import Link from "next/link"
import { PricingTable } from "@/components/billing/PricingTable"
import prisma from "@/lib/prisma"
import type { Metadata } from "next"

export const metadata: Metadata = {
	title: "Home",
	description:
		"The modern SaaS platform that helps you build, launch, and grow your business faster.",
}

async function getActivePlans() {
	const products = await prisma.product.findMany({
		where: { isActive: true },
		orderBy: { price: "asc" },
		select: {
			id: true,
			name: true,
			description: true,
			price: true,
			currency: true,
			interval: true,
			tier: true,
			features: true,
			recommended: true,
		},
	})

	return products
}

export default async function LandingPage() {
	const appName = process.env.NEXT_PUBLIC_APP_NAME ?? "SaaS Starter"
	const plans = await getActivePlans()

	return (
		<div>
			{/* ── Hero Section ─────────────────────────────────────────────── */}
			<section className="hero min-h-[70vh] bg-base-200">
				<div className="hero-content text-center max-w-3xl">
					<div>
						<h1 className="text-5xl font-bold tracking-tight">
							Build your SaaS faster with{" "}
							<span className="text-primary">{appName}</span>
						</h1>
						<p className="py-6 text-lg text-base-content/70 max-w-xl mx-auto">
							Everything you need to launch your next startup idea.
							Authentication, payments, admin dashboard, blog, and more — all
							pre-configured and ready to go.
						</p>
						<div className="flex gap-3 justify-center">
							<Link href="/register" className="btn btn-primary btn-lg">
								Get Started Free
							</Link>
							<Link href="#features" className="btn btn-ghost btn-lg">
								Learn More
							</Link>
						</div>
					</div>
				</div>
			</section>

			{/* ── Features Section ─────────────────────────────────────────── */}
			<section id="features" className="py-20 px-6">
				<div className="max-w-6xl mx-auto">
					<div className="text-center mb-16">
						<h2 className="text-3xl font-bold">Everything you need</h2>
						<p className="text-base-content/60 mt-3 max-w-lg mx-auto">
							Stop wasting weeks on boilerplate. Start building your product
							from day one.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{features.map((f) => (
							<div key={f.title} className="card bg-base-200">
								<div className="card-body">
									<div className="text-primary text-2xl mb-2">
										<i className={f.icon} />
									</div>
									<h3 className="card-title text-lg">{f.title}</h3>
									<p className="text-base-content/60 text-sm">
										{f.description}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* ── Pricing Section ──────────────────────────────────────────── */}
			{plans.length > 0 && (
				<section id="pricing" className="py-20 px-6 bg-base-200">
					<div className="max-w-6xl mx-auto">
						<div className="text-center mb-12">
							<h2 className="text-3xl font-bold">Simple, transparent pricing</h2>
							<p className="text-base-content/60 mt-3">
								No hidden fees. Cancel anytime.
							</p>
						</div>

						<PricingTable plans={plans} mode="landing" />
					</div>
				</section>
			)}

			{/* ── Testimonials Section ─────────────────────────────────────── */}
			<section className="py-20 px-6">
				<div className="max-w-4xl mx-auto">
					<div className="text-center mb-12">
						<h2 className="text-3xl font-bold">Loved by developers</h2>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{testimonials.map((t) => (
							<div key={t.name} className="card bg-base-200">
								<div className="card-body">
									<p className="text-sm italic text-base-content/70">
										&ldquo;{t.quote}&rdquo;
									</p>
									<div className="mt-3 flex items-center gap-3">
										<div className="avatar placeholder">
											<div className="bg-primary text-primary-content rounded-full w-8">
												<span className="text-xs">{t.name[0]}</span>
											</div>
										</div>
										<div>
											<p className="text-sm font-medium">{t.name}</p>
											<p className="text-xs text-base-content/50">{t.role}</p>
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* ── CTA Section ──────────────────────────────────────────────── */}
			<section className="py-20 px-6 bg-primary text-primary-content">
				<div className="max-w-3xl mx-auto text-center">
					<h2 className="text-3xl font-bold">Ready to get started?</h2>
					<p className="mt-4 text-primary-content/80">
						Join thousands of developers who are already building with{" "}
						{appName}. Free to start, no credit card required.
					</p>
					<Link
						href="/register"
						className="btn btn-secondary btn-lg mt-6"
					>
						Start Building Today
					</Link>
				</div>
			</section>
		</div>
	)
}

/* ── Static data ─────────────────────────────────────────────────────────── */

const features = [
	{
		icon: "fa-solid fa-shield-halved",
		title: "Authentication",
		description:
			"OAuth providers (Google, GitHub, Apple), magic links, and credentials — all auto-configured from env vars.",
	},
	{
		icon: "fa-solid fa-credit-card",
		title: "Stripe Payments",
		description:
			"Subscriptions, one-time payments, customer portal, and webhooks — ready to accept payments.",
	},
	{
		icon: "fa-solid fa-gauge-high",
		title: "Admin Dashboard",
		description:
			"Manage users, content, products, and subscriptions with built-in CRUD pages and role-based access.",
	},
	{
		icon: "fa-solid fa-pen-fancy",
		title: "Blog System",
		description:
			"SEO-friendly blog with markdown support, frontmatter metadata, and a full admin editor.",
	},
	{
		icon: "fa-solid fa-cloud-arrow-up",
		title: "File Storage",
		description:
			"Upload files to Vercel Blob or AWS S3 with a unified API. Just swap env vars to switch providers.",
	},
	{
		icon: "fa-solid fa-palette",
		title: "DaisyUI + shadcn/ui",
		description:
			"Beautiful, accessible components with light/dark themes. Full design system out of the box.",
	},
]

const testimonials = [
	{
		name: "Alex Chen",
		role: "Indie Hacker",
		quote:
			"Saved me at least 2 weeks of setup time. I was able to focus on my actual product immediately.",
	},
	{
		name: "Sarah Johnson",
		role: "Startup CTO",
		quote:
			"The TypeScript strictness and code quality is exactly what I want for a production codebase.",
	},
	{
		name: "Marcus Williams",
		role: "Full-Stack Developer",
		quote:
			"Finally a SaaS starter that doesn't make me fight with the architecture. It just works.",
	},
]
