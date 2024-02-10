import { fetchGameData } from "@/lib/helpers/fetch";
import { HangmanQuestionProps } from "@/lib/types/questions";
import React, { useContext, useEffect, useRef, useState } from "react";
import LetterSlot from "./LetterSlot";
import Lodash from "./Lodash";
import LetterInput from "./LetterInput";
import { GameContext } from "@/context/GameContext";
import { GameName } from "@/lib/types/game";
import useInfoMessage from "@/hooks/useInfoMessage";
import InfoMessage from "@/components/ui/InfoMessage";
import { AnimatePresence } from "framer-motion";
import HangedMan, { hangmanPartsInOrder } from "./HangedMan";
import SuccessScreen from "@/components/ui/SuccessScreen";
import FailedScreen from "@/components/ui/FailedScreen";
import { HangmanProgressCompletedProps } from "@/lib/types/progress";

interface HangmanProps {}

const Hangman: React.FC<HangmanProps> = ({}) => {
	const [maskedWords, setMaskedWords] = useState<HangmanQuestionProps[] | []>(
		[]
	);
	const [questionId, setQuestionId] = useState(0);
	const {
		updateProgress,
		setRoundLength,
		getGameCurrentRoundIndex,
		getQuestionStatus,
		errors,
		updateErrors,
		getGameErrors,
		roundComplete,
		roundFailed,
		onRoundFail,
		setNumberOfRounds,
		allRoundsPassed,
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
		// TODO: investigate why this sticks around to the next round
		if (roundComplete) updateSuccessMessage("You beat this round!");
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [roundComplete]);

	useEffect(() => {
		if (roundFailed) updateFailedMessage("You lost this round!");
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
	 * Fetch masked words
	 */
	useEffect(() => {
		const fetchData = async () => {
			const currentRoundIndex = getGameCurrentRoundIndex(GameName.Hangman);
			// TODO: Rename maskedwords, maybe to sentence
			const maskedWords = await fetchGameData("hangman", "GET");
			setMaskedWords(maskedWords);
			setNumberOfRounds(maskedWords.length);
			const numberOfLettersInCurrentWord = maskedWords[
				currentRoundIndex
			]?.maskedWord?.reduce((acc: number, nr: number) => acc + nr);
			setRoundLength(numberOfLettersInCurrentWord);
		};
		if (!maskedWords.length) fetchData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

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
			const letterMatches = await fetchGameData("hangman", "POST", {
				letter,
				questionId,
			});
			if (letterMatches) {
				updateProgress(GameName.Hangman, questionId, letterMatches);
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
		<div className="hangman flex flex-col justify-center items-center lg:flex-row min-h-screen">
			{/* Game  */}
			<div className="flex flex-col items-center">
				{maskedWords?.length ? (
					<div className="words flex gap-6 mb-12">
						{(() => {
							let indexOutOfTotal = 0;
							return maskedWords[
								getGameCurrentRoundIndex(GameName.Hangman)
							].maskedWord.map((wordCount, i) => {
								return (
									<div className="word flex gap-1" key={`word-${i}`}>
										{Array.from({
											length: wordCount,
										}).map((_, index) => {
											const curIndex = indexOutOfTotal;
											indexOutOfTotal++;
											return (
												<div
													className="letter flex flex-col"
													key={`letter-${curIndex}`}
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
				{!!getGameErrors(GameName.Hangman).length && (
					<div className="errors my-10">
						<p>You have already guessed:</p>
						<ul className="flex gap-2">
							{getGameErrors(GameName.Hangman).map((err: string, i: number) => (
								<li className="uppercase text-lg" key={`error-${i}`}>
									{err}
								</li>
							))}
						</ul>
					</div>
				)}
			</div>
			{/* Man  */}
			{/* TODO: Check why gameErrors remains from one round to another */}
			<div className="h-[408px]">
				<HangedMan errorLength={getGameErrors(GameName.Hangman).length} />
			</div>
			<AnimatePresence>
				{successMessage && <SuccessScreen text={successMessage} />}
				{failedMessage && <FailedScreen text={failedMessage} />}
			</AnimatePresence>
		</div>
	);
};

export default Hangman;
