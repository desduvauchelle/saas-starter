import React from "react"

export default function ContactPage() {
	return (
		<main className="flex min-h-screen items-center justify-center bg-base-200">
			<section className="w-full max-w-md p-8 rounded-box shadow-lg bg-base-100">
				<h1 className="text-3xl font-bold mb-6 text-center">Contact Us</h1>
				<form className="space-y-4">
					<div className="form-control">
						<label className="label" htmlFor="name">
							<span className="label-text">Name</span>
						</label>
						<input
							id="name"
							name="name"
							type="text"
							placeholder="Your Name"
							className="input input-bordered"
							required
						/>
					</div>
					<div className="form-control">
						<label className="label" htmlFor="email">
							<span className="label-text">Email</span>
						</label>
						<input
							id="email"
							name="email"
							type="email"
							placeholder="you@example.com"
							className="input input-bordered"
							required
						/>
					</div>
					<div className="form-control">
						<label className="label" htmlFor="message">
							<span className="label-text">Message</span>
						</label>
						<textarea
							id="message"
							name="message"
							placeholder="How can we help you?"
							className="textarea textarea-bordered"
							rows={4}
							required
						/>
					</div>
					<button type="submit" className="btn btn-primary w-full">
						Send Message
					</button>
				</form>
			</section>
		</main>
	)
}
