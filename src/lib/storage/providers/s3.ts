/**
 * AWS S3 storage provider.
 *
 * Uses @aws-sdk/client-s3 for file operations. Files are stored
 * with public-read ACL by default.
 */

import {
	S3Client,
	PutObjectCommand,
	DeleteObjectCommand,
} from "@aws-sdk/client-s3"
import type { StorageProvider, UploadOptions, UploadResult } from "@/types/storage"

interface S3Config {
	bucket: string
	accessKeyId: string
	secretAccessKey: string
	region: string
}

export class S3Provider implements StorageProvider {
	private client: S3Client
	private bucket: string
	private region: string

	constructor(config: S3Config) {
		this.bucket = config.bucket
		this.region = config.region
		this.client = new S3Client({
			region: config.region,
			credentials: {
				accessKeyId: config.accessKeyId,
				secretAccessKey: config.secretAccessKey,
			},
		})
	}

	async upload(
		filename: string,
		file: Buffer | ReadableStream,
		mimeType: string,
		options?: UploadOptions
	): Promise<UploadResult> {
		const key = options?.directory
			? `${options.directory}/${filename}`
			: filename

		let body: Buffer
		if (Buffer.isBuffer(file)) {
			body = file
		} else {
			body = Buffer.from(await streamToBuffer(file as ReadableStream))
		}

		await this.client.send(
			new PutObjectCommand({
				Bucket: this.bucket,
				Key: key,
				Body: body,
				ContentType: mimeType,
			})
		)

		return {
			key,
			url: this.getUrl(key),
			size: body.length,
			mimeType,
		}
	}

	async delete(key: string): Promise<void> {
		await this.client.send(
			new DeleteObjectCommand({
				Bucket: this.bucket,
				Key: key,
			})
		)
	}

	getUrl(key: string): string {
		return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`
	}
}

/** Helper: convert a ReadableStream to Buffer */
async function streamToBuffer(stream: ReadableStream): Promise<ArrayBuffer> {
	const reader = stream.getReader()
	const chunks: Uint8Array[] = []
	let done = false

	while (!done) {
		const result = await reader.read()
		done = result.done
		if (result.value) {
			chunks.push(result.value)
		}
	}

	const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0)
	const buffer = new Uint8Array(totalLength)
	let offset = 0
	for (const chunk of chunks) {
		buffer.set(chunk, offset)
		offset += chunk.length
	}

	return buffer.buffer
}
