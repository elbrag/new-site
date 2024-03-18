import { motion } from "framer-motion";
import Image from "next/image";

interface MemoryCardProps {
	cardData?: any;
	flipped: boolean;
	onClick: () => void;
}

const MemoryCard: React.FC<MemoryCardProps> = ({
	cardData,
	flipped,
	onClick,
}) => {
	return (
		<a
			onClick={onClick}
			className="w-36 h-52 block cursor-pointer"
			style={{ perspective: "1000px" }}
		>
			<motion.div
				initial={{ transform: "rotateY(180deg)" }}
				animate={{ transform: flipped ? "rotateY(0)" : "rotateY(180deg)" }}
				transition={{
					delay: flipped ? 0.2 : 0,
				}}
				className="inner relative h-full w-full"
				style={{ transformStyle: "preserve-3d" }}
			>
				<div
					className="front w-full h-full absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
					style={{ backfaceVisibility: "hidden" }}
				>
					{cardData?.images?.length && (
						<Image
							className="min-h-full object-cover"
							src={`/static/images/memory/${cardData.images[0].url}.jpg`}
							alt=""
							width={500}
							height={500}
						/>
					)}
				</div>
				<div
					className="back w-full h-full absolute top-0 left-0 bg-military"
					style={{
						backfaceVisibility: "hidden",
						transform: "rotateY(180deg)",
					}}
				></div>
			</motion.div>
		</a>
	);
};

export default MemoryCard;
