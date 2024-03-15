import { HangmanRevealedRoundProps } from "@/lib/types/rounds";
import { motion } from "framer-motion";

interface FactsListProps {
	heading?: string;
	facts: HangmanRevealedRoundProps[];
}

const FactsList: React.FC<FactsListProps> = ({ facts, heading }) => {
	return (
		<div className="flex flex-col items-center text-center">
			{heading && <h2 className="font-alegreya lg:text-lg mb-12">{heading}</h2>}
			<ul>
				{facts.map((fact, index) => (
					<motion.li
						className="mb-8"
						style={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{
							delay: 0.25 * index,
							duration: 0.6,
							ease: "easeInOut",
						}}
						key={`fact-${fact.roundId}`}
					>
						<h3 className="text-lg lg:text-xl mb-4">{fact.description}</h3>
						<p className="text-md">{fact.answer}</p>
					</motion.li>
				))}
			</ul>
		</div>
	);
};

export default FactsList;
