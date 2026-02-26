/**
 * PATCH /api/account/profile — update user profile (name, email).
 */

import { NextRequest } from "next/server"
import { z } from "zod"
import prisma from "@/lib/prisma"
import { requireAuth } from "@/lib/auth/guards"
import { successResponse, errorResponse } from "@/lib/api/response"
import { AuthError } from "@/lib/auth/guards"

const schema = z.object({
	name: z.string().min(1).max(100).optional(),
	email: z.string().email().optional(),
})

export async function PATCH(req: NextRequest) {
	try {
		const session = await requireAuth()
		const body: unknown = await req.json()
		const result = schema.safeParse(body)

		if (!result.success) {
			const details: Record<string, string[]> = {}
			for (const issue of result.error.issues) {
				const key = issue.path.join(".")
				if (!details[key]) details[key] = []
				details[key].push(issue.message)
			}
			return errorResponse("Validation failed", "VALIDATION_ERROR", 422, details)
		}

		const { name, email } = result.data

		// Check for email conflict
		if (email && email !== session.user.email) {
			const existing = await prisma.user.findUnique({ where: { email } })
			if (existing) {
				return errorResponse("Email already in use", "CONFLICT", 409)
			}
		}

		const updated = await prisma.user.update({
			where: { id: session.user.id },
			data: {
				...(name !== undefined ? { name } : {}),
				...(email !== undefined ? { email } : {}),
			},
			select: {
				id: true,
				name: true,
				email: true,
				image: true,
				avatarUrl: true,
				role: true,
				isActive: true,
				createdAt: true,
				updatedAt: true,
			},
		})

		return successResponse(updated)
	} catch (error) {
		if (error instanceof AuthError) {
			return errorResponse(error.message, error.code, error.statusCode)
		}
		console.error("Profile update error:", error)
		return errorResponse("Internal server error", "INTERNAL_ERROR", 500)
	}
}
