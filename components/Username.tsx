import { GameContext } from "@/context/GameContext";
import { FormEvent, useCallback, useContext, useEffect, useState } from "react";
import Button from "./ui/Button";
import { AnimatePresence } from "framer-motion";
import Modal from "./ui/Modal";
import Input from "./ui/Input";
import { FirebaseContext } from "@/context/FirebaseContext";
import useUsername from "@/hooks/firebase/useUsername";
import { InfoContext } from "@/context/InfoContext";

export default function Username() {
	const { username, updateUsernameInFirebase } = useContext(GameContext);
	const { showUsernameModal, setShowUsernameModal } = useContext(InfoContext);
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
		if (showUsernameModal) {
			(document.querySelector("input#username") as HTMLInputElement)?.focus();
			presetInputValue();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [showUsernameModal]);

	/**
	 * On button click
	 */
	const onButtonClick = () => {
		setShowUsernameModal(true);
	};

	/**
	 * On username submit
	 */
	const onUsernameSubmit = async (e: FormEvent) => {
		e.preventDefault();
		await updateUsernameInFirebase(inputValue);
		setTimeout(() => {
			setShowUsernameModal(false);
		}, 100);
	};

	return signedIn ? (
		<div className="flex items-center mb-1 sm:mb-0.5">
			<p className="uppercase sm:text-lg font-alegreya leading-none mt-1">
				Username:
			</p>
			<div className="min-w-12 relative ml-2 mr-4 flex justify-center sm:text-lg leading-none">
				{username}
			</div>
			<Button buttonStyle="link" label="Change" onClick={onButtonClick} />
			<AnimatePresence>
				{showUsernameModal && (
					<Modal
						onClose={() => setShowUsernameModal(false)}
						motionKey="username-modal"
					>
						<div className="mb-6 lg:mb-10">
							<h2 className="text-xl lg:text-2xl uppercase mb-2 md:mb-3">
								Update username
							</h2>
							<p>You don&apos;t have to, but it&apos;s nice.</p>
						</div>
						<form onSubmit={(e) => e.preventDefault()}>
							<Input
								id="username"
								label="Username"
								className="mb-8 lg:mb-10"
								value={inputValue}
								onChange={(e) => {
									setInputValue(e.target.value);
								}}
								onClickEnter={onUsernameSubmit}
								setMimickActive={setMimickActive}
							/>
							<div className="mb-6 flex justify-center">
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
