/**
 * Storage-related types.
 */

/** Supported storage providers */
export type StorageProviderType = "vercel" | "s3"

/** Options for file upload */
export interface UploadOptions {
	/** MIME types to accept (e.g. ["image/jpeg", "image/png"]) */
	allowedMimeTypes?: string[]
	/** Max file size in bytes (default: 5MB) */
	maxSizeBytes?: number
	/** Directory within the bucket (e.g. "avatars", "blog") */
	directory?: string
}

/** Result of a successful upload */
export interface UploadResult {
	key: string
	url: string
	size: number
	mimeType: string
}

/** Storage provider interface — implemented by Vercel Blob and S3 */
export interface StorageProvider {
	/** Upload a file and return its URL + key */
	upload(
		filename: string,
		file: Buffer | ReadableStream,
		mimeType: string,
		options?: UploadOptions
	): Promise<UploadResult>

	/** Delete a file by key */
	delete(key: string): Promise<void>

	/** Get a public URL for a file by key */
	getUrl(key: string): string
}
