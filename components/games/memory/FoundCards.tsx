import { MemoryRoundProps } from "@/lib/types/rounds";
import React, { useMemo } from "react";
import MemoryRevealedImage from "./MemoryRevealedImage";
import { createRandomRotationsArray } from "@/lib/helpers/effects";

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
		<div>
			{cardData.map((data, i) => (
				<div className="text-center" key={`card-list-${i}`}>
					<h2 className="font-alegreya lg:text-lg mb-8">{data.description}</h2>
					<div className="flex justify-center mb-24">
						<ul
							className={`relative mx-auto h-44 md:h-52 grid place-items-center grid-cols-${data.images.length}`}
						>
							{data.images.map((image, ii) => {
								const rotation = rotationValues[ii * i];

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
		</div>
	);
};

export default FoundCards;
