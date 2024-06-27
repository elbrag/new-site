import { motion } from "framer-motion";
import Image from "next/image";
import styled from "styled-components";

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
			className="w-32 h-44 md:w-36 md:h-52 block cursor-pointer m-auto"
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
					className="front w-full h-full absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md overflow-hidden"
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
				<StyledBackside
					className="back w-full h-full absolute top-0 left-0 rounded-md overflow-hidden"
					style={{
						backfaceVisibility: "hidden",
						transform: "rotateY(180deg)",
					}}
				></StyledBackside>
			</motion.div>
		</a>
	);
};

export default MemoryCard;

const StyledBackside = styled.div`
	border: 0.5rem solid #3c4d39;

	--s: 20px; /* Pattern size*/
	--c1: #3c4d39;
	--c2: #485945;

	--g: #0000 45%, var(--c1) 46% 54%, #0000 55%;
	background: linear-gradient(50deg, var(--g)),
		linear-gradient(-50deg, var(--g)) var(--c2);
	background-size: var(--s) calc(tan(50deg) * var(--s));
`;
