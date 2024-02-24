import React from "react";
import Link from "next/link";
import Icon, { IconTypes } from "./ui/Icon";

interface GameCardProps {
	url: string;
	locked?: boolean;
}

const GameCard: React.FC<GameCardProps> = ({ url, locked = false }) => {
	return (
		<Link
			className={`game-card border-military border-015vw rounded-lg h-full flex items-center justify-center relative shadow-card ${
				locked ? "bg-paper" : "bg-lime"
			}`}
			href={locked ? "" : url}
		>
			{locked && (
				<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -rotate-6">
					<Icon
						width={25}
						height={25}
						inVw={true}
						icon={IconTypes.ComingSoon}
					/>
				</div>
			)}
		</Link>
	);
};

export default GameCard;
