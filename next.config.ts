import type { NextConfig } from "next"

const nextConfig: NextConfig = {
	serverExternalPackages: [
		"@prisma/client",
		"prisma",
		"bcryptjs",
		"sharp",
		"@aws-sdk/client-s3",
		"@aws-sdk/s3-request-presigner",
		"@node-rs/argon2",
	],
}

export default nextConfig
