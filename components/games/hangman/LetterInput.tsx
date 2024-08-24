import Button from "@/components/ui/Button";
import React, { ChangeEvent, useState } from "react";

interface LetterInputProps {
	onClick: (inputValue: string) => void;
}

const LetterInput: React.FC<LetterInputProps> = ({ onClick }) => {
	const [inputValue, setInputValue] = useState("");

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		const value = e.currentTarget.value;

		if (value === "" || value.match(/^[A-Öa-ö]$/)) {
			setInputValue(value);
		}
	};

	return (
		<div className="letter-input flex items-center gap-4">
			<input
				type="text"
				className="text-2xl text-center p-2 focus:outline-none active:outline-none w-20 uppercase border-military border-2 bg-paper"
				maxLength={1}
				onChange={(e) => handleInputChange(e)}
				value={inputValue}
			/>
			<Button
				label="Guess"
				onClick={() => {
					onClick(inputValue);
					setInputValue("");
				}}
			/>
		</div>
	);
};

export default LetterInput;
