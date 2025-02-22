import { motion } from "framer-motion";
import React from "react";

interface FailedScreenProps {
	text: string;
}

const FailedScreen: React.FC<FailedScreenProps> = ({ text }) => {
	return (
		<motion.div
			key={text}
			initial={{ rotate: -30, scale: 0 }}
			animate={{ rotate: 10, scale: 1 }}
			exit={{ rotate: -30, scale: 0 }}
			transition={{ duration: 0.5 }}
			className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center z-20"
		>
			<div className="px-8 py-4 sm:px-12 sm:py-8 text-lg sm:text-2xl bg-military text-lime rounded-xl select-none">
				{text}
			</div>
		</motion.div>
	);
};

export default FailedScreen;
