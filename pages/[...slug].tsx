import gamesData from "../lib/db/gamesData.json";
import { useRouter } from "next/router";

const GamePage = () => {
	const router = useRouter();
	const { slug } = router.query;

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
		</div>
	);
};

export default GamePage;
