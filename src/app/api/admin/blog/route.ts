/**
 * Admin Blog API — list and create posts.
 *
 * GET  /api/admin/blog — paginated post list with search, status, author filters
 * POST /api/admin/blog — create a new blog post
 */

import { NextRequest } from "next/server"
import { z } from "zod"
import prisma from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth/guards"
import {
	paginatedResponse,
	successResponse,
	errorResponse,
	parsePagination,
	buildPaginationMeta,
} from "@/lib/api/response"
import { ApiError, ConflictError, ValidationError } from "@/lib/api/errors"
import type { Prisma } from "@prisma/client"

const createPostSchema = z.object({
	title: z.string().min(1, "Title is required").max(200),
	slug: z
		.string()
		.min(1, "Slug is required")
		.max(200)
		.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase alphanumeric with hyphens"),
	description: z.string().max(500).optional().default(""),
	keywords: z.array(z.string()).optional().default([]),
	content: z.string().min(1, "Content is required"),
	coverImage: z.string().url().optional().nullable(),
	status: z.enum(["DRAFT", "PUBLISHED"]).optional().default("DRAFT"),
	publishedAt: z.string().datetime().optional().nullable(),
})

const postSelect = {
	id: true,
	slug: true,
	title: true,
	description: true,
	keywords: true,
	coverImage: true,
	status: true,
	publishedAt: true,
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

export async function GET(request: NextRequest) {
	try {
		await requireAdmin()

		const { searchParams } = request.nextUrl
		const { page, perPage, skip } = parsePagination(searchParams)

		const search = searchParams.get("search") ?? ""
		const status = searchParams.get("status") ?? ""
		const authorId = searchParams.get("authorId") ?? ""
		const sortBy = searchParams.get("sortBy") ?? "createdAt"
		const sortOrder = (searchParams.get("sortOrder") ?? "desc") as "asc" | "desc"

		const where: Prisma.PostWhereInput = {}

		if (search) {
			where.OR = [
				{ title: { contains: search, mode: "insensitive" } },
				{ description: { contains: search, mode: "insensitive" } },
				{ slug: { contains: search, mode: "insensitive" } },
			]
		}

		if (status && ["DRAFT", "PUBLISHED"].includes(status)) {
			where.status = status as Prisma.EnumPostStatusFilter
		}

		if (authorId) {
			where.authorId = authorId
		}

		const allowedSortFields = ["title", "slug", "status", "publishedAt", "createdAt"]
		const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : "createdAt"

		const [posts, total] = await Promise.all([
			prisma.post.findMany({
				where,
				select: postSelect,
				orderBy: { [safeSortBy]: sortOrder },
				skip,
				take: perPage,
			}),
			prisma.post.count({ where }),
		])

		return paginatedResponse(posts, buildPaginationMeta(page, perPage, total))
	} catch (error) {
		if (error instanceof ApiError) {
			return errorResponse(error.message, error.code, error.statusCode)
		}
		console.error("Admin blog GET error:", error)
		return errorResponse("Internal server error", "INTERNAL_ERROR", 500)
	}
}

export async function POST(request: NextRequest) {
	try {
		const session = await requireAdmin()

		const body: unknown = await request.json()
		const result = createPostSchema.safeParse(body)

		if (!result.success) {
			const details: Record<string, string[]> = {}
			for (const issue of result.error.issues) {
				const key = issue.path.join(".")
				details[key] = details[key] ?? []
				details[key].push(issue.message)
			}
			throw new ValidationError(details)
		}

		const data = result.data

		// Check for duplicate slug
		const existing = await prisma.post.findUnique({
			where: { slug: data.slug },
		})
		if (existing) {
			throw new ConflictError("A post with this slug already exists")
		}

		const post = await prisma.post.create({
			data: {
				title: data.title,
				slug: data.slug,
				description: data.description,
				keywords: data.keywords,
				content: data.content,
				coverImage: data.coverImage ?? null,
				status: data.status,
				publishedAt: data.status === "PUBLISHED"
					? (data.publishedAt ? new Date(data.publishedAt) : new Date())
					: null,
				authorId: session.user.id,
			},
			select: { ...postSelect, content: true },
		})

		return successResponse(post, 201)
	} catch (error) {
		if (error instanceof ApiError) {
			return errorResponse(error.message, error.code, error.statusCode, error.details)
		}
		console.error("Admin blog POST error:", error)
		return errorResponse("Internal server error", "INTERNAL_ERROR", 500)
	}
}
