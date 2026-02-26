import { FC } from "react"
import Image from "next/image"

const Avatar: FC<{
	image?: string | null,
	name?: string | null,
	className?: string,
	size?: string,
	textSize?: string
}> = ({ image, name, size = "w-16", textSize = "text-xl" }) => {

	if (!image) {
		return <div className="avatar placeholder">
			<div className={`bg-secondary text-white rounded-full font-bold ${size} ${textSize}`}>
				<span>{(name ?? "?").charAt(0).toUpperCase()}</span>
			</div>
		</div>
	}
	return <div className="avatar">
		<div className={`${size} rounded-full`}>
			<Image src={image} width={120} height={120} alt={name ?? "User avatar"} />
		</div>
	</div>
}
export default Avatar
