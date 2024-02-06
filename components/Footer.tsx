import { GameContext } from "@/context/GameContext";
import Link from "next/link";
import { useContext, useState } from "react";

export default function Footer() {
	const [inputValue, setInputValue] = useState("");
	const { currentScore, username, updateUsername } = useContext(GameContext);

	return (
		<footer className="p-6 lg:p-12 flex justify-between text-black">
			<div>
				<input
					onKeyUp={(e: any) => setInputValue(e.currentTarget.value)}
					placeholder="Username"
				/>
				<button type="submit" onClick={() => updateUsername(inputValue)}>
					Update name
				</button>
			</div>
			Username: {username}
			<p>Score: {currentScore}</p>
		</footer>
	);
}
