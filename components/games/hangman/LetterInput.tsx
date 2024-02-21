import Button from "@/components/ui/Button";
import React, { useState } from "react";

interface LetterInputProps {
	onClick: (inputValue: string) => void;
}

const LetterInput: React.FC<LetterInputProps> = ({ onClick }) => {
	const [inputValue, setInputValue] = useState("");

	const handleInputChange = (e: any) => {
		const value = e.currentTarget.value;

		if (value === "" || value.match(/^[A-Za-z]$/)) {
			setInputValue(value);
		}
	};

	return (
		<div className="letter-input flex items-center gap-4">
			<input
				type="text"
				className="text-3xl text-center p-3 focus:outline-none active:outline-none w-24 uppercase"
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
