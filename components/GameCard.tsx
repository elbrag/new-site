import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import SvgImage, { SvgImageMotifs } from "./ui/SvgImage";
import { getEnumValue, kebabToPascal } from "@/lib/helpers/formatting";
import { GameName } from "@/lib/types/game";
import styled from "styled-components";
import { useInView } from "react-intersection-observer";
import { isMobile } from "react-device-detect";
import { ProgressContext } from "@/context/ProgressContext";
import { GameContext } from "@/context/GameContext";
import { AnimatePresence, motion } from "framer-motion";

interface GameCardProps {
	slug: GameName;
	locked?: boolean;
	index: number;
}

const GameCard: React.FC<GameCardProps> = ({ slug, locked = false, index }) => {
	// Cover image
	const coverImage = !locked
		? getEnumValue(SvgImageMotifs, kebabToPascal(`${slug}`))
		: null;

	const { progress } = useContext(ProgressContext);
	const { checkIfGameCompleted } = useContext(GameContext);
	const [gameCompleted, setGameCompleted] = useState(false);
	/**
	 * Check progress for this game
	 */
	useEffect(() => {
		const checkProgress = async () => {
			const gameIsCompleted = await checkIfGameCompleted(slug);
			setGameCompleted(gameIsCompleted);
		};
		checkProgress();
	}, [progress]);

	// Intersection observer
	const { ref, inView } = useInView({
		threshold: 1,
	});

	/**
	 * Image container classes
	 */
	const getImageContainerClasses = () => {
		let classes =
			"absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-scale transition-transform duration-500 ease-bouncy-1 ";

		switch (slug) {
			case GameName.Hangman:
				classes +=
					"w-[152%] h-[152%] md:w-[130%] md:h-[130%] lg:w-[170%] lg:h-[170%] xl:w-[200%] xl:h-[200%] -translate-y-1/3";
				break;
			case GameName.Memory:
				classes += "w-[115%] h-[115%]";
				break;
			case GameName.Puzzle:
				classes += "w-[180%] xl:w-[150%] max-h-full";
				break;
			case GameName.SendResults:
				classes += " w-[105%] h-[105%]";
				break;
			case GameName.ComingSoon:
				classes += "w-full h-full flex justify-center items-center";
				break;
		}

		return classes;
	};

	// Crop?
	const crop =
		!locked && slug != GameName.SendResults && slug != GameName.Memory;

	// Truly sorry to my future self for this class building, it's due to Tailwind dynamic class constraints. Don't forget to update everywhere when changes are made ;-;

	/**
	 * Non animated classes
	 */
	const getNonAnimatedClasses = () => {
		let nonAnimatedClasses = "";

		switch (slug) {
			case GameName.Hangman:
				nonAnimatedClasses = "";
				break;
			case GameName.Memory:
				nonAnimatedClasses = "";
				break;
			case GameName.Puzzle:
				nonAnimatedClasses = "-translate-x-[80%]";
				break;
			case GameName.SendResults:
				nonAnimatedClasses = "rotate-5";
				break;
			case GameName.ComingSoon:
				nonAnimatedClasses = "-rotate-6";
				break;
		}

		return nonAnimatedClasses;
	};

	/**
	 * Animated classes
	 */
	const getAnimatedClasses = () => {
		let animatedClasses = "";
		let animatedClassesHover = "";

		switch (slug) {
			case GameName.Hangman:
				animatedClasses = "scale-110 -rotate-8";
				animatedClassesHover = "hover:scale-110 hover:-rotate-8";
				break;
			case GameName.Memory:
				animatedClasses = "scale-105 rotate-6";
				animatedClassesHover = "hover:scale-105 hover:rotate-6";
				break;
			case GameName.Puzzle:
				animatedClasses = "-translate-x-[20%]";
				animatedClassesHover = "hover:-translate-x-[20%]";
				break;
			case GameName.SendResults:
				animatedClasses = "scale-105 rotate-15";
				animatedClassesHover = "hover:scale-105 hover:rotate-15";
				break;
			case GameName.ComingSoon:
				animatedClasses = "-rotate-10";
				animatedClassesHover = "hover:-rotate-10";
				break;
		}

		return isMobile
			? inView
				? animatedClasses
				: getNonAnimatedClasses()
			: `${getNonAnimatedClasses()} ${animatedClassesHover}`;
	};

	return (
		<StyledLink
			ref={ref}
			className={`game-card border-military border-2 rounded-lg h-full aspect-square md:aspect-auto flex items-center justify-center relative ${
				locked ? "bg-cream" : "bg-lime"
			} ${crop ? "overflow-hidden" : "z-1"}`}
			href={locked ? "" : slug}
		>
			<div className={`${getImageContainerClasses()} ${getAnimatedClasses()}`}>
				{coverImage ? (
					<SvgImage width={100} height={100} suffix="%" image={coverImage} />
				) : locked ? (
					<h2 className="text-2xl-vw xs:text-xl-vw md:text-lg-vw text-center uppercase leading-none w-full break-words">
						Coming soon
					</h2>
				) : (
					<></>
				)}
			</div>
			<AnimatePresence>
				{gameCompleted ? (
					<motion.div
						initial={{ rotate: -120, scale: 0, y: 12 }}
						animate={{ rotate: 0, scale: 1, y: 0 }}
						transition={{
							duration: 0.5,
							ease: [0.68, 0.05, 0.27, 1.25],
							delay: 0.2 * index,
						}}
						className="absolute bottom-2 right-3 text-lg xl:text-xl"
					>
						🏆
					</motion.div>
				) : (
					<></>
				)}
			</AnimatePresence>
		</StyledLink>
	);
};

export default GameCard;

const StyledLink = styled(Link)`
	svg {
		path,
		circle {
			stroke-width: 2px;
			stroke: #3c4d39;
		}
	}
`;
