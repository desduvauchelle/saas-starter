/**
 * Environment variable validation and access.
 *
 * Uses Zod to declare every env var the app needs. Validated once at startup
 * (imported in `next.config.ts`). The parsed result is exported as `env` — use
 * it instead of `process.env` everywhere so missing vars are caught at boot
 * rather than at runtime.
 *
 * Groups:
 *  - DATABASE    — PostgreSQL connection
 *  - AUTH        — NextAuth secret + base URL
 *  - OAUTH       — Optional OAuth provider credentials
 *  - EMAIL       — Resend API key
 *  - STORAGE     — Vercel Blob or AWS S3
 *  - STRIPE      — Payment processing
 *  - APP         — General application settings
 *  - ADMIN       — Owner / admin email addresses
 */

import { z } from "zod"

/* -------------------------------------------------------------------------- */
/*  Schema                                                                     */
/* -------------------------------------------------------------------------- */

const envSchema = z.object({
	/* ── DATABASE ─────────────────────────────────────────────────────────── */
	/** PostgreSQL connection string used by Prisma */
	DATABASE_URL: z.string().url("DATABASE_URL must be a valid URL"),

	/* ── AUTH ──────────────────────────────────────────────────────────────── */
	/** Random secret used by NextAuth for JWT signing */
	NEXTAUTH_SECRET: z.string().min(1, "NEXTAUTH_SECRET is required"),
	/** Canonical URL of the app (e.g. http://localhost:3000) */
	NEXTAUTH_URL: z.string().url("NEXTAUTH_URL must be a valid URL"),

	/* ── OAUTH PROVIDERS (all optional — presence enables the provider) ──── */
	GOOGLE_CLIENT_ID: z.string().optional(),
	GOOGLE_CLIENT_SECRET: z.string().optional(),
	GITHUB_CLIENT_ID: z.string().optional(),
	GITHUB_CLIENT_SECRET: z.string().optional(),
	APPLE_CLIENT_ID: z.string().optional(),
	APPLE_CLIENT_SECRET: z.string().optional(),

	/** Set to "true" to enable magic-link login (requires EMAIL config) */
	MAGIC_LINK_ENABLED: z
		.enum(["true", "false"])
		.optional()
		.default("false")
		.transform((v) => v === "true"),

	/* ── EMAIL ─────────────────────────────────────────────────────────────── */
	/** Resend API key — required for transactional emails */
	RESEND_API_KEY: z.string().optional(),
	/** "From" address for emails (e.g. noreply@yourdomain.com) */
	EMAIL_FROM: z.string().email().optional(),

	/* ── STORAGE ───────────────────────────────────────────────────────────── */
	/** Which provider to use: "vercel" | "s3" */
	STORAGE_PROVIDER: z.enum(["vercel", "s3"]).optional(),
	/** Vercel Blob read-write token (required when STORAGE_PROVIDER=vercel) */
	BLOB_READ_WRITE_TOKEN: z.string().optional(),
	/** AWS S3 bucket name (required when STORAGE_PROVIDER=s3) */
	AWS_S3_BUCKET: z.string().optional(),
	/** AWS access key ID (required when STORAGE_PROVIDER=s3) */
	AWS_ACCESS_KEY_ID: z.string().optional(),
	/** AWS secret access key (required when STORAGE_PROVIDER=s3) */
	AWS_SECRET_ACCESS_KEY: z.string().optional(),
	/** AWS region (required when STORAGE_PROVIDER=s3) */
	AWS_REGION: z.string().optional(),

	/* ── STRIPE ────────────────────────────────────────────────────────────── */
	/** Stripe secret key (sk_...) */
	STRIPE_SECRET_KEY: z.string().optional(),
	/** Stripe publishable key (pk_...) — exposed to the browser */
	NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
	/** Stripe webhook signing secret (whsec_...) */
	STRIPE_WEBHOOK_SECRET: z.string().optional(),

	/* ── AI ────────────────────────────────────────────────────────────────── */
	/** OpenRouter API key — required for AI features */
	OPENROUTER_API_KEY: z.string().optional(),
	/** OpenRouter model identifier (e.g. google/gemini-flash-1.5) */
	OPENROUTER_MODEL: z.string().optional().default("google/gemini-flash-1.5"),

	/* ── APP ───────────────────────────────────────────────────────────────── */
	/** Public-facing app name shown in emails, titles, etc. */
	NEXT_PUBLIC_APP_NAME: z.string().optional().default("SaaS Starter"),
	/** Public URL of the app — used for links in emails and OG tags */
	NEXT_PUBLIC_APP_URL: z.string().url().optional(),
	/** Node environment */
	NODE_ENV: z
		.enum(["development", "production", "test"])
		.optional()
		.default("development"),

	/* ── ADMIN ─────────────────────────────────────────────────────────────── */
	/** Comma-separated emails that are assigned the OWNER role on first login */
	OWNER_EMAILS: z.string().optional().default(""),
	/** Comma-separated emails that are assigned the ADMIN role on first login */
	ADMIN_EMAILS: z.string().optional().default(""),
})

/* -------------------------------------------------------------------------- */
/*  Parse & export                                                             */
/* -------------------------------------------------------------------------- */

export type Env = z.infer<typeof envSchema>

