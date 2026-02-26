/**
 * Terms of Service page at /terms.
 */

import type { Metadata } from "next"

export const metadata: Metadata = {
	title: "Terms of Service",
	description: "Terms and conditions for using our service.",
}

export default function TermsPage() {
	const appName = process.env.NEXT_PUBLIC_APP_NAME ?? "SaaS Starter"

	return (
		<div className="bg-base-100">
			{/* Hero Header */}
			<div className="bg-base-200 border-b border-base-300 py-20">
				<div className="container mx-auto px-4 max-w-4xl">
					<h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
						Terms of Service
					</h1>
					<p className="text-xl text-base-content/70">
						Please read our terms carefully before using our services.
					</p>
				</div>
			</div>

			{/* Content */}
			<div className="container mx-auto px-4 py-16 max-w-4xl">
				<div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary prose-a:no-underline hover:prose-a:underline">
					<p className="lead">
						By using <strong>{appName}</strong>, you agree to these terms.
					</p>

					<h2>1. Acceptance of Terms</h2>
					<p>
						By accessing or using our service, you agree to be bound by these Terms
						of Service and our <a href="/privacy">Privacy Policy</a>. If you do not
						agree, do not use the service.
					</p>

					<h2>2. Description of Service</h2>
					<p>
						{appName} provides a software-as-a-service platform. Features and
						availability may change at our discretion. We will make reasonable
						efforts to notify you of significant changes.
					</p>

					<h2>3. Account Registration</h2>
					<ul>
						<li>You must provide accurate and complete information.</li>
						<li>You are responsible for maintaining the security of your account.</li>
						<li>You must be at least 16 years old to create an account.</li>
						<li>One person or entity may not maintain more than one account.</li>
					</ul>

					<h2>4. Acceptable Use</h2>
					<p>You agree not to:</p>
					<ul>
						<li>Use the service for any illegal purpose.</li>
						<li>Upload malicious code, viruses, or harmful content.</li>
						<li>Attempt to gain unauthorized access to our systems.</li>
						<li>Interfere with the service or other users&apos; use of it.</li>
						<li>Scrape, crawl, or index the service without permission.</li>
						<li>Resell or redistribute the service without authorization.</li>
					</ul>

					<h2>5. Payment and Billing</h2>
					<ul>
						<li>Paid plans are billed in advance on a recurring basis.</li>
						<li>
							All fees are non-refundable except as required by applicable law.
						</li>
						<li>
							We may change pricing with 30 days&apos; notice. Changes apply at
							your next renewal.
						</li>
						<li>
							Payment processing is handled by Stripe. Their terms apply to
							payment transactions.
						</li>
					</ul>

					<h2>6. Cancellation</h2>
					<p>
						You may cancel your subscription at any time. Your access continues
						until the end of the current billing period. You can manage your
						subscription via the billing portal in your account.
					</p>

					<h2>7. Intellectual Property</h2>
					<p>
						The service, including its design, code, and content, is owned by us
						and protected by intellectual property laws. You retain ownership of
						your own content you upload or create using the service.
					</p>

					<h2>8. Limitation of Liability</h2>
					<p>
						To the maximum extent permitted by law, {appName} shall not be liable
						for any indirect, incidental, special, consequential, or punitive
						damages, or any loss of profits or revenues, whether incurred directly
						or indirectly.
					</p>

					<h2>9. Disclaimer of Warranties</h2>
					<p>
						The service is provided &ldquo;as is&rdquo; and &ldquo;as
						available&rdquo; without warranties of any kind, either express or
						implied, including but not limited to implied warranties of
						merchantability and fitness for a particular purpose.
					</p>

					<h2>10. Termination</h2>
					<p>
						We may suspend or terminate your access at any time for violation of
						these terms, or for any other reason with reasonable notice. You may
						terminate your account at any time.
					</p>

					<h2>11. Changes to Terms</h2>
					<p>
						We may modify these terms at any time. Material changes will be
						communicated via email or in-app notice at least 30 days in advance.
						Continued use after changes constitutes acceptance.
					</p>

					<h2>12. Governing Law</h2>
					<p>
						These terms are governed by the laws of [Your Jurisdiction]. Disputes
						shall be resolved in the courts of [Your Jurisdiction].
					</p>

					<h2>13. Contact</h2>
					<p>
						Questions about these terms? Contact us at{" "}
						<a href="mailto:legal@example.com">legal@example.com</a>.
					</p>

					<p className="text-base-content/50 text-sm mt-12 pt-8 border-t border-base-200">
						Last updated: {new Date().toLocaleDateString()}
					</p>
				</div>
			</div>
		</div>
	)
}
