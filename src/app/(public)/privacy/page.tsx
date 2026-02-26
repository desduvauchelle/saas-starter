/**
 * Privacy Policy page at /privacy.
 */

import type { Metadata } from "next"

export const metadata: Metadata = {
	title: "Privacy Policy",
	description: "How we collect, use, and protect your personal data.",
}

export default function PrivacyPage() {
	const appName = process.env.NEXT_PUBLIC_APP_NAME ?? "SaaS Starter"

	return (
		<div className="bg-base-100">
			{/* Hero Header */}
			<div className="bg-base-200 border-b border-base-300 py-20">
				<div className="container mx-auto px-4 max-w-4xl">
					<h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
						Privacy Policy
					</h1>
					<p className="text-xl text-base-content/70">
						How we collect, use, and protect your personal information.
					</p>
				</div>
			</div>

			{/* Content */}
			<div className="container mx-auto px-4 py-16 max-w-4xl">
				<div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary prose-a:no-underline hover:prose-a:underline">
					<p className="lead">
						Your privacy is important to us.
					</p>

					<h2>1. Information We Collect</h2>
					<h3>Information you provide</h3>
					<ul>
						<li>
							<strong>Account data:</strong> name, email address, and password when
							you register.
						</li>
						<li>
							<strong>Profile data:</strong> avatar, bio, and preferences you choose
							to provide.
						</li>
						<li>
							<strong>Payment data:</strong> processed through Stripe — we never
							store your credit card details.
						</li>
						<li>
							<strong>Communications:</strong> messages you send through our contact
							form or support channels.
						</li>
					</ul>

					<h3>Information collected automatically</h3>
					<ul>
						<li>
							<strong>Usage data:</strong> pages visited, features used, and
							interaction patterns.
						</li>
						<li>
							<strong>Device data:</strong> browser type, OS, screen resolution, and
							IP address.
						</li>
						<li>
							<strong>Cookies:</strong> small text files stored on your device (see
							our <a href="/cookies">Cookie Policy</a>).
						</li>
					</ul>

					<h2>2. How We Use Your Information</h2>
					<ul>
						<li>To provide, maintain, and improve our services.</li>
						<li>To process payments and manage subscriptions.</li>
						<li>To send transactional emails (confirmations, invoices, etc.).</li>
						<li>
							To send marketing communications (only with your consent — you can
							opt out anytime).
						</li>
						<li>To detect and prevent fraud and abuse.</li>
						<li>To comply with legal obligations.</li>
					</ul>

					<h2>3. Data Sharing</h2>
					<p>
						We do <strong>not</strong> sell your personal data. We share information
						only with:
					</p>
					<ul>
						<li>
							<strong>Service providers:</strong> Stripe (payments), Resend
							(emails), Vercel (hosting), and cloud storage providers — only as
							needed to operate the service.
						</li>
						<li>
							<strong>Legal requirements:</strong> when required by law,
							regulation, or valid legal process.
						</li>
					</ul>

					<h2>4. Data Security</h2>
					<p>
						We implement industry-standard security measures including encryption
						in transit (TLS) and at rest, secure password hashing, and access
						controls.
					</p>

					<h2>5. Data Retention</h2>
					<p>
						We retain your data for as long as your account is active or as needed
						to provide the service. You can request deletion at any time by
						contacting us or deleting your account.
					</p>

					<h2>6. Your Rights</h2>
					<p>Depending on your location, you may have the right to:</p>
					<ul>
						<li>Access the personal data we hold about you.</li>
						<li>Request correction of inaccurate data.</li>
						<li>Request deletion of your data.</li>
						<li>Object to or restrict certain processing.</li>
						<li>Request data portability.</li>
						<li>Withdraw consent at any time.</li>
					</ul>
					<p>
						To exercise these rights, contact us at{" "}
						<a href="mailto:privacy@example.com">privacy@example.com</a>.
					</p>

					<h2>7. International Transfers</h2>
					<p>
						Your data may be transferred to and processed in countries outside your
						own. We ensure appropriate safeguards are in place for such transfers.
					</p>

					<h2>8. Children</h2>
					<p>
						Our service is not directed to children under 16. We do not knowingly
						collect data from children.
					</p>

					<h2>9. Changes to This Policy</h2>
					<p>
						We may update this policy from time to time. We will notify you of
						material changes via email or a notice on our website.
					</p>

					<h2>10. Contact</h2>
					<p>
						For privacy questions, contact us at{" "}
						<a href="mailto:privacy@example.com">privacy@example.com</a>.
					</p>

					<p className="text-base-content/50 text-sm mt-12 pt-8 border-t border-base-200">
						Last updated: {new Date().toLocaleDateString()}
					</p>
				</div>
			</div>
		</div>
	)
}
