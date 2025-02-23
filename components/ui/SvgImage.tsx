import React from "react";
import Logo from "../../public/static/images/logo.svg";
import Puzzle from "../../public/static/images/covers/puzzle.svg";
import ComingSoon from "../../public/static/images/comingsoon.svg";
import Hangman from "../../public/static/images/covers/hangman.svg";
import Memory from "../../public/static/images/covers/memory.svg";
import SendResults from "../../public/static/images/covers/sendResults.svg";
import FullLogo from "../../public/static/images/puzzle/full_logo.svg";
import styled from "styled-components";
import tailwindConfig from "../../tailwindSettings";

const svgImages = {
	logo: Logo,
	comingSoon: ComingSoon,
	puzzle: Puzzle,
	hangman: Hangman,
	memory: Memory,
	sendResults: SendResults,
	fullLogo: FullLogo,
};

export enum SvgImageMotifs {
	Logo = "logo",
	ComingSoon = "comingSoon",
	Puzzle = "puzzle",
	Hangman = "hangman",
	Memory = "memory",
	SendResults = "sendResults",
	FullLogo = "fullLogo",
}

export enum SvgImageColors {
	Military = "military",
	Black = "black",
	Lime = "lime",
	Cream = "cream",
	Transparent = "transparent",
}

interface SvgImageProps {
	image: SvgImageMotifs;
	color?: SvgImageColors;
	width?: number;
	height?: number;
	smallScaleFactor?: number;
	mediumScaleFactor?: number;
	largeScaleFactor?: number;
	suffix?: "vw" | "px" | "%";
	className?: string;
	enforceFitContentHeight?: boolean;
}

const SvgImage: React.FC<SvgImageProps> = ({
	image = SvgImageMotifs.Logo,
	color = SvgImageColors.Black,
	width = 24,
	height = 24,
	smallScaleFactor,
	mediumScaleFactor,
	largeScaleFactor,
	suffix = "px",
	className,
	enforceFitContentHeight = false,
}) => {
	const SvgImageElement = svgImages[image];

	return (
		<StyledSvgImage
			$width={width}
			$height={height}
			$suffix={suffix}
			$smallScaleFactor={smallScaleFactor}
			$mediumScaleFactor={mediumScaleFactor}
			$largeScaleFactor={largeScaleFactor}
			$enforceFitContentHeight={enforceFitContentHeight}
			className={`svg-image flex items-center justify-center transition-size duration-500 ease-bouncy-1 max-w-full max-h-fit ${className}`}
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
	$largeScaleFactor?: number;
	$enforceFitContentHeight: boolean;
}>`
	width: ${(props) => `${props.$width}${props.$suffix}`};
	height: ${(props) =>
		props.$enforceFitContentHeight
			? "fit-content"
			: `${props.$height}${props.$suffix}`};
	@media (max-width: ${tailwindConfig.theme.screens.lg}) {
		width: ${(props) =>
			`${props.$width * (props.$largeScaleFactor || 1)}${props.$suffix}`};
		height: ${(props) =>
			props.$enforceFitContentHeight
				? "fit-content"
				: `${props.$height * (props.$largeScaleFactor || 1)}${props.$suffix}`};
	}
	@media (max-width: ${tailwindConfig.theme.screens.md}) {
		width: ${(props) =>
			`${props.$width * (props.$mediumScaleFactor || 1)}${props.$suffix}`};
		height: ${(props) =>
			props.$enforceFitContentHeight
				? "fit-content"
				: `${props.$height * (props.$mediumScaleFactor || 1)}${props.$suffix}`};
	}
	@media (max-width: 480px) {
		width: ${(props) =>
			`${props.$width * (props.$smallScaleFactor || 1)}${props.$suffix}`};
		height: ${(props) =>
			props.$enforceFitContentHeight
				? "fit-content"
				: `${props.$height * (props.$smallScaleFactor || 1)}${props.$suffix}`};
	}
`;
