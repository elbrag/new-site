import { NextApiRequest, NextApiResponse } from "next";
import hangman from "../../../lib/data/answers/hangman.json";
import { HangmanRoundProps } from "@/lib/types/rounds";

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse<any>
) {
	let returnData = {};

	if (req.method === "GET") {
		returnData = getMaskedWords();
	}
	if (req.method === "POST") {
		returnData = getLetterFromWords(req.body);
	}

	res.status(200).json(returnData);
}

/**
 * Get masked words
 */
const getMaskedWords = () => {
	return hangman.map((round) => {
		return {
			roundId: round.roundId,
			description: round.description,
			maskedWord: round.answer.split(" ").map((answer) => answer.length),
		};
	}) as unknown as HangmanRoundProps;
};

/**
 * Get letter from words
 * returns the letter(s) if it is in words, otherwise false
 */
const getLetterFromWords = (reqBody: any) => {
	const { roundId, letter } = reqBody;
	if (!roundId || !letter) {
		throw new Error();
	}
	const currentRound = hangman.find((round) => round.roundId === roundId);
	if (currentRound?.answer.toLowerCase().includes(letter.toLowerCase())) {
		const matches = currentRound?.answer
			.split("")
			.filter((char) => char != " ")
			.map((char, index) => ({ char, index }))
			.filter(({ char }) => char.toLowerCase() === letter.toLowerCase())
			.map(({ char, index }) => ({ letter: char.toLowerCase(), index }));
		return matches;
	}

	return false;
};
