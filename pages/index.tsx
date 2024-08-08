import React, { useContext, useEffect } from "react";
import GameBoard from "@/components/GameBoard";
import { FirebaseContext } from "@/context/FirebaseContext";
import {
	GetServerSidePropsContext,
	GetServerSidePropsResult,
} from "next/types";

const Home: React.FC = () => {
	// const { userId } = useContext(FirebaseContext);

	return <GameBoard />;
};

export default Home;

export const getServerSideProps = async (
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<any>> => {
	// const userLoggedIn: boolean = await checkUserLoggedIn();
	const userLoggedIn = false;

	if (!userLoggedIn) {
		return {
			redirect: {
				destination: "/login",
				permanent: false,
			},
		};
	}

	return {
		props: {},
	};
};
