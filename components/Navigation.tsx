import Link from "next/link";
import Icon, { IconColors, IconTypes } from "./ui/Icon";

export default function Navigation() {
	return (
		<header className="p-4 lg:px-8 lg:py-6">
			<nav className="flex justify-start items-end">
				<Link href="/" aria-label="Home" className="block mr-2vw">
					<Icon
						icon={IconTypes.Logo}
						width={10}
						height={4}
						inVw={true}
						color={IconColors.Lime}
						smallScaleFactor={1.25}
						mediumScaleFactor={1}
					/>
				</Link>
				<h1
					className="text-5xl lg:text-6xl leading-none text-border uppercase tracking-wide drop-shadow-text text-lime"
					style={{ WebkitTextStroke: "0.125vw black" }}
				>
					The get to know me game
				</h1>
			</nav>
		</header>
	);
}
