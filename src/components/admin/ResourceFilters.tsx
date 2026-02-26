/**
 * ResourceFilters — reusable search + filter bar for admin lists.
 *
 * Renders a search input and configurable select filters.
 * Debounces search input to avoid excessive re-renders.
 */

"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Input, Select } from "@/components/ui"

export interface FilterOption {
	label: string
	value: string
}

export interface FilterConfig {
	key: string
	label: string
	options: FilterOption[]
	/** Current value */
	value: string
}

interface ResourceFiltersProps {
	/** Search input value */
	search: string
	/** Called when search value changes (debounced) */
	onSearchChange: (value: string) => void
	/** Select filters */
	filters?: FilterConfig[]
	/** Called when a filter value changes */
	onFilterChange?: (key: string, value: string) => void
	/** Search placeholder */
	searchPlaceholder?: string
}

export function ResourceFilters({
	search,
	onSearchChange,
	filters,
	onFilterChange,
	searchPlaceholder = "Search...",
}: ResourceFiltersProps) {
	const [localSearch, setLocalSearch] = useState(search)
	const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

	const debouncedSearch = useCallback(
		(value: string) => {
			if (debounceRef.current) clearTimeout(debounceRef.current)
			debounceRef.current = setTimeout(() => {
				onSearchChange(value)
			}, 300)
		},
		[onSearchChange]
	)

	useEffect(() => {
		return () => {
			if (debounceRef.current) clearTimeout(debounceRef.current)
		}
	}, [])

	const handleSearchChange = (value: string) => {
		setLocalSearch(value)
		debouncedSearch(value)
	}

	return (
		<div className="flex flex-wrap gap-3 items-end mb-4">
			{/* Search */}
			<Input
				label="Search"
				size="sm"
				leftIcon="fa-solid fa-magnifying-glass"
				placeholder={searchPlaceholder}
				value={localSearch}
				onChange={(e) => handleSearchChange(e.target.value)}
				wrapperClassName="flex-1 min-w-[200px]"
			/>

			{/* Filters */}
			{filters?.map((filter) => (
				<Select
					key={filter.key}
					label={filter.label}
					size="sm"
					value={filter.value}
					onChange={(e) => onFilterChange?.(filter.key, e.target.value)}
					options={[{ label: "All", value: "" }, ...filter.options]}
					wrapperClassName="min-w-[140px]"
				/>
			))}
		</div>
	)
}
