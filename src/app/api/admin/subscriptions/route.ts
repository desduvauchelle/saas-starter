/**
 * Admin Subscriptions API — list subscriptions.
 *
 * GET /api/admin/subscriptions — paginated subscription list
 */

import { NextRequest } from "next/server"
import prisma from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth/guards"
import {
	paginatedResponse,
	errorResponse,
	parsePagination,
	buildPaginationMeta,
} from "@/lib/api/response"
import { ApiError } from "@/lib/api/errors"
import type { Prisma } from "@prisma/client"

const subscriptionSelect = {
	id: true,
	status: true,
	currentPeriodStart: true,
	currentPeriodEnd: true,
	cancelAtPeriodEnd: true,
	stripeSubscriptionId: true,
	createdAt: true,
	updatedAt: true,
	user: {
		select: {
			id: true,
			name: true,
			email: true,
		},
	},
	product: {
		select: {
			id: true,
			name: true,
			price: true,
			currency: true,
			type: true,
			tier: true,
			interval: true,
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
		const sortBy = searchParams.get("sortBy") ?? "createdAt"
		const sortOrder = (searchParams.get("sortOrder") ?? "desc") as "asc" | "desc"

		const where: Prisma.SubscriptionWhereInput = {}

		if (search) {
			where.OR = [
				{ user: { name: { contains: search, mode: "insensitive" } } },
				{ user: { email: { contains: search, mode: "insensitive" } } },
				{ product: { name: { contains: search, mode: "insensitive" } } },
			]
		}

		if (status && ["ACTIVE", "CANCELED", "PAST_DUE", "TRIALING", "INCOMPLETE"].includes(status)) {
			where.status = status as Prisma.EnumSubscriptionStatusFilter
		}

		const allowedSortFields = ["status", "createdAt", "currentPeriodEnd"]
		const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : "createdAt"

		const [subscriptions, total] = await Promise.all([
			prisma.subscription.findMany({
				where,
				select: subscriptionSelect,
				orderBy: { [safeSortBy]: sortOrder },
				skip,
				take: perPage,
			}),
			prisma.subscription.count({ where }),
		])

		return paginatedResponse(subscriptions, buildPaginationMeta(page, perPage, total))
	} catch (error) {
		if (error instanceof ApiError) {
			return errorResponse(error.message, error.code, error.statusCode)
		}
		console.error("Admin subscriptions GET error:", error)
		return errorResponse("Internal server error", "INTERNAL_ERROR", 500)
	}
}
