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
		returnData = hangman.map((question) => {
			return {
				questionId: question.questionId,
				maskedWord: question.answer.split(" ").map((answer) => answer.length),
			};
		}) as unknown as HangmanQuestionProps;
	}

	res.status(200).json(returnData);
}
