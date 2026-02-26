/**
 * Admin Edit Post page — loads post data and renders PostEditor.
 */

"use client"

import { useCallback, useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { PostEditor } from "@/components/admin/PostEditor"
import type { PostStatus } from "@prisma/client"
import { parseApiResponse } from "@/lib/api/client"

interface PostData {
	id: string
	title: string
	slug: string
	description: string | null
	keywords: string[]
	content: string
	coverImage: string | null
	status: PostStatus
	publishedAt: string | null
	createdAt: string
	updatedAt: string
	author: {
		id: string
		name: string | null
	}
}

export default function AdminEditPostPage() {
	const params = useParams<{ id: string }>()
	const router = useRouter()
	const [post, setPost] = useState<PostData | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState("")

	const fetchPost = useCallback(async () => {
		try {
			const res = await fetch(`/api/admin/blog/${params.id}`)
			const result = await parseApiResponse<PostData>(res)

			if (result.ok) {
				setPost(result.data)
			} else {
				setError(result.message)
			}
		} catch {
			setError("Failed to load post")
		} finally {
			setLoading(false)
		}
	}, [params.id])

	useEffect(() => {
		void fetchPost()
	}, [fetchPost])

	const handleSubmit = async (data: {
		title: string
		slug: string
		description: string
		keywords: string[]
		content: string
		coverImage: string
		status: string
	}) => {
		const res = await fetch(`/api/admin/blog/${params.id}`, {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		})

		const result = await parseApiResponse<PostData>(res)
		if (!result.ok) {
			throw new Error(result.message)
		}

		void fetchPost()
	}

	const handleDelete = async () => {
		const res = await fetch(`/api/admin/blog/${params.id}`, {
			method: "DELETE",
		})

		const delResult = await parseApiResponse<unknown>(res)
		if (!delResult.ok) {
			throw new Error(delResult.message)
		}

		router.push("/admin/blog")
	}

	if (loading) {
		return (
			<div className="flex justify-center py-12">
				<span className="loading loading-spinner loading-lg" />
			</div>
		)
	}

	if (!post) {
		return (
			<div className="text-center py-12">
				<p className="text-error">{error || "Post not found"}</p>
				<Link href="/admin/blog" className="btn btn-ghost btn-sm mt-4">
					Back to Blog
				</Link>
			</div>
		)
	}

	return (
		<div>
			<div className="text-sm breadcrumbs mb-4">
				<ul>
					<li><Link href="/admin">Admin</Link></li>
					<li><Link href="/admin/blog">Blog</Link></li>
					<li>Edit: {post.title}</li>
				</ul>
			</div>

			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-bold">Edit Post</h1>
				<a
					href={`/blog/${post.slug}`}
					target="_blank"
					rel="noopener noreferrer"
					className="btn btn-ghost btn-sm"
				>
					<i className="fa-solid fa-eye mr-1" /> Preview
				</a>
			</div>

			<PostEditor
				initialData={{
					title: post.title,
					slug: post.slug,
					description: post.description ?? "",
					keywords: post.keywords,
					content: post.content,
					coverImage: post.coverImage ?? "",
					status: post.status,
				}}
				onSubmit={handleSubmit}
				submitLabel="Update Post"
				showDelete
				onDelete={handleDelete}
			/>
		</div>
	)
}
