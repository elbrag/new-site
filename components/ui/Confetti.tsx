import { motion } from "framer-motion";
import React from "react";
import shuffle from "lodash/shuffle";

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

	const getConfettiArray = () => {
		const array = [];
		for (const confetti of confettiColors) {
			for (let i = 0; i < 20; i++) {
				array.push(confetti);
			}
		}
		return shuffle(array);
	};

	return (
		<div className="confetti hidden w-screen h-screen flex justify-center items-center">
			<div className="flex items-center justify-center">
				{getConfettiArray().map((color, i) => (
					<motion.span
						key={`color-${color}-${i}`}
						className={`inline w-4 h-4 bg-confetti-${color}`}
					></motion.span>
				))}
			</div>
		</div>
	);
};

export default Confetti;
