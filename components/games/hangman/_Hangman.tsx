import { fetchGameData } from "@/lib/helpers/fetch";
import { HangmanQuestionProps } from "@/lib/types/questions";
import React, { useEffect, useState } from "react";
import Lodash from "./lodash";

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
			components.push(<Lodash />);
		}
		return components;
	};

	return (
		<div>
			{maskedWords?.length && (
				<div className="flex gap-6">
					{maskedWords[currentWordIndex].maskedWord.map((wordCount, i) => (
						<div className="flex gap-1" key={`word-${currentWordIndex}-${i}`}>
							{makeDashedLetters(wordCount)}
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default Hangman;
