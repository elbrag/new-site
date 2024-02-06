import gamesData from "../lib/db/gamesData.json";
import { useRouter } from "next/router";
import { GameContext } from "@/context/GameContext";
import { useContext } from "react";

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

	return (
		<div>
			<h1>{selectedGame.title}</h1>
			<p>URL: {selectedGame.url}</p>
			<button onClick={() => updateScore(1)}>Add point</button>
			{currentScore}
		</div>
	);
};

export default GamePage;
