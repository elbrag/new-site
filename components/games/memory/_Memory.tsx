import { GameName, MemoryGameData } from "@/lib/types/game";
import React, { useEffect, useState } from "react";
import MemoryCard from "./MemoryCard";
import { fetchGameData } from "@/lib/helpers/fetch";
import { MemoryRoundProps } from "@/lib/types/rounds";

interface MemoryProps {
	gameData: MemoryGameData;
}

const Memory: React.FC<MemoryProps> = ({ gameData }) => {
	const { cardCount } = gameData;
	const [card1Data, setCard1Data] = useState<MemoryRoundProps | null>(null);
	const [card2Data, setCard2Data] = useState<MemoryRoundProps | null>(null);
	const [flippedCard1, setFlippedCard1] = useState<number | null>(null);
	const [flippedCard2, setFlippedCard2] = useState<number | null>(null);

	const timeoutTime = 200;

	/**
	 * Match watcher
	 */
	useEffect(() => {
		console.log(card1Data, card2Data);
		if (
			card1Data != null &&
			card2Data != null &&
			card1Data.roundId === card2Data.roundId
		) {
			setTimeout(() => {
				alert("It's a match!");
			}, timeoutTime);
		}
	}, [card1Data, card2Data]);

	/**
	 * Check and flip cards
	 */
	const checkAndFlipCards = (index: number) => {
		if (flippedCard1 === null) {
			flipCard(1, index);
		} else if (flippedCard2 === null) {
			flipCard(2, index);
		}
	};

	/**
	 * Flip card
	 */
	const flipCard = async (number: 1 | 2, index: number) => {
		const _cardData = await fetchGameData(GameName.Memory, "POST", {
			cardIndex: index,
		});
		setTimeout(() => {
			number === 1 ? setCard1Data(_cardData) : setCard2Data(_cardData);
			number === 1 ? setFlippedCard1(index) : setFlippedCard2(index);
		}, timeoutTime);
	};

	/**
	 * On card click
	 */
	const onCardClick = async (index: number) => {
		if (index === flippedCard1 || index === flippedCard2) {
			console.log("do nothing");
			return;
		} else if (flippedCard1 != null && flippedCard2 != null) {
			setFlippedCard1(null);
			setFlippedCard2(null);
			setCard1Data(null);
			setCard2Data(null);
			flipCard(1, index);
		} else {
			checkAndFlipCards(index);
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
