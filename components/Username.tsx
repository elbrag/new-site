import { GameContext } from "@/context/GameContext";
import { FormEvent, useContext, useEffect, useState } from "react";
import Button from "./ui/Button";
import { AnimatePresence } from "framer-motion";
import Modal from "./ui/Modal";
import Input from "./ui/Input";

export default function Username() {
	const [showModal, setShowModal] = useState(false);
	const { username, updateUsernameInFirebase } = useContext(GameContext);
	const [inputValue, setInputValue] = useState(username ?? "");

	/**
	 * Set input value to username from context if it exists
	 */
	useEffect(() => {
		if (username && !inputValue) setInputValue(username);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	/**
	 * Focus input field when modal is open
	 */
	useEffect(() => {
		if (showModal)
			(document.querySelector("input#username") as HTMLInputElement)?.focus();
	}, [showModal]);

	/**
	 * On button click
	 */
	const onButtonClick = () => {
		setShowModal(true);
	};

	/**
	 * On username submit
	 */
	const onUsernameSubmit = async (e: FormEvent) => {
		e.preventDefault();
		await updateUsernameInFirebase(inputValue);
		setShowModal(false);
	};

	return (
		<div className="flex items-center">
			<p className="uppercase text-lg font-alegreya">Username:</p>
			<div className="min-w-12 relative ml-2 mr-4 flex justify-center text-lg mb-1">
				{username}
			</div>
			<Button buttonStyle="link" label="Change" onClick={onButtonClick} />
			<AnimatePresence>
				{showModal && (
					<Modal onClose={() => setShowModal(false)} motionKey="username-modal">
						<h2 className="text-xl lg:text-2xl mb-10 uppercase">
							Update username
						</h2>
						<form onSubmit={(e) => onUsernameSubmit(e)}>
							<Input
								id="username"
								label="Username"
								className="mb-10"
								value={inputValue}
								onChange={(e) => {
									setInputValue(e.target.value);
								}}
							/>

							<div className="mb-8 flex justify-center">
								<Button label="Update" isSubmit={true} />
							</div>
						</form>
					</Modal>
				)}
			</AnimatePresence>
		</div>
	);
}
