import React from "react";
import LetterSlot from "./LetterSlot";
import Lodash from "./Lodash";
import {
	HangmanProgressCompletedProps,
	ProgressQuestionProps,
} from "@/lib/types/progress";
import { motion } from "framer-motion";

interface RoundContentProps {
	key: string;
	description: string;
	maskedWord: any;
	questionStatus: ProgressQuestionProps | null;
}

const RoundContent: React.FC<RoundContentProps> = ({
	key,
	questionStatus,
	description,
	maskedWord,
}) => {
	/**
	 * Get letter to show in slot
	 */
	const letterToShow = (index: number) => {
		const match = questionStatus?.completed.find(
			(c: HangmanProgressCompletedProps) => c.index === index
		);
		return match?.letter ?? null;
	};

	return (
		<motion.div
			className="w-full"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.5 }}
			key={key}
		>
			<h2 className="text-center font-alegreya text-lg mb-10">{description}</h2>
			<div className="words flex gap-6 mb-16 flex-wrap justify-center">
				{(() => {
					let indexOutOfTotal = 0;
					return maskedWord.map((wordCount: number, i: number) => {
						return (
							<div className="word flex gap-1" key={`word-${i}`}>
								{Array.from({
									length: wordCount,
								}).map((_, index) => {
									const curIndex = indexOutOfTotal;
									indexOutOfTotal++;
									return (
										<div
											className="letter flex flex-col items-center"
											key={`letter-${index}`}
										>
											<LetterSlot letter={letterToShow(curIndex)} />
											<Lodash />
										</div>
									);
								})}
							</div>
						);
					});
				})()}
			</div>
		</motion.div>
	);
};

export default RoundContent;
