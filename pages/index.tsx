import React from "react";
import GameBoard from "@/components/GameBoard";
import {
	GetServerSidePropsContext,
	GetServerSidePropsResult,
} from "next/types";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "@/lib/helpers/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const Home: React.FC = () => {
	// const { userId } = useContext(FirebaseContext);

	return <GameBoard />;
};

export default Home;

export const getServerSideProps = async (
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<any>> => {
	// TODO: If account is removed manually in Firebase you must be logged out
	// TODO: Make function for these and use here and in ...slug

	const firebaseApp = initializeApp(firebaseConfig);
	const auth = getAuth(firebaseApp);

	const redirect = {
		redirect: {
			destination: "/login",
			permanent: false,
		},
	};

	if (firebaseApp) {
		const unsubscribe = onAuthStateChanged(auth, async (user) => {
			if (!user) {
				return redirect;
			}
		});
		unsubscribe();
	} else {
		return redirect;
	}

	return {
		props: {},
	};
};
