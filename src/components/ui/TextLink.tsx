/**
 * TextLink — inline text link using Next.js Link or native <a>.
 *
 * Wraps DaisyUI link classes with variant support.
 * Automatically uses <a> for external URLs.
 */

import Link from "next/link"
import type { ComponentProps } from "react"

export type TextLinkVariant = "primary" | "hover" | "neutral" | "secondary" | "accent" | "error"

export interface TextLinkProps
	extends Omit<ComponentProps<typeof Link>, "className"> {
	/** Visual variant mapped to DaisyUI link-{variant} */
	variant?: TextLinkVariant
	/** Opens in new tab with rel="noopener noreferrer" */
	external?: boolean
	/** Extra class names */
	className?: string
	children?: React.ReactNode
}

export function TextLink({
	variant,
	external = false,
	className = "",
	children,
	href,
	...rest
}: TextLinkProps) {
	const classes = [
		"link",
		variant && `link-${variant}`,
		className,
	]
		.filter(Boolean)
		.join(" ")

	if (external) {
		const hrefStr = typeof href === "string" ? href : href.toString()
		return (
			<a
				href={hrefStr}
				className={classes}
				target="_blank"
				rel="noopener noreferrer"
			>
				{children}
			</a>
		)
	}

	return (
		<Link href={href} className={classes} {...rest}>
			{children}
		</Link>
	)
}
