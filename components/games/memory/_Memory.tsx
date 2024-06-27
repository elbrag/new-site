import { GameName, MemoryGameData } from "@/lib/types/game";
import React, { useState } from "react";
import MemoryCard from "./MemoryCard";
import { fetchGameData } from "@/lib/helpers/fetch";

interface MemoryProps {
	gameData: MemoryGameData;
}

const Memory: React.FC<MemoryProps> = ({ gameData }) => {
	const { cardCount } = gameData;
	const [card1Data, setCard1Data] = useState<any>(null);
	const [card2Data, setCard2Data] = useState<any>(null);
	const [flippedCard1, setFlippedCard1] = useState<number | null>(null);
	const [flippedCard2, setFlippedCard2] = useState<number | null>(null);

	const flipCards = (index: number) => {
		if (flippedCard1 === null) {
			setCardToFlipped(1, index);
		} else if (flippedCard2 === null) {
			setCardToFlipped(2, index);
		}
	};

	const setCardToFlipped = async (number: 1 | 2, index: number) => {
		const _cardData = await fetchGameData(GameName.Memory, "POST", {
			cardIndex: index,
		});
		await setTimeout(() => {
			number === 1 ? setCard1Data(_cardData) : setCard2Data(_cardData);
			number === 1 ? setFlippedCard1(index) : setFlippedCard2(index);
		}, 200);
	};

	/**
	 * On card click
	 */
	const onCardClick = async (index: number) => {
		if (index === flippedCard1 || index === flippedCard2) {
			return;
		} else if (flippedCard1 && flippedCard2) {
			setFlippedCard1(null);
			setFlippedCard2(null);
			setCardToFlipped(1, index);
		} else {
			flipCards(index);
		}
	};

	return (
		<div>
			<div className="md:px-6 lg:px-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 justify-center">
				{Array.from({ length: cardCount }).map((card, index) => (
					<MemoryCard
						flipped={flippedCard1 === index || flippedCard2 === index}
						cardData={
							flippedCard1 === index
								? card1Data
								: flippedCard2 === index
								? card2Data
								: null
						}
						key={`card-${index}`}
						onClick={() => onCardClick(index)}
					></MemoryCard>
				))}
			</div>
		</div>
	);
};

export default Memory;
