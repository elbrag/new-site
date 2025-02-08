import { wellDoneHeading } from "@/lib/helpers/messages";
import { HangmanRevealedRoundProps } from "@/lib/types/rounds";
import { motion } from "framer-motion";

interface FactsListProps {
	facts: HangmanRevealedRoundProps[];
}

const FactsList: React.FC<FactsListProps> = ({ facts }) => {
	return (
		<div className="flex flex-col items-center text-center">
			{facts.length ? (
				<h2 className="font-alegreya lg:text-lg mb-12">{wellDoneHeading}</h2>
			) : (
				<>
					<h2 className="mb-4 lg:mb-6">
						You didn&apos;t find anything out! ¯\_(ツ)_/¯
					</h2>
					<p className="font-alegreya lg:text-lg">
						But don&apos;t worry, I&apos;ll tell you over a cup of coffee!
					</p>
				</>
			)}
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
						<h3 className="text-base mb-2">{fact.description}</h3>
						<p className="text-lg lg:text-xl">✨ {fact.answer} ✨</p>
					</motion.li>
				))}
			</ul>
		</div>
	);
};

export default FactsList;
