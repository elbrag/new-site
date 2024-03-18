import { GameName, MemoryGameData } from "@/lib/types/game";
import React, { useState } from "react";
import MemoryCard from "./MemoryCard";
import { fetchGameData } from "@/lib/helpers/fetch";

interface MemoryProps {
	gameData: MemoryGameData;
}

const Memory: React.FC<MemoryProps> = ({ gameData }) => {
	const { cardCount } = gameData;

	const [cardData, setCardData] = useState<any>(null);
	const [flippedCard, setFlippedCard] = useState<number | null>(null);

	const onCardClick = async (index: number) => {
		if (flippedCard === index) {
			setFlippedCard(null);
		} else {
			setFlippedCard(null);

			const _cardData = await fetchGameData(GameName.Memory, "POST", {
				cardIndex: index,
			});
			setTimeout(() => {
				setCardData(_cardData);
				setFlippedCard(index);
			}, 200);
		}
	};

	return (
		<div>
			<div className="px-6 lg:px-12 grid grid-cols-5 gap-6">
				{Array.from({ length: cardCount }).map((card, index) => (
					<MemoryCard
						flipped={flippedCard === index}
						cardData={cardData}
						key={`card-${index}`}
						onClick={() => onCardClick(index)}
					></MemoryCard>
				))}
			</div>
		</div>
	);
};

export default Memory;
