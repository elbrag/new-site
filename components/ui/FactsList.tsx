import { HangmanRevealedRoundProps } from "@/lib/types/rounds";
import { motion } from "framer-motion";

interface FactsListProps {
	facts: HangmanRevealedRoundProps[];
}

const FactsList: React.FC<FactsListProps> = ({ facts }) => {
	return (
		<div>
			<ul>
				{facts.map((fact, index) => (
					<motion.li
						className="mb-8"
						style={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{
							delay: 0.1 * index,
							duration: 0.6,
							ease: "easeInOut",
						}}
						key={`fact-${fact.roundId}`}
					>
						<h3 className="text-xl mb-4">{fact.description}</h3>
						<p>{fact.answer}</p>
					</motion.li>
				))}
			</ul>
		</div>
	);
};

export default FactsList;
