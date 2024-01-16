import Link from "next/link";
import Icon, { IconColors, IconTypes } from "./ui/Icon";

export default function Navigation() {
	return (
		<header className="p-4 lg:px-8 lg:py-6">
			<nav className="flex justify-start items-center scale-">
				<Link href="/" aria-label="Home" className="block">
					<Icon
						icon={IconTypes.Logo}
						width={14}
						height={6}
						inVw={true}
						color={IconColors.Lime}
						smallScaleFactor={1.5}
					/>
				</Link>
				<h1 className="text-5xl lg:text-6xl leading-none text-border uppercase">
					The get to know me game
				</h1>
			</nav>
		</header>
	);
}
