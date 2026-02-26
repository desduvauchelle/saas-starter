/**
 * Admin Create Product page.
 */

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import type { ProductType, SubscriptionTier, SubscriptionInterval } from "@prisma/client"

export default function AdminNewProductPage() {
	const router = useRouter()
	const [name, setName] = useState("")
	const [description, setDescription] = useState("")
	const [price, setPrice] = useState("")
	const [currency, setCurrency] = useState("usd")
	const [type, setType] = useState<ProductType>("SUBSCRIPTION")
	const [tier, setTier] = useState<SubscriptionTier | "">("")
	const [interval, setInterval] = useState<SubscriptionInterval | "">("")
	const [features, setFeatures] = useState("")
	const [recommended, setRecommended] = useState(false)
	const [isActive, setIsActive] = useState(true)
	const [saving, setSaving] = useState(false)
	const [error, setError] = useState("")

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setSaving(true)
		setError("")

		try {
			const res = await fetch("/api/admin/products", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name,
					description: description || undefined,
					price: Math.round(parseFloat(price) * 100), // dollars to cents
					currency,
					type,
					tier: tier || null,
					interval: interval || null,
					features: features.split("\n").map((f) => f.trim()).filter(Boolean),
					recommended,
					isActive,
				}),
			})

			const json: unknown = await res.json()

			if (res.ok) {
				const data = json as { data: { id: string } }
				router.push(`/admin/products/${data.data.id}`)
			} else {
				const err = json as { error: { message: string } }
				setError(err.error.message)
			}
		} catch {
			setError("Failed to create product")
		} finally {
			setSaving(false)
		}
	}

	return (
		<div>
			<div className="text-sm breadcrumbs mb-4">
				<ul>
					<li><Link href="/admin">Admin</Link></li>
					<li><Link href="/admin/products">Products</Link></li>
					<li>New Product</li>
				</ul>
			</div>

			<h1 className="text-2xl font-bold mb-6">Create Product</h1>

			<div className="card bg-base-200 max-w-2xl">
				<div className="card-body">
					{error && (
						<div className="alert alert-error"><span>{error}</span></div>
					)}

					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="form-control">
							<label className="label"><span className="label-text">Name *</span></label>
							<input
								type="text"
								className="input input-bordered"
								value={name}
								onChange={(e) => setName(e.target.value)}
								required
							/>
						</div>

						<div className="form-control">
							<label className="label"><span className="label-text">Description</span></label>
							<textarea
								className="textarea textarea-bordered"
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								rows={2}
							/>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div className="form-control">
								<label className="label"><span className="label-text">Price (USD) *</span></label>
								<input
									type="number"
									step="0.01"
									min="0"
									className="input input-bordered"
									value={price}
									onChange={(e) => setPrice(e.target.value)}
									required
									placeholder="9.99"
								/>
							</div>

							<div className="form-control">
								<label className="label"><span className="label-text">Currency</span></label>
								<select
									className="select select-bordered"
									value={currency}
									onChange={(e) => setCurrency(e.target.value)}
								>
									<option value="usd">USD</option>
									<option value="eur">EUR</option>
									<option value="gbp">GBP</option>
								</select>
							</div>
						</div>

						<div className="form-control">
							<label className="label"><span className="label-text">Type *</span></label>
							<select
								className="select select-bordered"
								value={type}
								onChange={(e) => setType(e.target.value as ProductType)}
							>
								<option value="SUBSCRIPTION">Subscription</option>
								<option value="ONE_TIME">One-Time</option>
							</select>
						</div>

						{type === "SUBSCRIPTION" && (
							<div className="grid grid-cols-2 gap-4">
								<div className="form-control">
									<label className="label"><span className="label-text">Tier</span></label>
									<select
										className="select select-bordered"
										value={tier}
										onChange={(e) => setTier(e.target.value as SubscriptionTier | "")}
									>
										<option value="">None</option>
										<option value="FREE">Free</option>
										<option value="BASIC">Basic</option>
										<option value="PRO">Pro</option>
										<option value="ENTERPRISE">Enterprise</option>
									</select>
								</div>

								<div className="form-control">
									<label className="label"><span className="label-text">Interval</span></label>
									<select
										className="select select-bordered"
										value={interval}
										onChange={(e) => setInterval(e.target.value as SubscriptionInterval | "")}
									>
										<option value="">None</option>
										<option value="MONTHLY">Monthly</option>
										<option value="YEARLY">Yearly</option>
										<option value="LIFETIME">Lifetime</option>
									</select>
								</div>
							</div>
						)}

						<div className="form-control">
							<label className="label"><span className="label-text">Features (one per line)</span></label>
							<textarea
								className="textarea textarea-bordered"
								value={features}
								onChange={(e) => setFeatures(e.target.value)}
								rows={4}
								placeholder={"Feature 1\nFeature 2\nFeature 3"}
							/>
						</div>

						<div className="flex gap-4">
							<label className="label cursor-pointer gap-2">
								<input
									type="checkbox"
									className="toggle toggle-accent"
									checked={recommended}
									onChange={(e) => setRecommended(e.target.checked)}
								/>
								<span className="label-text">Recommended</span>
							</label>

							<label className="label cursor-pointer gap-2">
								<input
									type="checkbox"
									className="toggle toggle-success"
									checked={isActive}
									onChange={(e) => setIsActive(e.target.checked)}
								/>
								<span className="label-text">Active</span>
							</label>
						</div>

						<div className="flex gap-2 pt-2">
							<button type="submit" className="btn btn-primary" disabled={saving}>
								{saving && <span className="loading loading-spinner loading-xs" />}
								Create Product
							</button>
							<Link href="/admin/products" className="btn btn-ghost">Cancel</Link>
						</div>
					</form>
				</div>
			</div>
		</div>
	)
}
