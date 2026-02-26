/**
 * Admin Users List — client component with search, filters, sorting, pagination.
 *
 * Fetches users from the admin API and renders them in a ResourceTable.
 */

"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { Button, ButtonLink, TextLink } from "@/components/ui"
import { ResourceTable, type Column } from "@/components/admin/ResourceTable"
import { ResourceFilters, type FilterConfig } from "@/components/admin/ResourceFilters"
import { Pagination } from "@/components/admin/Pagination"
import type { PaginationMeta } from "@/types/api"
import type { UserPublic } from "@/types/user"
import { parsePaginatedResponse } from "@/lib/api/client"

type UserRow = Omit<UserPublic, "avatarUrl">

export default function AdminUsersPage() {
	const [users, setUsers] = useState<UserRow[]>([])
	const [pagination, setPagination] = useState<PaginationMeta>({
		page: 1,
		perPage: 20,
		total: 0,
		totalPages: 0,
		hasNext: false,
		hasPrev: false,
	})
	const [loading, setLoading] = useState(true)
	const [search, setSearch] = useState("")
	const [roleFilter, setRoleFilter] = useState("")
	const [activeFilter, setActiveFilter] = useState("")
	const [sortBy, setSortBy] = useState("createdAt")
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

	const fetchUsers = useCallback(async () => {
		setLoading(true)
		try {
			const params = new URLSearchParams({
				page: String(pagination.page),
				perPage: String(pagination.perPage),
				sortBy,
				sortOrder,
			})
			if (search) params.set("search", search)
			if (roleFilter) params.set("role", roleFilter)
			if (activeFilter) params.set("isActive", activeFilter)

			const res = await fetch(`/api/admin/users?${params.toString()}`)
			const result = await parsePaginatedResponse<UserRow>(res)

			if (result.ok) {
				setUsers(result.data)
				setPagination(result.pagination)
			}
		} catch (err) {
			console.error("Failed to fetch users:", err)
		} finally {
			setLoading(false)
		}
	}, [pagination.page, pagination.perPage, search, roleFilter, activeFilter, sortBy, sortOrder])

	useEffect(() => {
		void fetchUsers()
	}, [fetchUsers])

	const handleSort = (key: string) => {
		if (sortBy === key) {
			setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
		} else {
			setSortBy(key)
			setSortOrder("asc")
		}
	}

	const handlePageChange = (page: number) => {
		setPagination((prev) => ({ ...prev, page }))
	}

	const handleDelete = async (id: string) => {
		if (!confirm("Are you sure you want to delete this user?")) return

		try {
			const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" })
			if (res.ok) {
				void fetchUsers()
			}
		} catch (err) {
			console.error("Failed to delete user:", err)
		}
	}

	const columns: Column<UserRow>[] = [
		{
			key: "name",
			label: "Name",
			sortable: true,
			render: (row) => (
				<TextLink
					href={`/admin/users/${row.id}`}
					variant="hover"
					className="font-medium"
				>
					{row.name ?? "—"}
				</TextLink>
			),
		},
		{
			key: "email",
			label: "Email",
			sortable: true,
		},
		{
			key: "role",
			label: "Role",
			sortable: true,
			render: (row) => {
				const badgeClass =
					row.role === "OWNER"
						? "badge-error"
						: row.role === "ADMIN"
							? "badge-warning"
							: "badge-info"
				return <span className={`badge badge-sm ${badgeClass}`}>{row.role}</span>
			},
		},
		{
			key: "isActive",
			label: "Status",
			sortable: true,
			render: (row) => (
				<span
					className={`badge badge-sm ${row.isActive ? "badge-success" : "badge-ghost"
						}`}
				>
					{row.isActive ? "Active" : "Inactive"}
				</span>
			),
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
			key: "role",
			label: "Role",
			value: roleFilter,
			options: [
				{ label: "User", value: "USER" },
				{ label: "Admin", value: "ADMIN" },
				{ label: "Owner", value: "OWNER" },
			],
		},
		{
			key: "isActive",
			label: "Status",
			value: activeFilter,
			options: [
				{ label: "Active", value: "true" },
				{ label: "Inactive", value: "false" },
			],
		},
	]

	return (
		<div>
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-bold">Users</h1>
				<ButtonLink href="/admin/users/new" variant="primary" size="sm">
					<i className="fa-solid fa-plus mr-1" /> New User
				</ButtonLink>
			</div>

			<div className="card bg-base-200">
				<div className="card-body">
					<ResourceFilters
						search={search}
						onSearchChange={(v) => {
							setSearch(v)
							setPagination((prev) => ({ ...prev, page: 1 }))
						}}
						filters={filters}
						onFilterChange={(key, value) => {
							if (key === "role") setRoleFilter(value)
							if (key === "isActive") setActiveFilter(value)
							setPagination((prev) => ({ ...prev, page: 1 }))
						}}
						searchPlaceholder="Search by name or email..."
					/>

					<ResourceTable<UserRow>
						columns={columns}
						data={users}
						sortBy={sortBy}
						sortOrder={sortOrder}
						onSort={handleSort}
						getRowKey={(row) => row.id}
						loading={loading}
						emptyMessage="No users found."
						actions={(row) => (
							<div className="flex gap-1">
							<ButtonLink
								href={`/admin/users/${row.id}`}
								variant="ghost"
								size="xs"
							>
								<i className="fa-solid fa-pen-to-square" />
							</ButtonLink>
							<Button
								variant="ghost"
								size="xs"
								className="text-error"
								onClick={() => handleDelete(row.id)}
								disabled={row.role === "OWNER"}
							>
								<i className="fa-solid fa-trash" />
							</Button>
							</div>
						)}
					/>

					<Pagination
						pagination={pagination}
						onPageChange={handlePageChange}
					/>
				</div>
			</div>
		</div>
	)
}
