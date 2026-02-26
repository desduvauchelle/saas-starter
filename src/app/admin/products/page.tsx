/**
 * Admin Products List page.
 */

"use client"

import { useCallback, useEffect, useState } from "react"
import { Button, ButtonLink, TextLink } from "@/components/ui"
import { ResourceTable, type Column } from "@/components/admin/ResourceTable"
import { ResourceFilters, type FilterConfig } from "@/components/admin/ResourceFilters"
import { Pagination } from "@/components/admin/Pagination"
import type { PaginationMeta } from "@/types/api"
import type { ProductType, SubscriptionTier, SubscriptionInterval } from "@prisma/client"
import { parseApiResponse, parsePaginatedResponse } from "@/lib/api/client"

interface ProductRow {
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
	createdAt: string
	_count: { subscriptions: number }
}

function formatPrice(cents: number, currency: string): string {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: currency.toUpperCase(),
	}).format(cents / 100)
}

export default function AdminProductsPage() {
	const [products, setProducts] = useState<ProductRow[]>([])
	const [pagination, setPagination] = useState<PaginationMeta>({
		page: 1, perPage: 20, total: 0, totalPages: 0, hasNext: false, hasPrev: false,
	})
	const [loading, setLoading] = useState(true)
	const [search, setSearch] = useState("")
	const [typeFilter, setTypeFilter] = useState("")
	const [sortBy, setSortBy] = useState("createdAt")
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

	const fetchProducts = useCallback(async () => {
		setLoading(true)
		try {
			const params = new URLSearchParams({
				page: String(pagination.page),
				perPage: String(pagination.perPage),
				sortBy,
				sortOrder,
			})
			if (search) params.set("search", search)
			if (typeFilter) params.set("type", typeFilter)

			const res = await fetch(`/api/admin/products?${params.toString()}`)
			const result = await parsePaginatedResponse<ProductRow>(res)

			if (result.ok) {
				setProducts(result.data)
				setPagination(result.pagination)
			}
		} catch (err) {
			console.error("Failed to fetch products:", err)
		} finally {
			setLoading(false)
		}
	}, [pagination.page, pagination.perPage, search, typeFilter, sortBy, sortOrder])

	useEffect(() => {
		void fetchProducts()
	}, [fetchProducts])

	const handleSort = (key: string) => {
		if (sortBy === key) {
			setSortOrder((p) => (p === "asc" ? "desc" : "asc"))
		} else {
			setSortBy(key)
			setSortOrder("asc")
		}
	}

	const handleDelete = async (id: string) => {
		if (!confirm("Delete this product?")) return
		try {
			const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" })
			const result = await parseApiResponse<unknown>(res)
			if (result.ok) void fetchProducts()
			else {
				alert(result.message)
			}
		} catch (err) {
			console.error("Failed to delete product:", err)
		}
	}

	const columns: Column<ProductRow>[] = [
		{
			key: "name",
			label: "Name",
			sortable: true,
			render: (row) => (
				<div>
					<TextLink href={`/admin/products/${row.id}`} variant="hover" className="font-medium">
						{row.name}
					</TextLink>
					{row.recommended && (
						<span className="badge badge-xs badge-accent ml-2">Recommended</span>
					)}
				</div>
			),
		},
		{
			key: "price",
			label: "Price",
			sortable: true,
			render: (row) => formatPrice(row.price, row.currency),
		},
		{
			key: "type",
			label: "Type",
			sortable: true,
			render: (row) => (
				<div className="flex flex-col">
					<span className="badge badge-sm badge-outline">{row.type}</span>
					{row.tier && <span className="text-xs text-base-content/60 mt-0.5">{row.tier}</span>}
					{row.interval && <span className="text-xs text-base-content/60">{row.interval}</span>}
				</div>
			),
		},
		{
			key: "isActive",
			label: "Status",
			render: (row) => (
				<span className={`badge badge-sm ${row.isActive ? "badge-success" : "badge-ghost"}`}>
					{row.isActive ? "Active" : "Inactive"}
				</span>
			),
		},
		{
			key: "subscriptions",
			label: "Subs",
			render: (row) => <span className="badge badge-sm">{row._count.subscriptions}</span>,
		},
		{
			key: "stripe",
			label: "Stripe",
			render: (row) => (
				<span className={`badge badge-sm ${row.stripeProductId ? "badge-info" : "badge-ghost"}`}>
					{row.stripeProductId ? "Linked" : "Local"}
				</span>
			),
		},
	]

	const filters: FilterConfig[] = [
		{
			key: "type",
			label: "Type",
			value: typeFilter,
			options: [
				{ label: "One-Time", value: "ONE_TIME" },
				{ label: "Subscription", value: "SUBSCRIPTION" },
			],
		},
	]

	return (
		<div>
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-bold">Products</h1>
				<ButtonLink href="/admin/products/new" variant="primary" size="sm">
					<i className="fa-solid fa-plus mr-1" /> New Product
				</ButtonLink>
			</div>

			<div className="card bg-base-200">
				<div className="card-body">
					<ResourceFilters
						search={search}
						onSearchChange={(v) => { setSearch(v); setPagination((p) => ({ ...p, page: 1 })) }}
						filters={filters}
						onFilterChange={(key, value) => {
							if (key === "type") setTypeFilter(value)
							setPagination((p) => ({ ...p, page: 1 }))
						}}
						searchPlaceholder="Search products..."
					/>

					<ResourceTable<ProductRow>
						columns={columns}
						data={products}
						sortBy={sortBy}
						sortOrder={sortOrder}
						onSort={handleSort}
						getRowKey={(row) => row.id}
						loading={loading}
						emptyMessage="No products found."
						actions={(row) => (
							<div className="flex gap-1">
								<ButtonLink href={`/admin/products/${row.id}`} variant="ghost" size="xs" title="Edit">
									<i className="fa-solid fa-pen-to-square" />
								</ButtonLink>
								<Button
									onClick={() => handleDelete(row.id)}
									variant="ghost"
									size="xs"
									className="text-error"
									title="Delete"
								>
									<i className="fa-solid fa-trash" />
								</Button>
							</div>
						)}
					/>

					<Pagination
						pagination={pagination}
						onPageChange={(p) => setPagination((prev) => ({ ...prev, page: p }))}
					/>
				</div>
			</div>
		</div>
	)
}
