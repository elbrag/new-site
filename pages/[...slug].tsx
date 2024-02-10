import gamesData from "../lib/data/gamesData.json";
import { useRouter } from "next/router";
import { GameContext } from "@/context/GameContext";
import { Component, useContext } from "react";
import dynamic from "next/dynamic";
import { kebabToCamel, kebabToPascal } from "@/lib/helpers/formatting";

const GamePage = () => {
	const router = useRouter();
	const { slug } = router.query;
	const { updateScore, currentScore } = useContext(GameContext);

	if (!slug || slug.length !== 1) {
		return <div>Invalid URL</div>;
	}
	const gameUrl = slug[0];

	const selectedGame = gamesData.find((g) => g.url === gameUrl);

	if (!selectedGame) {
		return <div>Game not found</div>;
	}

	const GameComponent = dynamic(
		() =>
			import(
				`../components/games/${kebabToPascal(gameUrl)}/_${kebabToCamel(
					gameUrl
				)}.tsx`
			),
		{
			loading: () => (
				<div className="min-h-screen flex items-center justify-center">
					<p>Loading...</p>
				</div>
			),
		}
	);

	return (
		<div>
			<div className="px-6 lg:px-12 min-h-screen flex flex-col items-center justify-center">
				<div>
					<GameComponent />
				</div>
			</div>
		</div>
	);
};

export default GamePage;
