import React from "react";
import Logo from "../../public/static/images/logo.svg";
import Puzzle from "../../public/static/images/covers/puzzle.svg";
import ComingSoon from "../../public/static/images/comingsoon.svg";
import Hangman from "../../public/static/images/covers/hangman.svg";
import Memory from "../../public/static/images/covers/memory.svg";
import SendResults from "../../public/static/images/covers/sendResults.svg";

import styled from "styled-components";
import tailwindConfig from "../../tailwindSettings";

const svgImages = {
	logo: Logo,
	comingSoon: ComingSoon,
	puzzle: Puzzle,
	hangman: Hangman,
	memory: Memory,
	sendResults: SendResults,
};

export enum SvgImageMotifs {
	Logo = "logo",
	ComingSoon = "comingSoon",
	Puzzle = "puzzle",
	Hangman = "hangman",
	Memory = "memory",
	SendResults = "sendResults",
}

export enum SvgImageColors {
	Military = "military",
	Black = "black",
	Lime = "lime",
	Cream = "cream",
}

interface SvgImageProps {
	image: SvgImageMotifs;
	color?: SvgImageColors;
	width?: number;
	height?: number;
	smallScaleFactor?: number;
	mediumScaleFactor?: number;
	suffix?: "vw" | "px" | "%";
}

const SvgImage: React.FC<SvgImageProps> = ({
	image = SvgImageMotifs.Logo,
	color = SvgImageColors.Black,
	width = 24,
	height = 24,
	smallScaleFactor,
	mediumScaleFactor,
	suffix = "px",
}) => {
	const SvgImageElement = svgImages[image];

	return (
		<StyledSvgImage
			$width={width}
			$height={height}
			$suffix={suffix}
			$smallScaleFactor={smallScaleFactor}
			$mediumScaleFactor={mediumScaleFactor}
			className={`svg-image flex items-center justify-center transition-size duration-500 ease-bouncy-1 `}
		>
			<SvgImageElement className={`text-${color} w-full h-full`} />
		</StyledSvgImage>
	);
};

export default SvgImage;

const StyledSvgImage = styled.div<{
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
