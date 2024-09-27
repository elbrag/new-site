import { MemoryRoundProps } from "@/lib/types/rounds";
import { motion } from "framer-motion";
import Image from "next/image";
import styled from "styled-components";

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
	return (
		<motion.div
			key={`found-img-container-${index}`}
			className={`w-32 md:w-36 h-inherit rounded-md overflow-hidden ${className}`}
			initial={{
				rotateZ: 0,
				x: 0,
				transformOrigin: "50% 50%",
			}}
			animate={{
				rotateZ: rotation,
				x: `calc(11rem * ${index})`,
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
