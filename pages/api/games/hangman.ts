import { HangmanAnswerProps } from "@/lib/types/answers";
import { NextApiRequest, NextApiResponse } from "next";
import hangman from "../../../lib/data/answers/hangman.json";
import { HangmanQuestionProps } from "@/lib/types/questions";

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
	return hangman.map((question) => {
		return {
			questionId: question.questionId,
			maskedWord: question.answer.split(" ").map((answer) => answer.length),
		};
	}) as unknown as HangmanQuestionProps;
};

/**
 * Get letter from words
 * returns the letter(s) if it is in words, otherwise false
 */
const getLetterFromWords = (reqBody: any) => {
	const { questionId, letter } = reqBody;
	if (!questionId || !letter) {
		throw new Error();
	}
	const currentQuestion = hangman.find(
		(question) => question.questionId === questionId
	);
	if (currentQuestion?.answer.toLowerCase().includes(letter.toLowerCase())) {
		const matches = currentQuestion?.answer
			.split("")
			.filter((char) => char != " ")
			.map((char, index) => ({ char, index }))
			.filter(({ char }) => char.toLowerCase() === letter.toLowerCase())
			.map(({ char, index }) => ({ letter: char.toLowerCase(), index }));
		return matches;
	}

	return false;
};
