/**
 * Account Profile page — edit name, email, avatar.
 */

"use client"

import { useState, useRef } from "react"
import { useSession } from "next-auth/react"
import type { ApiResponse } from "@/types/api"
import type { UserPublic } from "@/types/user"
import { Button, Input } from "@/components/ui"

export default function ProfilePage() {
	const { data: session, update } = useSession()
	const fileInputRef = useRef<HTMLInputElement>(null)

	const [name, setName] = useState(session?.user?.name ?? "")
	const [email, setEmail] = useState(session?.user?.email ?? "")
	const [loading, setLoading] = useState(false)
	const [avatarLoading, setAvatarLoading] = useState(false)
	const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

	async function handleProfileSubmit(e: React.FormEvent) {
		e.preventDefault()
		setLoading(true)
		setMessage(null)

		try {
			const res = await fetch("/api/account/profile", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name, email }),
			})

			const data = (await res.json()) as ApiResponse<UserPublic>

			if (!data.success) {
				setMessage({ type: "error", text: data.error.message })
			} else {
				setMessage({ type: "success", text: "Profile updated successfully" })
				await update()
			}
		} catch {
			setMessage({ type: "error", text: "Failed to update profile" })
		} finally {
			setLoading(false)
		}
	}

	async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0]
		if (!file) return

		setAvatarLoading(true)
		setMessage(null)

		try {
			const formData = new FormData()
			formData.append("file", file)

			const res = await fetch("/api/account/avatar", {
				method: "POST",
				body: formData,
			})

			const data = (await res.json()) as ApiResponse<{ url: string }>

			if (!data.success) {
				setMessage({ type: "error", text: data.error.message })
			} else {
				setMessage({ type: "success", text: "Avatar updated successfully" })
				await update()
			}
		} catch {
			setMessage({ type: "error", text: "Failed to upload avatar" })
		} finally {
			setAvatarLoading(false)
		}
	}

	const initials = (session?.user?.name ?? session?.user?.email ?? "U")
		.charAt(0)
		.toUpperCase()

	return (
		<div className="max-w-2xl mx-auto space-y-6">
			<h1 className="text-2xl font-bold">Profile</h1>

			{message && (
				<div
					className={`alert ${message.type === "success" ? "alert-success" : "alert-error"} text-sm`}
				>
					<span>{message.text}</span>
				</div>
			)}

			{/* Avatar */}
			<div className="card bg-base-100 shadow-sm">
				<div className="card-body">
					<h2 className="card-title text-lg">Avatar</h2>
					<div className="flex items-center gap-4">
						<div className="avatar placeholder">
							{session?.user?.image ? (
								<div className="w-16 rounded-full">
									<img src={session.user.image} alt="Avatar" />
								</div>
							) : (
								<div className="bg-primary text-primary-content w-16 rounded-full">
									<span className="text-xl">{initials}</span>
								</div>
							)}
						</div>
						<div>
							<Button
								type="button"
								size="sm"
								outline
								onClick={() => fileInputRef.current?.click()}
								loading={avatarLoading}
							>
								Upload New Avatar
							</Button>
							<input
								ref={fileInputRef}
								type="file"
								className="hidden"
								accept="image/jpeg,image/png,image/webp"
								onChange={handleAvatarUpload}
							/>
							<p className="text-xs text-base-content/50 mt-1">
								JPG, PNG, or WebP. Max 5MB.
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Profile info */}
			<div className="card bg-base-100 shadow-sm">
				<div className="card-body">
					<h2 className="card-title text-lg">Profile Information</h2>

					<form onSubmit={handleProfileSubmit} className="space-y-4">
						<Input
							label="Name"
							id="profile-name"
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
							required
						/>

						<Input
							label="Email"
							id="profile-email"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>

						<Button type="submit" variant="primary" loading={loading}>
							Save Changes
						</Button>
					</form>
				</div>
			</div>
		</div>
	)
}
