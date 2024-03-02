import { GameContext } from "@/context/GameContext";
import { useContext, useState } from "react";
import CurrentScore from "./CurrentScore";

export default function Footer() {
	const [inputValue, setInputValue] = useState("");
	const { username, updateUsername } = useContext(GameContext);

	return (
		<footer className="py-4 px-5 flex justify-between text-lime fixed bottom-0 w-full bg-military z-1">
			<div>
				{/* <input
					onKeyUp={(e: any) => setInputValue(e.currentTarget.value)}
					placeholder="Username"
				/>
				<button type="submit" onClick={() => updateUsername(inputValue)}>
					Update name
				</button> */}
			</div>
			{/* Username: {username} */}
			<CurrentScore />
		</footer>
	);
}
