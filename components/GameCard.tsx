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

	const getContainerClasses = (url: GameName) => {
		let classes =
			"w-full h-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ";
		if (locked) classes += " -rotate-6";
		switch (url) {
			case GameName.Hangman:
				classes += "";
				break;
			case GameName.Memory:
				classes += "";
				break;
			case GameName.Puzzle:
				classes += "";
				break;
			case GameName.SendResults:
				classes += "";
				break;
		}
		return classes;
	};

	return (
		<Link
			className={`game-card border-military border-015vw rounded-lg h-full aspect-square md:aspect-auto flex items-center justify-center relative shadow-card ${
				locked ? "bg-cream" : "bg-lime"
			}`}
			href={locked ? "" : url}
		>
			<div
				className={getContainerClasses(
					getEnumValue(GameName, kebabToPascal(url))
				)}
			>
				<SvgImage width={100} height={100} suffix="%" image={coverImage} />
			</div>
		</Link>
	);
};

export default GameCard;
