/**
 * OAuthButtons — renders OAuth sign-in buttons based on enabled providers.
 *
 * Only shows buttons for providers that have their env vars configured.
 * Uses DaisyUI button styles.
 */

"use client"

import { signIn } from "next-auth/react"
import type { AuthProviderInfo } from "@/types/auth"
import { Button } from "@/components/ui"

interface OAuthButtonsProps {
	providers: AuthProviderInfo[]
	callbackUrl?: string
}

const providerIcons: Record<string, string> = {
	google: "G",
	github: "GH",
	apple: "A",
}

export function OAuthButtons({ providers, callbackUrl = "/dashboard" }: OAuthButtonsProps) {
	const enabled = providers.filter((p) => p.enabled)

	if (enabled.length === 0) return null

	return (
		<div className="space-y-2">
			<div className="divider text-sm text-base-content/60">or continue with</div>
			{enabled.map((provider) => (
				<Button
					key={provider.id}
					type="button"
					onClick={() => signIn(provider.id, { callbackUrl })}
					outline
					className="w-full gap-2"
				>
					<span className="font-bold">{providerIcons[provider.id]}</span>
					Continue with {provider.name}
				</Button>
			))}
		</div>
	)
}
