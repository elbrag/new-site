import { NextApiRequest, NextApiResponse } from "next";
import memory from "../../../lib/data/rounds/memory.json";

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse<any>
) {
	let returnData = {};

	if (req.method === "GET") {
		returnData = getInitialImages();
		// returnData = getMaskedWords();
	}
	if (req.method === "POST") {
	}

	res.status(200).json(returnData);
}

const getInitialImages = () => {
	return memory.map((round) => {
		return { roundId: round.roundId, image: round.images[0] };
	});
};
