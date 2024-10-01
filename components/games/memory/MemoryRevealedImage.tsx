import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { throttle } from "lodash";

interface MemoryRevealedImageProps {
	imgUrl: string;
	className?: string;
	timeoutTime?: number;
	index: number;
	rotation: number;
}

const MemoryRevealedImage: React.FC<MemoryRevealedImageProps> = ({
	imgUrl,
	className,
	timeoutTime = 200,
	index,
	rotation,
}) => {
	const [screenWidth, setScreenWidth] = useState(0);

	useEffect(() => {
		if (!window) return;

		const _setScreenWidth = throttle(() => {
			setScreenWidth(window.innerWidth);
			console.log(screenWidth);
		}, 1000);

		_setScreenWidth();

		window.addEventListener("resize", _setScreenWidth);

		return () => {
			window.removeEventListener("resize", _setScreenWidth);
		};
	}, []);

	return (
		<motion.div
			key={`found-img-container-${index}`}
			className={`w-32 lg:w-40 aspect-9/13 rounded-md overflow-hidden ${className}`}
			initial={{
				rotateZ: 0,
				x: 0,
				transformOrigin: "50% 50%",
			}}
			animate={{
				rotateZ: rotation,
				x:
					screenWidth >= 640
						? `calc(${screenWidth < 768 ? "9rem" : "11rem"} * ${index})`
						: 0,
				transformOrigin: "50% 50%",
			}}
			transition={{
				duration: 0.6,
				delay: index * 0.5 * (timeoutTime / 1000),
				ease: [0.42, 0, 0.58, 1],
			}}
		>
			<Image
				className="min-h-full object-cover"
				src={`/static/images/memory/${imgUrl}.jpg`}
				alt=""
				width={500}
				height={500}
			/>
		</motion.div>
	);
};

export default MemoryRevealedImage;
