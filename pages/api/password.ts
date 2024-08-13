import { NextApiRequest, NextApiResponse } from "next";

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse<any>
) {
	const { input } = req.body;
	if (input === "potat") {
		res.status(200).end("Password correct");
	} else {
		res.status(401).end("Unauthorized");
	}
}
