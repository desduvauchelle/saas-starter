import { FC, useState, useRef, useEffect } from "react"

interface ShowMoreLessProps {
	limitHeight?: string
	children: React.ReactNode
}

const ShowMoreLess: FC<ShowMoreLessProps> = ({ limitHeight = "max-h-16", children }) => {
	const [isExpanded, setIsExpanded] = useState(false)
	const [isOverflowing, setIsOverflowing] = useState(false)
	const contentRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (!contentRef.current) return

		setIsOverflowing(contentRef.current.scrollHeight > contentRef.current.clientHeight)

	}, [children])

	return (
		<div className="relative">
			<div ref={contentRef} className={`${isExpanded ? "" : limitHeight} overflow-hidden rl`}>
				{children}
			</div>
			{isOverflowing && (
				<button className="text-blue-500 cursor-pointer mt-2" onClick={() => setIsExpanded(!isExpanded)}>
					{isExpanded ? "Show less" : "Show more"}
				</button>
			)}
		</div>
	)
}

export default ShowMoreLess
