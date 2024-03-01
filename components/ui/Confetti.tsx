import React from "react";

interface ConfettiProps {}

const Confetti: React.FC<ConfettiProps> = ({}) => {
	const confettiColors = [
		"blue",
		"green",
		"yellow",
		"orange",
		"red",
		"pink",
		"purple",
	];

	return (
		<div className="confetti fixed w-screen h-screen flex justify-center items-center">
			<div className="flex">
				{Array.from(confettiColors).map((color, i) => (
					<span
						key={`color-${color}-${i}`}
						className={`inline-block w-4 h-4 bg-confetti-${color}`}
					></span>
				))}
			</div>
		</div>
	);
};

export default Confetti;
