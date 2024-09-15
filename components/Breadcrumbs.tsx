import { useRouter } from "next/router";
import gamesData from "../lib/data/gamesData.json";
import Link from "next/link";

interface BreadcrumbsProps {}

const Breadcrumbs: React.FC<BreadcrumbsProps> = () => {
	const router = useRouter();

	const currentGame = gamesData.find(
		(game) => router.asPath.split("/")[1] === game.url
	);

	const crumbClasses = "uppercase";
	const slashClasses = "mx-2";

	return (
		<div className="flex flex-col justify-center md:min-h-9">
			<ul className="flex leading-none mt-2">
				{currentGame ? (
					<>
						<li>
							<Link
								className={`${crumbClasses} font-alegreya text-lg sm:text-xl`}
								href="/"
							>
								Games
							</Link>
						</li>
						<span
							className={`${slashClasses} font-alegreya text-md sm:text-xl-sans`}
						>
							/
						</span>
						<li className={`${crumbClasses} text-md sm:text-xl-sans`}>
							{currentGame.title}
						</li>
					</>
				) : (
					<>
						<li className={`${crumbClasses} text-xl-sans`}>Pick a game</li>
					</>
				)}
			</ul>
		</div>
	);
};

export default Breadcrumbs;
