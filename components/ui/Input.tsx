import React, { ChangeEvent, FormEvent, KeyboardEvent, useState } from "react";

interface InputProps {
	id?: string;
	value: string | number;
	label: string;
	type?: "text" | "number" | "email" | "password";
	placeholder?: string;
	className?: string;
	onChange: (e: ChangeEvent<HTMLInputElement>) => void;
	onClickEnter?: (e: FormEvent<Element>) => void;
	setMimickActive?: React.Dispatch<React.SetStateAction<boolean>>;
}

const Input: React.FC<InputProps> = ({
	id,
	value,
	label,
	type = "text",
	placeholder,
	className,
	onChange,
	onClickEnter,
	setMimickActive,
}) => {
	const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (!onClickEnter) return;
		if (e.key === "Enter" || e.keyCode === 13) {
			if (setMimickActive) setMimickActive(true);
			onClickEnter(e);
			setTimeout(() => {
				if (setMimickActive) setMimickActive(false);
			}, 200);
		}
	};

	return (
		<label className={`w-full block ${className}`}>
			<div className="mb-1.5 font-alegreya uppercase">{label}</div>
			<input
				id={id}
				className="border-2 border-military block w-full lg:text-lg px-4 py-2 bg-paper"
				type={type}
				placeholder={placeholder}
				value={value}
				onChange={onChange}
				onKeyDown={handleKeyDown}
			/>
		</label>
	);
};

export default Input;
