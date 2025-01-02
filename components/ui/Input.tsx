import React, { ChangeEvent, FormEvent, KeyboardEvent, useState } from "react";

interface InputProps {
	id?: string;
	value: string | number;
	label: string;
	type?: "text" | "number" | "email" | "password" | "textarea";
	placeholder?: string;
	className?: string;
	readonly?: boolean;
	required?: boolean;
	onChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
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
	readonly = false,
	required = false,
	onChange,
	onClickEnter,
	setMimickActive,
}) => {
	const handleKeyDown = (
		e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		if (!onClickEnter) return;
		if (e.key === "Enter" || e.keyCode === 13) {
			if (setMimickActive) setMimickActive(true);
			onClickEnter(e);
			setTimeout(() => {
				if (setMimickActive) setMimickActive(false);
			}, 200);
		}
	};

	const Component = type === "textarea" ? "textarea" : "input";

	return (
		<label className={`w-full text-left block ${className}`}>
			<div className="mb-1.5 font-alegreya uppercase">{label}</div>
			<Component
				id={id}
				className={`border-2 border-military block w-full lg:text-lg p-2 md:px-4 md:py-2 ${
					readonly ? "bg-line2 cursor-not-allowed" : "bg-paper"
				}`}
				type={type}
				placeholder={placeholder}
				value={value}
				onChange={onChange}
				onKeyDown={handleKeyDown}
				readOnly={readonly}
				required={required}
			/>
		</label>
	);
};

export default Input;
