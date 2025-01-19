import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { GameContext } from "@/context/GameContext";
import { AnimatePresence, motion } from "framer-motion";
import React, { FormEvent, useContext, useEffect, useState } from "react";

interface SendResultsProps {
	gameData: [];
}

const SendResults: React.FC<SendResultsProps> = ({ gameData }) => {
	const { username, currentScore } = useContext(GameContext);

	// Input values
	const [senderName, setSenderName] = useState("");
	const [email, setEmail] = useState("");
	const [emailError, setEmailError] = useState("");
	const [message, setMessage] = useState("");
	const [honey, setHoney] = useState<string>("");

	// Feedback states
	const [failed, setFailed] = useState(false);
	const [success, setSuccess] = useState(false);
	const [loading, setLoading] = useState(false);

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
		setEmailError("");
		setSuccess(false);
		setFailed(false);

		if (
			!email.length ||
			/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email) === false
		) {
			setEmailError("Please fill in a valid email address");
			return;
		}
		if (!senderName.length || honey.length) return;
		setLoading(true);
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
			if (result.status >= 200 && result.status < 300) {
				setSuccess(true);
				setLoading(false);
			}
		} catch (err) {
			console.log(err);
			setFailed(true);
			setLoading(false);
		}
	};

	return (
		<div className="md:px-6 lg:px-12">
			<div className="max-w-144 mx-auto">
				<AnimatePresence>
					{success ? (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="text-center"
						>
							<h2 className="text-2xl lg:text-4xl mb-4 md:mb-6 ">
								Thank you! 🤝
							</h2>
							<p>Looking forward to getting your message!</p>
						</motion.div>
					) : (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
						>
							<h1 className="uppercase text-2xl lg:text-4xl mb-4 md:mb-6 text-center">
								Send results
							</h1>
							<form
								className="flex flex-col gap-y-4"
								onSubmit={(e) => onSubmit(e)}
							>
								<div className="text-center">
									<p className="text-xl lg:text-2xl mb-1.5">
										Score: {currentScore}
									</p>
									<p className="mb-2">
										That's really good! If you want it even higher before
										sending it, go{" "}
										<Button buttonStyle="link" label="play" href="/" /> some
										more.
									</p>
								</div>
								<div>
									<Input
										value={senderName}
										label="Name"
										{...(!username && {
											onChange: (e) => {
												setSenderName(e.target.value);
											},
										})}
										{...(username && { readonly: true })}
										required={true}
									/>
								</div>
								<div>
									<Input
										value={email}
										label="E-mail address"
										type="email"
										onChange={(e) => {
											setEmail(e.target.value);
											setEmailError("");
										}}
										required={true}
									/>
									{emailError && (
										<p className="text-sm text-error">{emailError}</p>
									)}
								</div>
								<Input
									value={message}
									label="Message (if you'd like)"
									type="textarea"
									onChange={(e) => setMessage(e.target.value)}
								/>
								<input
									className="hidden"
									value={honey}
									onChange={(e) => setHoney(e.target.value)}
								/>
								<div className="flex flex-col items-center mt-4 md:mt-6">
									<div className="mb-6 text-center">
										<Button
											disabled={
												!senderName.length || !email.length || honey.length > 0
											}
											label={loading ? "Sending…" : "Send"}
											onClick={(e) => onSubmit(e)}
										/>
										{failed && (
											<p className="mt-4 text-error">
												Sorry, something went wrong. Please try again.
											</p>
										)}
									</div>
								</div>
							</form>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
};

export default SendResults;
