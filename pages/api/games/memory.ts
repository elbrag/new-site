import { NextApiRequest, NextApiResponse } from "next";
import memory from "../../../lib/data/rounds/memory.json";
import { MemoryRoundProps } from "@/lib/types/rounds";

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse<unknown>
) {
	let returnData = {};

	if (req.method === "GET") {
		returnData = getCardCount();
	}

	if (req.method === "POST") {
		if (req.body.foundMatchesIds?.length) {
			returnData = getMatchedCardsData(req.body.foundMatchesIds) ?? {};
		}
		if (req.body.cardIndex !== undefined) {
			returnData = getCardData(req.body.cardIndex) ?? {};
		}
	}

	res.status(200).json(returnData);
}

const getCardCount = () => {
	return memory.length * 2;
};

const getMatchedCardsData = (foundMatchesIds: number[]): MemoryRoundProps[] => {
	return memory.filter((card) => foundMatchesIds?.includes(card.roundId));
};

const getCardData = (cardIndex: number): MemoryRoundProps | undefined => {
	return memory.find((card) => card.images[0].slotIndexes?.includes(cardIndex));
};
