/**
 * Contact page at /contact.
 */

import { Button, Input, Textarea, TextLink } from "@/components/ui"
import type { Metadata } from "next"

export const metadata: Metadata = {
	title: "Contact Us",
	description: "Get in touch with our team.",
}

export default function ContactPage() {
	const appName = process.env.NEXT_PUBLIC_APP_NAME ?? "SaaS Starter"

	return (
		<div className="bg-base-100">
			{/* Hero Header */}
			<div className="bg-base-200 border-b border-base-300 py-20">
				<div className="container mx-auto px-4 max-w-xl text-center">
					<h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
						Get in Touch
					</h1>
					<p className="text-xl text-base-content/70">
						Have a question or need help? We&apos;d love to hear from you.
					</p>
				</div>
			</div>

			<div className="container mx-auto px-4 py-16 max-w-xl">
				<form className="space-y-6" action="/api/contact" method="POST">
					<Input label="Name" name="name" size="lg" placeholder="Your name" required />
					<Input label="Email" name="email" type="email" size="lg" placeholder="you@example.com" required />
					<Input label="Subject" name="subject" type="text" size="lg" placeholder="How can we help?" required />
					<Textarea label="Message" name="message" placeholder="Tell us more about your inquiry..." rows={6} required className="text-lg" />

					<Button type="submit" variant="primary" modifier="block" size="lg">
						Send Message
					</Button>
				</form>

				<div className="divider my-16">OR</div>

				<div className="text-center space-y-4">
					<p className="text-base-content/70">
						Prefer direct email? Reach us at:
					</p>
					<TextLink
						href="mailto:support@example.com"
						variant="primary"
						external
						className="text-2xl font-bold no-underline hover:underline"
					>
						support@example.com
					</TextLink>
				</div>
			</div>
		</div>
	)
}
