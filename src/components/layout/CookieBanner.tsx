/**
 * CookieBanner — displays a GDPR-compliant cookie consent banner.
 *
 * Stores consent in localStorage. Only shows once until the user
 * clears storage or changes their mind.
 */

"use client"

import { useEffect, useState } from "react"
import { Button, TextLink } from "@/components/ui"

const COOKIE_CONSENT_KEY = "cookie-consent"

type ConsentValue = "accepted" | "rejected" | null

export function CookieBanner() {
	const [consent, setConsent] = useState<ConsentValue>(null)
	const [visible, setVisible] = useState(false)

	useEffect(() => {
		const stored = localStorage.getItem(COOKIE_CONSENT_KEY)
		if (stored === "accepted" || stored === "rejected") {
			setConsent(stored)
		} else {
			// Show banner after a short delay so it doesn't flash on page load
			const timer = setTimeout(() => setVisible(true), 1000)
			return () => clearTimeout(timer)
		}
	}, [])

	const handleAccept = () => {
		localStorage.setItem(COOKIE_CONSENT_KEY, "accepted")
		setConsent("accepted")
		setVisible(false)
	}

	const handleReject = () => {
		localStorage.setItem(COOKIE_CONSENT_KEY, "rejected")
		setConsent("rejected")
		setVisible(false)
	}

	// Already answered or not yet visible
	if (consent !== null || !visible) return null

	return (
		<div className="fixed bottom-0 left-0 right-0 z-50 p-4">
			<div className="max-w-4xl mx-auto bg-base-200 border border-base-300 rounded-xl shadow-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
				<div className="flex-1">
					<p className="text-sm">
						We use cookies to improve your experience and analyze site usage.
						By clicking &ldquo;Accept&rdquo;, you consent to our use of cookies.
						See our{" "}
						<TextLink href="/cookies" variant="primary">
							Cookie Policy
						</TextLink>{" "}
						for details.
					</p>
				</div>
				<div className="flex gap-2 shrink-0">
					<Button variant="ghost" size="sm" onClick={handleReject}>
						Reject
					</Button>
					<Button variant="primary" size="sm" onClick={handleAccept}>
						Accept
					</Button>
				</div>
			</div>
		</div>
	)
}
