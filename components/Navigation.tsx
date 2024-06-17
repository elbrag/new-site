import Link from "next/link";
import { SvgImageColors, SvgImageMotifs } from "./ui/SvgImage";
import Breadcrumbs from "./Breadcrumbs";
import SvgImage from "./ui/SvgImage";

export default function Navigation() {
	return (
		<header className="py-4 px-5 fixed top-0 bg-military text-lime w-full z-1">
			<nav className="flex justify-start items-end">
				<div className="flex flex-col md:flex-row md:items-center">
					<Link href="/" aria-label="Home" className="block mr-2vw md:mr-3vw">
						<SvgImage
							image={SvgImageMotifs.Logo}
							width={8}
							height={3}
							suffix="vw"
							color={SvgImageColors.Military}
							smallScaleFactor={1.25}
							mediumScaleFactor={1}
						/>
					</Link>
					<Breadcrumbs />
				</div>
			</nav>
		</header>
	);
}
