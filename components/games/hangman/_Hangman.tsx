import { fetchGameData } from "@/lib/helpers/fetch";
import { HangmanQuestionProps } from "@/lib/types/questions";
import React, { useContext, useEffect, useState } from "react";
import LetterSlot from "./LetterSlot";
import Lodash from "./Lodash";
import LetterInput from "./LetterInput";
import { GameContext } from "@/context/GameContext";
import { GameName } from "@/lib/types/game";

interface HangmanProps {}

const Hangman: React.FC<HangmanProps> = ({}) => {
	const [maskedWords, setMaskedWords] = useState<HangmanQuestionProps[] | []>(
		[]
	);
	const [currentWordIndex, setCurrentWordIndex] = useState(0);
	const { updateProgress, getGameProgress, getQuestionStatus } =
		useContext(GameContext);
	const questionId = parseInt(maskedWords[currentWordIndex]?.questionId);

	/**
	 * Fetch masked words
	 */
	useEffect(() => {
		const fetchData = async () => {
			const maskedWords = await fetchGameData("hangman", "GET");
			setMaskedWords(maskedWords);
		};
		fetchData();
	}, []);

	/**
	 * Check letter
	 */
	const checkLetter = async (letter: string) => {
		if (questionId) {
			const letterMatches = await fetchGameData("hangman", "POST", {
				letter,
				questionId,
			});
			if (letterMatches) {
				const currentQuestionProgress =
					getQuestionStatus(GameName.Hangman, questionId)?.progress || [];
				const progressObj = {
					game: "hangman",
					progress: [
						{
							questionId: questionId,
							completed: [...currentQuestionProgress, ...letterMatches],
						},
					],
				};
				updateProgress(progressObj);
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
			(c: any) => c.index === index
		);
		return match?.letter ?? null;
	};

	return (
		<div className="hangman flex flex-col items-center">
			{maskedWords?.length && (
				<div className="words flex gap-6 mb-12">
					{(() => {
						let indexOutOfTotal = 0;
						return maskedWords[currentWordIndex].maskedWord.map(
							(wordCount, i) => {
								return (
									<div
										className="word flex gap-1"
										key={`word-${currentWordIndex}-${i}`}
									>
										{Array.from({ length: wordCount }).map((_, index) => {
											const curIndex = indexOutOfTotal;
											indexOutOfTotal++;
											return (
												<div
													className="letter flex flex-col"
													key={`letter-${currentWordIndex}-${index}`}
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
			)}

			<LetterInput
				onClick={(value) => {
					checkLetter(value);
				}}
			/>
		</div>
	);
};

export default Hangman;
