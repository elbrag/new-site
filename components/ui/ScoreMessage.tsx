import { motion } from "framer-motion";
import React from "react";

interface ScoreMessageProps {
	text: string;
}

const ScoreMessage: React.FC<ScoreMessageProps> = ({ text }) => {
	const translate = { translateX: "-50%", translateY: "-50%" };
	return (
		<motion.div
			key={text}
			initial={{
				rotate: -30,
				scale: 0,
				...translate,
			}}
			animate={{
				rotate: 10,
				scale: 1,
				...translate,
			}}
			exit={{ rotate: -30, scale: 0, ...translate }}
			transition={{ duration: 0.5 }}
			className="absolute top-1/2 left-1/2 -translate-x-full -translate-y-full rounded-xl bg-lime text-military py-0.5 px-1"
		>
			{text}
		</motion.div>
	);
};

export default ScoreMessage;
