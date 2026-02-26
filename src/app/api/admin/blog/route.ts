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
import { parseFrontmatter, FrontmatterParseError } from "@/lib/blog/parser"
import type { Prisma } from "@prisma/client"

const createPostSchema = z.object({
	rawContent: z.string().min(1, "Content is required"),
	status: z.enum(["DRAFT", "PUBLISHED"]).optional().default("DRAFT"),
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

		// Parse frontmatter from raw content
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
		const status = result.data.status

		const post = await prisma.post.create({
			data: {
				title: meta.title,
				slug: meta.slug,
				description: meta.description ?? "",
				keywords: meta.keywords ?? [],
				// Store full raw content (frontmatter + body) as source of truth
				content: result.data.rawContent,
				coverImage: meta.coverImage ?? null,
				status,
				publishedAt: status === "PUBLISHED" ? new Date() : null,
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
