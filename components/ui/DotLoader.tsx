import { motion } from "framer-motion";

const DotLoader: React.FC = () => {
	return (
		<div className="h-24 flex flex-col justify-end items-center">
			<motion.div
				initial={{ rotate: 0, y: 0 }}
				animate={{
					y: ["0%", "-200%", "0%"],
					rotate: [0, 180, 360],
				}}
				transition={{
					duration: 0.7,
					repeat: Infinity,
					repeatType: "reverse",
					repeatDelay: 0.4,
					ease: "easeInOut",
				}}
				className="dot w-4 h-4 bg-military"
			></motion.div>
		</div>
	);
};

export default DotLoader;
