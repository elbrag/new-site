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

	return (
		<div>
			{cardData.map((data, i) => {
				const rotation = rotationValues[i];

				return (
					<ul key={`card-list-${i}`}>
						{data.images.map((image, i) => (
							<li key={`card-${i}`}>
								<MemoryRevealedImage
									imgUrl={image.url}
									index={i}
									rotation={rotation}
								/>
							</li>
						))}
					</ul>
				);
			})}
		</div>
	);
};

export default FoundCards;
