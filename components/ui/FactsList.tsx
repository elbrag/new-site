import { motion } from "framer-motion";

interface FactsListProps {
	facts: String[];
}

const FactsList: React.FC<FactsListProps> = ({ facts }) => {
	return (
		<div>
			<ul>
				{facts.map((fact, index) => (
					<motion.li
						style={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{
							delay: 0.1 * index,
							duration: 0.6,
							ease: "easeInOut",
						}}
						key={`${fact}`}
					>
						{fact}
					</motion.li>
				))}
			</ul>
		</div>
	);
};

export default FactsList;
