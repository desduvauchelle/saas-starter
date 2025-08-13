import { faSpinner } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { FC } from "react"


const ComponentLoading: FC<{ text?: string }> = ({ text }) => {
	return <div className="relative">
		<div className="flex w-full flex-col gap-4">
			<div className="skeleton h-32 w-full"></div>
			<div className="skeleton h-4 w-28"></div>
			<div className="skeleton h-4 w-full"></div>
			<div className="skeleton h-4 w-full"></div>
		</div>
		{text && <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
			<div className="bg-base-100/40 backdrop-blur-md p-4 rounded-xl text-lg">
				<FontAwesomeIcon icon={faSpinner} spin className="mr-1" /> {text}
			</div>
		</div>}
	</div>
}

export default ComponentLoading
