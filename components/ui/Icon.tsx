import React from "react";
import Logo from "../../public/static/images/logo.svg";
import styled from "styled-components";
import tailwindConfig from "../../tailwindSettings";

const icons = {
	logo: Logo,
};

export enum IconTypes {
	Logo = "logo",
}

export enum IconColors {
	Black = "black",
	Lime = "lime",
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
			className={`icon flex items-center justify-center`}
		>
			<IconElement
				className={`text-${color} duration-500 ease-bouncy-1 w-full h-full`}
			/>
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
