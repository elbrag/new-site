import { GameName, MemoryGameData } from "@/lib/types/game";
import React, {
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import MemoryCard from "./MemoryCard";
import { fetchGameData } from "@/lib/helpers/fetch";
import { MemoryRoundProps } from "@/lib/types/rounds";
import { AnimatePresence, motion } from "framer-motion";
import useInfoMessage from "@/hooks/useInfoMessage";
import SuccessScreen from "@/components/ui/SuccessScreen";
import { GameContext } from "@/context/GameContext";
import { ProgressContext } from "@/context/ProgressContext";
import { ProgressProps } from "@/lib/types/progress";
import Modal from "@/components/ui/Modal";
import { createRandomRotationsArray } from "@/lib/helpers/effects";
import InfoMessage from "@/components/ui/InfoMessage";
import { memoryFailMessages } from "@/lib/helpers/messages";
import { RoundContext } from "@/context/RoundContext";
import FoundCards from "./FoundCards";
import MemoryRevealedImage from "./MemoryRevealedImage";
import { uniqBy } from "lodash";

interface MemoryProps {
	gameData: MemoryGameData;
}

const Memory: React.FC<MemoryProps> = ({ gameData }) => {
	const { cardCount } = gameData;
	const timeoutTime = 200;

	// Context data and functions
	const { updateProgress } = useContext(GameContext);
	const { progress, getGameProgress } = useContext(ProgressContext);
	const { numberOfRounds, setNumberOfRounds, allRoundsPassed } =
		useContext(RoundContext);

	// States
	const [card1Data, setCard1Data] = useState<MemoryRoundProps | null>(null);
	const [card2Data, setCard2Data] = useState<MemoryRoundProps | null>(null);
	const [activeCard1, setActiveCard1] = useState<number | null>(null);
	const [activeCard2, setActiveCard2] = useState<number | null>(null);
	const [foundCardData, setFoundCardData] = useState<MemoryRoundProps[]>([]);
	const [modalCardContent, setModalCardContent] =
		useState<MemoryRoundProps | null>(null);
	const [allFound, setAllfound] = useState<boolean>(false);
	const [readyToRenderGame, setReadyToRenderGame] = useState(false);

	// Rotations need to be memoized, otherwise the random rotation function triggers a re-render
	const rotationValues = useMemo(() => {
		const rotations = createRandomRotationsArray();
		return rotations;
	}, []);

	// Hooks
	const { infoMessage, updateInfoMessage, successMessage } = useInfoMessage();

	/**
	 * On progress state update
	 */
	const onProgressUpdate = useCallback(async (progress: ProgressProps[]) => {
		const gameProgress = await getGameProgress(GameName.Memory, progress);
		const foundMatchesIds = gameProgress.map((match) => match.roundId);
		const foundMatchesData = await fetchGameData(GameName.Memory, "POST", {
			foundMatchesIds,
		});
		setFoundCardData(foundMatchesData);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	/**
	 * Set number of rounds initially
	 */
	useEffect(() => {
		setNumberOfRounds(gameData.cardCount / 2);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [gameData]);

	/**
	 * On first render, check if all rounds are completed
	 */
	useEffect(() => {
		// When the event state of all rounds passed happens, return in favour of the function call on modal close
		if (allRoundsPassed) return;
		const _checkIfAllCompleted = async () => {
			const gameProgress = await getGameProgress(GameName.Memory, progress);
			const foundMatchesIds = gameProgress.map((match) => match.roundId);
			const foundMatchesData = await fetchGameData(GameName.Memory, "POST", {
				foundMatchesIds,
			});
			if (foundMatchesData.length === numberOfRounds) {
				setAllfound(true);
			} else {
				setTimeout(() => {
					setReadyToRenderGame(true);
				}, 1000);
			}
		};
		_checkIfAllCompleted();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [getGameProgress, numberOfRounds, allRoundsPassed]);

	/**
	 * Progress state watcher
	 */
	useEffect(() => {
		onProgressUpdate(progress);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [progress]);

	/**
	 * Match watcher
	 */
	useEffect(() => {
		const gameProgress = getGameProgress(GameName.Memory, progress);
		// Both cards are indeed flipped
		if (card1Data != null && card2Data != null) {
			// The cards match and we haven't matched them earlier
			if (
				card1Data.roundId === card2Data.roundId &&
				!gameProgress.some((p) => p.roundId === card1Data.roundId)
			) {
				setTimeout(async () => {
					// Update progress and score
					await updateProgress(GameName.Memory, card1Data.roundId, true);
					// Set card as currently viewing in modal
					setModalCardContent(card1Data);
				}, timeoutTime);
			}
			// It's not a match
			else if (card1Data.roundId !== card2Data.roundId) {
				const rand = Math.floor(Math.random() * memoryFailMessages.length);
				updateInfoMessage(memoryFailMessages[rand]);
			}
		}
		return () => {
			updateInfoMessage(null);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
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
		// Already found: Show card data in modal
		if (getFoundCardDataBySlotindex(index)) {
			setModalCardContent(getCardData(index));
		}
		// Clicked card already flipped
		else if (index === activeCard1 || index === activeCard2) {
			return;
		}
		// Both cards already flipped
		else if (activeCard1 != null && activeCard2 != null) {
			setActiveCard1(null);
			setActiveCard2(null);
			setCard1Data(null);
			setCard2Data(null);
			activateCard(1, index);
		}
		// Flip card and check for matches
		else {
			checkAndActivateCards(index);
		}
	};

	/**
	 * Get found card data by slot index
	 *
	 * Returns card data if it has been found
	 */
	const getFoundCardDataBySlotindex = (index: number) => {
		const dataFound = foundCardData.length
			? foundCardData.find((data) =>
					data.images.some(
						(image) => image.slotIndexes && image.slotIndexes.includes(index)
					)
			  )
			: false;
		if (dataFound) return dataFound;
	};

	/**
	 * Get card data by index
	 */
	const getCardData = (index: number) => {
		const dataFound = getFoundCardDataBySlotindex(index);
		if (dataFound) return dataFound;

		return activeCard1 === index
			? card1Data
			: activeCard2 === index
			? card2Data
			: null;
	};

	/**
	 * On modal close
	 */
	const onModalClose = () => {
		setModalCardContent(null);
		if (allRoundsPassed) {
			setTimeout(() => {
				setAllfound(true);
			}, 600);
		}
	};

	/**
	 * All found – reveal result!
	 */
	if (allFound) {
		const allData: MemoryRoundProps[] = Array.from({
			length: cardCount,
		})
			.map((_, index: number) => getCardData(index))
			.filter((data) => data != null);
		const allUniqueData = uniqBy(allData, "roundId");
		return <FoundCards cardData={allUniqueData} />;
	}

	return (
		<div className="flex justify-center">
			{readyToRenderGame && (
				<>
					{/* Cards */}
					{cardCount && (
						<AnimatePresence>
							<motion.div
								className="inline-grid grid-cols-2 xs:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 justify-center"
								initial={{
									opacity: 0,
								}}
								animate={{
									opacity: 1,
								}}
								exit={{
									opacity: 0,
								}}
								transition={{
									duration: 0.5,
								}}
							>
								{Array.from({
									length: cardCount,
								}).map((_, index) => (
									<MemoryCard
										key={`card-${index}`}
										cardData={getCardData(index)}
										onClick={() => onCardClick(index)}
										className={index === activeCard2 ? "z-1" : ""}
									>
										<AnimatePresence>
											{infoMessage && index === activeCard2 && (
												<div className="w-full absolute bottom-1/4 left-0 md:left-[unset] md:-right-1/2 z-1">
													<InfoMessage text={infoMessage} />
												</div>
											)}
										</AnimatePresence>
									</MemoryCard>
								))}
							</motion.div>
						</AnimatePresence>
					)}
					<AnimatePresence>
						{successMessage && <SuccessScreen text={successMessage} />}
					</AnimatePresence>
					<AnimatePresence>{/* <Confetti /> */}</AnimatePresence>
					{/* Modal */}
					<AnimatePresence>
						{modalCardContent && (
							<Modal
								onClose={onModalClose}
								className="overflow-hidden md:max-w-184"
								motionKey="memory-modal"
							>
								<h2 className="text-xl lg:text-2xl mb-6 lg:mb-10 uppercase">
									It&apos;s a match!
								</h2>
								<div className="mb-6 flex flex-col justify-center max-w-full">
									<h3 className="mb-8 text-center">
										{modalCardContent.description}
									</h3>
									<p>
										{modalCardContent.subtitle && modalCardContent.subtitle}
									</p>
									<ul
										className={`relative mx-auto h-44 md:h-52 grid place-items-center grid-cols-${modalCardContent?.images.length}`}
										style={{
											gridTemplateColumns: `repeat(${modalCardContent?.images.length}, 11rem)`,
										}}
									>
										<AnimatePresence>
											{modalCardContent?.images.map((image, i) => {
												const rotation = rotationValues[i];
												return (
													<li
														className={`w-44 h-inherit flex justify-center ${
															i === 0 ? "z-1" : "absolute left-0 z-0"
														}`}
														key={`found-img-li-${i}`}
													>
														<MemoryRevealedImage
															imgUrl={image.url}
															index={i}
															rotation={rotation}
															timeoutTime={timeoutTime}
														/>
													</li>
												);
											})}
										</AnimatePresence>
									</ul>
								</div>
							</Modal>
						)}
					</AnimatePresence>
				</>
			)}
		</div>
	);
};

export default Memory;
