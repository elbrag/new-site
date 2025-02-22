import { motion } from "framer-motion";
import React from "react";

interface ScoreToastProps {
	text: string;
}

const ScoreToast: React.FC<ScoreToastProps> = ({ text }) => {
	return (
		<motion.div
			key={text}
			initial={{
				rotate: -180,
				scale: 0,
				y: "-4rem",
			}}
			animate={{
				rotate: 10,
				scale: 1,
				y: 0,
			}}
			exit={{ rotate: -180, scale: 0, y: "-4rem" }}
			transition={{ duration: 0.5 }}
			className="fixed z-2 top-20 md:top-22 xl:top-24 2xl:top-28 right-6 sm:right-8 rounded-xl bg-lime text-military py-0.5 px-1"
		>
			{text}
		</motion.div>
	);
};

export default ScoreToast;
