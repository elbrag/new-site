import { motion } from "framer-motion";
import React from "react";

interface SuccessScreenProps {
	text: string;
}

const SuccessScreen: React.FC<SuccessScreenProps> = ({ text }) => {
	return (
		<motion.div
			key={text}
			initial={{ rotate: -30, scale: 0 }}
			animate={{ rotate: 10, scale: 1 }}
			exit={{ rotate: -30, scale: 0 }}
			transition={{ duration: 0.5 }}
			className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center"
		>
			<div className="px-12 py-8 bg-yellow text-2xl rounded-xl">{text}</div>
		</motion.div>
	);
};

export default SuccessScreen;
