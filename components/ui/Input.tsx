import React, { ChangeEvent, KeyboardEvent } from "react";

interface InputProps {
	id?: string;
	value: string | number;
	label: string;
	type?: "text" | "number" | "email" | "password";
	placeholder?: string;
	className?: string;
	onChange: (e: ChangeEvent<HTMLInputElement>) => void;
	onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({
	id,
	value,
	label,
	type = "text",
	placeholder,
	className,
	onChange,
	onKeyDown,
}) => {
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
				onKeyDown={onKeyDown}
			/>
		</label>
	);
};

export default Input;
