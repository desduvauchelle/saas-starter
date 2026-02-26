/**
 * Legal notice page at /legal.
 */

import type { Metadata } from "next"

export const metadata: Metadata = {
	title: "Legal Notice",
	description: "Legal information and company details.",
}

export default function LegalPage() {
	const appName = process.env.NEXT_PUBLIC_APP_NAME ?? "SaaS Starter"

	return (
		<div className="bg-base-100">
			{/* Hero Header */}
			<div className="bg-base-200 border-b border-base-300 py-20">
				<div className="container mx-auto px-4 max-w-4xl">
					<h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
						Legal Notice
					</h1>
					<p className="text-xl text-base-content/70">
						Required legal information and company details.
					</p>
				</div>
			</div>

			{/* Content */}
			<div className="container mx-auto px-4 py-16 max-w-4xl">
				<div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary prose-a:no-underline hover:prose-a:underline">
					<p className="lead">
						Official identification and responsibility details.
					</p>

					<h2>Company Information</h2>
					<p>
						<strong>[Your Company Name]</strong>
						<br />
						[Street Address]
						<br />
						[City, State/Province, ZIP/Postal Code]
						<br />
						[Country]
					</p>
					<p>
						<strong>Email:</strong>{" "}
						<a href="mailto:legal@example.com">legal@example.com</a>
						<br />
						<strong>Phone:</strong> [Your phone number]
					</p>

					<h2>Represented By</h2>
					<p>[Name of the legally responsible person or managing director]</p>

					<h2>Registration</h2>
					<p>
						Registered in [Registry], Registration Number: [Number]
						<br />
						VAT ID: [If applicable]
					</p>

					<h2>Dispute Resolution</h2>
					<p>
						We are not willing or obliged to participate in dispute resolution
						proceedings before a consumer arbitration board. If you have a dispute,
						please contact us directly.
					</p>

					<h2>Liability for Content</h2>
					<p>
						As a service provider, we are responsible for our own content on these
						pages in accordance with applicable law. However, we are not obligated
						to monitor transmitted or stored third-party information.
					</p>

					<p className="text-base-content/50 text-sm mt-12 pt-8 border-t border-base-200">
						Last updated: {new Date().toLocaleDateString()}
					</p>
				</div>
			</div>
		</div>
	)
}
