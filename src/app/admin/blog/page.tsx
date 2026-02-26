/**
 * Admin Blog List — paginated list of blog posts with search and filters.
 */

"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { Button, ButtonLink, TextLink } from "@/components/ui"
import { ResourceTable, type Column } from "@/components/admin/ResourceTable"
import { ResourceFilters, type FilterConfig } from "@/components/admin/ResourceFilters"
import { Pagination } from "@/components/admin/Pagination"
import type { PaginationMeta } from "@/types/api"
import type { PostStatus } from "@prisma/client"
import { parsePaginatedResponse } from "@/lib/api/client"

interface PostRow {
	id: string
	slug: string
	title: string
	description: string | null
	status: PostStatus
	publishedAt: string | null
	createdAt: string
	author: {
		id: string
		name: string | null
	}
}

export default function AdminBlogPage() {
	const [posts, setPosts] = useState<PostRow[]>([])
	const [pagination, setPagination] = useState<PaginationMeta>({
		page: 1, perPage: 20, total: 0, totalPages: 0, hasNext: false, hasPrev: false,
	})
	const [loading, setLoading] = useState(true)
	const [search, setSearch] = useState("")
	const [statusFilter, setStatusFilter] = useState("")
	const [sortBy, setSortBy] = useState("createdAt")
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

	const fetchPosts = useCallback(async () => {
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

			const res = await fetch(`/api/admin/blog?${params.toString()}`)
			const result = await parsePaginatedResponse<PostRow>(res)

			if (result.ok) {
				setPosts(result.data)
				setPagination(result.pagination)
			}
		} catch (err) {
			console.error("Failed to fetch posts:", err)
		} finally {
			setLoading(false)
		}
	}, [pagination.page, pagination.perPage, search, statusFilter, sortBy, sortOrder])

	useEffect(() => {
		void fetchPosts()
	}, [fetchPosts])

	const handleSort = (key: string) => {
		if (sortBy === key) {
			setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
		} else {
			setSortBy(key)
			setSortOrder("asc")
		}
	}

	const handleDelete = async (id: string) => {
		if (!confirm("Delete this post? This cannot be undone.")) return
		try {
			const res = await fetch(`/api/admin/blog/${id}`, { method: "DELETE" })
			if (res.ok) void fetchPosts()
		} catch (err) {
			console.error("Failed to delete post:", err)
		}
	}

	const columns: Column<PostRow>[] = [
		{
			key: "title",
			label: "Title",
			sortable: true,
			render: (row) => (
				<TextLink href={`/admin/blog/${row.id}`} variant="hover" className="font-medium">
					{row.title}
				</TextLink>
			),
		},
		{
			key: "slug",
			label: "Slug",
			sortable: true,
			render: (row) => (
				<code className="text-xs text-base-content/60">{row.slug}</code>
			),
		},
		{
			key: "status",
			label: "Status",
			sortable: true,
			render: (row) => (
				<span className={`badge badge-sm ${row.status === "PUBLISHED" ? "badge-success" : "badge-warning"}`}>
					{row.status}
				</span>
			),
		},
		{
			key: "author",
			label: "Author",
			render: (row) => row.author.name ?? "—",
		},
		{
			key: "publishedAt",
			label: "Published",
			sortable: true,
			render: (row) => row.publishedAt ? new Date(row.publishedAt).toLocaleDateString() : "—",
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
				{ label: "Draft", value: "DRAFT" },
				{ label: "Published", value: "PUBLISHED" },
			],
		},
	]

	return (
		<div>
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-bold">Blog Posts</h1>
				<ButtonLink href="/admin/blog/new" variant="primary" size="sm">
					<i className="fa-solid fa-plus mr-1" /> New Post
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
							if (key === "status") setStatusFilter(value)
							setPagination((prev) => ({ ...prev, page: 1 }))
						}}
						searchPlaceholder="Search posts..."
					/>

					<ResourceTable<PostRow>
						columns={columns}
						data={posts}
						sortBy={sortBy}
						sortOrder={sortOrder}
						onSort={handleSort}
						getRowKey={(row) => row.id}
						loading={loading}
						emptyMessage="No posts found."
						actions={(row) => (
							<div className="flex gap-1">
							<ButtonLink href={`/admin/blog/${row.id}`} variant="ghost" size="xs" title="Edit">
								<i className="fa-solid fa-pen-to-square" />
							</ButtonLink>
								<a
									href={`/blog/${row.id}/${row.slug}`}
									target="_blank"
									rel="noopener noreferrer"
									className="btn btn-ghost btn-xs"
									title="View"
								>
									<i className="fa-solid fa-eye" />
								</a>
							<Button variant="ghost" size="xs" onClick={() => handleDelete(row.id)} className="text-error" title="Delete">
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
