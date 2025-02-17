import { FontList } from "@/pages/_app";

export default function Hero() {
	const fontNames = Object.keys(FontList);
	const text = "Ellen Brage";

	return (
		<div className="hero h-full w-full flex items-center justify-center flex-grow">
			<h1>
				<div className="letter letter-e flex flex-col justify-between gap-5 w-64">
					<span className="w-full h-10 bg-yellow"></span>
					<span className="w-full h-10 bg-yellow"></span>
					<span className="w-full h-10 bg-yellow"></span>
				</div>
			</h1>
		</div>
	);
}
