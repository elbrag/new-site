import { GameContext } from "@/context/GameContext";
import { useContext, useState } from "react";
import Button from "./ui/Button";
import { AnimatePresence } from "framer-motion";
import Modal from "./ui/Modal";
import Input from "./ui/Input";

export default function Username() {
	const [showModal, setShowModal] = useState(false);
	const { username, updateUsername } = useContext(GameContext);
	const [inputValue, setInputValue] = useState(username ?? "");

	const onUsernameSubmit = async (e: any) => {
		e.preventDefault();
		await updateUsername(inputValue);
		setShowModal(false);
	};

	return (
		<div className="flex items-center">
			<p className="uppercase text-lg font-alegreya">Username:</p>
			<div className="min-w-12 relative ml-2 mr-4 flex justify-center text-lg mb-1">
				{username}
			</div>
			<Button
				buttonStyle="link"
				label="Change"
				onClick={() => setShowModal(true)}
			/>
			<AnimatePresence>
				{showModal && (
					<Modal onClose={() => setShowModal(false)}>
						<h2 className="text-xl lg:text-2xl mb-10 uppercase">
							Update username
						</h2>
						<form onSubmit={(e) => onUsernameSubmit(e)}>
							<Input
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
