/**
 * ButtonLink — link styled as a DaisyUI button using Next.js Link.
 *
 * Same visual API as Button (variant, size, modifier) but navigates
 * instead of submitting. When disabled, renders a span with aria-disabled.
 */

import Link from "next/link"
import type { ComponentProps } from "react"
import type { ButtonVariant, ButtonSize, ButtonModifier } from "./Button"

export interface ButtonLinkProps
	extends Omit<ComponentProps<typeof Link>, "className"> {
	/** Visual variant mapped to DaisyUI btn-{variant} */
	variant?: ButtonVariant
	/** Size mapped to DaisyUI btn-{size} */
	size?: ButtonSize
	/** Shape/width modifier */
	modifier?: ButtonModifier
	/** Outline style */
	outline?: boolean
	/** Renders a disabled-looking span instead of a link */
	disabled?: boolean
	/** Extra class names */
	className?: string
	children?: React.ReactNode
}

export function ButtonLink({
	variant,
	size,
	modifier,
	outline,
	disabled = false,
	className = "",
	children,
	...rest
}: ButtonLinkProps) {
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

	if (disabled) {
		return (
			<span className={`${classes} btn-disabled`} aria-disabled="true">
				{children}
			</span>
		)
	}

	return (
		<Link className={classes} {...rest}>
			{children}
		</Link>
	)
}
