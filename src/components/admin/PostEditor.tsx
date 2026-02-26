/**
 * Post editor — single frontmatter + markdown textarea.
 *
 * The entire post (metadata + content) is written in one textarea using
 * YAML frontmatter at the top followed by Markdown body. Image uploads
 * are available below for existing posts only.
 *
 * Expected frontmatter format:
 * ---
 * title: "My Post Title"
 * slug: "my-post-title"
 * description: "A brief description"
 * keywords: ["saas", "startup"]
 * coverImage: "https://example.com/image.jpg"
 * ---
 *
 * Content here...
 */

"use client"

import { useRef, useState } from "react"
import type { PostStatus } from "@prisma/client"
import { Button, ButtonLink, Select } from "@/components/ui"

export const DEFAULT_POST_TEMPLATE = `---
title: ""
slug: ""
description: ""
keywords: []
---

Write your content here...`

interface PostEditorProps {
	/** Set when editing an existing post — enables image uploads */
	postId?: string
	/** Initial raw frontmatter + markdown content */
	initialRawContent?: string
	/** Initial publish status */
	initialStatus?: PostStatus
	/** Called on save with the raw content and status */
	onSubmit: (data: { rawContent: string; status: PostStatus }) => Promise<void>
	/** Submit button label */
	submitLabel?: string
	/** Show delete button */
	showDelete?: boolean
	/** Called on delete */
	onDelete?: () => Promise<void>
}

export function PostEditor({
	postId,
	initialRawContent,
	initialStatus,
	onSubmit,
	submitLabel = "Save Post",
	showDelete,
	onDelete,
}: PostEditorProps) {
	const [rawContent, setRawContent] = useState(initialRawContent ?? DEFAULT_POST_TEMPLATE)
	const [status, setStatus] = useState<PostStatus>(initialStatus ?? "DRAFT")
	const [saving, setSaving] = useState(false)
	const [error, setError] = useState("")
	const [uploading, setUploading] = useState(false)
	const [uploadedUrls, setUploadedUrls] = useState<string[]>([])
	const [copied, setCopied] = useState<string | null>(null)
	const fileInputRef = useRef<HTMLInputElement>(null)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setSaving(true)
		setError("")
		try {
			await onSubmit({ rawContent, status })
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

	const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return
		setUploading(true)
		setError("")
		try {
			const formData = new FormData()
			formData.append("file", file)
			formData.append("directory", "blog")
			const res = await fetch("/api/storage/upload", { method: "POST", body: formData })
			if (!res.ok) {
				const json = (await res.json()) as { error?: { message: string } }
				throw new Error(json.error?.message ?? "Upload failed")
			}
			const json = (await res.json()) as { data: { url: string } }
			setUploadedUrls((prev) => [...prev, json.data.url])
		} catch (err) {
			setError(err instanceof Error ? err.message : "Upload failed")
		} finally {
			setUploading(false)
			if (fileInputRef.current) fileInputRef.current.value = ""
		}
	}

	const copyMarkdown = (url: string) => {
		void navigator.clipboard.writeText(`![image](${url})`)
		setCopied(url)
		setTimeout(() => setCopied(null), 2000)
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			{error && (
				<div className="alert alert-error">
					<i className="fa-solid fa-circle-exclamation" />
					<span>{error}</span>
				</div>
			)}

			{/* Top bar: status + actions */}
			<div className="flex items-center gap-3 flex-wrap">
				<div className="flex items-center gap-2">
					<span className="label-text text-sm font-medium">Status</span>
					<Select
						size="sm"
						value={status}
						onChange={(e) => setStatus(e.target.value as PostStatus)}
						options={[
							{ value: "DRAFT", label: "Draft" },
							{ value: "PUBLISHED", label: "Published" },
						]}
					/>
				</div>
				<div className="flex gap-2 ml-auto">
					{showDelete && onDelete && (
						<Button
							type="button"
							onClick={handleDelete}
							variant="error"
							size="sm"
							outline
						>
							<i className="fa-solid fa-trash" />
							Delete
						</Button>
					)}
					<ButtonLink href="/admin/blog" variant="ghost" size="sm">
						Cancel
					</ButtonLink>
					<Button type="submit" variant="primary" size="sm" loading={saving}>
						{submitLabel}
					</Button>
				</div>
			</div>

			{/* Main textarea */}
			<div className="form-control">
				<textarea
					className="textarea textarea-bordered font-mono text-sm w-full min-h-[70vh] resize-y leading-relaxed"
					value={rawContent}
					onChange={(e) => setRawContent(e.target.value)}
					required
					spellCheck={false}
					placeholder={DEFAULT_POST_TEMPLATE}
				/>
				<label className="label">
					<span className="label-text-alt text-base-content/50">
						Frontmatter fields:{" "}
						<code className="text-xs">title</code>,{" "}
						<code className="text-xs">slug</code>,{" "}
						<code className="text-xs">description</code>,{" "}
						<code className="text-xs">keywords</code>,{" "}
						<code className="text-xs">coverImage</code>
						{" "}— followed by Markdown body.
					</span>
				</label>
			</div>

			{/* Image uploads */}
			<div className="card bg-base-200">
				<div className="card-body py-4">
					<h3 className="font-semibold text-sm flex items-center gap-2">
						<i className="fa-solid fa-image" />
						Image Uploads
					</h3>

					{!postId ? (
						<div className="alert alert-warning">
							<i className="fa-solid fa-triangle-exclamation" />
							<span>
								Save the post first to enable image uploads. You can then reference
								uploaded images in your markdown using{" "}
								<code className="text-xs">![alt text](url)</code>.
							</span>
						</div>
					) : (
						<>
							<div className="flex items-center gap-3">
								<input
									ref={fileInputRef}
									type="file"
									accept="image/jpeg,image/png,image/webp,image/gif"
									className="file-input file-input-bordered file-input-sm"
									onChange={handleUpload}
									disabled={uploading}
								/>
								{uploading && <span className="loading loading-spinner loading-sm" />}
							</div>

							{uploadedUrls.length > 0 && (
								<div className="space-y-1 mt-2">
									<p className="text-xs text-base-content/50">
										Click an entry to copy the markdown snippet:
									</p>
									{uploadedUrls.map((url) => (
									<Button
										key={url}
										type="button"
										onClick={() => copyMarkdown(url)}
										variant="ghost"
										size="xs"
										className="font-mono text-xs w-full justify-start truncate"
										title="Copy markdown"
									>
										<i
											className={`fa-solid ${
												copied === url ? "fa-check text-success" : "fa-copy"
											}`}
										/>
										![image]({url})
									</Button>
									))}
								</div>
							)}
						</>
					)}
				</div>
			</div>
		</form>
	)
}
