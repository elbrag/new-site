import { GameContext } from "@/context/GameContext";
import { useContext } from "react";
import ScoreMessage from "./ui/ScoreMessage";
import { AnimatePresence } from "framer-motion";
import { FirebaseContext } from "@/context/FirebaseContext";

export default function CurrentScore() {
	const { currentScore, scoreMessage } = useContext(GameContext);
	const { signedIn } = useContext(FirebaseContext);

	return (
		<div className={`current-score ${!signedIn && "opacity-0"}`}>
			<div className="flex items-center gap-2">
				<p className="uppercase text-lg font-alegreya">Score:</p>
				<span className="relative">
					<p
						className={`text-lg mb-1 ${
							scoreMessage ? "opacity-0" : "opacity-100"
						}`}
					>
						{currentScore}
					</p>
					<AnimatePresence>
						{scoreMessage && <ScoreMessage text={scoreMessage} />}
					</AnimatePresence>
				</span>
			</div>
		</div>
	);
}
