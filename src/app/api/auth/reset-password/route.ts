/**
 * POST /api/auth/reset-password
 *
 * Resets a user's password using a valid token.
 */

import { NextRequest } from "next/server"
import { z } from "zod"
import bcrypt from "bcryptjs"
import prisma from "@/lib/prisma"
import { successResponse, errorResponse } from "@/lib/api/response"

const schema = z.object({
	token: z.string().min(1, "Token is required"),
	password: z.string().min(8, "Password must be at least 8 characters").max(128),
})

export async function POST(req: NextRequest) {
	try {
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

		const { token, password } = result.data

		// Find valid token
		const verificationToken = await prisma.verificationToken.findUnique({
			where: { token },
		})

		if (!verificationToken || verificationToken.expires < new Date()) {
			return errorResponse(
				"Invalid or expired reset token",
				"INVALID_TOKEN",
				400
			)
		}

		// Find user
		const user = await prisma.user.findUnique({
			where: { email: verificationToken.identifier },
		})

		if (!user) {
			return errorResponse("User not found", "NOT_FOUND", 404)
		}

		// Update password
		const hashedPassword = await bcrypt.hash(password, 12)
		await prisma.user.update({
			where: { id: user.id },
			data: { hashedPassword },
		})

		// Delete used token
		await prisma.verificationToken.delete({
			where: {
				identifier_token: {
					identifier: verificationToken.identifier,
					token: verificationToken.token,
				},
			},
		})

		return successResponse({ message: "Password has been reset successfully" })
	} catch (error) {
		console.error("Reset password error:", error)
		return errorResponse("Internal server error", "INTERNAL_ERROR", 500)
	}
}
