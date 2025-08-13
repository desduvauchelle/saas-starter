import { faCircleNotch } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Link from "next/link"
import { AnchorHTMLAttributes, ButtonHTMLAttributes, FC, ReactNode, useMemo } from "react"


type ButtonThemes = "primary" | "secondary" | "danger" | "success" | "warning" | "info" | "dark" | "light" | "link" | "custom" | "ghost" | "red"



const Button: FC<ButtonHTMLAttributes<HTMLButtonElement> & {
	theme: ButtonThemes,
	children: ReactNode,
	isLoading?: boolean,
	isLoadingContent?: ReactNode,
	isBig?: boolean,
	isSmall?: boolean,
	isOutline?: boolean,
	tooltip?: string,
	tooltipPosition?: "top" | "bottom" | "left" | "right"
}> = ({
	theme,
	children,
	className,
	isLoading,
	isBig,
	isSmall,
	isOutline,
	tooltip,
	tooltipPosition,
	isLoadingContent = <FontAwesomeIcon icon={faCircleNotch} spin />,
	...rest
}) => {
		const customClassName = useMemo(() => {
			let themeClassName = "btn "
			if (isOutline) {
				themeClassName += " btn-outline"
			}
			switch (theme) {
				case "primary":
					themeClassName += " btn-primary"
					break
				case "secondary":
					themeClassName += " btn-secondary"
					break
				case "danger":
					themeClassName += " btn-error"
					break
				case "success":
					themeClassName += " btn-success"
					break
				case "warning":
					themeClassName += " btn-warning"
					break
				case "info":
					themeClassName += " btn-info"
					break
				case "dark":
					themeClassName += " btn-dark"
					break
				case "light":
					themeClassName += " btn-light"
					break
				case "link":
					themeClassName += " btn-link"
					break
				case "ghost":
					themeClassName += " btn-ghost"
					break
				case "red":
					themeClassName += " text-error"
					break
				case "custom":
					themeClassName = ""
					break
				default:
					themeClassName += " btn-primary"
					break
			}
			if (className) {
				themeClassName += " " + className
			}

			if (isBig) {
				themeClassName += " btn-lg"
			}
			if (isSmall) {
				themeClassName += " btn-sm"
			}
			return themeClassName
		}, [isOutline, theme, className, isBig, isSmall])

		const attributes: ButtonHTMLAttributes<HTMLButtonElement> = {
			...rest,
			className: customClassName
		}
		if (isLoading) {
			attributes.disabled = true
		}
		if (tooltip) {
			// @ts-expect-error Not sure how to type fix this
			attributes["data-tip"] = tooltip
			attributes.className += " tooltip"
			if (tooltipPosition) {
				attributes.className += " tooltip-" + tooltipPosition
			}
		}

		return <button {...attributes}>{isLoading ? isLoadingContent : children}</button>
	}



export default Button

export const MyLink: FC<AnchorHTMLAttributes<HTMLAnchorElement> & {
	theme?: ButtonThemes, isButton?: boolean, isOutline?: boolean, children: ReactNode, isLoading?: boolean, isBig?: boolean,
	tooltip?: string,
	tooltipPosition?: "top" | "bottom" | "left" | "right"
}> = ({
	theme,
	children,
	className,
	isLoading,
	isOutline,
	isBig,
	isButton,
	href,
	tooltip,
	tooltipPosition,
	...rest
}) => {
		const customClassName = useMemo(() => {
			let themeClassName = "link"
			if (isOutline) {
				themeClassName += " link-outline"
			}
			switch (theme) {
				case "primary":
					themeClassName += " link-primary"
					break
				case "secondary":
					themeClassName += " link-secondary"
					break
				case "danger":
					themeClassName += " link-error"
					break
				case "success":
					themeClassName += " link-success"
					break
				case "warning":
					themeClassName += " link-warning"
					break
				case "info":
					themeClassName += " link-info"
					break
				case "dark":
					themeClassName += " link-dark"
					break
				case "light":
					themeClassName += " link-light"
					break
				case "link":
					themeClassName += " link-link"
					break
				case "custom":
					themeClassName = ""
					break
				case "ghost":
					themeClassName += " link-ghost"
					break
				default:
					themeClassName += ""
					break
			}
			if (className) {
				themeClassName += " " + className
			}
			if (isBig) {
				themeClassName += " btn-lg"
			}
			if (isButton) {
				themeClassName = themeClassName.replaceAll("link", "btn")
				themeClassName += " no-underline"
			}
			return themeClassName
		}, [isOutline, theme, className, isBig, isButton])

		const attributes: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string } = {
			...rest,
			href: href || "#",
			className: customClassName
		}

		if (isLoading) {
			attributes["aria-disabled"] = true
		}

		if (tooltip) {
			// @ts-expect-error Not sure how to type fix this
			attributes["data-tip"] = tooltip
			attributes.className += " tooltip"
			if (tooltipPosition) {
				attributes.className += " tooltip-" + tooltipPosition
			}
		}

		return <Link {...attributes}>{children}</Link>
	}
