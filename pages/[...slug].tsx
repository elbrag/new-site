import gamesData from "../lib/db/gamesData.json";
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
				`../components/games/${kebabToPascal(gameUrl)}/${kebabToCamel(
					gameUrl
				)}.tsx`
			),
		{
			loading: () => <p>Loading...</p>,
		}
	);

	return (
		<div>
			<div className="px-6 lg:px-12">
				<h1>{selectedGame.title}</h1>
				<GameComponent />
			</div>

			{/* <button onClick={() => updateScore(1)}>Add point</button>
			{currentScore} */}
		</div>
	);
};

export default GamePage;
