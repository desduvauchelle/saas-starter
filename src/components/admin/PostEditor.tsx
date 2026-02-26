/**
 * Post editor form — shared between create and edit pages.
 *
 * Provides a markdown editor with metadata fields (title, slug, description,
 * keywords, cover image, status). Uses a plain textarea for markdown content.
 */

"use client"

import { useState } from "react"
import Link from "next/link"
import type { PostStatus } from "@prisma/client"

interface PostFormData {
	title: string
	slug: string
	description: string
	keywords: string[]
	content: string
	coverImage: string
	status: PostStatus
}

interface PostEditorProps {
	/** Initial values (for editing) */
	initialData?: Partial<PostFormData>
	/** Called on save */
	onSubmit: (data: PostFormData) => Promise<void>
	/** Button label */
	submitLabel?: string
	/** Show delete button */
	showDelete?: boolean
	/** Called on delete */
	onDelete?: () => Promise<void>
}

export function PostEditor({
	initialData,
	onSubmit,
	submitLabel = "Save Post",
	showDelete,
	onDelete,
}: PostEditorProps) {
	const [title, setTitle] = useState(initialData?.title ?? "")
	const [slug, setSlug] = useState(initialData?.slug ?? "")
	const [description, setDescription] = useState(initialData?.description ?? "")
	const [keywords, setKeywords] = useState(initialData?.keywords?.join(", ") ?? "")
	const [content, setContent] = useState(initialData?.content ?? "")
	const [coverImage, setCoverImage] = useState(initialData?.coverImage ?? "")
	const [status, setStatus] = useState<PostStatus>(initialData?.status ?? "DRAFT")
	const [saving, setSaving] = useState(false)
	const [error, setError] = useState("")

	/** Auto-generate slug from title */
	const generateSlug = (text: string): string => {
		return text
			.toLowerCase()
			.replace(/[^a-z0-9\s-]/g, "")
			.replace(/\s+/g, "-")
			.replace(/-+/g, "-")
			.replace(/^-|-$/g, "")
	}

	const handleTitleChange = (value: string) => {
		setTitle(value)
		// Only auto-generate slug if it hasn't been manually edited
		if (!initialData?.slug) {
			setSlug(generateSlug(value))
		}
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setSaving(true)
		setError("")

		try {
			await onSubmit({
				title,
				slug,
				description,
				keywords: keywords
					.split(",")
					.map((k) => k.trim())
					.filter(Boolean),
				content,
				coverImage,
				status,
			})
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to save post")
		} finally {
			setSaving(false)
		}
	}

	const handleDelete = async () => {
		if (!confirm("Delete this post? This cannot be undone.")) return
		try {
			await onDelete?.()
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to delete post")
		}
	}

	return (
		<form onSubmit={handleSubmit}>
			{error && (
				<div className="alert alert-error mb-4">
					<span>{error}</span>
				</div>
			)}

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Main content */}
				<div className="lg:col-span-2 space-y-4">
					<div className="form-control">
						<label className="label">
							<span className="label-text">Title *</span>
						</label>
						<input
							type="text"
							className="input input-bordered"
							value={title}
							onChange={(e) => handleTitleChange(e.target.value)}
							required
						/>
					</div>

					<div className="form-control">
						<label className="label">
							<span className="label-text">Slug *</span>
						</label>
						<input
							type="text"
							className="input input-bordered font-mono text-sm"
							value={slug}
							onChange={(e) => setSlug(e.target.value)}
							required
							pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
						/>
						<label className="label">
							<span className="label-text-alt text-base-content/50">
								URL: /blog/{slug || "..."}
							</span>
						</label>
					</div>

					<div className="form-control">
						<label className="label">
							<span className="label-text">Content (Markdown) *</span>
						</label>
						<textarea
							className="textarea textarea-bordered font-mono text-sm min-h-[400px]"
							value={content}
							onChange={(e) => setContent(e.target.value)}
							required
							placeholder="Write your blog post in Markdown..."
						/>
						<label className="label">
							<span className="label-text-alt text-base-content/50">
								Supports Markdown formatting. Use ## for headings, **bold**, *italic*, etc.
							</span>
						</label>
					</div>
				</div>

				{/* Sidebar / metadata */}
				<div className="space-y-4">
					{/* Actions */}
					<div className="card bg-base-200">
						<div className="card-body">
							<h3 className="card-title text-sm">Publish</h3>

							<div className="form-control">
								<label className="label">
									<span className="label-text text-sm">Status</span>
								</label>
								<select
									className="select select-bordered select-sm"
									value={status}
									onChange={(e) => setStatus(e.target.value as PostStatus)}
								>
									<option value="DRAFT">Draft</option>
									<option value="PUBLISHED">Published</option>
								</select>
							</div>

							<div className="flex gap-2 mt-3">
								<button
									type="submit"
									className="btn btn-primary btn-sm flex-1"
									disabled={saving}
								>
									{saving && <span className="loading loading-spinner loading-xs" />}
									{submitLabel}
								</button>
								<Link href="/admin/blog" className="btn btn-ghost btn-sm">
									Cancel
								</Link>
							</div>

							{showDelete && onDelete && (
								<button
									type="button"
									onClick={handleDelete}
									className="btn btn-error btn-sm btn-outline mt-2 w-full"
								>
									<i className="fa-solid fa-trash mr-1" /> Delete Post
								</button>
							)}
						</div>
					</div>

					{/* Description */}
					<div className="card bg-base-200">
						<div className="card-body">
							<h3 className="card-title text-sm">SEO</h3>

							<div className="form-control">
								<label className="label">
									<span className="label-text text-sm">Description</span>
								</label>
								<textarea
									className="textarea textarea-bordered textarea-sm"
									rows={3}
									value={description}
									onChange={(e) => setDescription(e.target.value)}
									maxLength={500}
									placeholder="Brief description for search engines..."
								/>
							</div>

							<div className="form-control">
								<label className="label">
									<span className="label-text text-sm">Keywords</span>
								</label>
								<input
									type="text"
									className="input input-bordered input-sm"
									value={keywords}
									onChange={(e) => setKeywords(e.target.value)}
									placeholder="keyword1, keyword2, keyword3"
								/>
								<label className="label">
									<span className="label-text-alt text-base-content/50">
										Comma-separated
									</span>
								</label>
							</div>
						</div>
					</div>

					{/* Cover Image */}
					<div className="card bg-base-200">
						<div className="card-body">
							<h3 className="card-title text-sm">Cover Image</h3>

							<div className="form-control">
								<input
									type="url"
									className="input input-bordered input-sm"
									value={coverImage}
									onChange={(e) => setCoverImage(e.target.value)}
									placeholder="https://example.com/image.jpg"
								/>
							</div>

							{coverImage && (
								<div className="mt-2 aspect-video bg-base-300 rounded overflow-hidden">
									{/* eslint-disable-next-line @next/next/no-img-element */}
									<img
										src={coverImage}
										alt="Cover preview"
										className="w-full h-full object-cover"
									/>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</form>
	)
}
