/**
 * Cookie Policy page at /cookies.
 */

import type { Metadata } from "next"

export const metadata: Metadata = {
	title: "Cookie Policy",
	description: "How we use cookies and similar technologies.",
}

export default function CookiesPage() {
	const appName = process.env.NEXT_PUBLIC_APP_NAME ?? "SaaS Starter"

	return (
		<div className="bg-base-100">
			{/* Hero Header */}
			<div className="bg-base-200 border-b border-base-300 py-20">
				<div className="container mx-auto px-4 max-w-4xl">
					<h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
						Cookie Policy
					</h1>
					<p className="text-xl text-base-content/70">
						How we use cookies and similar tracking technologies.
					</p>
				</div>
			</div>

			{/* Content */}
			<div className="container mx-auto px-4 py-16 max-w-4xl">
				<div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary prose-a:no-underline hover:prose-a:underline">
					<p className="lead">
						Transparency about how we use cookies.
					</p>

					<h2>What Are Cookies?</h2>
					<p>
						Cookies are small text files stored on your device when you visit a
						website. They help the site remember your preferences and improve your
						experience.
					</p>

					<h2>Types of Cookies We Use</h2>

					<h3>Essential Cookies</h3>
					<p>
						These cookies are necessary for the service to function. They include
						session cookies for authentication and security. You cannot opt out of
						essential cookies.
					</p>
					<table>
						<thead>
							<tr>
								<th>Cookie</th>
								<th>Purpose</th>
								<th>Duration</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>
									<code>next-auth.session-token</code>
								</td>
								<td>Authentication session</td>
								<td>Session / 30 days</td>
							</tr>
							<tr>
								<td>
									<code>next-auth.csrf-token</code>
								</td>
								<td>CSRF protection</td>
								<td>Session</td>
							</tr>
							<tr>
								<td>
									<code>cookie-consent</code>
								</td>
								<td>Remembers your cookie preferences</td>
								<td>1 year</td>
							</tr>
						</tbody>
					</table>

					<h3>Analytics Cookies (Optional)</h3>
					<p>
						If enabled, these cookies help us understand how visitors use the site.
						They are only set with your consent.
					</p>

					<h3>Marketing Cookies (Optional)</h3>
					<p>
						If enabled, these cookies are used to deliver relevant advertisements
						and track campaign performance. They are only set with your consent.
					</p>

					<h2>Managing Cookies</h2>
					<p>You can manage your cookie preferences in several ways:</p>
					<ul>
						<li>
							<strong>Cookie banner:</strong> Use the cookie consent banner that
							appears when you first visit the site.
						</li>
						<li>
							<strong>Browser settings:</strong> Most browsers let you block or
							delete cookies via their settings.
						</li>
						<li>
							<strong>Opt-out links:</strong> Some analytics providers offer
							opt-out browser plugins.
						</li>
					</ul>
					<p>
						Note that disabling essential cookies may prevent the service from
						functioning correctly.
					</p>

					<h2>Third-Party Cookies</h2>
					<p>
						Some cookies may be set by third-party services we use, including:
					</p>
					<ul>
						<li>
							<strong>Stripe:</strong> for secure payment processing.
						</li>
						<li>
							<strong>Analytics provider:</strong> if configured by the site
							administrator.
						</li>
					</ul>

					<h2>Changes to This Policy</h2>
					<p>
						We may update this Cookie Policy from time to time. Check back
						periodically for changes.
					</p>

					<h2>Contact</h2>
					<p>
						Questions about our cookie usage? Contact us at{" "}
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
