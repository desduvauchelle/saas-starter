/**
 * PATCH /api/account/password — change password.
 */

import { NextRequest } from "next/server"
import { z } from "zod"
import bcrypt from "bcryptjs"
import prisma from "@/lib/prisma"
import { requireAuth, AuthError } from "@/lib/auth/guards"
import { successResponse, errorResponse } from "@/lib/api/response"

const schema = z.object({
	currentPassword: z.string().min(1, "Current password is required"),
	newPassword: z.string().min(8, "New password must be at least 8 characters").max(128),
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

		const { currentPassword, newPassword } = result.data

		// Get user with hashed password
		const user = await prisma.user.findUnique({
			where: { id: session.user.id },
			select: { hashedPassword: true },
		})

		if (!user?.hashedPassword) {
			return errorResponse(
				"Password change is not available for OAuth accounts",
				"INVALID_REQUEST",
				400
			)
		}

		// Verify current password
		const isValid = await bcrypt.compare(currentPassword, user.hashedPassword)
		if (!isValid) {
			return errorResponse("Current password is incorrect", "INVALID_PASSWORD", 400)
		}

		// Update password
		const hashedPassword = await bcrypt.hash(newPassword, 12)
		await prisma.user.update({
			where: { id: session.user.id },
			data: { hashedPassword },
		})

		return successResponse({ message: "Password changed successfully" })
	} catch (error) {
		if (error instanceof AuthError) {
			return errorResponse(error.message, error.code, error.statusCode)
		}
		console.error("Password change error:", error)
		return errorResponse("Internal server error", "INTERNAL_ERROR", 500)
	}
}
