/**
 * Admin Product [id] API — get, update, and delete a single product.
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

const updateProductSchema = z.object({
	name: z.string().min(1).max(100).optional(),
	description: z.string().max(500).optional(),
	price: z.number().int().min(0).optional(),
	currency: z.string().length(3).optional(),
	type: z.enum(["ONE_TIME", "SUBSCRIPTION"]).optional(),
	tier: z.enum(["FREE", "BASIC", "PRO", "ENTERPRISE"]).optional().nullable(),
	interval: z.enum(["MONTHLY", "YEARLY", "LIFETIME"]).optional().nullable(),
	features: z.array(z.string()).optional(),
	recommended: z.boolean().optional(),
	isActive: z.boolean().optional(),
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

		const product = await prisma.product.findUnique({
			where: { id },
			select: productSelect,
		})

		if (!product) throw new NotFoundError("Product")

		return successResponse(product)
	} catch (error) {
		if (error instanceof ApiError) {
			return errorResponse(error.message, error.code, error.statusCode)
		}
		console.error("Admin product GET error:", error)
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
		const result = updateProductSchema.safeParse(body)

		if (!result.success) {
			const details: Record<string, string[]> = {}
			for (const issue of result.error.issues) {
				const key = issue.path.join(".")
				details[key] = details[key] ?? []
				details[key].push(issue.message)
			}
			throw new ValidationError(details)
		}

		const existing = await prisma.product.findUnique({ where: { id } })
		if (!existing) throw new NotFoundError("Product")

		const product = await prisma.product.update({
			where: { id },
			data: result.data,
			select: productSelect,
		})

		return successResponse(product)
	} catch (error) {
		if (error instanceof ApiError) {
			return errorResponse(error.message, error.code, error.statusCode, error.details)
		}
		console.error("Admin product PATCH error:", error)
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

		const existing = await prisma.product.findUnique({
			where: { id },
			include: { _count: { select: { subscriptions: true } } },
		})

		if (!existing) throw new NotFoundError("Product")

		if (existing._count.subscriptions > 0) {
			return errorResponse(
				"Cannot delete a product with active subscriptions. Deactivate it instead.",
				"CONFLICT",
				409
			)
		}

		await prisma.product.delete({ where: { id } })

		return successResponse({ deleted: true })
	} catch (error) {
		if (error instanceof ApiError) {
			return errorResponse(error.message, error.code, error.statusCode)
		}
		console.error("Admin product DELETE error:", error)
		return errorResponse("Internal server error", "INTERNAL_ERROR", 500)
	}
}
