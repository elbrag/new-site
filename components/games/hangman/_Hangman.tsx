import { fetchGameData } from "@/lib/helpers/fetch";
import { HangmanQuestionProps } from "@/lib/types/questions";
import React, { useEffect, useState } from "react";
import LetterSlot from "./LetterSlot";
import Lodash from "./Lodash";
import LetterInput from "./LetterInput";

interface HangmanProps {}

const Hangman: React.FC<HangmanProps> = ({}) => {
	const [maskedWords, setMaskedWords] = useState<HangmanQuestionProps[] | []>(
		[]
	);
	const [currentWordIndex, setCurrentWordIndex] = useState(0);

	useEffect(() => {
		const fetchData = async () => {
			const maskedWords = await fetchGameData("hangman", "GET");
			setMaskedWords(maskedWords);
		};

		fetchData();
	}, []);

	const makeDashedLetters = (wordCount: number) => {
		let components = [];
		for (let i = 0; i < wordCount; i++) {
			components.push(
				<div className="letter flex flex-col">
					<LetterSlot />
					<Lodash />
				</div>
			);
		}
		return components;
	};

	return (
		<div className="hangman flex flex-col items-center">
			{maskedWords?.length && (
				<div className="words flex gap-6 mb-12">
					{maskedWords[currentWordIndex].maskedWord.map((wordCount, i) => (
						<div
							className="word flex gap-1"
							key={`word-${currentWordIndex}-${i}`}
						>
							{makeDashedLetters(wordCount)}
						</div>
					))}
				</div>
			)}
			<LetterInput
				onClick={(value) => {
					console.log(value);
				}}
			/>
		</div>
	);
};

export default Hangman;