function validateEnv(): Env {
	const result = envSchema.safeParse(process.env)

	if (!result.success) {
		const formatted = result.error.issues
			.map((issue) => `  ✗ ${issue.path.join(".")}: ${issue.message}`)
			.join("\n")

		console.error(
			"\n╔══════════════════════════════════════════════════╗"
		)
		console.error(
			"║  ❌  Invalid environment variables               ║"
		)
		console.error(
			"╚══════════════════════════════════════════════════╝\n"
		)
		console.error(formatted)
		console.error(
			"\nSee .env.example for the full list with descriptions.\n"
		)

		throw new Error("Invalid environment variables")
	}

	return result.data
}

/**
 * Validated environment variables. Import this instead of using
 * `process.env` directly for type-safe access.
 */
export const env = validateEnv()

/* -------------------------------------------------------------------------- */
/*  Startup status printer                                                     */
/* -------------------------------------------------------------------------- */

interface EnvVarInfo {
	name: string
	group: string
	required: boolean
	description: string
}

const ENV_VARS: EnvVarInfo[] = [
	{ name: "DATABASE_URL", group: "DATABASE", required: true, description: "PostgreSQL connection string" },
	{ name: "NEXTAUTH_SECRET", group: "AUTH", required: true, description: "JWT signing secret" },
	{ name: "NEXTAUTH_URL", group: "AUTH", required: true, description: "Canonical app URL" },
	{ name: "GOOGLE_CLIENT_ID", group: "OAUTH", required: false, description: "Google OAuth client ID" },
	{ name: "GOOGLE_CLIENT_SECRET", group: "OAUTH", required: false, description: "Google OAuth client secret" },
	{ name: "GITHUB_CLIENT_ID", group: "OAUTH", required: false, description: "GitHub OAuth client ID" },
	{ name: "GITHUB_CLIENT_SECRET", group: "OAUTH", required: false, description: "GitHub OAuth client secret" },
	{ name: "APPLE_CLIENT_ID", group: "OAUTH", required: false, description: "Apple OAuth client ID" },
	{ name: "APPLE_CLIENT_SECRET", group: "OAUTH", required: false, description: "Apple OAuth client secret" },
	{ name: "MAGIC_LINK_ENABLED", group: "OAUTH", required: false, description: "Enable magic-link login (true/false)" },
	{ name: "RESEND_API_KEY", group: "EMAIL", required: false, description: "Resend API key" },
	{ name: "EMAIL_FROM", group: "EMAIL", required: false, description: "From address for emails" },
	{ name: "STORAGE_PROVIDER", group: "STORAGE", required: false, description: "vercel | s3" },
	{ name: "BLOB_READ_WRITE_TOKEN", group: "STORAGE", required: false, description: "Vercel Blob token" },
	{ name: "AWS_S3_BUCKET", group: "STORAGE", required: false, description: "S3 bucket name" },
	{ name: "AWS_ACCESS_KEY_ID", group: "STORAGE", required: false, description: "AWS access key" },
	{ name: "AWS_SECRET_ACCESS_KEY", group: "STORAGE", required: false, description: "AWS secret key" },
	{ name: "AWS_REGION", group: "STORAGE", required: false, description: "AWS region" },
	{ name: "STRIPE_SECRET_KEY", group: "STRIPE", required: false, description: "Stripe secret key (sk_...)" },
	{ name: "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY", group: "STRIPE", required: false, description: "Stripe publishable key (pk_...)" },
	{ name: "STRIPE_WEBHOOK_SECRET", group: "STRIPE", required: false, description: "Stripe webhook secret (whsec_...)" },
	{ name: "OPENROUTER_API_KEY", group: "AI", required: false, description: "OpenRouter API key" },
	{ name: "OPENROUTER_MODEL", group: "AI", required: false, description: "OpenRouter model ID" },
	{ name: "NEXT_PUBLIC_APP_NAME", group: "APP", required: false, description: "Public app name" },
	{ name: "NEXT_PUBLIC_APP_URL", group: "APP", required: false, description: "Public app URL" },
	{ name: "OWNER_EMAILS", group: "ADMIN", required: false, description: "Comma-separated owner emails" },
	{ name: "ADMIN_EMAILS", group: "ADMIN", required: false, description: "Comma-separated admin emails" },
]

/**
 * Prints a formatted table of all environment variable statuses.
 * Called during server startup to give developers quick visibility.
 */
export function printEnvStatus(): void {
	console.log("\n┌──────────────────────────────────────────────────────────────────────┐")
	console.log("│  Environment Variables                                               │")
	console.log("├──────────┬────────────────────────────────────┬───────┬───────────────┤")
	console.log("│  Group   │  Variable                          │ Status│ Description   │")
	console.log("├──────────┼────────────────────────────────────┼───────┼───────────────┤")

	for (const v of ENV_VARS) {
		const value = process.env[v.name]
		const status = value ? "✓ set" : v.required ? "✗ MISS" : "⚠ skip"
		const group = v.group.padEnd(8)
		const name = v.name.padEnd(36)
		const st = status.padEnd(6)
		console.log(`│  ${group}│  ${name}│ ${st}│ ${v.description}`)
	}

	console.log("└──────────┴────────────────────────────────────┴───────┴───────────────┘\n")
}
