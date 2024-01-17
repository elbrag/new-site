import React from "react";
import Logo from "../../public/static/images/logo.svg";
import ComingSoon from "../../public/static/images/comingsoon.svg";
import styled from "styled-components";
import tailwindConfig from "../../tailwindSettings";

const icons = {
	logo: Logo,
	comingSoon: ComingSoon,
};

export enum IconTypes {
	Logo = "logo",
	ComingSoon = "comingSoon",
}

export enum IconColors {
	Black = "black",
	Lime = "lime",
	ComingSoon = "comingSoon",
}

interface IconProps {
	icon: IconTypes;
	color?: IconColors;
	width?: number;
	height?: number;
	smallScaleFactor?: number;
	mediumScaleFactor?: number;
	inVw?: boolean;
}

const Icon: React.FC<IconProps> = ({
	icon = IconTypes.Logo,
	color = IconColors.Black,
	width = 24,
	height = 24,
	smallScaleFactor,
	mediumScaleFactor,
	inVw = false,
}) => {
	const IconElement = icons[icon];
	const suffix = inVw ? "vw" : "px";

	return (
		<StyledIcon
			$width={width}
			$height={height}
			$suffix={suffix}
			$smallScaleFactor={smallScaleFactor}
			$mediumScaleFactor={mediumScaleFactor}
			className={`icon flex items-center justify-center transition-size duration-500 ease-bouncy-1 `}
		>
			<IconElement className={`text-${color} w-full h-full`} />
		</StyledIcon>
	);
};

export default Icon;

const StyledIcon = styled.div<{
	$width: number;
	$height: number;
	$suffix: string;
	$smallScaleFactor?: number;
	$mediumScaleFactor?: number;
}>`
	width: ${(props) => `${props.$width}${props.$suffix}`};
	height: ${(props) => `${props.$height}${props.$suffix}`};
	@media (max-width: ${tailwindConfig.theme.screens.md}) {
		width: ${(props) =>
			`${props.$width * (props.$mediumScaleFactor || 1)}${props.$suffix}`};
		height: ${(props) =>
			`${props.$height * (props.$mediumScaleFactor || 1)}${props.$suffix}`};
	}
	@media (max-width: ${tailwindConfig.theme.screens.sm}) {
		width: ${(props) =>
			`${props.$width * (props.$smallScaleFactor || 1)}${props.$suffix}`};
		height: ${(props) =>
			`${props.$height * (props.$smallScaleFactor || 1)}${props.$suffix}`};
	}
`;
