import { GameContext } from "@/context/GameContext";
import React, { useContext } from "react";
import GameCard from "./GameCard";
import { GameName } from "@/lib/types/game";

const GameBoard: React.FC = () => {
	const { gameSlugs } = useContext(GameContext);

	return (
		<div className="game-board h-full w-full flex flex-grow">
			<div className="grid xs:grid-cols-2 md:grid-cols-3 lg:grid-rows-2 gap-4 p-4 h-full w-full">
				{gameSlugs.map((gameSlug, i) => (
					<li key={i}>
						<GameCard
							slug={gameSlug}
							locked={gameSlug === GameName.ComingSoon}
						/>
					</li>
				))}
			</div>
		</div>
	);
};

export default GameBoard;
