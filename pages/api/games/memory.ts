import { NextApiRequest, NextApiResponse } from "next";
import memory from "../../../lib/data/rounds/memory.json";
import { MemoryRoundProps } from "@/lib/types/rounds";

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse<any>
) {
	let returnData = {};

	if (req.method === "GET") {
		returnData = getCardCount();
	}

	if (req.method === "POST") {
		if (req.body.cardIndex !== undefined) {
			returnData = getCardData(req.body) ?? {};
		}
	}

	res.status(200).json(returnData);
}

// const getInitialImages = () => {
// 	return memory.map((round) => {
// 		return { roundId: round.roundId, imageUrl: round.images[0].url };
// 	});
// };

const getCardCount = () => {
	return memory.length * 2;
};

const getCardData = (reqBody: any): MemoryRoundProps | undefined => {
	return memory.find((card) =>
		card.images[0].slotIndexes?.includes(reqBody.cardIndex)
	);
};
