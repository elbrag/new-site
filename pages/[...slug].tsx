import gamesData from "../lib/data/gamesData.json";
import { GameContext } from "@/context/GameContext";
import { useContext } from "react";
import dynamic from "next/dynamic";
import { kebabToCamel, kebabToPascal } from "@/lib/helpers/formatting";

const GamePage = ({ game }: { game: any }) => {
	const { updateScore, currentScore } = useContext(GameContext);

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
			<div className="px-6 lg:px-12 min-h-screen flex flex-col items-center justify-center">
				<div>
					<GameComponent />
				</div>
			</div>
		</div>
	);
};

export default GamePage;

export async function getStaticProps({ params }: { params: any }) {
	const game = gamesData.find((game) => game.url === params.slug[0]);
	if (!game) {
		return {
			notFound: true,
		};
	}
	return {
		props: {
			game,
		},
	};
}

export async function getStaticPaths() {
	const paths = gamesData.map((game) => ({
		params: { slug: [game.url] },
	}));
	return { paths, fallback: false };
}
