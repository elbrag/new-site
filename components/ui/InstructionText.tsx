import { motion } from "framer-motion";

const InstructionText: React.FC<{ className?: string; text: string }> = ({
	className,
	text,
}) => {
	return (
		<motion.div
			className={`instruction-text max-w-40 transform -mr-6 sm:mr-0 md:max-w-none origin-bottom-right ${className}`}
			initial={{ rotate: -100, scale: 0 }}
			animate={{ rotate: 0, scale: 1 }}
			transition={{
				duration: 0.3,
				delay: 1.5,
				ease: [0.68, 0.05, 0.27, 1.25],
			}}
		>
			<p className="rotate-5 text-sm md:text-base text-center">{text}</p>
		</motion.div>
	);
};

export default InstructionText;
