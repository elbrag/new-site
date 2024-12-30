import { motion } from "framer-motion";
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

	return mounted ? (
		<div className="min-h-80vh flex flex-col justify-center items-center">
			<div
				className={`overflow-hidden px-6 border-military border-2 h-60 flex flex-col justify-center transition-colors ${
					youWon ? "animate-blink" : "bg-paper"
				}`}
			>
				<ul className="flex">
					{winningNumbers.map((winner, i) => (
						<motion.li
							className="px-2 pb-34"
							key={`winner-${i}`}
							initial={{ y: `${(Math.random() * (35 - 16) + 16) * -1}%` }}
							animate={{ y: 0 }}
							transition={{
								duration: 0.6 + i * 0.4,
								delay: 0.5 + (0.25 * i + 1),
								ease: [0.2, 1, 0.4, 1.15],
							}}
							onAnimationComplete={() => {
								if (i === winningNumbers.length - 1) {
									setTimeout(() => {
										setYouWon(true);
									}, 1000);
								}
							}}
						>
							<ul className="flex flex-col gap-2">
								{numberList(winner).map((nr, i) => (
									<li
										className="bg-yellow text-military h-32 w-28 flex items-center justify-center rounded-lg text-3xl box-content"
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
	) : (
		<></>
	);
};

export default Error404;
