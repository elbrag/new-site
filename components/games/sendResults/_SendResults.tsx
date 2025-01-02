import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { GameContext } from "@/context/GameContext";
import React, { FormEvent, useContext, useEffect, useState } from "react";

interface SendResultsProps {
	gameData: [];
}

const SendResults: React.FC<SendResultsProps> = ({ gameData }) => {
	const { username, currentScore } = useContext(GameContext);

	// Input values
	const [senderName, setSenderName] = useState("");
	const [email, setEmail] = useState("");
	const [message, setMessage] = useState("");
	const [honey, setHoney] = useState<string>("");

	// Feedback states
	const [failed, setFailed] = useState(false);
	const [success, setSuccess] = useState(true);
	const [loading, setLoading] = useState(false);
	const [mimickActive, setMimickActive] = useState(false);

	/**
	 * Set sender name to username as default
	 */
	useEffect(() => {
		if (username && !senderName.length) {
			setSenderName(username);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [username]);

	/**
	 * Send form
	 */
	const onSubmit = async (e: FormEvent) => {
		e.preventDefault();
		try {
			const result = await fetch(
				`${process.env.NEXT_PUBLIC_SITE_URL}/api/send-email`,
				{
					method: "POST",
					body: JSON.stringify({
						name: senderName,
						email: email,
						message: message,
						score: currentScore,
					}),
				}
			);
			console.log(result);
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<div className="md:px-6 lg:px-12">
			<h1 className="uppercase text-2xl lg:text-4xl mb-4 md:mb-6 text-center">
				Send results
			</h1>
			<form
				className="flex flex-col gap-y-4 max-w-144 mx-auto"
				onSubmit={(e) => onSubmit(e)}
			>
				<div className="text-center">
					<p className="text-xl lg:text-2xl mb-1.5">Score: {currentScore}</p>
				</div>
				<Input
					value={senderName}
					label="Name"
					{...(!username && {
						onChange: (e) => setSenderName(e.target.value),
					})}
					{...(username && { readonly: true })}
					setMimickActive={setMimickActive}
				/>
				<Input
					value={email}
					label="E-mail address"
					type="email"
					onChange={(e) => setEmail(e.target.value)}
					setMimickActive={setMimickActive}
				/>
				<Input
					value={message}
					label="Message (if you'd like)"
					type="textarea"
					onChange={(e) => setMessage(e.target.value)}
					setMimickActive={setMimickActive}
				/>
				<input
					className="hidden"
					value={honey}
					onChange={(e) => setHoney(e.target.value)}
				/>
				<div className="flex flex-col items-center mt-4 md:mt-6">
					<div className="mb-6 text-center">
						<Button
							label={loading ? "Sending…" : "Send"}
							onClick={(e) => onSubmit(e)}
							mimickActive={mimickActive}
							mimickHover={senderName.length > 0 || message.length > 0}
						/>
						{failed && (
							<p className="mt-4">
								Sorry, something went wrong. Please try again.
							</p>
						)}
					</div>
				</div>
			</form>
			<br />
			<br />
			Data to send:
			<br /> <br />
			score: {currentScore} <br />
			from: {senderName} <br />
			message: {message} <br />
		</div>
	);
};

export default SendResults;
