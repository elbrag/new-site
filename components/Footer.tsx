import CurrentScore from "./CurrentScore";
import Username from "./Username";

export default function Footer() {
	return (
		<footer className="py-4 px-5 flex flex-col md:flex-row justify-between text-lime fixed bottom-0 w-full bg-military z-1">
			<Username />
			<CurrentScore />
		</footer>
	);
}
