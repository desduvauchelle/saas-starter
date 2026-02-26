/**
 * Admin Create Product page.
 */

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button, ButtonLink, Input, Textarea, Select, Toggle } from "@/components/ui"
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
						<Input label="Name *" type="text" value={name} onChange={(e) => setName(e.target.value)} required />

						<Textarea label="Description" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />

						<div className="grid grid-cols-2 gap-4">
							<Input label="Price (USD) *" type="number" step="0.01" min="0" value={price} onChange={(e) => setPrice(e.target.value)} required placeholder="9.99" />

							<Select label="Currency" value={currency} onChange={(e) => setCurrency(e.target.value)} options={[{label:"USD",value:"usd"},{label:"EUR",value:"eur"},{label:"GBP",value:"gbp"}]} />
						</div>

						<Select label="Type *" value={type} onChange={(e) => setType(e.target.value as ProductType)} options={[{label:"Subscription",value:"SUBSCRIPTION"},{label:"One-Time",value:"ONE_TIME"}]} />

						{type === "SUBSCRIPTION" && (
							<div className="grid grid-cols-2 gap-4">
								<Select label="Tier" value={tier} onChange={(e) => setTier(e.target.value as SubscriptionTier | "")} options={[{label:"None",value:""},{label:"Free",value:"FREE"},{label:"Basic",value:"BASIC"},{label:"Pro",value:"PRO"},{label:"Enterprise",value:"ENTERPRISE"}]} />

								<Select label="Interval" value={interval} onChange={(e) => setInterval(e.target.value as SubscriptionInterval | "")} options={[{label:"None",value:""},{label:"Monthly",value:"MONTHLY"},{label:"Yearly",value:"YEARLY"},{label:"Lifetime",value:"LIFETIME"}]} />
							</div>
						)}

						<Textarea label="Features (one per line)" value={features} onChange={(e) => setFeatures(e.target.value)} rows={4} placeholder={"Feature 1\nFeature 2\nFeature 3"} />

						<div className="flex gap-4">
							<Toggle label="Recommended" color="accent" checked={recommended} onChange={(e) => setRecommended(e.target.checked)} />
							<Toggle label="Active" color="success" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
						</div>

						<div className="flex gap-2 pt-2">
							<Button type="submit" variant="primary" loading={saving}>Create Product</Button>
							<ButtonLink href="/admin/products" variant="ghost">Cancel</ButtonLink>
						</div>
					</form>
				</div>
			</div>
		</div>
	)
}
