/**
 * Button — reusable button component with DaisyUI variants.
 *
 * Supports variant, size, modifier, loading, and disabled states.
 * Forwards ref and spreads all native button attributes.
 */

import { forwardRef } from "react"

export type ButtonVariant =
	| "primary"
	| "secondary"
	| "accent"
	| "ghost"
	| "outline"
	| "error"
	| "link"
	| "info"
	| "success"
	| "warning"
	| "neutral"

export type ButtonSize = "xs" | "sm" | "md" | "lg"

export type ButtonModifier = "block" | "square" | "circle" | "wide"

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	/** Visual variant mapped to DaisyUI btn-{variant} */
	variant?: ButtonVariant
	/** Size mapped to DaisyUI btn-{size} */
	size?: ButtonSize
	/** Shape/width modifier */
	modifier?: ButtonModifier
	/** Outline style (combines with variant for btn-outline) */
	outline?: boolean
	/** Shows a loading spinner and disables the button */
	loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	function Button(
		{
			variant,
			size,
			modifier,
			outline,
			loading = false,
			disabled,
			className = "",
			children,
			...rest
		},
		ref
	) {
		const classes = [
			"btn",
			variant && `btn-${variant}`,
			size && `btn-${size}`,
			modifier && `btn-${modifier}`,
			outline && "btn-outline",
			className,
		]
			.filter(Boolean)
			.join(" ")

		return (
			<button
				ref={ref}
				className={classes}
				disabled={disabled || loading}
				{...rest}
			>
				{loading && <span className="loading loading-spinner loading-sm" />}
				{children}
			</button>
		)
	}
)
