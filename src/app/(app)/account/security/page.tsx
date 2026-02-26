/**
 * Account Security page — change password, danger zone.
 */

"use client"

import { useState } from "react"
import { signOut } from "next-auth/react"
import type { ApiResponse } from "@/types/api"
import { Button, Input } from "@/components/ui"

export default function SecurityPage() {
	const [currentPassword, setCurrentPassword] = useState("")
	const [newPassword, setNewPassword] = useState("")
	const [confirmPassword, setConfirmPassword] = useState("")
	const [loading, setLoading] = useState(false)
	const [deleteLoading, setDeleteLoading] = useState(false)
	const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

	async function handlePasswordChange(e: React.FormEvent) {
		e.preventDefault()
		setLoading(true)
		setMessage(null)

		if (newPassword !== confirmPassword) {
			setMessage({ type: "error", text: "New passwords do not match" })
			setLoading(false)
			return
		}

		try {
			const res = await fetch("/api/account/password", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					currentPassword,
					newPassword,
				}),
			})

			const data = (await res.json()) as ApiResponse<{ message: string }>

			if (!data.success) {
				setMessage({ type: "error", text: data.error.message })
			} else {
				setMessage({ type: "success", text: "Password changed successfully" })
				setCurrentPassword("")
				setNewPassword("")
				setConfirmPassword("")
			}
		} catch {
			setMessage({ type: "error", text: "Failed to change password" })
		} finally {
			setLoading(false)
		}
	}

	async function handleDeleteAccount() {
		setDeleteLoading(true)

		try {
			const res = await fetch("/api/account", {
				method: "DELETE",
			})

			const data = (await res.json()) as ApiResponse<{ message: string }>

			if (!data.success) {
				setMessage({ type: "error", text: data.error.message })
				setDeleteLoading(false)
			} else {
				await signOut({ callbackUrl: "/login" })
			}
		} catch {
			setMessage({ type: "error", text: "Failed to delete account" })
			setDeleteLoading(false)
		}
	}

	return (
		<div className="max-w-2xl mx-auto space-y-6">
			<h1 className="text-2xl font-bold">Security</h1>

			{message && (
				<div
					className={`alert ${message.type === "success" ? "alert-success" : "alert-error"} text-sm`}
				>
					<span>{message.text}</span>
				</div>
			)}

			{/* Change Password */}
			<div className="card bg-base-100 shadow-sm">
				<div className="card-body">
					<h2 className="card-title text-lg">Change Password</h2>

					<form onSubmit={handlePasswordChange} className="space-y-4">
						<Input
							label="Current Password"
							id="current-password"
							type="password"
							value={currentPassword}
							onChange={(e) => setCurrentPassword(e.target.value)}
							required
							autoComplete="current-password"
						/>

						<Input
							label="New Password"
							id="new-pass"
							type="password"
							value={newPassword}
							onChange={(e) => setNewPassword(e.target.value)}
							required
							minLength={8}
							autoComplete="new-password"
						/>

						<Input
							label="Confirm New Password"
							id="confirm-pass"
							type="password"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							required
							minLength={8}
							autoComplete="new-password"
						/>

						<Button type="submit" variant="primary" loading={loading}>
							Update Password
						</Button>
					</form>
				</div>
			</div>

			{/* Danger Zone */}
			<div className="card bg-base-100 shadow-sm border border-error/20">
				<div className="card-body">
					<h2 className="card-title text-lg text-error">Danger Zone</h2>
					<p className="text-sm text-base-content/70">
						Permanently delete your account and all of your data. This action
						cannot be undone.
					</p>

					{showDeleteConfirm ? (
						<div className="flex gap-2 mt-2">
							<Button
								type="button"
								variant="error"
								size="sm"
								onClick={handleDeleteAccount}
								loading={deleteLoading}
							>
								Yes, Delete My Account
							</Button>
							<Button
								type="button"
								variant="ghost"
								size="sm"
								onClick={() => setShowDeleteConfirm(false)}
							>
								Cancel
							</Button>
						</div>
					) : (
						<Button
							type="button"
							variant="error"
							size="sm"
							outline
							className="w-fit mt-2"
							onClick={() => setShowDeleteConfirm(true)}
						>
							Delete Account
						</Button>
					)}
				</div>
			</div>
		</div>
	)
}
