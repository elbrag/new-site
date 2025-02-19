import React, { useEffect, useState } from "react";
import LetterSlot from "./LetterSlot";
import Lodash from "./Lodash";
import {
	HangmanProgressCompletedProps,
	ProgressRoundProps,
} from "@/lib/types/progress";
import { motion } from "framer-motion";

interface RoundContentProps {
	motionKey: string;
	description: string;
	maskedWord: number[];
	roundStatus: ProgressRoundProps | null;
}

const RoundContent: React.FC<RoundContentProps> = ({
	motionKey,
	roundStatus,
	description,
	maskedWord,
}) => {
	const [signalUpdate, setSignalUpdate] = useState(false);
	const [mountDone, setMountDone] = useState(false);

	/**
	 * Get letter to show in slot
	 */
	const letterToShow = (index: number) => {
		const match = Array.isArray(roundStatus?.completed)
			? roundStatus?.completed.find(
					(c: HangmanProgressCompletedProps) => c.index === index
			  )
			: null;
		return match?.letter ?? null;
	};

	useEffect(() => {
		if (mountDone) {
			setSignalUpdate(true);
			setTimeout(() => {
				setSignalUpdate(false);
			}, 600);
		} else {
			setMountDone(true);
		}
	}, [roundStatus]);

	return (
		<motion.div
			className="w-full"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.5 }}
			key={motionKey}
		>
			<h2 className="text-center font-alegreya text-md md:text-lg mb-2 sm:mb-4">
				{description}
			</h2>
			<div
				className={`words pt-2 pb-4 sm:pt-6 sm:pb-6 flex gap-4 sm:gap-6 mb-10 sm:mb-12 lg:mb-14 flex-wrap justify-center transition-colors duration-200 ease-in-out ${
					signalUpdate ? "bg-lime" : "bg-transparent"
				}`}
			>
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
