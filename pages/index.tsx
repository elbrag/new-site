import React from "react";
import GameBoard from "@/components/GameBoard";
import {
	GetServerSidePropsContext,
	GetServerSidePropsResult,
} from "next/types";
import { CookieNames, getCookie } from "@/lib/helpers/cookies";
import { firebaseAdmin } from "@/lib/helpers/firebaseAdmin";

const Home: React.FC = () => {
	return <GameBoard />;
};

export default Home;

export const getServerSideProps = async (
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<unknown>> => {
	const { req } = context;
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

	return {
		props: {},
	};
};
