/**
 * Vercel Blob storage provider.
 *
 * Uses @vercel/blob SDK for file uploads. Files are publicly accessible
 * at the returned URL. Requires BLOB_READ_WRITE_TOKEN env var.
 */

import { put, del } from "@vercel/blob"
import type { StorageProvider, UploadOptions, UploadResult } from "@/types/storage"

export class VercelBlobProvider implements StorageProvider {
	constructor(private token: string) { }

	async upload(
		filename: string,
		file: Buffer | ReadableStream,
		mimeType: string,
		options?: UploadOptions
	): Promise<UploadResult> {
		const pathname = options?.directory
			? `${options.directory}/${filename}`
			: filename

		const blob = await put(pathname, file, {
			access: "public",
			token: this.token,
			contentType: mimeType,
		})

		return {
			key: blob.pathname,
			url: blob.url,
			size: file instanceof Buffer ? file.length : 0,
			mimeType,
		}
	}

	async delete(key: string): Promise<void> {
		const url = this.getUrl(key)
		await del(url, { token: this.token })
	}

	getUrl(key: string): string {
		// Vercel blob URLs are absolute, but we reconstruct from key if needed
		return key.startsWith("http") ? key : `https://blob.vercel-storage.com/${key}`
	}
}
