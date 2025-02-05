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
import { CookieNames, getCookie, setCookie } from "@/lib/helpers/cookies";
import { AnimatePresence } from "framer-motion";
import Modal from "@/components/ui/Modal";

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
	const [showModal, setShowModal] = useState(false);
	const fonts = Object.keys(FontList).map(
		(key) => FontList[key as keyof typeof FontList]
	);
	const isHome = router.asPath === "/";

	/**
	 * Show modal if intro has not been shown
	 */
	useEffect(() => {
		const introShownCookie = getCookie(
			CookieNames.IntroShown,
			document.cookie ?? ""
		);
		const introHasBeenShown = introShownCookie
			? JSON.parse(introShownCookie)
			: false;
		if (!introHasBeenShown) setShowModal(true);
	}, []);

	/**
	 * On close intro modal
	 */
	const onCloseIntroModal = () => {
		setShowModal(false);
		setCookie(CookieNames.IntroShown, "true", 30);
	};

	/**
	 * Keep page title updated
	 */
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
							<FirebaseContextProvider>
								<GameContextProvider>
									<div className="page-content flex-grow h-full flex flex-col justify-center mx-5 mt-18 mb-14">
										<Component {...pageProps} />
									</div>
									<Footer />
								</GameContextProvider>
							</FirebaseContextProvider>
						</RoundContextProvider>
					</ProgressContextProvider>
				</ErrorContextProvider>
				{/* Intro modal */}
				<AnimatePresence>
					{showModal && (
						<Modal
							onClose={() => onCloseIntroModal()}
							motionKey="username-modal"
						>
							<h2 className="text-xl lg:text-2xl mb-2 lg:mb-4 uppercase">
								Hello!
							</h2>
							<div className="mb-4 text-sm">
								<p className="mb-3">
									Are you looking to play some games? Would you also like to get
									to know me a bit better? Then this is the site for you!
								</p>
								<p className="mb-3">
									There are currently 3 games that you can play. You will be
									able to see them all after closing this modal. When you are
									happy with your score (which is shown at the bottom right
									corner by the way), make sure to send me a message to show me
									your score and drop me a line or two.
								</p>
								<p>Hope to hear from you soon! 🪐</p>
							</div>
						</Modal>
					)}
				</AnimatePresence>
			</main>
		</>
	);
}

export default MyApp;
