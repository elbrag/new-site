import React from "react";
import Link from "next/link";
import SvgImage, { SvgImageMotifs } from "./ui/SvgImage";
import { getEnumValue, kebabToPascal } from "@/lib/helpers/formatting";
import { GameName } from "@/lib/types/game";

interface GameCardProps {
	url: string;
	locked?: boolean;
}

const GameCard: React.FC<GameCardProps> = ({ url, locked = false }) => {
	const coverImage = !locked
		? getEnumValue(SvgImageMotifs, kebabToPascal(url))
		: SvgImageMotifs.ComingSoon;

	const getImageContainerClasses = () => {
		let classes =
			"absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-scale duration-500 ease-bouncy-1 ";
		if (locked) classes += "w-full h-full -rotate-6 hover:-rotate-10";
		switch (url) {
			case GameName.Hangman:
				classes +=
					"w-[200%] h-[200%] -translate-y-1/3 hover:scale-110 hover:-rotate-6";
				break;
			case GameName.Memory:
				classes += "w-[115%] h-[115%] hover:scale-110 hover:rotate-6";
				break;
			case GameName.Puzzle:
				classes +=
					"w-[200%] h-[200%] -translate-x-[80%] hover:-translate-x-[20%]";
				break;
			case GameName.SendResults:
				classes += "w-[110%] h-[110%] hover:scale-110 hover:rotate-20";
				break;
		}
		return classes;
	};

	const crop = !locked && url != GameName.SendResults && url != GameName.Memory;

	return (
		<Link
			className={`game-card border-military border-015vw rounded-lg h-full aspect-square md:aspect-auto flex items-center justify-center relative shadow-card ${
				locked ? "bg-cream" : "bg-lime"
			} ${crop ? "overflow-hidden" : "z-1"}`}
			href={locked ? "" : url}
		>
			{coverImage && (
				<div className={getImageContainerClasses()}>
					<SvgImage width={100} height={100} suffix="%" image={coverImage} />
				</div>
			)}
		</Link>
	);
};

export default GameCard;
