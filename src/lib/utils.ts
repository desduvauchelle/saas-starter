/**
 * Utility function for merging Tailwind CSS classes.
 *
 * Combines `clsx` for conditional classes with `tailwind-merge` to
 * intelligently resolve conflicting Tailwind classes (e.g. `p-4 p-2` → `p-2`).
 *
 * Usage:
 *   cn("px-4 py-2", isActive && "bg-primary", className)
 */

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]): string {
	return twMerge(clsx(inputs))
}
