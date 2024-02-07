import Button from "@/components/ui/Button";
import React, { useState } from "react";

interface LetterInputProps {
	onClick: (inputValue: string) => void;
}

const LetterInput: React.FC<LetterInputProps> = ({ onClick }) => {
	const [inputValue, setInputValue] = useState("");
	return (
		<div className="letter-input flex items-center gap-4">
			<input
				type="text"
				className="text-3xl text-center p-3 focus:outline-none active:outline-none w-24 uppercase"
				maxLength={1}
				onKeyUp={(e) => {
					setInputValue(e.currentTarget.value);
				}}
			/>
			<Button
				label="Guess"
				onClick={() => {
					onClick(inputValue);
				}}
			/>
		</div>
	);
};

export default LetterInput;
