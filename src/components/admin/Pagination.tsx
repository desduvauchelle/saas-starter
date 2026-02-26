/**
 * Pagination — reusable pagination component.
 *
 * Uses DaisyUI join/btn styling. Supports page navigation
 * with first/last, prev/next, and page number buttons.
 */

"use client"

import type { PaginationMeta } from "@/types/api"
import { Button } from "@/components/ui"

interface PaginationProps {
	pagination: PaginationMeta
	onPageChange: (page: number) => void
}

export function Pagination({ pagination, onPageChange }: PaginationProps) {
	const { page, totalPages, hasNext, hasPrev, total, perPage } = pagination

	if (totalPages <= 1) return null

	// Build page numbers — show max 5 around current page
	const pages: number[] = []
	const start = Math.max(1, page - 2)
	const end = Math.min(totalPages, page + 2)

	for (let i = start; i <= end; i++) {
		pages.push(i)
	}

	const startRecord = (page - 1) * perPage + 1
	const endRecord = Math.min(page * perPage, total)

	return (
		<div className="flex items-center justify-between mt-4">
			<p className="text-sm text-base-content/60">
				Showing {startRecord}–{endRecord} of {total}
			</p>

			<div className="join">
				<Button
					size="sm"
					className="join-item"
					disabled={!hasPrev}
					onClick={() => onPageChange(1)}
					aria-label="First page"
				>
					<i className="fa-solid fa-angles-left" />
				</Button>
				<Button
					size="sm"
					className="join-item"
					disabled={!hasPrev}
					onClick={() => onPageChange(page - 1)}
					aria-label="Previous page"
				>
					<i className="fa-solid fa-angle-left" />
				</Button>

				{start > 1 && (
					<Button size="sm" className="join-item" disabled>…</Button>
				)}

				{pages.map((p) => (
					<Button
						key={p}
						size="sm"
						variant={p === page ? "primary" : undefined}
						className={`join-item ${p === page ? "btn-active" : ""}`}
						onClick={() => onPageChange(p)}
					>
						{p}
					</Button>
				))}

				{end < totalPages && (
					<Button size="sm" className="join-item" disabled>…</Button>
				)}

				<Button
					size="sm"
					className="join-item"
					disabled={!hasNext}
					onClick={() => onPageChange(page + 1)}
					aria-label="Next page"
				>
					<i className="fa-solid fa-angle-right" />
				</Button>
				<Button
					size="sm"
					className="join-item"
					disabled={!hasNext}
					onClick={() => onPageChange(totalPages)}
					aria-label="Last page"
				>
					<i className="fa-solid fa-angles-right" />
				</Button>
			</div>
		</div>
	)
}
