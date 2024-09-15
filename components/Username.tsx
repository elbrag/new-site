import { GameContext } from "@/context/GameContext";
import { FormEvent, useCallback, useContext, useEffect, useState } from "react";
import Button from "./ui/Button";
import { AnimatePresence } from "framer-motion";
import Modal from "./ui/Modal";
import Input from "./ui/Input";
import { FirebaseContext } from "@/context/FirebaseContext";

export default function Username() {
	const [showModal, setShowModal] = useState(false);
	const { username, updateUsernameInFirebase } = useContext(GameContext);
	const { signedIn } = useContext(FirebaseContext);
	const [inputValue, setInputValue] = useState(username ?? "");
	const [mimickActive, setMimickActive] = useState(false);

	/**
	 * Set input value to username from context if it exists
	 */
	const presetInputValue = useCallback(() => {
		if (username && !inputValue) setInputValue(username);
	}, [inputValue, username]);

	useEffect(() => {
		presetInputValue();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	/**
	 * Focus input field when modal is open
	 */
	useEffect(() => {
		if (showModal) {
			(document.querySelector("input#username") as HTMLInputElement)?.focus();
			presetInputValue();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
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
		setTimeout(() => {
			setShowModal(false);
		}, 100);
	};

	return signedIn ? (
		<div className="flex items-center">
			<p className="uppercase sm:text-lg font-alegreya leading-none">
				Username:
			</p>
			<div className="min-w-12 relative ml-2 mr-4 flex justify-center sm:text-lg mb-1 leading-none">
				{username}
			</div>
			<Button buttonStyle="link" label="Change" onClick={onButtonClick} />
			<AnimatePresence>
				{showModal && (
					<Modal onClose={() => setShowModal(false)} motionKey="username-modal">
						<h2 className="text-xl lg:text-2xl mb-10 uppercase">
							Update username
						</h2>
						<form onSubmit={(e) => e.preventDefault()}>
							<Input
								id="username"
								label="Username"
								className="mb-10"
								value={inputValue}
								onChange={(e) => {
									setInputValue(e.target.value);
								}}
								onClickEnter={onUsernameSubmit}
								setMimickActive={setMimickActive}
							/>
							<div className="mb-8 flex justify-center">
								<Button
									label="Update"
									onClick={onUsernameSubmit}
									mimickActive={mimickActive}
									mimickHover={inputValue?.length > 0}
								/>
							</div>
						</form>
					</Modal>
				)}
			</AnimatePresence>
		</div>
	) : (
		<></>
	);
}
