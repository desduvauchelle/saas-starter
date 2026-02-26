/**
 * POST /api/account/avatar — upload avatar image.
 */

import { NextRequest } from "next/server"
import prisma from "@/lib/prisma"
import { requireAuth } from "@/lib/auth/guards"
import { AuthError } from "@/lib/auth/guards"
import { successResponse, errorResponse } from "@/lib/api/response"
import { getStorageProvider } from "@/lib/storage"

const MAX_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"]

export async function POST(req: NextRequest) {
	try {
		const session = await requireAuth()

		const formData = await req.formData()
		const file = formData.get("file")

		if (!file || !(file instanceof File)) {
			return errorResponse("No file provided", "VALIDATION_ERROR", 400)
		}

		if (!ALLOWED_TYPES.includes(file.type)) {
			return errorResponse(
				`Invalid file type. Allowed: ${ALLOWED_TYPES.join(", ")}`,
				"UNSUPPORTED_MEDIA_TYPE",
				415
			)
		}

		if (file.size > MAX_SIZE) {
			return errorResponse("File too large. Maximum: 5MB", "FILE_TOO_LARGE", 413)
		}

		const storage = getStorageProvider()
		const buffer = Buffer.from(await file.arrayBuffer())
		const ext = file.type.split("/")[1]
		const filename = `avatars/${session.user.id}.${ext}`

		const result = await storage.upload(filename, buffer, file.type, {
			directory: "avatars",
		})

		// Update user avatar URL
		await prisma.user.update({
			where: { id: session.user.id },
			data: { avatarUrl: result.url, image: result.url },
		})

		// Save storage file record
		await prisma.storageFile.upsert({
			where: { key: result.key },
			create: {
				key: result.key,
				url: result.url,
				provider: process.env.STORAGE_PROVIDER ?? "vercel",
				size: file.size,
				mimeType: file.type,
				uploadedBy: session.user.id,
			},
			update: {
				url: result.url,
				size: file.size,
			},
		})

		return successResponse({ url: result.url })
	} catch (error) {
		if (error instanceof AuthError) {
			return errorResponse(error.message, error.code, error.statusCode)
		}
		console.error("Avatar upload error:", error)
		return errorResponse("Internal server error", "INTERNAL_ERROR", 500)
	}
}
