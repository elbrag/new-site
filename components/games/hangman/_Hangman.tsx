import { fetchGameData } from "@/lib/helpers/fetch";
import React, { useContext, useEffect, useRef, useState } from "react";
import LetterSlot from "./LetterSlot";
import LetterInput from "./LetterInput";
import { GameContext } from "@/context/GameContext";
import { GameName } from "@/lib/types/game";
import useInfoMessage from "@/hooks/useInfoMessage";
import InfoMessage from "@/components/ui/InfoMessage";
import { AnimatePresence, motion } from "framer-motion";
import HangedMan, { hangmanPartsInOrder } from "./HangedMan";
import SuccessScreen from "@/components/ui/SuccessScreen";
import FailedScreen from "@/components/ui/FailedScreen";
import { HangmanProgressCompletedProps } from "@/lib/types/progress";
import Pagination from "./Pagination";
import ResetButton from "./ResetButton";
import Confetti from "@/components/ui/Confetti";
import Lodash from "./lodash_temp";

interface HangmanProps {
	gameData: any;
}

const Hangman: React.FC<HangmanProps> = ({ gameData }) => {
	const [questionId, setQuestionId] = useState(0);
	const { maskedWords } = gameData;

	const {
		updateProgress,
		setRoundLength,
		getGameCurrentRoundIndex,
		updateCurrentRoundIndexes,
		getQuestionStatus,
		errors,
		updateErrors,
		getGameErrors,
		roundComplete,
		roundFailed,
		onRoundFail,
		numberOfRounds,
		setNumberOfRounds,
		allRoundsPassed,
		resetRound,
	} = useContext(GameContext);

	const {
		infoMessage,
		updateInfoMessage,
		successMessage,
		updateSuccessMessage,
		failedMessage,
		updateFailedMessage,
	} = useInfoMessage();

	/**
	 * Check for round completion to set success/fail message
	 *
	 * Split into these 2 states to enable exit animation
	 */
	useEffect(() => {
		if (roundComplete) updateSuccessMessage("You got it!");

		const setRoundState = async () => {
			const currentRoundIndex = getGameCurrentRoundIndex(GameName.Hangman);
			setNumberOfRounds(maskedWords.length);
			const numberOfLettersInCurrentWord = maskedWords[
				currentRoundIndex
			]?.maskedWord?.reduce((acc: number, nr: number) => acc + nr);
			setRoundLength(numberOfLettersInCurrentWord);
		};
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
	 * Update question id if currentRoundIndex changes
	 */
	useEffect(() => {
		setQuestionId(
			parseInt(
				maskedWords[getGameCurrentRoundIndex(GameName.Hangman)]?.questionId
			)
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
		let currentQuestionCompleted =
			getQuestionStatus(GameName.Hangman, questionId)?.completed || [];
		// Check if letter already has been tried
		const alreadyFound = currentQuestionCompleted.some(
			(question: HangmanProgressCompletedProps) => question.letter === letter
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
		if (questionId) {
			// Check for match
			const letterMatches = await fetchGameData(GameName.Hangman, "POST", {
				letter,
				questionId,
			});
			if (letterMatches) {
				await updateProgress(GameName.Hangman, questionId, letterMatches);
			} else {
				await updateErrors(GameName.Hangman, letter, true);
			}
		}
	};

	/**
	 * Get letter to show in slot
	 */
	const letterToShow = (index: number) => {
		const currentQuestionStatus = getQuestionStatus(
			GameName.Hangman,
			questionId
		);
		const match = currentQuestionStatus?.completed.find(
			(c: HangmanProgressCompletedProps) => c.index === index
		);
		return match?.letter ?? null;
	};

	return (
		<div className="hangman min-h-[80vh] flex flex-col justify-center w-full">
			<div className="flex flex-col justify-center items-center lg:flex-row lg:justify-around gap-4">
				{/* Game  */}
				<div className="flex flex-col items-center lg:max-w-3/5">
					{maskedWords?.length ? (
						<AnimatePresence mode="wait">
							<motion.div
								className="w-full"
								key={getGameCurrentRoundIndex(GameName.Hangman)}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.5 }}
							>
								<h2 className="text-center font-alegreya text-lg mb-10">
									{
										maskedWords[getGameCurrentRoundIndex(GameName.Hangman)]
											?.description
									}
								</h2>
								<div className="words flex gap-6 mb-16 flex-wrap justify-center">
									{(() => {
										let indexOutOfTotal = 0;
										return maskedWords[
											getGameCurrentRoundIndex(GameName.Hangman)
										].maskedWord.map((wordCount: number, i: number) => {
											return (
												<div className="word flex gap-1" key={`word-${i}`}>
													{Array.from({
														length: wordCount,
													}).map((_, index) => {
														const curIndex = indexOutOfTotal;
														indexOutOfTotal++;
														return (
															<div
																className="letter flex flex-col items-center"
																key={`letter-${index}`}
															>
																<LetterSlot letter={letterToShow(curIndex)} />
																<Lodash />
															</div>
														);
													})}
												</div>
											);
										});
									})()}
								</div>
							</motion.div>
						</AnimatePresence>
					) : (
						<div className="h-16"></div>
					)}
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
					{failedMessage && <FailedScreen text={failedMessage} />}
					<Confetti />
				</AnimatePresence>
			</div>
			{/* <div className="flex gap-6">
				<Pagination
					itemLength={numberOfRounds}
					onClick={(index) => {
						updateCurrentRoundIndexes(GameName.Hangman, index);
					}}
					activeItemIndex={getGameCurrentRoundIndex(GameName.Hangman)}
				/>
				<ResetButton
					onSubmit={() => {
						resetRound(GameName.Hangman, questionId);
					}}
				/>
			</div> */}
		</div>
	);
};

export default Hangman;
