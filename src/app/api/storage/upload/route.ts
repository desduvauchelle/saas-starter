/**
 * POST /api/storage/upload — upload a file.
 *
 * Authenticated endpoint. Validates file type/size, uploads via
 * storage provider, and saves a StorageFile record.
 *
 * Returns: { url: string; key: string }
 */

import { NextRequest } from "next/server"
import prisma from "@/lib/prisma"
import { requireAuth, AuthError } from "@/lib/auth/guards"
import { successResponse, errorResponse } from "@/lib/api/response"
import { getStorageProvider, StorageConfigError } from "@/lib/storage"

const MAX_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = [
	"image/jpeg",
	"image/png",
	"image/webp",
	"image/gif",
	"application/pdf",
]

export async function POST(req: NextRequest) {
	try {
		const session = await requireAuth()

		const formData = await req.formData()
		const file = formData.get("file")
		const directory = formData.get("directory")

		if (!file || !(file instanceof File)) {
			return errorResponse("No file provided", "VALIDATION_ERROR", 400)
		}

		if (!ALLOWED_TYPES.includes(file.type)) {
			return errorResponse(
				`Unsupported file type: ${file.type}`,
				"UNSUPPORTED_MEDIA_TYPE",
				415
			)
		}

		if (file.size > MAX_SIZE) {
			return errorResponse("File too large. Maximum: 10MB", "FILE_TOO_LARGE", 413)
		}

		const storage = getStorageProvider()
		const buffer = Buffer.from(await file.arrayBuffer())
		const timestamp = Date.now()
		const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_")
		const filename = `${timestamp}-${safeName}`

		const dir = typeof directory === "string" ? directory : "uploads"

		const result = await storage.upload(filename, buffer, file.type, {
			directory: dir,
		})

		// Save record
		await prisma.storageFile.create({
			data: {
				key: result.key,
				url: result.url,
				provider: process.env.STORAGE_PROVIDER ?? "vercel",
				size: file.size,
				mimeType: file.type,
				uploadedBy: session.user.id,
			},
		})

		return successResponse({ url: result.url, key: result.key })
	} catch (error) {
		if (error instanceof AuthError) {
			return errorResponse(error.message, error.code, error.statusCode)
		}
		if (error instanceof StorageConfigError) {
			return errorResponse(error.message, "STORAGE_CONFIG_ERROR", 500)
		}
		console.error("Upload error:", error)
		return errorResponse("Internal server error", "INTERNAL_ERROR", 500)
	}
}
