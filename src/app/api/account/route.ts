/**
 * DELETE /api/account — delete user account.
 */

import { requireAuth, AuthError } from "@/lib/auth/guards"
import prisma from "@/lib/prisma"
import { successResponse, errorResponse } from "@/lib/api/response"

export async function DELETE() {
	try {
		const session = await requireAuth()

		// Delete user (cascades to accounts, sessions, posts, etc.)
		await prisma.user.delete({
			where: { id: session.user.id },
		})

		return successResponse({ message: "Account deleted successfully" })
	} catch (error) {
		if (error instanceof AuthError) {
			return errorResponse(error.message, error.code, error.statusCode)
		}
		console.error("Account deletion error:", error)
		return errorResponse("Internal server error", "INTERNAL_ERROR", 500)
	}
}
