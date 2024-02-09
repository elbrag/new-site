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
import HangedMan from "./HangedMan";
import SuccessScreen from "@/components/ui/SuccessScreen";

interface HangmanProps {}

const Hangman: React.FC<HangmanProps> = ({}) => {
	const [maskedWords, setMaskedWords] = useState<HangmanQuestionProps[] | []>(
		[]
	);
	const [questionId, setQuestionId] = useState(0);
	const {
		updateProgress,
		setRoundLength,
		currentRoundIndex,
		setCurrentRoundIndex,
		getQuestionStatus,
		updateErrors,
		getGameErrors,
		roundComplete,
		roundFailed,
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
	 * Check for round completion to set success message
	 *
	 * Split into these 2 states to enable exit animation
	 */
	useEffect(() => {
		if (roundComplete) updateSuccessMessage("You did it!!");
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [roundComplete]);

	useEffect(() => {
		setQuestionId(parseInt(maskedWords[currentRoundIndex]?.questionId));
	}, [currentRoundIndex, maskedWords]);

	/**
	 * Fetch masked words
	 */
	useEffect(() => {
		const fetchData = async () => {
			const maskedWords = await fetchGameData("hangman", "GET");
			setMaskedWords(maskedWords);
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
		console.log(letter);
		// Check if there's a letter
		if (!letter.length) {
			updateInfoMessage("Please enter a letter");
			return;
		}
		let currentQuestionCompleted =
			getQuestionStatus(GameName.Hangman, questionId)?.completed || [];
		// Check if letter already has been tried
		const alreadyFound = currentQuestionCompleted.some(
			(question: any) => question.letter === letter
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
				const progressObj = {
					game: "hangman",
					progress: [
						{
							questionId: questionId,
							completed: letterMatches,
						},
					],
				};
				updateProgress(progressObj);
			} else {
				updateErrors({ game: GameName.Hangman, error: letter }, true);
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
		console.log(index, questionId, currentQuestionStatus);
		const match = currentQuestionStatus?.completed.find(
			(c: any) => c.index === index
		);
		return match?.letter ?? null;
	};

	return (
		<div className="hangman flex flex-col lg:flex-row min-h-screen">
			{/* Game  */}
			<div className="flex flex-col items-center">
				{maskedWords?.length ? (
					<div className="words flex gap-6 mb-12">
						{(() => {
							let indexOutOfTotal = 0;
							return maskedWords[currentRoundIndex].maskedWord.map(
								(wordCount, i) => {
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
								}
							);
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
				{getGameErrors(GameName.Hangman).length && (
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
			<div className="h-[408px]">
				<HangedMan errorLength={getGameErrors(GameName.Hangman).length} />
			</div>
			<AnimatePresence>
				{successMessage && <SuccessScreen text={successMessage} />}
			</AnimatePresence>
		</div>
	);
};

export default Hangman;
