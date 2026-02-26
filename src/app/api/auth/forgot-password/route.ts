/**
 * POST /api/auth/forgot-password
 *
 * Sends a password reset email to the user.
 * Always returns 200 to prevent email enumeration.
 */

import { NextRequest } from "next/server"
import { z } from "zod"
import prisma from "@/lib/prisma"
import { successResponse, errorResponse } from "@/lib/api/response"
import crypto from "crypto"

const schema = z.object({
	email: z.string().email("Valid email is required"),
})

export async function POST(req: NextRequest) {
	try {
		const body: unknown = await req.json()
		const result = schema.safeParse(body)

		if (!result.success) {
			return errorResponse("Valid email is required", "VALIDATION_ERROR", 422)
		}

		const { email } = result.data

		const user = await prisma.user.findUnique({
			where: { email },
		})

		if (user) {
			// Generate a reset token
			const token = crypto.randomBytes(32).toString("hex")
			const expires = new Date(Date.now() + 3600 * 1000) // 1 hour

			await prisma.verificationToken.create({
				data: {
					identifier: email,
					token,
					expires,
				},
			})

			// TODO: Send email via Resend
			// await sendPasswordResetEmail(email, token);
			console.log(`[DEV] Password reset token for ${email}: ${token}`)
		}

		// Always return success to prevent email enumeration
		return successResponse({
			message:
				"If an account exists with that email, a password reset link has been sent.",
		})
	} catch (error) {
		console.error("Forgot password error:", error)
		return errorResponse("Internal server error", "INTERNAL_ERROR", 500)
	}
}
