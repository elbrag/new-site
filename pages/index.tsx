import React, { useContext, useEffect } from "react";
import GameBoard from "@/components/GameBoard";
import Login from "./login";
import { FirebaseContext } from "@/context/FirebaseContext";

const Home: React.FC = () => {
	const { userId } = useContext(FirebaseContext);

	return <>{userId ? <GameBoard /> : <Login />}</>;
};

export default Home;
