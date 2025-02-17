import { MemoryRoundProps } from "@/lib/types/rounds";
import React, { useEffect, useMemo } from "react";
import MemoryRevealedImage from "./MemoryRevealedImage";
import { createRandomRotationsArray } from "@/lib/helpers/effects";
import { wellDoneHeading } from "@/lib/helpers/messages";
import { motion } from "framer-motion";
import { StyledCardGrid } from "./_Memory";
import { makeMemoryImgUrl, preloadImage } from "@/lib/helpers/images";
import BackButton from "@/components/ui/BackButton";

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
			style={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{
				duration: 0.6,
				ease: "easeInOut",
			}}
		>
			<div className="mb-8 md:mb-4">
				<BackButton />
			</div>
			<div className="text-center">
				<h2 className="font-alegreya lg:text-lg mb-12 lg:mb-16">
					{wellDoneHeading}
				</h2>
				{cardData.map((data, i) => (
					<div key={`card-list-${i}`}>
						<div className="mb-8">
							<h3 className="text-base">{data.description}</h3>
							{data.subtitle && (
								<p className="font-alegreya mt-2">{data.subtitle}</p>
							)}
						</div>
						<div className="flex justify-center mb-20">
							<StyledCardGrid
								$numberOfCards={data.images.length}
								className={`relative mx-auto h-fit grid place-items-center gap-2 sm:gap-0`}
							>
								{data.images.map((image, ii) => {
									const rotation = rotationValues[(ii + 1) * i];

									return (
										<li
											key={`card-${ii}`}
											className={`w-36 md:w-44 h-inherit flex justify-center ${
												ii === 0 ? "z-1" : "sm:absolute left-0 z-0"
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
							</StyledCardGrid>
						</div>
					</div>
				))}
			</div>
		</motion.div>
	);
};

export default FoundCards;
