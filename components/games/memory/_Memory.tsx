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
import FailedScreen from "@/components/ui/FailedScreen";
import { GameContext } from "@/context/GameContext";
import { ProgressContext } from "@/context/ProgressContext";
import { ProgressProps } from "@/lib/types/progress";
import Modal from "@/components/ui/Modal";
import Image from "next/image";
import { createRandomRotationsArray } from "@/lib/helpers/effects";

interface MemoryProps {
	gameData: MemoryGameData;
}

const Memory: React.FC<MemoryProps> = ({ gameData }) => {
	const { cardCount } = gameData;
	const timeoutTime = 200;

	// Context data and functions
	const { updateProgress } = useContext(GameContext);
	const { progress, getGameProgress } = useContext(ProgressContext);

	// States
	const [card1Data, setCard1Data] = useState<MemoryRoundProps | null>(null);
	const [card2Data, setCard2Data] = useState<MemoryRoundProps | null>(null);
	const [activeCard1, setActiveCard1] = useState<number | null>(null);
	const [activeCard2, setActiveCard2] = useState<number | null>(null);
	const [foundCardData, setFoundCardData] = useState<MemoryRoundProps[]>([]);
	const [modalCardContent, setModalCardContent] =
		useState<MemoryRoundProps | null>(null);

	// Rotations need to be memoized, otherwise the random rotation function triggers a re-render
	const rotationValues = useMemo(() => {
		const rotations = createRandomRotationsArray();
		return rotations;
	}, []);

	// Hooks
	const { successMessage } = useInfoMessage();

	useEffect(() => {
		console.log("rerender");
	}, []);

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
		if (
			card1Data != null &&
			card2Data != null &&
			card1Data.roundId === card2Data.roundId &&
			!gameProgress.some((p) => p.roundId === card1Data.roundId)
		) {
			// It's a match
			setTimeout(async () => {
				// Update progress and score
				await updateProgress(GameName.Memory, card1Data.roundId, true);
				// Set card as currently viewing in modal
				setModalCardContent(card1Data);
			}, timeoutTime);
		}
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
		if (getCardData(index)) {
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

	const getCardData = (index: number) => {
		const dataFound = foundCardData.length
			? foundCardData.find((data) =>
					data.images.some(
						(image) => image.slotIndexes && image.slotIndexes.includes(index)
					)
			  )
			: false;
		if (dataFound) return dataFound;

		return activeCard1 === index
			? card1Data
			: activeCard2 === index
			? card2Data
			: null;
	};

	return (
		<div>
			<div className="md:px-6 lg:px-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 justify-center">
				{/* Cards */}
				{Array.from({ length: cardCount }).map((card, index) => (
					<MemoryCard
						cardData={getCardData(index)}
						key={`card-${index}`}
						onClick={() => onCardClick(index)}
					></MemoryCard>
				))}
				<AnimatePresence>
					{successMessage && <SuccessScreen text={successMessage} />}
				</AnimatePresence>
				<AnimatePresence>{/* <Confetti /> */}</AnimatePresence>
				{/* Modal */}
				<AnimatePresence>
					{modalCardContent && (
						<Modal
							onClose={() => setModalCardContent(null)}
							className="overflow-hidden max-w-184"
							motionKey="memory-modal"
						>
							<h2 className="text-xl lg:text-2xl mb-10 uppercase">
								It&apos;s a match!
							</h2>
							<div className="mb-6 flex flex-col justify-center">
								<h3 className="mb-8 text-center">
									{modalCardContent.description}
								</h3>
								<p>{modalCardContent.subtitle && modalCardContent.subtitle}</p>
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
													<motion.div
														key={`found-img-container-${i}`}
														className={`w-32 md:w-36 h-inherit rounded-md overflow-hidden `}
														initial={{
															rotateZ: 0,
															x: 0,
															transformOrigin: "50% 50%",
														}}
														animate={{
															rotateZ: rotation,
															x: `calc(11rem * ${i})`,
															transformOrigin: "50% 50%",
														}}
														transition={{
															duration: 0.6,
															delay: i * 0.5 * (timeoutTime / 1000),
															ease: [0.42, 0, 0.58, 1],
														}}
													>
														<Image
															className="min-h-full object-cover"
															src={`/static/images/memory/${image.url}.jpg`}
															alt=""
															width={500}
															height={500}
														/>
													</motion.div>
												</li>
											);
										})}
									</AnimatePresence>
								</ul>
							</div>
						</Modal>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
};

export default Memory;
