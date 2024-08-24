import gamesData from "../lib/data/gamesData.json";
import dynamic from "next/dynamic";
import { kebabToCamel, kebabToPascal } from "@/lib/helpers/formatting";
import { GameName, GameProps } from "@/lib/types/game";
import { fetchGameData } from "@/lib/helpers/fetch";
import { HangmanMaskedRoundProps } from "@/lib/types/rounds";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "@/lib/helpers/firebase";
import { getCookie } from "@/lib/helpers/cookies";
import { firebaseAdmin } from "@/lib/helpers/firebaseAdmin";
import {
	GetServerSideProps,
	GetServerSidePropsContext,
	GetStaticPropsContext,
} from "next/types";
import { useEffect } from "react";

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

export const getServerSideProps: GetServerSideProps = async (
	context: GetServerSidePropsContext
) => {
	const { req, params } = context;

	const cookieString =
		getCookie(req.headers.cookie ?? "", "firebaseToken") ?? "";
	const token = cookieString?.length
		? await firebaseAdmin.auth().verifyIdToken(cookieString)
		: false;

	if (!token) {
		return {
			redirect: {
				destination: "/login",
				permanent: false,
			},
		};
	}

	const game = gamesData.find((game) => game.url === params?.slug?.[0]);

	if (!game) {
		return {
			notFound: true,
		};
	}

	let gameData = {};

	if (game?.url === GameName.Hangman) {
		const maskedWords = await fetchGameData(GameName.Hangman, "GET");
		gameData = { maskedWords };
	} else if (game?.url === GameName.Memory) {
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
