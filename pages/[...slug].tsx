import gamesData from "../lib/data/gamesData.json";
import { GameContext } from "@/context/GameContext";
import { useContext } from "react";
import dynamic from "next/dynamic";
import { kebabToCamel, kebabToPascal } from "@/lib/helpers/formatting";
import { GameName, GameProps } from "@/lib/types/game";
import { fetchGameData } from "@/lib/helpers/fetch";
import { HangmanRoundProps } from "@/lib/types/rounds";

const GamePage = ({ game, gameData }: { game: GameProps; gameData: any }) => {
	if (!game) {
		return <div>Game not found</div>;
	}
	const gameUrl = game.url;

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
			<div className="px-6 lg:px-12 flex flex-col items-center justify-center">
				<div className="w-full">
					{/* @ts-ignore */}
					<GameComponent gameData={gameData} />
				</div>
			</div>
		</div>
	);
};

export default GamePage;

export async function getStaticProps({ params }: { params: any }) {
	const game = gamesData.find((game) => game.url === params.slug[0]);

	let gameData = {};

	if (game?.url === GameName.Hangman) {
		const maskedWords: HangmanRoundProps = await fetchGameData(
			GameName.Hangman,
			"GET"
		);
		gameData = { maskedWords };
	}

	if (!game) {
		return {
			notFound: true,
		};
	}
	return {
		props: {
			game,
			gameData,
		},
	};
}

export async function getStaticPaths() {
	const paths = gamesData.map((game) => ({
		params: { slug: [game.url] },
	}));
	return { paths, fallback: false };
}
