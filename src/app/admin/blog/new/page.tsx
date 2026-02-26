/**
 * Admin Create Post page.
 */

"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { PostEditor, DEFAULT_POST_TEMPLATE } from "@/components/admin/PostEditor"
import type { PostStatus } from "@prisma/client"

export default function AdminNewPostPage() {
	const router = useRouter()

	const handleSubmit = async (data: { rawContent: string; status: PostStatus }) => {
		const res = await fetch("/api/admin/blog", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		})

		if (!res.ok) {
			const json = (await res.json()) as { error: { message: string } }
			throw new Error(json.error.message)
		}

		const json = (await res.json()) as { data: { id: string } }
		router.push(`/admin/blog/${json.data.id}`)
	}

	return (
		<div>
			<div className="text-sm breadcrumbs mb-4">
				<ul>
					<li><Link href="/admin">Admin</Link></li>
					<li><Link href="/admin/blog">Blog</Link></li>
					<li>New Post</li>
				</ul>
			</div>

			<h1 className="text-2xl font-bold mb-6">New Post</h1>

			<PostEditor
				initialRawContent={DEFAULT_POST_TEMPLATE}
				onSubmit={handleSubmit}
				submitLabel="Create Post"
			/>
		</div>
	)
}
