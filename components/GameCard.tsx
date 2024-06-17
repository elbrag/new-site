import React from "react";
import Link from "next/link";
import SvgImage, { SvgImageMotifs } from "./ui/SvgImage";
import { getEnumValue, kebabToPascal } from "@/lib/helpers/formatting";

interface GameCardProps {
	url: string;
	locked?: boolean;
}

const GameCard: React.FC<GameCardProps> = ({ url, locked = false }) => {
	console.log(kebabToPascal(url));
	const coverImage = !locked
		? getEnumValue(SvgImageMotifs, kebabToPascal(url))
		: SvgImageMotifs.ComingSoon;
	return (
		<Link
			className={`game-card border-military border-015vw rounded-lg h-full flex items-center justify-center relative shadow-card ${
				locked ? "bg-paper" : "bg-lime"
			}`}
			href={locked ? "" : url}
		>
			{locked ? (
				<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -rotate-6">
					<SvgImage width={25} height={25} inVw={true} image={coverImage} />
				</div>
			) : (
				<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -rotate-6">
					<SvgImage width={25} height={25} inVw={true} image={coverImage} />
				</div>
			)}
		</Link>
	);
};

export default GameCard;
