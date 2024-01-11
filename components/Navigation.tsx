import Link from "next/link";
import Icon, { IconTypes } from "./ui/Icon";

export default function Navigation() {
	return (
		<header className="p-6 lg:p-12">
			<nav className="flex justify-between">
				<Link href="/" aria-label="Home">
					<Icon
						icon={IconTypes.Logo}
						width={100}
						height={40}
						smallScaleFactor={75}
						mediumScaleFactor={90}
					/>
				</Link>
				<ul>
					<li></li>
				</ul>
			</nav>
		</header>
	);
}
