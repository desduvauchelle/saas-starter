/**
 * Admin Edit Product page.
 */

"use client"

import { useCallback, useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import type { ProductType, SubscriptionTier, SubscriptionInterval } from "@prisma/client"
import { parseApiResponse } from "@/lib/api/client"

interface ProductData {
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
	stripeProductId: string | null
	stripePriceId: string | null
	createdAt: string
	updatedAt: string
	_count: { subscriptions: number }
}

export default function AdminEditProductPage() {
	const params = useParams<{ id: string }>()
	const router = useRouter()
	const [product, setProduct] = useState<ProductData | null>(null)
	const [loading, setLoading] = useState(true)
	const [saving, setSaving] = useState(false)
	const [error, setError] = useState("")
	const [success, setSuccess] = useState("")

	// Form state
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

	const fetchProduct = useCallback(async () => {
		try {
			const res = await fetch(`/api/admin/products/${params.id}`)
			const result = await parseApiResponse<ProductData>(res)

			if (result.ok) {
				const data = result.data
				setProduct(data)
				setName(data.name)
				setDescription(data.description ?? "")
				setPrice(String(data.price / 100))
				setCurrency(data.currency)
				setType(data.type)
				setTier(data.tier ?? "")
				setInterval(data.interval ?? "")
				setFeatures(data.features.join("\n"))
				setRecommended(data.recommended)
				setIsActive(data.isActive)
			} else {
				setError(result.message)
			}
		} catch {
			setError("Failed to load product")
		} finally {
			setLoading(false)
		}
	}, [params.id])

	useEffect(() => {
		void fetchProduct()
	}, [fetchProduct])

	const handleSave = async (e: React.FormEvent) => {
		e.preventDefault()
		setSaving(true)
		setError("")
		setSuccess("")

		try {
			const res = await fetch(`/api/admin/products/${params.id}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name,
					description: description || undefined,
					price: Math.round(parseFloat(price) * 100),
					currency,
					type,
					tier: tier || null,
					interval: interval || null,
					features: features.split("\n").map((f) => f.trim()).filter(Boolean),
					recommended,
					isActive,
				}),
			})

			const result = await parseApiResponse<ProductData>(res)
			if (result.ok) {
				setSuccess("Product updated successfully")
				void fetchProduct()
			} else {
				setError(result.message)
			}
		} catch {
			setError("Failed to update product")
		} finally {
			setSaving(false)
		}
	}

	const handleDelete = async () => {
		if (!confirm("Delete this product? This cannot be undone.")) return
		try {
			const res = await fetch(`/api/admin/products/${params.id}`, { method: "DELETE" })
			const delResult = await parseApiResponse<unknown>(res)
			if (delResult.ok) {
				router.push("/admin/products")
			} else {
				setError(delResult.message)
			}
		} catch {
			setError("Failed to delete product")
		}
	}

	if (loading) {
		return <div className="flex justify-center py-12"><span className="loading loading-spinner loading-lg" /></div>
	}

	if (!product) {
		return (
			<div className="text-center py-12">
				<p className="text-error">{error || "Product not found"}</p>
				<Link href="/admin/products" className="btn btn-ghost btn-sm mt-4">Back to Products</Link>
			</div>
		)
	}

	return (
		<div>
			<div className="text-sm breadcrumbs mb-4">
				<ul>
					<li><Link href="/admin">Admin</Link></li>
					<li><Link href="/admin/products">Products</Link></li>
					<li>{product.name}</li>
				</ul>
			</div>

			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-bold">Edit Product</h1>
				<button onClick={handleDelete} className="btn btn-error btn-sm">
					<i className="fa-solid fa-trash mr-1" /> Delete
				</button>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<div className="lg:col-span-2">
					<div className="card bg-base-200">
						<div className="card-body">
							{error && <div className="alert alert-error"><span>{error}</span></div>}
							{success && <div className="alert alert-success"><span>{success}</span></div>}

							<form onSubmit={handleSave} className="space-y-4">
								<div className="form-control">
									<label className="label"><span className="label-text">Name *</span></label>
									<input type="text" className="input input-bordered" value={name} onChange={(e) => setName(e.target.value)} required />
								</div>

								<div className="form-control">
									<label className="label"><span className="label-text">Description</span></label>
									<textarea className="textarea textarea-bordered" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
								</div>

								<div className="grid grid-cols-2 gap-4">
									<div className="form-control">
										<label className="label"><span className="label-text">Price *</span></label>
										<input type="number" step="0.01" min="0" className="input input-bordered" value={price} onChange={(e) => setPrice(e.target.value)} required />
									</div>
									<div className="form-control">
										<label className="label"><span className="label-text">Currency</span></label>
										<select className="select select-bordered" value={currency} onChange={(e) => setCurrency(e.target.value)}>
											<option value="usd">USD</option>
											<option value="eur">EUR</option>
											<option value="gbp">GBP</option>
										</select>
									</div>
								</div>

								<div className="form-control">
									<label className="label"><span className="label-text">Type</span></label>
									<select className="select select-bordered" value={type} onChange={(e) => setType(e.target.value as ProductType)}>
										<option value="SUBSCRIPTION">Subscription</option>
										<option value="ONE_TIME">One-Time</option>
									</select>
								</div>

								{type === "SUBSCRIPTION" && (
									<div className="grid grid-cols-2 gap-4">
										<div className="form-control">
											<label className="label"><span className="label-text">Tier</span></label>
											<select className="select select-bordered" value={tier} onChange={(e) => setTier(e.target.value as SubscriptionTier | "")}>
												<option value="">None</option>
												<option value="FREE">Free</option>
												<option value="BASIC">Basic</option>
												<option value="PRO">Pro</option>
												<option value="ENTERPRISE">Enterprise</option>
											</select>
										</div>
										<div className="form-control">
											<label className="label"><span className="label-text">Interval</span></label>
											<select className="select select-bordered" value={interval} onChange={(e) => setInterval(e.target.value as SubscriptionInterval | "")}>
												<option value="">None</option>
												<option value="MONTHLY">Monthly</option>
												<option value="YEARLY">Yearly</option>
												<option value="LIFETIME">Lifetime</option>
											</select>
										</div>
									</div>
								)}

								<div className="form-control">
									<label className="label"><span className="label-text">Features</span></label>
									<textarea className="textarea textarea-bordered" value={features} onChange={(e) => setFeatures(e.target.value)} rows={4} placeholder={"Feature 1\nFeature 2"} />
								</div>

								<div className="flex gap-4">
									<label className="label cursor-pointer gap-2">
										<input type="checkbox" className="toggle toggle-accent" checked={recommended} onChange={(e) => setRecommended(e.target.checked)} />
										<span className="label-text">Recommended</span>
									</label>
									<label className="label cursor-pointer gap-2">
										<input type="checkbox" className="toggle toggle-success" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
										<span className="label-text">Active</span>
									</label>
								</div>

								<div className="flex gap-2 pt-2">
									<button type="submit" className="btn btn-primary" disabled={saving}>
										{saving && <span className="loading loading-spinner loading-xs" />}
										Save Changes
									</button>
									<Link href="/admin/products" className="btn btn-ghost">Cancel</Link>
								</div>
							</form>
						</div>
					</div>
				</div>

				<div className="space-y-4">
					<div className="card bg-base-200">
						<div className="card-body">
							<h3 className="card-title text-sm">Info</h3>
							<div className="space-y-2 text-sm">
								<div className="flex justify-between">
									<span className="text-base-content/60">ID</span>
									<code className="text-xs">{product.id}</code>
								</div>
								<div className="flex justify-between">
									<span className="text-base-content/60">Stripe Product</span>
									<span>{product.stripeProductId ?? "Not linked"}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-base-content/60">Stripe Price</span>
									<span>{product.stripePriceId ?? "Not linked"}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-base-content/60">Subscriptions</span>
									<span className="badge badge-sm">{product._count.subscriptions}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-base-content/60">Created</span>
									<span>{new Date(product.createdAt).toLocaleDateString()}</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
