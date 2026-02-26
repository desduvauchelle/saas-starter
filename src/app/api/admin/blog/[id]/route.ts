/**
 * Admin Blog [id] API — get, update, and delete a single post.
 *
 * GET    /api/admin/blog/[id] — get post by id (with content)
 * PATCH  /api/admin/blog/[id] — update post fields
 * DELETE /api/admin/blog/[id] — delete post
 */

import { NextRequest } from "next/server"
import { z } from "zod"
import prisma from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth/guards"
import {
	successResponse,
	errorResponse,
} from "@/lib/api/response"
import { ApiError, NotFoundError, ValidationError } from "@/lib/api/errors"
import { parseFrontmatter, FrontmatterParseError } from "@/lib/blog/parser"

const updatePostSchema = z.object({
	rawContent: z.string().min(1, "Content is required").optional(),
	status: z.enum(["DRAFT", "PUBLISHED"]).optional(),
})

const postSelect = {
	id: true,
	slug: true,
	title: true,
	description: true,
	keywords: true,
	content: true,
	coverImage: true,
	status: true,
	publishedAt: true,
	authorId: true,
	createdAt: true,
	updatedAt: true,
	author: {
		select: {
			id: true,
			name: true,
			avatarUrl: true,
		},
	},
} as const

interface RouteParams {
	params: Promise<{ id: string }>
}

export async function GET(
	_request: NextRequest,
	{ params }: RouteParams
) {
	try {
		await requireAdmin()
		const { id } = await params

		const post = await prisma.post.findUnique({
			where: { id },
			select: postSelect,
		})

		if (!post) {
			throw new NotFoundError("Post")
		}

		return successResponse(post)
	} catch (error) {
		if (error instanceof ApiError) {
			return errorResponse(error.message, error.code, error.statusCode)
		}
		console.error("Admin blog GET error:", error)
		return errorResponse("Internal server error", "INTERNAL_ERROR", 500)
	}
}

export async function PATCH(
	request: NextRequest,
	{ params }: RouteParams
) {
	try {
		await requireAdmin()
		const { id } = await params

		const body: unknown = await request.json()
		const result = updatePostSchema.safeParse(body)

		if (!result.success) {
			const details: Record<string, string[]> = {}
			for (const issue of result.error.issues) {
				const key = issue.path.join(".")
				details[key] = details[key] ?? []
				details[key].push(issue.message)
			}
			throw new ValidationError(details)
		}

		const existing = await prisma.post.findUnique({ where: { id } })
		if (!existing) {
			throw new NotFoundError("Post")
		}

		// Parse frontmatter if rawContent is provided
		const updateData: Record<string, unknown> = {}

		if (result.data.rawContent) {
			let parsed: ReturnType<typeof parseFrontmatter>
			try {
				parsed = parseFrontmatter(result.data.rawContent)
			} catch (err) {
				if (err instanceof FrontmatterParseError) {
					const details: Record<string, string[]> = {}
					for (const f of err.fields) {
						details[f.field] = [f.message]
					}
					return errorResponse(err.message, "FRONTMATTER_INVALID", 422, details)
				}
				throw err
			}

			const { meta } = parsed

			updateData.title = meta.title
			updateData.slug = meta.slug
			updateData.description = meta.description ?? ""
			updateData.keywords = meta.keywords ?? []
			updateData.coverImage = meta.coverImage ?? null
			// Store full raw content (frontmatter + body) as source of truth
			updateData.content = result.data.rawContent
		}

		if (result.data.status) {
			updateData.status = result.data.status
			if (result.data.status === "PUBLISHED" && !existing.publishedAt) {
				updateData.publishedAt = new Date()
			}
		}

		const post = await prisma.post.update({
			where: { id },
			data: updateData,
			select: postSelect,
		})

		return successResponse(post)
	} catch (error) {
		if (error instanceof ApiError) {
			return errorResponse(error.message, error.code, error.statusCode, error.details)
		}
		console.error("Admin blog PATCH error:", error)
		return errorResponse("Internal server error", "INTERNAL_ERROR", 500)
	}
}

export async function DELETE(
	_request: NextRequest,
	{ params }: RouteParams
) {
	try {
		await requireAdmin()
		const { id } = await params

		const existing = await prisma.post.findUnique({ where: { id } })
		if (!existing) {
			throw new NotFoundError("Post")
		}

		await prisma.post.delete({ where: { id } })

		return successResponse({ deleted: true })
	} catch (error) {
		if (error instanceof ApiError) {
			return errorResponse(error.message, error.code, error.statusCode)
		}
		console.error("Admin blog DELETE error:", error)
		return errorResponse("Internal server error", "INTERNAL_ERROR", 500)
	}
}
