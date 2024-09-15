import { motion } from "framer-motion";
import React from "react";

interface InfoMessageProps {
	text: string;
}

const InfoMessage: React.FC<InfoMessageProps> = ({ text }) => {
	return (
		<motion.div
			key={text}
			initial={{ rotate: -30, scale: 0 }}
			animate={{ rotate: 10, scale: 1 }}
			exit={{ rotate: -30, scale: 0 }}
			transition={{ duration: 0.5 }}
			className="absolute top-0 left-0 py-3 px-4 sm:px-6 sm:py-4 rounded-xl bg-lime max-w-40 min-w-40 text-sm sm:text-base"
		>
			{text}
		</motion.div>
	);
};

export default InfoMessage;
