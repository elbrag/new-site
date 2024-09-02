import React, { MouseEvent } from "react";

interface ButtonProps {
	label: string;
	onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
	href?: string;
	isSubmit?: boolean;
	buttonStyle?: "button" | "link";
	mimickHover?: boolean;
	mimickActive?: boolean;
}

const Button: React.FC<ButtonProps> = ({
	label,
	onClick,
	href,
	isSubmit = false,
	buttonStyle = "button",
	mimickHover,
	mimickActive,
}) => {
	const activeButtonClasses = [
		"shadow-button-click",
		"translate-x-px",
		"translate-y-[2px]",
		"shadow-military",
		"border-military",
		"text-military",
	];

	const _activeButtonClasses = activeButtonClasses.map((className) =>
		mimickActive ? className : `active:${className}`
	);

	const hoverButtonClasses = [
		"shadow-button-hover",
		"-translate-y-[2px]",
		"-translate-x-[2px]",
	];

	const _hoverButtonClasses = hoverButtonClasses.map((className) =>
		mimickHover ? className : `hover:${className}`
	);

	const buttonClasses = `px-6 py-3 uppercase lg:text-lg border-2 rounded-lg shadow-button 
	transition-all origin-left bg-lime text-military ease-bouncy-2 ${_hoverButtonClasses.join(
		" "
	)} ${_activeButtonClasses.join(" ")}`;

	const activeLinkClasses = `active:text-lime active:scale-100`;
	const hoverLinkClasses = `hover:rotate-4 hover:scale-110`;
	const linkClasses = `underline underline-offset-3 decoration-2 transition-all ease-bouncy-2 duration-200 text-sm lg:text-base ${activeLinkClasses} ${hoverLinkClasses}`;

	const classes = buttonStyle === "link" ? linkClasses : buttonClasses;

	return (
		<>
			{href ? (
				<a className={classes} href={href}>
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
					className={classes}
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
