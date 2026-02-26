/**
 * Storage middleware — abstraction layer for file uploads.
 *
 * Reads STORAGE_PROVIDER env var to select Vercel Blob or AWS S3.
 * Both providers implement the StorageProvider interface from @/types/storage.
 *
 * Usage:
 *   import { getStorageProvider } from "@/lib/storage";
 *   const storage = getStorageProvider();
 *   const result = await storage.upload("path/file.jpg", buffer, "image/jpeg");
 */

import type { StorageProvider, StorageProviderType } from "@/types/storage"
import { VercelBlobProvider } from "./providers/vercel"
import { S3Provider } from "./providers/s3"

export class StorageConfigError extends Error {
	constructor(message: string) {
		super(message)
		this.name = "StorageConfigError"
	}
}

/**
 * Returns the configured storage provider instance.
 * Throws StorageConfigError if the provider is not configured
 * or required env vars are missing.
 */
export function getStorageProvider(): StorageProvider {
	const provider = (process.env.STORAGE_PROVIDER ?? "vercel") as StorageProviderType

	switch (provider) {
		case "vercel": {
			const token = process.env.BLOB_READ_WRITE_TOKEN
			if (!token) {
				throw new StorageConfigError(
					"BLOB_READ_WRITE_TOKEN is required when STORAGE_PROVIDER=vercel"
				)
			}
			return new VercelBlobProvider(token)
		}

		case "s3": {
			const bucket = process.env.AWS_S3_BUCKET
			const accessKeyId = process.env.AWS_ACCESS_KEY_ID
			const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
			const region = process.env.AWS_REGION ?? "us-east-1"

			if (!bucket || !accessKeyId || !secretAccessKey) {
				throw new StorageConfigError(
					"AWS_S3_BUCKET, AWS_ACCESS_KEY_ID, and AWS_SECRET_ACCESS_KEY are required when STORAGE_PROVIDER=s3"
				)
			}

			return new S3Provider({ bucket, accessKeyId, secretAccessKey, region })
		}

		default:
			throw new StorageConfigError(
				`Unknown storage provider: "${provider}". Use "vercel" or "s3".`
			)
	}
}
