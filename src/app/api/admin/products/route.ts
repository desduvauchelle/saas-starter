/**
 * Admin Products API — list and create products.
 *
 * GET  /api/admin/products — paginated product list
 * POST /api/admin/products — create a new product
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
import { ApiError, ValidationError } from "@/lib/api/errors"
import type { Prisma } from "@prisma/client"

const createProductSchema = z.object({
	name: z.string().min(1, "Name is required").max(100),
	description: z.string().max(500).optional().default(""),
	price: z.number().int().min(0, "Price must be non-negative"),
	currency: z.string().length(3).default("usd"),
	type: z.enum(["ONE_TIME", "SUBSCRIPTION"]),
	tier: z.enum(["FREE", "BASIC", "PRO", "ENTERPRISE"]).optional().nullable(),
	interval: z.enum(["MONTHLY", "YEARLY", "LIFETIME"]).optional().nullable(),
	features: z.array(z.string()).optional().default([]),
	recommended: z.boolean().optional().default(false),
	isActive: z.boolean().optional().default(true),
})

const productSelect = {
	id: true,
	name: true,
	description: true,
	price: true,
	currency: true,
	type: true,
	tier: true,
	interval: true,
	isActive: true,
	features: true,
	recommended: true,
	stripeProductId: true,
	stripePriceId: true,
	createdAt: true,
	updatedAt: true,
	_count: {
		select: { subscriptions: true },
	},
} as const

export async function GET(request: NextRequest) {
	try {
		await requireAdmin()

		const { searchParams } = request.nextUrl
		const { page, perPage, skip } = parsePagination(searchParams)

		const search = searchParams.get("search") ?? ""
		const type = searchParams.get("type") ?? ""
		const isActive = searchParams.get("isActive")
		const sortBy = searchParams.get("sortBy") ?? "createdAt"
		const sortOrder = (searchParams.get("sortOrder") ?? "desc") as "asc" | "desc"

		const where: Prisma.ProductWhereInput = {}

		if (search) {
			where.OR = [
				{ name: { contains: search, mode: "insensitive" } },
				{ description: { contains: search, mode: "insensitive" } },
			]
		}

		if (type && ["ONE_TIME", "SUBSCRIPTION"].includes(type)) {
			where.type = type as Prisma.EnumProductTypeFilter
		}

		if (isActive !== null && isActive !== undefined && isActive !== "") {
			where.isActive = isActive === "true"
		}

		const allowedSortFields = ["name", "price", "type", "isActive", "createdAt"]
		const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : "createdAt"

		const [products, total] = await Promise.all([
			prisma.product.findMany({
				where,
				select: productSelect,
				orderBy: { [safeSortBy]: sortOrder },
				skip,
				take: perPage,
			}),
			prisma.product.count({ where }),
		])

		return paginatedResponse(products, buildPaginationMeta(page, perPage, total))
	} catch (error) {
		if (error instanceof ApiError) {
			return errorResponse(error.message, error.code, error.statusCode)
		}
		console.error("Admin products GET error:", error)
		return errorResponse("Internal server error", "INTERNAL_ERROR", 500)
	}
}

export async function POST(request: NextRequest) {
	try {
		await requireAdmin()

		const body: unknown = await request.json()
		const result = createProductSchema.safeParse(body)

		if (!result.success) {
			const details: Record<string, string[]> = {}
			for (const issue of result.error.issues) {
				const key = issue.path.join(".")
				details[key] = details[key] ?? []
				details[key].push(issue.message)
			}
			throw new ValidationError(details)
		}

		const product = await prisma.product.create({
			data: result.data,
			select: productSelect,
		})

		return successResponse(product, 201)
	} catch (error) {
		if (error instanceof ApiError) {
			return errorResponse(error.message, error.code, error.statusCode, error.details)
		}
		console.error("Admin products POST error:", error)
		return errorResponse("Internal server error", "INTERNAL_ERROR", 500)
	}
}
