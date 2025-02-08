import { AnimatePresence } from "framer-motion";
import Modal from "@/components/ui/Modal";
import { InfoContext } from "@/context/InfoContext";
import { CookieNames, getCookie, setCookie } from "@/lib/helpers/cookies";
import { useContext, useEffect } from "react";
import { FirebaseContext } from "@/context/FirebaseContext";

export default function IntroModal() {
	const { setShowUsernameModal, showIntroModal, setShowIntroModal } =
		useContext(InfoContext);
	const { signedIn } = useContext(FirebaseContext);

	/**
	 * Get "introShown" cookie
	 */
	const getIntroShownCookie = () => {
		return getCookie(CookieNames.IntroShown, document.cookie ?? "");
	};

	/**
	 * Show modal if intro has not been shown
	 */
	useEffect(() => {
		const introShownCookie = getIntroShownCookie();
		const introHasBeenShown = introShownCookie
			? JSON.parse(introShownCookie)
			: false;
		if (!introHasBeenShown && signedIn)
			setTimeout(() => {
				setShowIntroModal(true);
			}, 500);
	}, [signedIn]);

	/**
	 * On close intro modal
	 */
	const onCloseIntroModal = () => {
		setShowIntroModal(false);
		const introShownCookie = getIntroShownCookie();

		setTimeout(() => {
			// If intro was shown because this was the first login, also show username prompt
			if (!introShownCookie) setShowUsernameModal(true);
			setCookie(CookieNames.IntroShown, "true", 30);
		}, 1000);
	};

	return (
		<>
			{/* Intro modal */}
			<AnimatePresence>
				{showIntroModal && (
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
								to see them all after closing this modal. If you exit a game you
								can always come back later, your progress is auto-saved.
							</p>
							<p className="mb-3">
								When you are happy with your score (which is shown down there
								👇), make sure to send me a message to show me how well you did,
								and drop me a line or two.
							</p>
							<p>Hope to hear from you soon! 🪐</p>
						</div>
					</Modal>
				)}
			</AnimatePresence>
		</>
	);
}
