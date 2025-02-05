import Link from "next/link";
import { SvgImageColors, SvgImageMotifs } from "./ui/SvgImage";
import Breadcrumbs from "./Breadcrumbs";
import SvgImage from "./ui/SvgImage";
import { InfoContext } from "@/context/InfoContext";
import { useContext } from "react";

export default function Navigation() {
	const { setShowIntroModal } = useContext(InfoContext);

	return (
		<header className="py-2.5 sm:py-4 px-5 fixed top-0 bg-military text-lime w-full z-10">
			<nav className="flex justify-between items-end">
				<div className="flex flex-col md:flex-row md:items-center">
					<Link href="/" aria-label="Home" className="block mr-6 md:mr-8">
						<SvgImage
							image={SvgImageMotifs.Logo}
							width={8}
							height={3.1}
							suffix="vw"
							color={SvgImageColors.Military}
							smallScaleFactor={2}
							mediumScaleFactor={1.25}
							largeScaleFactor={1}
						/>
					</Link>
					<Breadcrumbs />
				</div>
				<button
					className="w-6 h-6 md:w-8 md:h-8 rounded-full border-2 flex justify-center items-center leading-none border-lime"
					onClick={() => setShowIntroModal(true)}
				>
					?
				</button>
			</nav>
		</header>
	);
}
