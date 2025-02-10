import React, { useEffect } from "react";
import Link from "next/link";
import SvgImage, { SvgImageMotifs } from "./ui/SvgImage";
import { getEnumValue, kebabToPascal } from "@/lib/helpers/formatting";
import { GameName } from "@/lib/types/game";
import styled from "styled-components";
import { useInView } from "react-intersection-observer";
import { isMobile } from "react-device-detect";

interface GameCardProps {
	url: string;
	locked?: boolean;
}

const GameCard: React.FC<GameCardProps> = ({ url, locked = false }) => {
	const coverImage = !locked
		? getEnumValue(SvgImageMotifs, kebabToPascal(url))
		: null;

	const { ref, inView, entry } = useInView({
		threshold: 0.8,
	});

	const getImageContainerClasses = () => {
		let classes =
			"absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-scale transition-transform duration-500 ease-bouncy-1 ";

		switch (url) {
			case GameName.Hangman:
				classes += "w-[150%] h-[150%] lg:w-[200%] lg:h-[200%] -translate-y-1/3";
				//lg:hover:scale-110 lg:hover:-rotate-8
				break;
			case GameName.Memory:
				classes += "w-[115%] h-[115%] ";
				//lg:hover:scale-110 lg:hover:rotate-6
				break;
			case GameName.Puzzle:
				classes +=
					"w-[180%] h-[180%] xl:w-[150%] xl:h-[150%] -translate-x-[80%]";
				//lg:hover:-translate-x-[20%]
				break;
			case GameName.SendResults:
				classes += " w-[105%] h-[105%] rotate-5";
				//lg:rotate-5 lg:hover:scale-110 lg:hover:rotate-20
				break;
			case GameName.ComingSoon:
				classes += "w-full h-full flex justify-center items-center -rotate-6";
				//lg:rotate-6
				break;
		}

		return classes;
	};

	const crop = !locked && url != GameName.SendResults && url != GameName.Memory;

	const getNonAnimatedClasses = () => {
		let nonAnimatedClasses = "";

		switch (url) {
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

	const getAnimatedClasses = () => {
		let animatedClasses = "";
		let animatedClassesHover = "";

		switch (url) {
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
			: animatedClassesHover;
	};

	useEffect(() => {
		console.log("inview", url);
	}, [inView]);

	return (
		<StyledLink
			ref={ref}
			className={`game-card border-military border-2 rounded-lg h-full aspect-square md:aspect-auto flex items-center justify-center relative ${
				locked ? "bg-cream" : "bg-lime"
			} ${crop ? "overflow-hidden" : "z-1"}`}
			href={locked ? "" : url}
		>
			<div className={`${getImageContainerClasses()} ${getAnimatedClasses()}`}>
				{coverImage ? (
					<SvgImage width={100} height={100} suffix="%" image={coverImage} />
				) : locked ? (
					<h2 className="text-4xl lg:text-7xl text-center uppercase leading-none w-full break-words">
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
