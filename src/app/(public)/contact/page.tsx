/**
 * Contact page at /contact.
 */

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
					<div className="form-control">
						<label className="label">
							<span className="label-text font-semibold">Name</span>
						</label>
						<input
							type="text"
							name="name"
							className="input input-bordered w-full input-lg"
							placeholder="Your name"
							required
						/>
					</div>

					<div className="form-control">
						<label className="label">
							<span className="label-text font-semibold">Email</span>
						</label>
						<input
							type="email"
							name="email"
							className="input input-bordered w-full input-lg"
							placeholder="you@example.com"
							required
						/>
					</div>

					<div className="form-control">
						<label className="label">
							<span className="label-text font-semibold">Subject</span>
						</label>
						<input
							type="text"
							name="subject"
							className="input input-bordered w-full input-lg"
							placeholder="How can we help?"
							required
						/>
					</div>

					<div className="form-control">
						<label className="label">
							<span className="label-text font-semibold">Message</span>
						</label>
						<textarea
							name="message"
							className="textarea textarea-bordered w-full text-lg"
							placeholder="Tell us more about your inquiry..."
							rows={6}
							required
						/>
					</div>

					<button type="submit" className="btn btn-primary btn-block btn-lg">
						Send Message
					</button>
				</form>

				<div className="divider my-16">OR</div>

				<div className="text-center space-y-4">
					<p className="text-base-content/70">
						Prefer direct email? Reach us at:
					</p>
					<a
						href="mailto:support@example.com"
						className="text-2xl font-bold link link-primary no-underline hover:underline"
					>
						support@example.com
					</a>
				</div>
			</div>
		</div>
	)
}
