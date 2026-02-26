/**
 * Admin Edit Product page.
 */

"use client"

import { useCallback, useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button, ButtonLink, Input, Textarea, Select, Toggle } from "@/components/ui"
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
				<ButtonLink href="/admin/products" variant="ghost" size="sm" className="mt-4">Back to Products</ButtonLink>
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
				<Button variant="error" size="sm" onClick={handleDelete}>
					<i className="fa-solid fa-trash mr-1" /> Delete
				</Button>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<div className="lg:col-span-2">
					<div className="card bg-base-200">
						<div className="card-body">
							{error && <div className="alert alert-error"><span>{error}</span></div>}
							{success && <div className="alert alert-success"><span>{success}</span></div>}

							<form onSubmit={handleSave} className="space-y-4">
								<Input label="Name *" type="text" value={name} onChange={(e) => setName(e.target.value)} required />

								<Textarea label="Description" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />

								<div className="grid grid-cols-2 gap-4">
									<Input label="Price *" type="number" step="0.01" min="0" value={price} onChange={(e) => setPrice(e.target.value)} required />
									<Select label="Currency" value={currency} onChange={(e) => setCurrency(e.target.value)} options={[{label:"USD",value:"usd"},{label:"EUR",value:"eur"},{label:"GBP",value:"gbp"}]} />
								</div>

								<Select label="Type" value={type} onChange={(e) => setType(e.target.value as ProductType)} options={[{label:"Subscription",value:"SUBSCRIPTION"},{label:"One-Time",value:"ONE_TIME"}]} />

								{type === "SUBSCRIPTION" && (
									<div className="grid grid-cols-2 gap-4">
										<Select label="Tier" value={tier} onChange={(e) => setTier(e.target.value as SubscriptionTier | "")} options={[{label:"None",value:""},{label:"Free",value:"FREE"},{label:"Basic",value:"BASIC"},{label:"Pro",value:"PRO"},{label:"Enterprise",value:"ENTERPRISE"}]} />
										<Select label="Interval" value={interval} onChange={(e) => setInterval(e.target.value as SubscriptionInterval | "")} options={[{label:"None",value:""},{label:"Monthly",value:"MONTHLY"},{label:"Yearly",value:"YEARLY"},{label:"Lifetime",value:"LIFETIME"}]} />
									</div>
								)}

								<Textarea label="Features" value={features} onChange={(e) => setFeatures(e.target.value)} rows={4} placeholder={"Feature 1\nFeature 2"} />

								<div className="flex gap-4">
									<Toggle label="Recommended" color="accent" checked={recommended} onChange={(e) => setRecommended(e.target.checked)} />
									<Toggle label="Active" color="success" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
								</div>

								<div className="flex gap-2 pt-2">
									<Button type="submit" variant="primary" loading={saving}>Save Changes</Button>
									<ButtonLink href="/admin/products" variant="ghost">Cancel</ButtonLink>
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
