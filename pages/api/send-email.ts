import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<string>
) {
	if (req.method !== "POST") {
		return res.status(405).send("Method not allowed");
	}

	try {
		const apiKey = process.env.BREVO_API_KEY;
		const targetEmail = process.env.BREVO_TARGET_EMAIL;
		const { name, email, message, score } = JSON.parse(req.body);

		console.log(apiKey, targetEmail, name, email, message);

		const response = await fetch("https://api.brevo.com/v3/smtp/email", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"api-key": `${apiKey}`,
			},
			body: JSON.stringify({
				sender: {
					name: "Ellen",
					email: targetEmail,
				},
				to: [{ email: targetEmail }],
				subject: `Game results from ${name}`,
				htmlContent: `<html>
                                <body>
                                <h1>Game results from ${name}</h1>
                                <br />
                                <p><strong>Name:</strong> ${name}</p>
                                <p><strong>Email:</strong> ${email}</p>
                                <p><strong>Score:</strong> ${score}</p>
                                <p><strong>Message:</strong></p>
                                <p>${message}</p>
                                </body>
                            </html>
                            `,
			}),
		});
		if (!response.ok) {
			throw new Error(`Error: ${response.statusText}`);
		}

		res.status(200).send("Email sent successfully!");
	} catch (err) {
		res.status(500).send(`Failed to send email, reason: ${err}`);
	}
}
