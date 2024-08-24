import { NextApiRequest, NextApiResponse } from "next";

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse<string>
) {
	const { input } = req.body;
	if (input === process.env.NEXT_PUBLIC_LOGIN_PASS) {
		res.status(200).end("Password correct");
	} else {
		res.status(401).end("Unauthorized");
	}
}
