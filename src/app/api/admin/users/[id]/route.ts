/**
 * Admin Users [id] API — get, update, and delete a single user.
 *
 * GET    /api/admin/users/[id] — get user by id
 * PATCH  /api/admin/users/[id] — update user fields
 * DELETE /api/admin/users/[id] — soft-delete (deactivate) or hard-delete user
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

/** Zod schema for user update */
const updateUserSchema = z.object({
	name: z.string().min(1).max(100).optional(),
	email: z.string().email().optional(),
	role: z.enum(["USER", "ADMIN", "OWNER"]).optional(),
	isActive: z.boolean().optional(),
})

const userSelect = {
	id: true,
	name: true,
	email: true,
	image: true,
	avatarUrl: true,
	role: true,
	isActive: true,
	createdAt: true,
	updatedAt: true,
	_count: {
		select: {
			posts: true,
			subscriptions: true,
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

		const user = await prisma.user.findUnique({
			where: { id },
			select: userSelect,
		})

		if (!user) {
			throw new NotFoundError("User")
		}

		return successResponse(user)
	} catch (error) {
		if (error instanceof ApiError) {
			return errorResponse(error.message, error.code, error.statusCode)
		}
		console.error("Admin user GET error:", error)
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
		const result = updateUserSchema.safeParse(body)

		if (!result.success) {
			const details: Record<string, string[]> = {}
			for (const issue of result.error.issues) {
				const key = issue.path.join(".")
				details[key] = details[key] ?? []
				details[key].push(issue.message)
			}
			throw new ValidationError(details)
		}

		// Check user exists
		const existing = await prisma.user.findUnique({ where: { id } })
		if (!existing) {
			throw new NotFoundError("User")
		}

		// Check email uniqueness if changed
		if (result.data.email && result.data.email !== existing.email) {
			const emailTaken = await prisma.user.findUnique({
				where: { email: result.data.email },
			})
			if (emailTaken) {
				return errorResponse("Email already in use", "CONFLICT", 409)
			}
		}

		const user = await prisma.user.update({
			where: { id },
			data: result.data,
			select: userSelect,
		})

		return successResponse(user)
	} catch (error) {
		if (error instanceof ApiError) {
			return errorResponse(error.message, error.code, error.statusCode, error.details)
		}
		console.error("Admin user PATCH error:", error)
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

		const existing = await prisma.user.findUnique({ where: { id } })
		if (!existing) {
			throw new NotFoundError("User")
		}

		// Prevent deleting OWNER users (safety)
		if (existing.role === "OWNER") {
			return errorResponse("Cannot delete OWNER users", "FORBIDDEN", 403)
		}

		// Hard delete — cascades via Prisma schema
		await prisma.user.delete({ where: { id } })

		return successResponse({ deleted: true })
	} catch (error) {
		if (error instanceof ApiError) {
			return errorResponse(error.message, error.code, error.statusCode)
		}
		console.error("Admin user DELETE error:", error)
		return errorResponse("Internal server error", "INTERNAL_ERROR", 500)
	}
}
