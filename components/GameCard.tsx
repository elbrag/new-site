import React, { useContext, useEffect } from "react";
import Link from "next/link";
import SvgImage, { SvgImageMotifs } from "./ui/SvgImage";
import { getEnumValue, kebabToPascal } from "@/lib/helpers/formatting";
import { GameName } from "@/lib/types/game";
import styled from "styled-components";
import { useInView } from "react-intersection-observer";
import { isMobile } from "react-device-detect";
import { ProgressContext } from "@/context/ProgressContext";

interface GameCardProps {
	slug: GameName;
	locked?: boolean;
}

const GameCard: React.FC<GameCardProps> = ({ slug, locked = false }) => {
	// Cover image
	const coverImage = !locked
		? getEnumValue(SvgImageMotifs, kebabToPascal(`${slug}`))
		: null;

	const { progress, getGameProgress } = useContext(ProgressContext);

	/**
	 * Check progress for this game
	 */
	useEffect(() => {
		const checkProgress = async () => {
			const gameProgress = await getGameProgress(slug, progress);
			console.log(gameProgress);
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
				classes += "w-[150%] h-[150%] lg:w-[200%] lg:h-[200%] -translate-y-1/3";
				break;
			case GameName.Memory:
				classes += "w-[115%] h-[115%]";
				break;
			case GameName.Puzzle:
				classes += "w-[180%] h-[180%] xl:w-[150%] xl:h-[150%]";
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
				animatedClasses = "scale-110 rotate-6";
				animatedClassesHover = "hover:scale-110 hover:rotate-6";
				break;
			case GameName.Puzzle:
				animatedClasses = "-translate-x-[20%]";
				animatedClassesHover = "hover:-translate-x-[20%]";
				break;
			case GameName.SendResults:
				animatedClasses = "scale-110 rotate-20";
				animatedClassesHover = "hover:scale-110 hover:rotate-20";
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
