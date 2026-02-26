/**
 * GDPR Information page at /gdpr.
 */

import type { Metadata } from "next"

export const metadata: Metadata = {
	title: "GDPR Information",
	description: "Information about our GDPR compliance and your data rights.",
}

export default function GdprPage() {
	const appName = process.env.NEXT_PUBLIC_APP_NAME ?? "SaaS Starter"

	return (
		<div className="bg-base-100">
			{/* Hero Header */}
			<div className="bg-base-200 border-b border-base-300 py-20">
				<div className="container mx-auto px-4 max-w-4xl">
					<h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
						GDPR Information
					</h1>
					<p className="text-xl text-base-content/70">
						Commitment to protecting your personal data in accordance with GDPR.
					</p>
				</div>
			</div>

			{/* Content */}
			<div className="container mx-auto px-4 py-16 max-w-4xl">
				<div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary prose-a:no-underline hover:prose-a:underline">
					<p className="lead">
						Your rights and our responsibilities.
					</p>

					<h2>Data Controller</h2>
					<p>
						The data controller for personal data processed through this service
						is:
					</p>
					<p>
						<strong>[Your Company Name]</strong>
						<br />
						[Address]
						<br />
						Email:{" "}
						<a href="mailto:dpo@example.com">dpo@example.com</a>
					</p>

					<h2>Legal Basis for Processing</h2>
					<p>
						We process personal data under the following legal bases (Article 6
						GDPR):
					</p>
					<ul>
						<li>
							<strong>Contract performance (Art. 6(1)(b)):</strong> Processing
							necessary to provide the service you signed up for.
						</li>
						<li>
							<strong>Legitimate interest (Art. 6(1)(f)):</strong> Analytics,
							fraud prevention, and service improvement.
						</li>
						<li>
							<strong>Consent (Art. 6(1)(a)):</strong> Marketing communications
							and optional cookies.
						</li>
						<li>
							<strong>Legal obligation (Art. 6(1)(c)):</strong> Tax records,
							fraud reporting, and compliance.
						</li>
					</ul>

					<h2>Your Rights Under GDPR</h2>
					<p>Under the GDPR, you have the following rights:</p>

					<div className="overflow-x-auto">
						<table>
							<thead>
								<tr>
									<th>Right</th>
									<th>Description</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>
										<strong>Access</strong>
									</td>
									<td>
										Request a copy of the personal data we hold about you.
									</td>
								</tr>
								<tr>
									<td>
										<strong>Rectification</strong>
									</td>
									<td>Request correction of inaccurate or incomplete data.</td>
								</tr>
								<tr>
									<td>
										<strong>Erasure</strong>
									</td>
									<td>
										Request deletion of your data (&ldquo;right to be
										forgotten&rdquo;).
									</td>
								</tr>
								<tr>
									<td>
										<strong>Restriction</strong>
									</td>
									<td>
										Request limitation of processing in certain circumstances.
									</td>
								</tr>
								<tr>
									<td>
										<strong>Portability</strong>
									</td>
									<td>
										Receive your data in a structured, machine-readable format.
									</td>
								</tr>
								<tr>
									<td>
										<strong>Object</strong>
									</td>
									<td>
										Object to processing based on legitimate interest or direct
										marketing.
									</td>
								</tr>
								<tr>
									<td>
										<strong>Withdraw consent</strong>
									</td>
									<td>
										Withdraw previously given consent at any time.
									</td>
								</tr>
							</tbody>
						</table>
					</div>

					<h2>How to Exercise Your Rights</h2>
					<p>
						To exercise any of these rights, you can:
					</p>
					<ul>
						<li>
							<strong>Self-service:</strong> Delete your account from the account
							settings page.
						</li>
						<li>
							<strong>Email:</strong> Contact our Data Protection Officer at{" "}
							<a href="mailto:dpo@example.com">dpo@example.com</a>.
						</li>
					</ul>
					<p>
						We will respond to your request within 30 days. We may ask for
						identity verification before processing your request.
					</p>

					<h2>Data Processing Activities</h2>
					<ul>
						<li>
							<strong>Account management:</strong> Name, email, password hash,
							profile picture.
						</li>
						<li>
							<strong>Payment processing:</strong> Handled by Stripe (PCI DSS
							certified). We store only the Stripe customer ID.
						</li>
						<li>
							<strong>Email communications:</strong> Handled by Resend. No email
							content is stored beyond delivery logs.
						</li>
						<li>
							<strong>File uploads:</strong> Stored securely in the configured
							storage provider (Vercel Blob or AWS S3).
						</li>
					</ul>

					<h2>International Transfers</h2>
					<p>
						Your data may be processed in countries outside the EEA. We rely on
						Standard Contractual Clauses (SCCs) and adequacy decisions for such
						transfers.
					</p>

					<h2>Data Retention</h2>
					<p>
						We retain your data for as long as your account is active. After
						account deletion, we retain minimal records (e.g., transaction logs)
						for up to 7 years as required by law.
					</p>

					<h2>Supervisory Authority</h2>
					<p>
						If you believe your data protection rights have been violated, you
						have the right to lodge a complaint with your local supervisory
						authority.
					</p>

					<h2>Contact</h2>
					<p>
						Data Protection Officer:{" "}
						<a href="mailto:dpo@example.com">dpo@example.com</a>
					</p>

					<p className="text-base-content/50 text-sm mt-12 pt-8 border-t border-base-200">
						Last updated: {new Date().toLocaleDateString()}
					</p>
				</div>
			</div>
		</div>
	)
}
