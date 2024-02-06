import "../styles/globals.css";
import { AppProps } from "next/app";
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";

import { Blaka } from "next/font/google";
import { Dela_Gothic_One } from "next/font/google";
import GameContextProvider from "@/context/GameContext";

const blaka = Blaka({
	weight: "400",
	subsets: ["latin"],
	variable: "--font-blaka",
});
const delaGothicOne = Dela_Gothic_One({
	weight: "400",
	subsets: ["latin"],
	variable: "--font-dela",
});

export const FontList = {
	blaka: blaka.variable,
	dela: delaGothicOne.variable,
};

function MyApp({ Component, pageProps }: AppProps) {
	//@ts-ignore
	const fonts = Object.keys(FontList).map((key) => FontList[key]);

	return (
		<>
			<style jsx global>{``}</style>
			<main
				className={`h-screen min-h-screen flex flex-col bg-cream text-lime font-dela ${fonts.join(
					" "
				)}`}
			>
				<Navigation />
				<GameContextProvider>
					<div className="page-content flex-grow h-full flex flex-col">
						<Component {...pageProps} />
					</div>
					<Footer />
				</GameContextProvider>
			</main>
		</>
	);
}

export default MyApp;
