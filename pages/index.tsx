import React from "react";
import GameBoard from "@/components/GameBoard";
import {
	GetServerSidePropsContext,
	GetServerSidePropsResult,
} from "next/types";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "@/lib/helpers/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getCookie } from "@/lib/helpers/cookies";
import { firebaseAdmin } from "@/lib/helpers/firebaseAdmin";

const Home: React.FC = () => {
	// const { userId } = useContext(FirebaseContext);

	return <GameBoard />;
};

export default Home;

export const getServerSideProps = async (
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<any>> => {
	const { req } = context;
	const cookieString =
		getCookie(req.headers.cookie ?? "", "firebaseToken") ?? "";

	let token;
	try {
		token = cookieString.length
			? await firebaseAdmin?.auth()?.verifyIdToken(cookieString)
			: false;
	} catch (error) {
		console.error("Token verification failed:", error);
		token = false;
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
