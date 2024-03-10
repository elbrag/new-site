import "../styles/globals.css";
import { AppProps } from "next/app";
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import { Dela_Gothic_One, Alegreya } from "next/font/google";
import GameContextProvider from "@/context/GameContext";
import { useRouter } from "next/router";
import { useEffect } from "react";
import FirebaseContextProvider from "@/context/FirebaseContext";
import RoundContextProvider from "@/context/RoundContext";
import ProgressContextProvider from "@/context/ProgressContext";
import ErrorContextProvider from "@/context/ErrorContext";

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
	//@ts-ignore
	const fonts = Object.keys(FontList).map((key) => FontList[key]);

	useEffect(() => {
		console.log("rerender app.tsx");
	}, []);

	return (
		<>
			<main
				className={`min-h-screen flex flex-col  text-military font-dela ${
					router.asPath === "/" ? "h-screen" : ""
				} ${fonts.join(" ")}`}
			>
				<Navigation />
				<ErrorContextProvider>
					<ProgressContextProvider>
						<RoundContextProvider>
							<FirebaseContextProvider>
								<GameContextProvider>
									<div className="page-content flex-grow h-full flex flex-col justify-center mx-5 mt-18 mb-16 py-16">
										<Component {...pageProps} />
									</div>
									<Footer />
								</GameContextProvider>
							</FirebaseContextProvider>
						</RoundContextProvider>
					</ProgressContextProvider>
				</ErrorContextProvider>
			</main>
		</>
	);
}

export default MyApp;
