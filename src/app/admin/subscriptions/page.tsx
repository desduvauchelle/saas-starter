/**
 * Admin Subscriptions List page — read-only view of all subscriptions.
 */

"use client"

import { useCallback, useEffect, useState } from "react"
import { TextLink } from "@/components/ui"
import { ResourceTable, type Column } from "@/components/admin/ResourceTable"
import { ResourceFilters, type FilterConfig } from "@/components/admin/ResourceFilters"
import { Pagination } from "@/components/admin/Pagination"
import type { PaginationMeta } from "@/types/api"
import type { SubscriptionStatus, SubscriptionTier, SubscriptionInterval } from "@prisma/client"
import { parsePaginatedResponse } from "@/lib/api/client"

interface SubscriptionRow {
	id: string
	status: SubscriptionStatus
	currentPeriodStart: string | null
	currentPeriodEnd: string | null
	cancelAtPeriodEnd: boolean
	stripeSubscriptionId: string | null
	createdAt: string
	user: {
		id: string
		name: string | null
		email: string | null
	}
	product: {
		id: string
		name: string
		price: number
		currency: string
		type: string
		tier: SubscriptionTier | null
		interval: SubscriptionInterval | null
	}
}

function formatPrice(cents: number, currency: string): string {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: currency.toUpperCase(),
	}).format(cents / 100)
}

const statusColors: Record<SubscriptionStatus, string> = {
	ACTIVE: "badge-success",
	CANCELED: "badge-error",
	PAST_DUE: "badge-warning",
	TRIALING: "badge-info",
	INCOMPLETE: "badge-ghost",
}

export default function AdminSubscriptionsPage() {
	const [subscriptions, setSubscriptions] = useState<SubscriptionRow[]>([])
	const [pagination, setPagination] = useState<PaginationMeta>({
		page: 1, perPage: 20, total: 0, totalPages: 0, hasNext: false, hasPrev: false,
	})
	const [loading, setLoading] = useState(true)
	const [search, setSearch] = useState("")
	const [statusFilter, setStatusFilter] = useState("")
	const [sortBy, setSortBy] = useState("createdAt")
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

	const fetchSubscriptions = useCallback(async () => {
		setLoading(true)
		try {
			const params = new URLSearchParams({
				page: String(pagination.page),
				perPage: String(pagination.perPage),
				sortBy,
				sortOrder,
			})
			if (search) params.set("search", search)
			if (statusFilter) params.set("status", statusFilter)

			const res = await fetch(`/api/admin/subscriptions?${params.toString()}`)
			const result = await parsePaginatedResponse<SubscriptionRow>(res)

			if (result.ok) {
				setSubscriptions(result.data)
				setPagination(result.pagination)
			}
		} catch (err) {
			console.error("Failed to fetch subscriptions:", err)
		} finally {
			setLoading(false)
		}
	}, [pagination.page, pagination.perPage, search, statusFilter, sortBy, sortOrder])

	useEffect(() => {
		void fetchSubscriptions()
	}, [fetchSubscriptions])

	const handleSort = (key: string) => {
		if (sortBy === key) {
			setSortOrder((p) => (p === "asc" ? "desc" : "asc"))
		} else {
			setSortBy(key)
			setSortOrder("asc")
		}
	}

	const columns: Column<SubscriptionRow>[] = [
		{
			key: "user",
			label: "User",
			render: (row) => (
				<div>
				<TextLink href={`/admin/users/${row.user.id}`} variant="hover" className="font-medium">
					{row.user.name ?? "—"}
				</TextLink>
					<div className="text-xs text-base-content/60">{row.user.email}</div>
				</div>
			),
		},
		{
			key: "product",
			label: "Product",
			render: (row) => (
				<div>
				<TextLink href={`/admin/products/${row.product.id}`} variant="hover">
					{row.product.name}
				</TextLink>
					<div className="text-xs text-base-content/60">
						{formatPrice(row.product.price, row.product.currency)}
						{row.product.interval ? ` / ${row.product.interval.toLowerCase()}` : ""}
					</div>
				</div>
			),
		},
		{
			key: "status",
			label: "Status",
			sortable: true,
			render: (row) => (
				<div>
					<span className={`badge badge-sm ${statusColors[row.status]}`}>
						{row.status}
					</span>
					{row.cancelAtPeriodEnd && (
						<div className="text-xs text-warning mt-0.5">Cancels at period end</div>
					)}
				</div>
			),
		},
		{
			key: "currentPeriodEnd",
			label: "Renews",
			sortable: true,
			render: (row) =>
				row.currentPeriodEnd
					? new Date(row.currentPeriodEnd).toLocaleDateString()
					: "—",
		},
		{
			key: "createdAt",
			label: "Created",
			sortable: true,
			render: (row) => new Date(row.createdAt).toLocaleDateString(),
		},
	]

	const filters: FilterConfig[] = [
		{
			key: "status",
			label: "Status",
			value: statusFilter,
			options: [
				{ label: "Active", value: "ACTIVE" },
				{ label: "Canceled", value: "CANCELED" },
				{ label: "Past Due", value: "PAST_DUE" },
				{ label: "Trialing", value: "TRIALING" },
				{ label: "Incomplete", value: "INCOMPLETE" },
			],
		},
	]

	return (
		<div>
			<h1 className="text-2xl font-bold mb-6">Subscriptions</h1>

			<div className="card bg-base-200">
				<div className="card-body">
					<ResourceFilters
						search={search}
						onSearchChange={(v) => { setSearch(v); setPagination((p) => ({ ...p, page: 1 })) }}
						filters={filters}
						onFilterChange={(key, value) => {
							if (key === "status") setStatusFilter(value)
							setPagination((p) => ({ ...p, page: 1 }))
						}}
						searchPlaceholder="Search by user or product..."
					/>

					<ResourceTable<SubscriptionRow>
						columns={columns}
						data={subscriptions}
						sortBy={sortBy}
						sortOrder={sortOrder}
						onSort={handleSort}
						getRowKey={(row) => row.id}
						loading={loading}
						emptyMessage="No subscriptions found."
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
