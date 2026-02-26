/**
 * Admin Settings page — read-only overview of the application configuration.
 *
 * Shows the status of every configurable feature group (auth, email, storage,
 * payments, etc.) so admins can quickly see what is and isn't enabled.
 * Only accessible to OWNER role.
 */

import { env } from "@/env"

interface ConfigRow {
	label: string
	value: string | undefined
	status: "ok" | "missing" | "disabled"
	sensitive?: boolean
}

interface ConfigSection {
	title: string
	icon: string
	description: string
	rows: ConfigRow[]
}

function mask(val: string | undefined): string {
	if (!val) return "—"
	if (val.length <= 8) return "••••••••"
	return val.slice(0, 6) + "••••" + val.slice(-4)
}

function row(
	label: string,
	val: string | undefined,
	opts: { required?: boolean; sensitive?: boolean } = {}
): ConfigRow {
	return {
		label,
		value: val,
		status: val ? "ok" : opts.required ? "missing" : "disabled",
		sensitive: opts.sensitive,
	}
}

export default function AdminSettingsPage() {
	const sections: ConfigSection[] = [
		{
			title: "Application",
			icon: "fa-solid fa-layer-group",
			description: "General application metadata shown publicly.",
			rows: [
				row("App Name", env.NEXT_PUBLIC_APP_NAME),
				row("App URL", env.NEXT_PUBLIC_APP_URL),
				row("Environment", env.NODE_ENV),
				row("Canonical URL (NextAuth)", env.NEXTAUTH_URL),
			],
		},
		{
			title: "Authentication",
			icon: "fa-solid fa-key",
			description: "NextAuth configuration and OAuth providers.",
			rows: [
				row("NextAuth Secret", env.NEXTAUTH_SECRET, { required: true, sensitive: true }),
				row("Magic Link Login", env.MAGIC_LINK_ENABLED ? "enabled" : undefined),
				row("Google OAuth", env.GOOGLE_CLIENT_ID ? "configured" : undefined),
				row("GitHub OAuth", env.GITHUB_CLIENT_ID ? "configured" : undefined),
				row("Apple OAuth", env.APPLE_CLIENT_ID ? "configured" : undefined),
			],
		},
		{
			title: "Email",
			icon: "fa-solid fa-envelope",
			description: "Transactional email via Resend. Required for password resets and magic links.",
			rows: [
				row("Resend API Key", env.RESEND_API_KEY, { sensitive: true }),
				row("From Address", env.EMAIL_FROM),
			],
		},
		{
			title: "Storage",
			icon: "fa-solid fa-hard-drive",
			description: "File storage for uploads. Configure one provider.",
			rows: [
				row("Provider", env.STORAGE_PROVIDER),
				...(env.STORAGE_PROVIDER === "vercel"
					? [row("Vercel Blob Token", env.BLOB_READ_WRITE_TOKEN, { sensitive: true })]
					: []),
				...(env.STORAGE_PROVIDER === "s3"
					? [
						row("S3 Bucket", env.AWS_S3_BUCKET),
						row("AWS Access Key", env.AWS_ACCESS_KEY_ID, { sensitive: true }),
						row("AWS Secret Key", env.AWS_SECRET_ACCESS_KEY, { sensitive: true }),
						row("AWS Region", env.AWS_REGION),
					]
					: []),
			],
		},
		{
			title: "Payments",
			icon: "fa-solid fa-credit-card",
			description: "Stripe integration for subscriptions and one-time payments.",
			rows: [
				row("Stripe Secret Key", env.STRIPE_SECRET_KEY, { sensitive: true }),
				row("Stripe Publishable Key", env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY),
				row("Webhook Secret", env.STRIPE_WEBHOOK_SECRET, { sensitive: true }),
			],
		},
		{
			title: "Admin Access",
			icon: "fa-solid fa-shield-halved",
			description: "Emails that are automatically granted elevated roles on first login.",
			rows: [
				row("Owner Emails", env.OWNER_EMAILS || undefined),
				row("Admin Emails", env.ADMIN_EMAILS || undefined),
			],
		},
	]

	const statusBadge = (status: ConfigRow["status"]) => {
		if (status === "ok")
			return <span className="badge badge-success badge-sm">set</span>
		if (status === "missing")
			return <span className="badge badge-error badge-sm">missing</span>
		return <span className="badge badge-ghost badge-sm">not set</span>
	}

	const overallOk = sections.every((s) =>
		s.rows.every((r) => r.status !== "missing")
	)

	return (
		<div className="max-w-3xl">
			<h1 className="text-2xl font-bold mb-2">Settings</h1>
			<p className="text-base-content/60 mb-6">
				Read-only overview of the application configuration. Edit values in
				your <code className="font-mono text-sm">.env</code> file and restart
				the server for changes to take effect.
			</p>

			{overallOk ? (
				<div className="alert alert-success mb-6">
					<i className="fa-solid fa-circle-check" />
					<span>All required environment variables are configured.</span>
				</div>
			) : (
				<div className="alert alert-error mb-6">
					<i className="fa-solid fa-circle-exclamation" />
					<span>
						Some required environment variables are missing. Check the sections
						below.
					</span>
				</div>
			)}

			<div className="flex flex-col gap-4">
				{sections.map((section) => {
					const hasMissing = section.rows.some((r) => r.status === "missing")
					const configuredCount = section.rows.filter(
						(r) => r.status === "ok"
					).length

					return (
						<div key={section.title} className="card bg-base-200">
							<div className="card-body">
								<div className="flex items-start justify-between gap-4">
									<div className="flex items-center gap-3">
										<i className={`${section.icon} text-base-content/40 w-5 text-center`} />
										<div>
											<h2 className="font-semibold">{section.title}</h2>
											<p className="text-xs text-base-content/50">
												{section.description}
											</p>
										</div>
									</div>
									<div className="shrink-0">
										{hasMissing ? (
											<span className="badge badge-error badge-sm">
												action required
											</span>
										) : configuredCount === 0 ? (
											<span className="badge badge-ghost badge-sm">
												not configured
											</span>
										) : (
											<span className="badge badge-success badge-sm">
												configured
											</span>
										)}
									</div>
								</div>

								<div className="divider my-2" />

								<table className="w-full text-sm">
									<tbody>
										{section.rows.map((r) => (
											<tr
												key={r.label}
												className="border-t border-base-300 first:border-0"
											>
												<td className="py-2 text-base-content/60 pr-4 w-1/2">
													{r.label}
												</td>
												<td className="py-2 font-mono text-xs text-base-content/80 pr-4">
													{r.status === "ok"
														? r.sensitive
															? mask(r.value)
															: r.value
														: null}
												</td>
												<td className="py-2 text-right">
													{statusBadge(r.status)}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					)
				})}
			</div>
		</div>
	)
}
