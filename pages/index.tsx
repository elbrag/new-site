import React, { useContext, useEffect, useState } from "react";
import GameBoard from "@/components/GameBoard";
import {
	GetServerSidePropsContext,
	GetServerSidePropsResult,
} from "next/types";
import { CookieNames, getCookie, setCookie } from "@/lib/helpers/cookies";
import { firebaseAdmin } from "@/lib/helpers/firebaseAdmin";
import { GameContext } from "@/context/GameContext";
import { AnimatePresence } from "framer-motion";
import Modal from "@/components/ui/Modal";
import { InfoContext } from "@/context/InfoContext";

const Home: React.FC = () => {
	const [showModal, setShowModal] = useState(false);
	const { setShowUsernameModal } = useContext(InfoContext);

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
		setTimeout(() => {
			setShowUsernameModal(true);
		}, 1000);
	};

	return (
		<>
			<GameBoard />
			{/* Intro modal */}
			<AnimatePresence>
				{showModal && (
					<Modal onClose={() => onCloseIntroModal()} motionKey="intro-modal">
						<h2 className="text-xl lg:text-2xl mb-2 lg:mb-4 uppercase">
							Hello!
						</h2>
						<div className="mb-4 md:text-lg font-alegreya">
							<p className="mb-3">
								Are you looking to play some games? Would you also like to get
								to know me a bit better? Then this is the site for you!
							</p>
							<p className="mb-3">
								There are currently 3 games that you can play. You will be able
								to see them all after closing this modal. When you are happy
								with your score (which is shown at the bottom right corner by
								the way), make sure to send me a message to show me how well you
								did, and drop me a line or two.
							</p>
							<p>Hope to hear from you soon! 🪐</p>
						</div>
					</Modal>
				)}
			</AnimatePresence>
		</>
	);
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
