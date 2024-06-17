import Link from "next/link";
import Icon, { IconColors, IconTypes } from "./ui/Icon";
import Breadcrumbs from "./Breadcrumbs";

export default function Navigation() {
	return (
		<header className="py-4 px-5 fixed top-0 bg-military text-lime w-full z-1">
			<nav className="flex justify-start items-end">
				<div className="flex flex-col md:flex-row md:items-center">
					<Link href="/" aria-label="Home" className="block mr-2vw md:mr-3vw">
						<Icon
							icon={IconTypes.Logo}
							width={8}
							height={3}
							inVw={true}
							color={IconColors.Military}
							smallScaleFactor={1.25}
							mediumScaleFactor={1}
						/>
					</Link>
					<Breadcrumbs />
				</div>
				{/* <h1
					className="text-5xl lg:text-6xl leading-none text-border uppercase tracking-wide drop-shadow-text text-paper"
					style={{ WebkitTextStroke: "0.125vw black" }}
				>
					The get to know me game
				</h1> */}
			</nav>
		</header>
	);
}
