import { fetchGameData } from "@/lib/helpers/fetch";
import React, { useContext, useEffect, useState } from "react";
import LetterInput from "./LetterInput";
import { GameContext } from "@/context/GameContext";
import { HangmanGameData, GameName } from "@/lib/types/game";
import useInfoMessage from "@/hooks/useInfoMessage";
import InfoMessage from "@/components/ui/InfoMessage";
import { AnimatePresence } from "framer-motion";
import HangedMan, { hangmanPartsInOrder } from "./HangedMan";
import SuccessScreen from "@/components/ui/SuccessScreen";
import FailedScreen from "@/components/ui/FailedScreen";
import { HangmanProgressCompletedProps } from "@/lib/types/progress";
import RoundContent from "./RoundContent";
import { FirebaseContext } from "@/context/FirebaseContext";
import { RoundContext } from "@/context/RoundContext";
import { ErrorContext } from "@/context/ErrorContext";
import { ProgressContext } from "@/context/ProgressContext";
import FactsList from "@/components/ui/FactsList";
import { HangmanRevealedRoundProps } from "@/lib/types/rounds";
import Pagination from "./Pagination";
import DotLoader from "@/components/ui/DotLoader";

interface HangmanProps {
	gameData: HangmanGameData;
}

const Hangman: React.FC<HangmanProps> = ({ gameData }) => {
	// Initial data
	const { maskedWords } = gameData;

	// States
	const [finalResult, setFinalResult] = useState<HangmanRevealedRoundProps[]>();
	const [readyToRenderGame, setReadyToRenderGame] = useState(false);

	// Context data and functions
	const { firebaseDatabase, userId } = useContext(FirebaseContext);
	const { getRoundStatus, getFoundRoundAnswers } = useContext(ProgressContext);
	const { onRoundFail, updateProgress } = useContext(GameContext);
	const { updateErrors, getGameErrors } = useContext(ErrorContext);
	const {
		updateRoundLength,
		getGameCurrentRoundIndex,
		roundFailed,
		numberOfRounds,
		setNumberOfRounds,
		allRoundsPassed,
		roundComplete,
		currentRoundIndexes,
		completedRoundIndexes,
		getGameCompletedRoundIndexes,
	} = useContext(RoundContext);

	// Hooks
	const {
		infoMessage,
		updateInfoMessage,
		successMessage,
		updateSuccessMessage,
		failedMessage,
		updateFailedMessage,
	} = useInfoMessage();

	// States
	const [roundId, setRoundId] = useState(0);
	const [signalError, setSignalError] = useState(false);

	/**
	 * Set final result state after comparing with answers from backend
	 */
	const updateFinalResult = async () => {
		const foundRoundAnswers = await getFoundRoundAnswers(
			GameName.Hangman,
			maskedWords
		);
		const foundAnswers = await fetchGameData(GameName.Hangman, "POST", {
			foundRoundIds: foundRoundAnswers,
		});
		await setFinalResult(foundAnswers);
	};

	/**
	 * Set round state based on words
	 */
	const setRoundState = async () => {
		const currentRoundIndex = getGameCurrentRoundIndex(GameName.Hangman);
		const _numberOfRounds = maskedWords.length;
		setNumberOfRounds(_numberOfRounds);
		const numberOfLettersInCurrentWord = maskedWords[
			currentRoundIndex
		]?.maskedWord?.reduce((acc: number, nr: number) => acc + nr);
		updateRoundLength(numberOfLettersInCurrentWord);
		// Are all rounds finished?
		const completedRoundIndexes = getGameCompletedRoundIndexes(
			GameName.Hangman
		);
		if (
			currentRoundIndex === _numberOfRounds - 1 &&
			completedRoundIndexes.includes(_numberOfRounds - 1)
		) {
			updateFinalResult();
		} else {
			setTimeout(() => {
				setReadyToRenderGame(true);
			}, 1000);
		}
	};

	// Watch for round indexes change before setting round state
	useEffect(() => {
		setRoundState();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentRoundIndexes, completedRoundIndexes]);

	/**
	 * Check for round completion to set success/fail message
	 *
	 * Split into these 2 states to enable exit animation
	 */
	useEffect(() => {
		if (roundComplete) {
			updateSuccessMessage("You got it!");
			setRoundState();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [roundComplete]);

	useEffect(() => {
		if (roundFailed && !allRoundsPassed) updateFailedMessage("Ouch, my neck!!");
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [roundFailed]);

	useEffect(() => {
		if (allRoundsPassed) {
			updateSuccessMessage(
				roundFailed
					? "That was all. You did your best <3"
					: "That was all! Good job!"
			);
			setTimeout(() => {
				updateFinalResult();
			}, 3000);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [allRoundsPassed]);

	/**
	 * Update round id if currentRoundIndex changes
	 */
	useEffect(() => {
		setRoundId(
			maskedWords[getGameCurrentRoundIndex(GameName.Hangman)]?.roundId
		);
	}, [getGameCurrentRoundIndex, maskedWords]);

	/**
	 * Check letter
	 */
	const checkLetter = async (letter: string) => {
		// Check if there's a letter
		if (!letter.length) {
			updateInfoMessage("Please enter a letter");
			return;
		}
		const roundStatus =
			getRoundStatus(GameName.Hangman, roundId)?.completed || [];
		// Check if letter already has been tried
		const alreadyFound = (roundStatus as HangmanProgressCompletedProps[]).some(
			(round: HangmanProgressCompletedProps) => round.letter === letter
		);
		const alreadyErrored = getGameErrors(GameName.Hangman).includes(letter);
		if (alreadyFound || alreadyErrored) {
			updateInfoMessage(
				alreadyErrored
					? "You've already tried this one :("
					: "You've already found this one! :)"
			);
			return;
		}
		if (roundId) {
			// Check for match
			const letterMatches = await fetchGameData(GameName.Hangman, "POST", {
				letter,
				roundId,
			});
			// Match made
			if (letterMatches) {
				await updateProgress(GameName.Hangman, roundId, letterMatches);
			}
			// No match
			else {
				const newErrors = await updateErrors(
					firebaseDatabase,
					userId,
					GameName.Hangman,
					letter,
					true
				);
				// Failed the whole round
				if (
					getGameErrors(GameName.Hangman, newErrors).length &&
					getGameErrors(GameName.Hangman).length >=
						hangmanPartsInOrder.length - 1 &&
					!roundFailed
				) {
					onRoundFail(GameName.Hangman);
				} else {
					// Show that error occurred
					setSignalError(true);
					setTimeout(() => {
						setSignalError(false);
					}, 600);
				}
			}
		}
	};

	if (finalResult) return <FactsList facts={finalResult} />;

	return (
		<div className="hangman min-h-[80vh] flex flex-col justify-center w-full">
			{readyToRenderGame ? (
				<div className="grid lg:grid-cols-5 gap-4 lg:mb-[10vh]">
					{/* Game  */}
					<div className="lg:col-span-3 flex flex-col border rounded-lg border-line1 p-4 pb-10 bg-paper w-full">
						<div className="mb-4 lg:mb-8">
							<Pagination
								itemLength={numberOfRounds}
								activeItemIndex={getGameCurrentRoundIndex(GameName.Hangman)}
							/>
						</div>
						<div className="flex flex-col items-center w-full">
							{/* Round */}
							{maskedWords?.length ? (
								<AnimatePresence mode="wait">
									<RoundContent
										motionKey={`round-${getGameCurrentRoundIndex(
											GameName.Hangman
										)}`}
										roundStatus={getRoundStatus(GameName.Hangman, roundId)}
										description={
											maskedWords[getGameCurrentRoundIndex(GameName.Hangman)]
												?.description
										}
										maskedWord={
											maskedWords[getGameCurrentRoundIndex(GameName.Hangman)]
												.maskedWord
										}
									/>
								</AnimatePresence>
							) : (
								<div className="h-16"></div>
							)}
							{/* Input + input feedback */}
							<div className="relative">
								<LetterInput
									onClick={(value) => {
										checkLetter(value);
									}}
								/>
								<AnimatePresence>
									{infoMessage && (
										<div className="absolute -bottom-4 translate-y-full md:translate-y-0 translate-x-1/2 -left-5 w-full md:left-0 md:right-0 md:top-0 md:translate-x-full">
											<InfoMessage text={infoMessage} />
										</div>
									)}
								</AnimatePresence>
							</div>
						</div>
					</div>
					<div
						className={`flex flex-col items-center lg:col-span-2 border rounded-lg border-line1 p-4 sm:pt-8 transition-colors duration-200 ease-in-out ${
							signalError ? "bg-lime" : "bg-paper"
						}`}
					>
						{/* Man  */}
						<HangedMan errorLength={getGameErrors(GameName.Hangman).length} />
						{/* Error list */}
						{!!getGameErrors(GameName.Hangman).length && (
							<div className="errors mt-8 mb-4 sm:mt-10 sm:mb-6">
								<ul className="flex gap-2 justify-center flex-wrap">
									{getGameErrors(GameName.Hangman).map(
										(err: string, i: number) => (
											<li
												className="uppercase text-xl lg:text-2xl"
												key={`error-${i}`}
											>
												{err}
											</li>
										)
									)}
								</ul>
							</div>
						)}
					</div>
					<AnimatePresence>
						{successMessage && <SuccessScreen text={successMessage} />}
					</AnimatePresence>
					<AnimatePresence>
						{failedMessage && <FailedScreen text={failedMessage} />}
						{/* <Confetti /> */}
					</AnimatePresence>
				</div>
			) : (
				<DotLoader />
			)}
		</div>
	);
};

export default Hangman;
