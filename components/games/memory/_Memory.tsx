import { GameName, MemoryGameData } from "@/lib/types/game";
import React, { useContext, useEffect, useState } from "react";
import MemoryCard from "./MemoryCard";
import { fetchGameData } from "@/lib/helpers/fetch";
import { MemoryRoundProps } from "@/lib/types/rounds";
import { AnimatePresence } from "framer-motion";
import useInfoMessage from "@/hooks/useInfoMessage";
import SuccessScreen from "@/components/ui/SuccessScreen";
import FailedScreen from "@/components/ui/FailedScreen";
import { GameContext } from "@/context/GameContext";

interface MemoryProps {
	gameData: MemoryGameData;
}

const Memory: React.FC<MemoryProps> = ({ gameData }) => {
	const { cardCount } = gameData;
	const timeoutTime = 200;

	// Context data and functions
	const { updateProgress } = useContext(GameContext);

	// States
	const [card1Data, setCard1Data] = useState<MemoryRoundProps | null>(null);
	const [card2Data, setCard2Data] = useState<MemoryRoundProps | null>(null);
	const [activeCard1, setActiveCard1] = useState<number | null>(null);
	const [activeCard2, setActiveCard2] = useState<number | null>(null);

	// Hooks
	const {
		infoMessage,
		updateInfoMessage,
		successMessage,
		updateSuccessMessage,
		failedMessage,
		updateFailedMessage,
	} = useInfoMessage();

	/**
	 * Match watcher
	 */
	useEffect(() => {
		if (
			card1Data != null &&
			card2Data != null &&
			card1Data.roundId === card2Data.roundId
		) {
			setTimeout(() => {
				alert("It's a match!");
				updateProgress(GameName.Memory, card1Data.roundId, true);
			}, timeoutTime);
		}
	}, [card1Data, card2Data]);

	/**
	 * Check and activate cards
	 */
	const checkAndActivateCards = (index: number) => {
		if (activeCard1 === null) {
			activateCard(1, index);
		} else if (activeCard2 === null) {
			activateCard(2, index);
		}
	};

	/**
	 * Flip card
	 */
	const activateCard = async (number: 1 | 2, index: number) => {
		const _cardData = await fetchGameData(GameName.Memory, "POST", {
			cardIndex: index,
		});
		setTimeout(() => {
			number === 1 ? setCard1Data(_cardData) : setCard2Data(_cardData);
			number === 1 ? setActiveCard1(index) : setActiveCard2(index);
		}, timeoutTime);
	};

	/**
	 * On card click
	 */
	const onCardClick = async (index: number) => {
		if (index === activeCard1 || index === activeCard2) {
			return;
		} else if (activeCard1 != null && activeCard2 != null) {
			setActiveCard1(null);
			setActiveCard2(null);
			setCard1Data(null);
			setCard2Data(null);
			activateCard(1, index);
		} else {
			checkAndActivateCards(index);
		}
	};

	return (
		<div>
			<div className="md:px-6 lg:px-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 justify-center">
				{Array.from({ length: cardCount }).map((card, index) => (
					<MemoryCard
						flipped={activeCard1 === index || activeCard2 === index}
						cardData={
							activeCard1 === index
								? card1Data
								: activeCard2 === index
								? card2Data
								: null
						}
						key={`card-${index}`}
						onClick={() => onCardClick(index)}
					></MemoryCard>
				))}
				<AnimatePresence>
					{successMessage && <SuccessScreen text={successMessage} />}
				</AnimatePresence>
				<AnimatePresence>
					{failedMessage && <FailedScreen text={failedMessage} />}
					{/* <Confetti /> */}
				</AnimatePresence>
			</div>
		</div>
	);
};

export default Memory;
