import React from "react";

interface ButtonProps {
	label: string;
	onClick?: (event: any) => void;
	href?: string;
	isSubmit?: boolean;
}

const Button: React.FC<ButtonProps> = ({
	label,
	onClick,
	href,
	isSubmit = false,
}) => {
	const activeClasses =
		"active:shadow-button-click active:translate-x-px active:translate-y-[2px] active:shadow-military active:border-military active:text-military";
	const hoverClasses =
		"hover:shadow-button-hover hover:-translate-y-[2px] hover:-translate-x-[2px]";
	const buttonClasses = `px-6 py-3 uppercase text-lg border-2 rounded-lg shadow-button transition-all origin-left bg-lime ${hoverClasses} ${activeClasses}`;

	return (
		<>
			{href ? (
				<a className={buttonClasses} href={href}>
					{label}
				</a>
			) : onClick || isSubmit ? (
				<button
					type={isSubmit ? "submit" : "button"}
					onClick={(e) => {
						if (onClick) {
							e.preventDefault();
							onClick(e);
						}
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
