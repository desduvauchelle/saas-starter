/**
 * Admin Storage page — shows storage provider configuration status.
 *
 * If storage is not configured, displays a clear "not configured" notice
 * with instructions on what env vars to set. Only accessible to OWNER role.
 */

import { env } from "@/env"

interface ProviderVar {
	name: string
	description: string
	isSet: boolean
	mask?: boolean
}


export default function AdminStoragePage() {
	const provider = env.STORAGE_PROVIDER

	const vercelVars: ProviderVar[] = [
		{
			name: "STORAGE_PROVIDER",
			description: "Must be set to \"vercel\"",
			isSet: provider === "vercel",
		},
		{
			name: "BLOB_READ_WRITE_TOKEN",
			description: "Vercel Blob read-write token",
			isSet: !!env.BLOB_READ_WRITE_TOKEN,
			mask: true,
		},
	]

	const s3Vars: ProviderVar[] = [
		{
			name: "STORAGE_PROVIDER",
			description: "Must be set to \"s3\"",
			isSet: provider === "s3",
		},
		{
			name: "AWS_S3_BUCKET",
			description: "S3 bucket name",
			isSet: !!env.AWS_S3_BUCKET,
		},
		{
			name: "AWS_ACCESS_KEY_ID",
			description: "AWS access key ID",
			isSet: !!env.AWS_ACCESS_KEY_ID,
			mask: true,
		},
		{
			name: "AWS_SECRET_ACCESS_KEY",
			description: "AWS secret access key",
			isSet: !!env.AWS_SECRET_ACCESS_KEY,
			mask: true,
		},
		{
			name: "AWS_REGION",
			description: "AWS region (defaults to us-east-1)",
			isSet: !!env.AWS_REGION,
		},
	]

	const isVercelConfigured = provider === "vercel" && !!env.BLOB_READ_WRITE_TOKEN
	const isS3Configured =
		provider === "s3" &&
		!!env.AWS_S3_BUCKET &&
		!!env.AWS_ACCESS_KEY_ID &&
		!!env.AWS_SECRET_ACCESS_KEY

	const isConfigured = isVercelConfigured || isS3Configured

	return (
		<div className="max-w-3xl">
			<h1 className="text-2xl font-bold mb-2">Storage</h1>
			<p className="text-base-content/60 mb-6">
				File storage is used for user avatar uploads and any other file assets.
				Configure one provider via environment variables.
			</p>

			{/* Status banner */}
			{isConfigured ? (
				<div className="alert alert-success mb-6">
					<i className="fa-solid fa-circle-check" />
					<span>
						Storage is configured using the{" "}
						<strong>{provider === "vercel" ? "Vercel Blob" : "AWS S3"}</strong>{" "}
						provider.
					</span>
				</div>
			) : (
				<div className="alert alert-warning mb-6">
					<i className="fa-solid fa-triangle-exclamation" />
					<span>
						Storage is <strong>not configured</strong>. File uploads will fail
						until you set the required environment variables and restart the
						server.
					</span>
				</div>
			)}

			{/* Current state */}
			<div className="card bg-base-200 mb-6">
				<div className="card-body">
					<h2 className="card-title text-base">Current Configuration</h2>
					<div className="flex items-center gap-3">
						<span className="text-base-content/60 text-sm w-40">
							STORAGE_PROVIDER
						</span>
						{provider ? (
							<span className="badge badge-neutral font-mono text-xs">
								{provider}
							</span>
						) : (
							<span className="badge badge-ghost font-mono text-xs">not set</span>
						)}
					</div>
				</div>
			</div>

			{/* Provider options */}
			<div className="grid gap-6 md:grid-cols-2">
				{/* Vercel Blob */}
				<div
					className={`card border-2 ${isVercelConfigured
							? "border-success"
							: provider === "vercel"
								? "border-warning"
								: "border-base-300"
						} bg-base-200`}
				>
					<div className="card-body">
						<div className="flex items-center justify-between mb-2">
							<h3 className="font-semibold">Vercel Blob</h3>
							{isVercelConfigured ? (
								<span className="badge badge-success badge-sm">Active</span>
							) : (
								<span className="badge badge-ghost badge-sm">Inactive</span>
							)}
						</div>
						<p className="text-sm text-base-content/60 mb-4">
							Recommended for Vercel deployments. Simple setup with a single
							token.
						</p>
						<table className="w-full text-xs">
							<tbody>
								{vercelVars.map((v) => (
									<tr key={v.name} className="border-t border-base-300">
										<td className="py-2 font-mono text-base-content/70 pr-2">
											{v.name}
										</td>
										<td className="py-2 text-right">
											{v.isSet ? (
												<span className="text-success">
													<i className="fa-solid fa-check mr-1" />
													set
												</span>
											) : (
												<span className="text-warning">
													<i className="fa-solid fa-xmark mr-1" />
													missing
												</span>
											)}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>

				{/* AWS S3 */}
				<div
					className={`card border-2 ${isS3Configured
							? "border-success"
							: provider === "s3"
								? "border-warning"
								: "border-base-300"
						} bg-base-200`}
				>
					<div className="card-body">
						<div className="flex items-center justify-between mb-2">
							<h3 className="font-semibold">AWS S3</h3>
							{isS3Configured ? (
								<span className="badge badge-success badge-sm">Active</span>
							) : (
								<span className="badge badge-ghost badge-sm">Inactive</span>
							)}
						</div>
						<p className="text-sm text-base-content/60 mb-4">
							Use any S3-compatible bucket. Suitable for AWS or self-hosted
							MinIO deployments.
						</p>
						<table className="w-full text-xs">
							<tbody>
								{s3Vars.map((v) => (
									<tr key={v.name} className="border-t border-base-300">
										<td className="py-2 font-mono text-base-content/70 pr-2">
											{v.name}
										</td>
										<td className="py-2 text-right">
											{v.isSet ? (
												<span className="text-success">
													<i className="fa-solid fa-check mr-1" />
													set
												</span>
											) : (
												<span className="text-warning">
													<i className="fa-solid fa-xmark mr-1" />
													missing
												</span>
											)}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>

			{/* How to configure */}
			{!isConfigured && (
				<div className="card bg-base-200 mt-6">
					<div className="card-body">
						<h2 className="card-title text-base">How to Configure</h2>
						<p className="text-sm text-base-content/60 mb-3">
							Add the following to your <code className="font-mono">.env</code>{" "}
							file and restart the server:
						</p>
						<div className="mockup-code text-xs">
							<pre>
								<code>
									{provider === "s3"
										? `STORAGE_PROVIDER="s3"\nAWS_S3_BUCKET="my-bucket"\nAWS_ACCESS_KEY_ID="..."\nAWS_SECRET_ACCESS_KEY="..."\nAWS_REGION="us-east-1"`
										: `STORAGE_PROVIDER="vercel"\nBLOB_READ_WRITE_TOKEN="..."`}
								</code>
							</pre>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
