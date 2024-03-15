import { fetchGameData } from "@/lib/helpers/fetch";
import React, { useContext, useEffect, useRef, useState } from "react";
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
import ResetButton from "./ResetButton";
import FactsList from "@/components/ui/FactsList";

interface HangmanProps {
	gameData: HangmanGameData;
}

const Hangman: React.FC<HangmanProps> = ({ gameData }) => {
	// Initial data
	const { maskedWords } = gameData;

	// Context data and functions
	const { firebaseDatabase, userId } = useContext(FirebaseContext);
	const { getRoundStatus } = useContext(ProgressContext);
	const { onRoundFail, updateProgress, resetRound } = useContext(GameContext);
	const { errors, updateErrors, getGameErrors } = useContext(ErrorContext);
	const {
		updateRoundLength,
		getGameCurrentRoundIndex,
		roundFailed,
		setNumberOfRounds,
		allRoundsPassed,
		roundComplete,
		currentRoundIndexes,
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

	/**
	 * Set round state based on words
	 */
	const setRoundState = async () => {
		const currentRoundIndex = getGameCurrentRoundIndex(GameName.Hangman);
		setNumberOfRounds(maskedWords.length);
		const numberOfLettersInCurrentWord = maskedWords[
			currentRoundIndex
		]?.maskedWord?.reduce((acc: number, nr: number) => acc + nr);
		updateRoundLength(numberOfLettersInCurrentWord);
	};

	// Watch for round indexes change before setting round state
	useEffect(() => {
		setRoundState();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentRoundIndexes]);

	/**
	 * Check for round completion to set success/fail message
	 *
	 * Split into these 2 states to enable exit animation
	 */
	useEffect(() => {
		if (roundComplete) {
			updateSuccessMessage("You got it!");
		}
		setRoundState();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [roundComplete]);

	useEffect(() => {
		if (roundFailed) updateFailedMessage("Ouch, my neck!!");
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [roundFailed]);

	useEffect(() => {
		if (allRoundsPassed)
			updateSuccessMessage("That was the last round! Good job!");
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [allRoundsPassed]);

	/**
	 * Update round id if currentRoundIndex changes
	 */
	useEffect(() => {
		setRoundId(
			parseInt(maskedWords[getGameCurrentRoundIndex(GameName.Hangman)]?.roundId)
		);
	}, [getGameCurrentRoundIndex, maskedWords]);

	/**
	 * Set round fail if error count meets the limit
	 */
	useEffect(() => {
		if (
			getGameErrors(GameName.Hangman).length &&
			hangmanPartsInOrder.length === getGameErrors(GameName.Hangman).length &&
			!roundFailed
		) {
			onRoundFail(GameName.Hangman);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [errors]);

	/**
	 * Check letter
	 */
	const checkLetter = async (letter: string) => {
		// Check if there's a letter
		if (!letter.length) {
			updateInfoMessage("Please enter a letter");
			return;
		}
		let roundStatus =
			getRoundStatus(GameName.Hangman, roundId)?.completed || [];
		// Check if letter already has been tried
		const alreadyFound = roundStatus.some(
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
			if (letterMatches) {
				await updateProgress(GameName.Hangman, roundId, letterMatches);
			} else {
				await updateErrors(
					firebaseDatabase,
					userId,
					GameName.Hangman,
					letter,
					true
				);
			}
		}
	};

	return (
		<div className="hangman min-h-[80vh] flex flex-col justify-center w-full">
			<div className="flex flex-col justify-center items-center lg:flex-row lg:justify-around gap-4">
				{/* Game  */}
				<div className="flex flex-col items-center lg:max-w-3/5">
					{!allRoundsPassed ? (
						<>
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
										<div className="absolute right-0 top-0 translate-x-full">
											<InfoMessage text={infoMessage} />
										</div>
									)}
								</AnimatePresence>
							</div>
						</>
					) : (
						<></>
						// All rounds completed
						// <FactsList facts={} />
					)}
				</div>
				<div className="flex flex-col items-center">
					{/* Man  */}
					<div className="h-[408px]">
						<HangedMan errorLength={getGameErrors(GameName.Hangman).length} />
					</div>
					{/* Error list */}
					{!!getGameErrors(GameName.Hangman).length && (
						<div className="errors my-10">
							<ul className="flex gap-2 justify-center">
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
			<div className="flex gap-6">
				{/* <Pagination
					itemLength={numberOfRounds}
					onClick={(index) => {
						onRoundFinish(GameName.Hangman, index);
					}}
					activeItemIndex={getGameCurrentRoundIndex(GameName.Hangman)}
				/> */}
				<ResetButton
					onSubmit={() => {
						resetRound(GameName.Hangman, roundId);
					}}
				/>
			</div>
		</div>
	);
};

export default Hangman;
