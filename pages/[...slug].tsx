import gamesData from "../lib/data/gamesData.json";
import dynamic from "next/dynamic";
import { kebabToCamel, kebabToPascal } from "@/lib/helpers/formatting";
import { GameData, GameName, GameProps } from "@/lib/types/game";
import { fetchGameData } from "@/lib/helpers/fetch";
import { CookieNames, getCookie } from "@/lib/helpers/cookies";
import { firebaseAdmin } from "@/lib/helpers/firebaseAdmin";
import { GetServerSideProps, GetServerSidePropsContext } from "next/types";
import BarLoader from "@/components/ui/BarLoader";
import BackButton from "@/components/ui/BackButton";
interface GameComponentProps {
	gameData: GameData;
}
const GamePage = ({
	game,
	gameData,
}: {
	game: GameProps;
	gameData: GameData;
}) => {
	if (!game) {
		return <div>Game not found</div>;
	}
	const gameSlug = game.slug;

	const GameComponent = dynamic<GameComponentProps>(
		() =>
			import(
				`../components/games/${kebabToPascal(gameSlug)}/_${kebabToCamel(
					gameSlug
				)}.tsx`
			),
		{
			loading: () => (
				<div className="min-h-80vh flex items-center justify-center">
					<BarLoader />
				</div>
			),
		}
	);

	return (
		<div className="px-4 lg:px-12 pt-8 sm:pt-16 pb-16 flex-grow flex flex-col">
			<div className="flex-grow flex flex-col items-center justify-center">
				<div className="w-full">
					<GameComponent gameData={gameData} />
				</div>
			</div>
		</div>
	);
};

export default GamePage;

export const getServerSideProps: GetServerSideProps = async (
	context: GetServerSidePropsContext
) => {
	const { req, params } = context;
	const cookieString =
		getCookie(CookieNames.FirebaseToken, req.headers.cookie ?? "") ?? "";

	let token = null;

	try {
		token = cookieString.length
			? await firebaseAdmin?.auth()?.verifyIdToken(cookieString)
			: null;
	} catch (error) {
		console.error("Token verification failed:", error);
		token = null;
	}
	if (!token)
		return {
			redirect: {
				destination: "/login",
				permanent: false,
			},
		};

	const game = gamesData.find((game) => game.slug === params?.slug?.[0]);

	if (!game) {
		return {
			notFound: true,
		};
	}

	let gameData: GameData = {};

	if (game?.slug === GameName.Hangman) {
		const maskedWords = await fetchGameData(GameName.Hangman, "GET");
		gameData = { maskedWords };
	} else if (game?.slug === GameName.Memory) {
		const cardCount = await fetchGameData(GameName.Memory, "GET");
		gameData = { cardCount };
	}

	return {
		props: {
			game,
			gameData,
		},
	};
};
