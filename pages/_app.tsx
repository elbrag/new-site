import "../styles/globals.css";
import { AppProps } from "next/app";
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import { Dela_Gothic_One, Alegreya } from "next/font/google";
import GameContextProvider from "@/context/GameContext";
import { useRouter } from "next/router";
import FirebaseContextProvider from "@/context/FirebaseContext";
import RoundContextProvider from "@/context/RoundContext";
import ProgressContextProvider from "@/context/ProgressContext";
import ErrorContextProvider from "@/context/ErrorContext";
import Head from "next/head";
import gamesData from "../lib/data/gamesData.json";
import { useEffect, useState } from "react";
import ScoreContextProvider from "@/context/ScoreContext";

const delaGothicOne = Dela_Gothic_One({
	weight: "400",
	subsets: ["latin"],
	variable: "--font-dela",
});

const alegreya = Alegreya({
	weight: ["400", "500", "700"],
	subsets: ["latin"],
	variable: "--font-alegreya",
});

export const FontList = {
	alegreya: alegreya.variable,
	dela: delaGothicOne.variable,
};

function MyApp({ Component, pageProps }: AppProps) {
	const router = useRouter();
	const [title, setTitle] = useState("");
	//@ts-ignore
	const fonts = Object.keys(FontList).map((key) => FontList[key]);
	const isHome = router.asPath === "/";

	useEffect(() => {
		const getTitle = () => {
			if (isHome) return "Pick a game!";
			const path = router.asPath.split("/")[1];
			if (path === "login") return "Login";
			const gamePathMatch = gamesData.find((game) => game.url === path);
			if (gamePathMatch) return gamePathMatch.title;
			return "";
		};
		setTitle(getTitle());
	}, [router.asPath, isHome]);

	return (
		<>
			<Head>
				<title>{`EB ${title.length ? `| ${title}` : title}`}</title>
				<link rel="icon" href="/favicon.png" sizes="any" />
			</Head>
			<main
				className={`min-h-screen flex flex-col  text-military font-dela ${
					isHome ? "md:h-screen" : ""
				} ${fonts.join(" ")}`}
			>
				<Navigation />
				<ErrorContextProvider>
					<ProgressContextProvider>
						<RoundContextProvider>
							<ScoreContextProvider>
								<FirebaseContextProvider>
									<GameContextProvider>
										<div className="page-content flex-grow h-full flex flex-col justify-center mx-5 mt-18 mb-14">
											<Component {...pageProps} />
										</div>
										<Footer />
									</GameContextProvider>
								</FirebaseContextProvider>
							</ScoreContextProvider>
						</RoundContextProvider>
					</ProgressContextProvider>
				</ErrorContextProvider>
			</main>
		</>
	);
}

export default MyApp;
