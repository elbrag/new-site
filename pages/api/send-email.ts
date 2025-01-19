import { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<string>
) {
	if (req.method !== "POST") {
		return res.status(405).send("Method not allowed");
	}

	const { name, email, message, score } = JSON.parse(req.body);
	const targetEmail = process.env.BREVO_TARGET_EMAIL;

	const transporter = nodemailer.createTransport({
		host: "smtp-relay.brevo.com",
		port: 587,
		secure: false,
		auth: {
			user: process.env.BREVO_SMTP_USERNAME,
			pass: process.env.BREVO_SMTP_PASSWORD,
		},
	});

	try {
		const info = await transporter.sendMail({
			from: `ellenbrage.com <${targetEmail}>`,
			to: targetEmail,
			subject: `Game results from ${name}`,
			html: `<html>
					  <body>
						<h1>Game results from ${name}</h1>
						<br />
						<p><strong>Name:</strong> ${name}</p>
						<p><strong>Email:</strong> ${email}</p>
						<p><strong>Score:</strong> ${score}</p>
						<p><strong>Message:</strong></p>
						<p>${message}</p>
					  </body>
					</html>`,
		});

		console.log("Message sent: %s", info.messageId);
		res.status(200).send("Email sent successfully!");
	} catch (err) {
		console.error("Error sending email:", err);
		res.status(500).send(`Failed to send email, reason: ${err}`);
	}
}
