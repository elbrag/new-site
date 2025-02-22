import { MemoryRoundProps } from "@/lib/types/rounds";
import { motion } from "framer-motion";
import Image from "next/image";
import styled from "styled-components";

interface MemoryCardProps {
	cardData?: MemoryRoundProps | null;
	onClick: () => void;
	children?: React.ReactNode;
	className?: string;
}

const MemoryCard: React.FC<MemoryCardProps> = ({
	cardData,
	onClick,
	children,
	className,
}) => {
	return (
		<a
			onClick={onClick}
			className={`w-32 sm:w-36 lg:w-40 aspect-9/13 block cursor-pointer m-auto ${className}`}
			style={{ perspective: "1000px" }}
		>
			<div className="relative h-full w-full">
				<motion.div
					initial={{
						transform: "rotateY(180deg)",
					}}
					animate={{
						transform: cardData ? "rotateY(0)" : "rotateY(180deg)",
					}}
					transition={{
						delay: cardData ? 0.2 : 0,
					}}
					className="inner h-full w-full"
					style={{
						transformStyle: "preserve-3d",
					}}
				>
					<div
						className="front w-full h-full absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md overflow-hidden"
						style={{
							backfaceVisibility: "hidden",
						}}
					>
						{cardData?.images?.length && (
							<Image
								priority={true}
								className="min-h-full object-cover w-full h-full max-w-none"
								src={`/static/images/memory/${cardData.images[0].url}.webp`}
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
				{children}
			</div>
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
	&:after {
		content: "?";
		position: absolute;
		border-radius: 100%;
		color: #485945;
		background-color: #7ffd45;
		font-size: 1.25rem;
		display: flex;
		align-items: center;
		justify-content: center;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 2rem;
		height: 2rem;
		border: 0.125rem solid #7ffd45;
	}
	&:before {
		content: "?";
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 100%;
		height: 100%;
		border: 0.075rem solid #7ffd45;
	}
`;
