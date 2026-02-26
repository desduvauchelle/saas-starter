/**
 * Typed API error classes.
 *
 * Throw these in API routes — the error handler middleware
 * will catch them and return proper typed responses.
 */

export class ApiError extends Error {
	constructor(
		message: string,
		public statusCode: number,
		public code: string,
		public details?: Record<string, string[]>
	) {
		super(message)
		this.name = "ApiError"
	}
}

export class NotFoundError extends ApiError {
	constructor(resource: string) {
		super(`${resource} not found`, 404, "NOT_FOUND")
	}
}

export class ValidationError extends ApiError {
	constructor(details: Record<string, string[]>) {
		super("Validation failed", 422, "VALIDATION_ERROR", details)
	}
}

export class ConflictError extends ApiError {
	constructor(message: string) {
		super(message, 409, "CONFLICT")
	}
}

export class FileTooLargeError extends ApiError {
	constructor(maxSize: number) {
		super(
			`File too large. Maximum size: ${Math.round(maxSize / 1024 / 1024)}MB`,
			413,
			"FILE_TOO_LARGE"
		)
	}
}

export class UnsupportedMediaError extends ApiError {
	constructor(mimeType: string) {
		super(
			`Unsupported file type: ${mimeType}`,
			415,
			"UNSUPPORTED_MEDIA_TYPE"
		)
	}
}
