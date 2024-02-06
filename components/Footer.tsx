import { GameContext } from "@/context/GameContext";
import Link from "next/link";
import { useContext } from "react";

export default function Footer() {
	const { currentScore } = useContext(GameContext);

	const email = "ellenbrage@outlook.com";
	return (
		<footer className="p-6 lg:p-12 flex justify-between text-black">
			<Link href={`mailto:${email}`}>{email}</Link>
			<p>Score: {currentScore}</p>
		</footer>
	);
}
