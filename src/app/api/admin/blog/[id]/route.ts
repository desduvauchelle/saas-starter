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

const updatePostSchema = z.object({
	title: z.string().min(1).max(200).optional(),
	slug: z
		.string()
		.min(1)
		.max(200)
		.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
		.optional(),
	description: z.string().max(500).optional(),
	keywords: z.array(z.string()).optional(),
	content: z.string().min(1).optional(),
	coverImage: z.string().url().optional().nullable(),
	status: z.enum(["DRAFT", "PUBLISHED"]).optional(),
	publishedAt: z.string().datetime().optional().nullable(),
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

		// Check slug uniqueness if changed
		if (result.data.slug && result.data.slug !== existing.slug) {
			const slugTaken = await prisma.post.findUnique({
				where: { slug: result.data.slug },
			})
			if (slugTaken) {
				return errorResponse("Slug already in use", "CONFLICT", 409)
			}
		}

		// Handle publish date
		const updateData: Record<string, unknown> = { ...result.data }

		if (result.data.status === "PUBLISHED" && !existing.publishedAt) {
			updateData.publishedAt = result.data.publishedAt
				? new Date(result.data.publishedAt)
				: new Date()
		}

		if (result.data.publishedAt) {
			updateData.publishedAt = new Date(result.data.publishedAt)
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
