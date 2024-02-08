import React from "react";

interface ButtonProps {
	label: string;
	onClick?: (event: any) => void;
	href?: string;
}

const Button: React.FC<ButtonProps> = ({ label, onClick, href }) => {
	const activeClasses =
		"active:shadow-button-click active:translate-x-px active:translate-y-[2px] active:shadow-lime active:border-lime active:text-lime";
	const hoverClasses =
		"hover:shadow-button-hover hover:-translate-y-[2px] hover:-translate-x-[2px]";
	const buttonClasses = `px-6 py-3 uppercase text-lg border-2 rounded-lg shadow-button transition-all origin-left ${hoverClasses} ${activeClasses}`;

	return (
		<>
			{href ? (
				<a className={buttonClasses} href={href}>
					{label}
				</a>
			) : onClick ? (
				<button
					type="button"
					onClick={(e) => {
						e.preventDefault();
						onClick(e);
					}}
					className={buttonClasses}
				>
					{label}
				</button>
			) : (
				<></>
			)}
		</>
	);
};

export default Button;
