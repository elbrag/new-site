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
		returnData = checkLetter(req.body);
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
 * Check letter against words
 */
const checkLetter = (reqBody: any) => {
	if (!reqBody.questionId || !reqBody.letter) {
		throw new Error();
	}
	const currentQuestion = hangman.find(
		(question) => question.questionId === reqBody.questionId
	);
	return currentQuestion?.answer.includes(reqBody.letter) ? true : false;
};
