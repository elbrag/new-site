import Link from "next/link";
import Icon, { IconColors, IconTypes } from "./ui/Icon";

export default function Navigation() {
	return (
		<header className="py-4 px-5 fixed top-0 bg-military w-full z-1">
			<nav className="flex justify-start items-end">
				<Link href="/" aria-label="Home" className="block mr-2vw">
					<Icon
						icon={IconTypes.Logo}
						width={10}
						height={4}
						inVw={true}
						color={IconColors.Military}
						smallScaleFactor={1.25}
						mediumScaleFactor={1}
					/>
				</Link>
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
