import { MemoryRoundProps } from "@/lib/types/rounds";
import React, { useMemo } from "react";
import MemoryRevealedImage from "./MemoryRevealedImage";
import { createRandomRotationsArray } from "@/lib/helpers/effects";
import { wellDoneHeading } from "@/lib/helpers/messages";
import { motion } from "framer-motion";

interface FoundCardsProps {
	cardData: MemoryRoundProps[];
}

const FoundCards: React.FC<FoundCardsProps> = ({ cardData }) => {
	// Rotations need to be memoized, otherwise the random rotation function triggers a re-render
	const rotationValues = useMemo(() => {
		const rotations = createRandomRotationsArray();
		return rotations;
	}, []);

	cardData = cardData.sort((a, b) => a.roundId - b.roundId);

	return (
		<motion.div
			className="text-center"
			style={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{
				duration: 0.6,
				ease: "easeInOut",
			}}
		>
			<h2 className="font-alegreya lg:text-lg mb-12">{wellDoneHeading}</h2>
			{cardData.map((data, i) => (
				<div key={`card-list-${i}`}>
					<h3 className="text-base mb-8">{data.description}</h3>
					<div className="flex justify-center mb-20">
						<ul
							className={`relative mx-auto h-44 md:h-52 grid place-items-center grid-cols-${data.images.length}`}
						>
							{data.images.map((image, ii) => {
								const rotation = rotationValues[(ii + 1) * i];

								return (
									<li
										key={`card-${ii}`}
										className={`w-44 h-inherit flex justify-center ${
											ii === 0 ? "z-1" : "absolute left-0 z-0"
										}`}
									>
										<MemoryRevealedImage
											imgUrl={image.url}
											index={ii}
											rotation={rotation}
										/>
									</li>
								);
							})}
						</ul>
					</div>
				</div>
			))}
		</motion.div>
	);
};

export default FoundCards;
