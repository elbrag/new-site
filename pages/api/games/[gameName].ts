import { NextApiRequest, NextApiResponse } from "next";
import hangman from "../../../lib/data/rounds/hangman.json";

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse<unknown>
) {
	const { gameName } = req.query;
	let returnData;

	if (gameName === "hangman") {
		returnData = hangman;
	}

	res.status(200).json({ returnData });
}
