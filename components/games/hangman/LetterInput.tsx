import Button from "@/components/ui/Button";
import React, {
	ChangeEvent,
	KeyboardEvent,
	useEffect,
	useRef,
	useState,
} from "react";

interface LetterInputProps {
	onClick: (inputValue: string) => void;
}

const LetterInput: React.FC<LetterInputProps> = ({ onClick }) => {
	const [inputValue, setInputValue] = useState("");
	const input = useRef<HTMLInputElement | null>(null);

	useEffect(() => {
		focusInput();
	}, []);

	/**
	 * Handle input change
	 */
	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		const value = e.currentTarget.value;

		if (value === "" || value.match(/^[A-Öa-ö]$/)) {
			setInputValue(value);
		}
	};

	/**
	 * Handle keydown
	 */
	const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" || e.keyCode === 13) {
			onSubmit();
		}
	};

	/**
	 * On Submit
	 */
	const onSubmit = () => {
		onClick(inputValue);
		setInputValue("");
		focusInput();
	};

	/**
	 * Focus letter input
	 */
	const focusInput = () => {
		input.current?.focus();
	};

	return (
		<div className="letter-input flex items-center gap-4">
			<input
				ref={input}
				id="letter"
				type="text"
				className="text-2xl text-center p-2 focus:outline-none active:outline-none w-20 uppercase border-military border-2 bg-paper"
				maxLength={1}
				onChange={(e) => handleInputChange(e)}
				onKeyDown={handleKeyDown}
				value={inputValue}
			/>
			<Button label="Guess" onClick={onSubmit} />
		</div>
	);
};

export default LetterInput;
