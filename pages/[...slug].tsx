import gamesData from "../lib/data/gamesData.json";
import dynamic from "next/dynamic";
import { kebabToCamel, kebabToPascal } from "@/lib/helpers/formatting";
import { GameName, GameProps } from "@/lib/types/game";
import { fetchGameData } from "@/lib/helpers/fetch";
import { HangmanMaskedRoundProps } from "@/lib/types/rounds";

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
			<div className="px-6 lg:px-12 py-16 flex flex-col items-center justify-center">
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
	const userLoggedIn = false;

	if (!userLoggedIn) {
		return {
			redirect: {
				destination: "/login",
				permanent: false,
			},
		};
	}

	const game = gamesData.find((game) => game.url === params.slug[0]);

	let gameData = {};

	if (game?.url === GameName.Hangman) {
		const maskedWords: HangmanMaskedRoundProps = await fetchGameData(
			GameName.Hangman,
			"GET"
		);
		gameData = { maskedWords };
	} else if (game?.url === GameName.Memory) {
		const cardCount: number = await fetchGameData(GameName.Memory, "GET");
		gameData = { cardCount };
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

// export const getServerSideProps = async (
// 	context: GetServerSidePropsContext
// ): Promise<GetServerSidePropsResult<any>> => {
// 	// const userLoggedIn: boolean = await checkUserLoggedIn();
// 	const userLoggedIn = false;

// 	if (!userLoggedIn) {
// 		return {
// 			redirect: {
// 				destination: "/login",
// 				permanent: false,
// 			},
// 		};
// 	}

// 	return {
// 		props: {},
// 	};
// };
