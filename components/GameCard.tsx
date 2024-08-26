import React from "react";
import Link from "next/link";
import SvgImage, { SvgImageMotifs } from "./ui/SvgImage";
import { getEnumValue, kebabToPascal } from "@/lib/helpers/formatting";
import { GameName } from "@/lib/types/game";
import styled from "styled-components";

interface GameCardProps {
	url: string;
	locked?: boolean;
}

const GameCard: React.FC<GameCardProps> = ({ url, locked = false }) => {
	const coverImage = !locked
		? getEnumValue(SvgImageMotifs, kebabToPascal(url))
		: null;

	const getImageContainerClasses = () => {
		let classes =
			"absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-scale duration-500 ease-bouncy-1 ";
		if (locked) classes += "w-full h-full -rotate-6 hover:-rotate-10 ";
		switch (url) {
			case GameName.Hangman:
				classes +=
					"w-[150%] h-[150%] lg:w-[200%] lg:h-[200%] -translate-y-1/3 hover:scale-110 hover:-rotate-6";
				break;
			case GameName.Memory:
				classes += "w-[115%] h-[115%] hover:scale-110 hover:rotate-6";
				break;
			case GameName.Puzzle:
				classes +=
					"w-[180%] h-[180%] -translate-x-[80%] hover:-translate-x-[20%]";
				break;
			case GameName.SendResults:
				classes += "rotate-5 w-[105%] h-[105%] hover:scale-110 hover:rotate-20";
				break;
			case GameName.ComingSoon:
				classes += "flex justify-center items-center";
				break;
		}
		return classes;
	};

	const crop = !locked && url != GameName.SendResults && url != GameName.Memory;

	return (
		<StyledLink
			className={`game-card border-military border-2 rounded-lg h-full aspect-square md:aspect-auto flex items-center justify-center relative ${
				locked ? "bg-cream" : "bg-lime"
			} ${crop ? "overflow-hidden" : "z-1"}`}
			href={locked ? "" : url}
		>
			<div className={getImageContainerClasses()}>
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
