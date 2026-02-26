"use client"

/**
 * ThemeToggle — lets the user choose light, dark, or auto (system) theme.
 *
 * Persists the choice to localStorage under the key "theme".
 * "auto" removes the data-theme attribute so DaisyUI's --prefersdark media
 * query controls appearance automatically.
 */

import { useEffect, useState } from "react"
import { Button } from "@/components/ui"

type ThemeMode = "auto" | "light" | "dark"

const STORAGE_KEY = "theme"

function applyTheme(mode: ThemeMode) {
	if (mode === "light" || mode === "dark") {
		document.documentElement.setAttribute("data-theme", mode)
	} else {
		document.documentElement.removeAttribute("data-theme")
	}
}

export function ThemeToggle() {
	const [mode, setMode] = useState<ThemeMode>("auto")

	// Read persisted preference on mount
	useEffect(() => {
		try {
			const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null
			if (stored === "light" || stored === "dark" || stored === "auto") {
				setMode(stored)
				applyTheme(stored)
			}
		} catch {
			// localStorage unavailable (SSR safety, though this is client-only)
		}
	}, [])

	function handleChange(next: ThemeMode) {
		setMode(next)
		applyTheme(next)
		try {
			localStorage.setItem(STORAGE_KEY, next)
		} catch {
			// ignore
		}
	}

	return (
		<div className="flex items-center gap-1" aria-label="Theme selector">
			{(
				[
					{ value: "light", label: "☀️ Light" },
					{ value: "auto", label: "⚙️ Auto" },
					{ value: "dark", label: "🌙 Dark" },
				] as { value: ThemeMode; label: string }[]
			).map(({ value, label }) => (
				<Button
					key={value}
					variant={mode === value ? "primary" : "ghost"}
					size="xs"
					onClick={() => handleChange(value)}
					aria-pressed={mode === value}
				>
					{label}
				</Button>
			))}
		</div>
	)
}
