import useInfoMessage from "@/hooks/useInfoMessage";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

const Error404: React.FC = () => {
	const [mounted, setMounted] = useState(false);
	const [youWon, setYouWon] = useState(false);

	const winningNumbers: number[] = [4, 0, 4];

	useEffect(() => {
		setMounted(true);
	}, []);

	const numberList = (winner: number) => {
		const array = [];
		for (let i = 0; i <= 9; i++) {
			array.push(i);
		}

		const halfLength = Math.floor(array.length / 2);
		const start = winner - halfLength;

		return array
			.slice(start < 0 ? array.length + start : start)
			.concat(array.slice(0, start < 0 ? array.length + start : start));
	};

	const onAnimationEnd = (i: number) => {
		if (i === winningNumbers.length - 1) {
			setTimeout(() => {
				setYouWon(true);
			}, 1000);
		}
	};

	return (
		<AnimatePresence>
			{mounted && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					className="min-h-50vh md:min-h-80vh flex flex-col justify-center items-center w-full max-w-200 mx-auto"
				>
					<div className="flex justify-between items-end w-full px-6 min-h-20 md:min-h-30">
						{youWon && (
							<>
								<p className="text-xl md:text-2xl transform animate-wiggle2">
									BIG ERROR
								</p>
								<p className="text-lg md:text-xl transform animate-wiggle3">
									0 points
								</p>
							</>
						)}
					</div>
					<div className="flex flex-grow flex-col justify-center my-12 md:my-8 2xl:my-12">
						<div
							className={`overflow-hidden px-6 border-military border-2 h-40 md:h-60 flex flex-col justify-center transition-colors ${
								youWon ? "animate-blinkColors" : "bg-paper"
							}`}
						>
							<ul className="flex">
								{winningNumbers.map((winner, i) => (
									<motion.li
										className="px-2 pb-20 md:pb-32"
										key={`winner-${i}`}
										initial={{ y: `${(Math.random() * (30 - 10) + 10) * -1}%` }}
										animate={{ y: 0 }}
										transition={{
											duration: 0.6 + i * 0.4,
											delay: 0.5 + (0.25 * i + 1),
											ease: [0.2, 1, 0.4, 1.15],
										}}
										onAnimationComplete={() => onAnimationEnd(i)}
									>
										<ul className="flex flex-col gap-2">
											{numberList(winner).map((nr, i) => (
												<li
													className="bg-yellow text-military h-18 w-16 md:h-28 md:w-24 flex items-center justify-center rounded-lg text-2xl md:text-4xl box-content"
													key={`slot-${i}`}
												>
													{nr}
												</li>
											))}
										</ul>
									</motion.li>
								))}
							</ul>
						</div>
					</div>
					<div className="flex flex-col md:flex-row justify-between items-start w-full px-6 min-h-20 md:min-h-30">
						{youWon && (
							<>
								<div>
									<div
										className={`bg-military border-4 border-lime px-1 text-stroke rounded-lg -rotate-4 text-lime text-xl md:text-4xl md:px-4 md:ml-4 animate-wiggle1 md:-mt-8`}
									>
										BROKE
									</div>
								</div>
								<Link
									href="/"
									aria-label="Home"
									className="text-lg md:text-xl transform rotate-8 md:mb-6 underline hover:rotate-4 transition-transform ease-bouncy-2 ml-auto duration-200"
								>
									Back home
								</Link>
							</>
						)}
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default Error404;
