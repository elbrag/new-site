import React from "react";

interface InputProps {
	value: any;
	label: string;
	type?: "text" | "number" | "email" | "password";
	placeholder?: string;
	className?: string;
	onChange: (e: any) => void;
}

const Input: React.FC<InputProps> = ({
	value,
	label,
	type = "text",
	placeholder,
	className,
	onChange,
}) => {
	return (
		<label className={`w-full block ${className}`}>
			<div className="mb-1.5 font-alegreya uppercase">{label}</div>
			<input
				className="border-2 border-military block w-full lg:text-lg px-4 py-2 bg-paper"
				type={type}
				placeholder={placeholder}
				value={value}
				onChange={onChange}
			/>
		</label>
	);
};

export default Input;
