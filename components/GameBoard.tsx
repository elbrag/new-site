import { GameContext } from "@/context/GameContext";
import React, { useContext } from "react";
import GameCard from "./GameCard";

const GameBoard: React.FC = () => {
	const { gameUrls } = useContext(GameContext);

	return (
		<div className="game-board h-full w-full flex flex-grow">
			<div className="grid xs:grid-cols-2 md:grid-cols-3 lg:grid-rows-2 gap-4 p-4 h-full w-full">
				{gameUrls.map((gameUrl, i) => (
					<li key={i}>
						<GameCard url={gameUrl} locked={gameUrl === "coming-soon"} />
					</li>
				))}
			</div>
		</div>
	);
};

export default GameBoard;
