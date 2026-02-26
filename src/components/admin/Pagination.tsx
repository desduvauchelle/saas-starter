/**
 * Pagination — reusable pagination component.
 *
 * Uses DaisyUI join/btn styling. Supports page navigation
 * with first/last, prev/next, and page number buttons.
 */

"use client"

import type { PaginationMeta } from "@/types/api"

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
				<button
					className="join-item btn btn-sm"
					disabled={!hasPrev}
					onClick={() => onPageChange(1)}
					aria-label="First page"
				>
					<i className="fa-solid fa-angles-left" />
				</button>
				<button
					className="join-item btn btn-sm"
					disabled={!hasPrev}
					onClick={() => onPageChange(page - 1)}
					aria-label="Previous page"
				>
					<i className="fa-solid fa-angle-left" />
				</button>

				{start > 1 && (
					<button className="join-item btn btn-sm btn-disabled">…</button>
				)}

				{pages.map((p) => (
					<button
						key={p}
						className={`join-item btn btn-sm ${p === page ? "btn-active btn-primary" : ""
							}`}
						onClick={() => onPageChange(p)}
					>
						{p}
					</button>
				))}

				{end < totalPages && (
					<button className="join-item btn btn-sm btn-disabled">…</button>
				)}

				<button
					className="join-item btn btn-sm"
					disabled={!hasNext}
					onClick={() => onPageChange(page + 1)}
					aria-label="Next page"
				>
					<i className="fa-solid fa-angle-right" />
				</button>
				<button
					className="join-item btn btn-sm"
					disabled={!hasNext}
					onClick={() => onPageChange(totalPages)}
					aria-label="Last page"
				>
					<i className="fa-solid fa-angles-right" />
				</button>
			</div>
		</div>
	)
}
