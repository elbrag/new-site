import Link from "next/link";
import { SvgImageColors, SvgImageMotifs } from "./ui/SvgImage";
import Breadcrumbs from "./Breadcrumbs";
import SvgImage from "./ui/SvgImage";

export default function Navigation() {
	return (
		<header className="py-2.5 sm:py-4 px-5 fixed top-0 bg-military text-lime w-full z-10">
			<nav className="flex justify-start items-end">
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
			</nav>
		</header>
	);
}
