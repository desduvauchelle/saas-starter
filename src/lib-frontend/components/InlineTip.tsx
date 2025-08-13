import { IconDefinition } from "@fortawesome/fontawesome-svg-core"
import { faLightbulb } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { FC, ReactNode } from "react"


export const InlineTip: FC<{
	children: ReactNode,
	icon?: IconDefinition,
	iconClassName?: string,
	wrapperClassName?: string
}> = ({ children, icon = faLightbulb, iconClassName = "text-warning", wrapperClassName = "" }) => {
	return <div className={`flex flex-row gap-4 items-start py-3 px-6 border border-warning/50 rounded-xl ${wrapperClassName}`}>
		<FontAwesomeIcon icon={icon} className={`pt-1 ${iconClassName}`} />
		<div className="grow">
			{children}
		</div>
	</div>
}
