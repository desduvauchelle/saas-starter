import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

import { config } from "@fortawesome/fontawesome-svg-core"
import "@fortawesome/fontawesome-svg-core/styles.css"
config.autoAddCss = false

import { CookieBanner } from "@/components/layout/CookieBanner"

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
})

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
})

export const metadata: Metadata = {
	title: {
		default: process.env.NEXT_PUBLIC_APP_NAME ?? "SaaS Starter",
		template: `%s | ${process.env.NEXT_PUBLIC_APP_NAME ?? "SaaS Starter"}`,
	},
	description: "Modern SaaS application",
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				{/* Inline script runs synchronously before first paint to restore the
				    user's persisted theme and avoid a light-mode flash. */}
				<script
					dangerouslySetInnerHTML={{
						__html: `(function(){try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark'){document.documentElement.setAttribute('data-theme',t);}else{document.documentElement.removeAttribute('data-theme');}}catch(e){}})();`,
					}}
				/>
				{children}
				<CookieBanner />
			</body>
		</html>
	)
}
