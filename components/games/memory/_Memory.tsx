import { MemoryGameData } from "@/lib/types/game";
import React, { useState } from "react";
import MemoryCard from "./MemoryCard";

interface MemoryProps {
	gameData: MemoryGameData;
}

const Memory: React.FC<MemoryProps> = ({ gameData }) => {
	const { initialImages } = gameData;
	const [flippedCard, setFlippedCard] = useState<string | null>(null);

	const onCardClick = (id: string) => {
		if (flippedCard === id) {
			setFlippedCard(null);
		} else {
			setFlippedCard(id);
		}
	};

	return (
		<div>
			<div className="px-6 lg:px-12 grid grid-cols-5 gap-6">
				{initialImages.map((card, index) => (
					<MemoryCard
						flipped={flippedCard === card.roundId}
						image={card.image}
						id={card.roundId}
						key={`card-${index}`}
						onClick={() => onCardClick(card.roundId)}
					></MemoryCard>
				))}
			</div>
		</div>
	);
};

export default Memory;
