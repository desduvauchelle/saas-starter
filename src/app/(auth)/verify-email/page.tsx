/**
 * Verify Email page — shown after registration or magic-link send.
 */

import { ButtonLink } from "@/components/ui"

export const metadata = {
	title: "Check Your Email",
}

export default function VerifyEmailPage() {
	return (
		<div className="card bg-base-100 shadow-xl">
			<div className="card-body text-center">
				<h2 className="card-title justify-center text-2xl mb-4">Check Your Email</h2>
				<p className="text-base-content/70">
					We&apos;ve sent you an email with a link to verify your account.
					Please check your inbox (and spam folder).
				</p>
				<ButtonLink href="/login" variant="primary" className="mt-4">
					Back to Sign In
				</ButtonLink>
			</div>
		</div>
	)
}
