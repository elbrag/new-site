import React, { useRef, useLayoutEffect } from "react";
import gsap from "gsap";

interface HangedManProps {
	errorLength: number;
}

export const hangmanPartsInOrder = [
	"base",
	"verticalBar",
	"horizontalBar",
	"diagonalBar",
	"rope",
	"noose",
	"head",
	"body",
	"arm1",
	"arm2",
	"leg1",
	"leg2",
];

const HangedMan: React.FC<HangedManProps> = ({ errorLength }) => {
	const container = useRef<HTMLDivElement | null>(null);

	useLayoutEffect(() => {
		if (errorLength === hangmanPartsInOrder.length) {
			const ctx = gsap.context(() => {
				gsap.to("#turbwave", {
					attr: { baseFrequency: "0.01 0.1" },
					duration: 5,
					repeat: -1,
					yoyo: true,
				});
			}, container);
			return () => ctx.revert();
		}
	}, [errorLength]);

	/**
	 * Display or not
	 */
	const getDisplayValue = (part: string) => {
		const currentErrorIndex = hangmanPartsInOrder.indexOf(part);
		if (currentErrorIndex <= errorLength - 1) return "block";
		return "none";
	};

	return (
		<div ref={container}>
			<svg
				filter="url(#turb)"
				className="h-[300px] w-[225px] md:h-[408px] md:w-[305px]"
				width="305"
				height="408"
				viewBox="0 0 305 408"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<defs>
					<filter id="turb">
						<feTurbulence
							id="turbwave"
							type="fractalNoise"
							baseFrequency="0"
							numOctaves="3"
							result="turbulence_3"
							data-filterId="3"
						/>
						<feDisplacementMap
							xChannelSelector="R"
							yChannelSelector="G"
							in="SourceGraphic"
							in2="turbulence_3"
							scale="60"
						/>
					</filter>
				</defs>
				<path
					style={{
						display: getDisplayValue("base"),
					}}
					id="base"
					d="M304.313 406.816H121.491C132.968 371.822 169.522 346.184 212.902 346.184C256.282 346.184 292.836 371.822 304.313 406.816Z"
					fill="#FFFCF7"
					stroke="#3c4d39"
					strokeWidth={1.5}
				/>
				<rect
					style={{
						display: getDisplayValue("rope"),
					}}
					id="rope"
					x="78.5"
					y="14"
					width="1"
					height="98"
					transform="rotate(180 78.5 62.5)"
					fill="#3c4d39"
					stroke="#3c4d39"
					strokeWidth={1.5}
				/>
				<rect
					style={{
						display: getDisplayValue("verticalBar"),
					}}
					x="206.5"
					y="0.5"
					width="12"
					height="346"
					id="verticalBar"
					fill="#FFFCF7"
					stroke="#3c4d39"
					strokeWidth={1.5}
				/>
				<path
					style={{
						display: getDisplayValue("diagonalBar"),
					}}
					id="diagonalBar"
					d="M113.707 10.2427L117.242 6.708L206.526 96.425L206.445 102.98L113.707 10.2427Z"
					fill="#FFFCF7"
					stroke="#3c4d39"
					strokeWidth={1.5}
				/>
				<path
					style={{
						display: getDisplayValue("noose"),
					}}
					id="noose"
					d="M69.9908 134.542C73.6106 133.347 77.9544 130.761 82.0777 127.001C86.201 123.24 89.1752 119.152 90.6968 115.657C91.5114 113.786 91.8259 112.318 91.8384 111.2C91.8509 110.088 91.5634 109.285 91.127 108.806C90.6907 108.328 89.9171 107.968 88.8087 107.878C87.6942 107.788 86.2034 107.966 84.2655 108.606C80.6457 109.8 76.3019 112.386 72.1786 116.147C68.0553 119.907 65.0812 123.995 63.5595 127.49C62.7449 129.361 62.4305 130.829 62.4179 131.947C62.4054 133.059 62.6929 133.862 63.1293 134.341C63.5657 134.819 64.3392 135.179 65.4476 135.269C66.5621 135.359 68.053 135.181 69.9908 134.542ZM83.1293 128.154C78.8801 132.029 74.3474 134.75 70.471 136.029C68.5321 136.668 66.7802 136.94 65.3216 136.832C63.8665 136.724 62.7326 136.242 61.9664 135.401C61.2001 134.561 60.8243 133.388 60.8503 131.929C60.8764 130.467 61.3076 128.747 62.1227 126.875C63.7522 123.132 66.8778 118.869 71.127 114.993C75.3762 111.118 79.9089 108.397 83.7853 107.118C85.7242 106.479 87.4761 106.207 88.9348 106.315C90.3898 106.423 91.5237 106.905 92.29 107.746C93.0562 108.586 93.4321 109.759 93.406 111.218C93.3799 112.68 92.9487 114.4 92.1337 116.272C90.5041 120.015 87.3785 124.278 83.1293 128.154Z"
					fill="#3c4d39"
					stroke="#3c4d39"
					strokeWidth={1.5}
				/>
				<rect
					style={{
						display: getDisplayValue("horizontalBar"),
					}}
					id="horizontalBar"
					x="69.5"
					y="12.5"
					width="12"
					height="137"
					transform="rotate(-90 69.5 12.5)"
					fill="#FFFCF7"
					stroke="#3c4d39"
					strokeWidth={1.5}
				/>
				<rect
					style={{
						display: getDisplayValue("body"),
					}}
					id="body"
					x="73.5"
					y="116.5"
					width="1"
					height="100"
					fill="#3c4d39"
					stroke="#3c4d39"
					strokeWidth={1.5}
				/>
				<rect
					style={{
						display: getDisplayValue("leg1"),
					}}
					id="leg1"
					x="73.217"
					y="216.676"
					width="1"
					height="97"
					transform="rotate(28.0012 73.217 216.676)"
					fill="#3c4d39"
					stroke="#3c4d39"
					strokeWidth={1.5}
				/>
				<rect
					style={{
						display: getDisplayValue("leg2"),
					}}
					id="leg2"
					x="73.4389"
					y="216.683"
					width="1"
					height="97"
					transform="rotate(-30 73.4389 216.683)"
					fill="#3c4d39"
					stroke="#3c4d39"
					strokeWidth={1.5}
				/>
				<rect
					style={{
						display: getDisplayValue("arm1"),
					}}
					id="arm1"
					x="1.20323"
					y="191.314"
					width="1"
					height="85.0327"
					transform="rotate(-121.128 1.20323 191.314)"
					fill="#3c4d39"
					stroke="#3c4d39"
					strokeWidth={1.5}
				/>
				<rect
					style={{
						display: getDisplayValue("arm2"),
					}}
					id="arm2"
					x="148.562"
					y="189.183"
					width="1"
					height="85.0327"
					transform="rotate(120 148.562 189.183)"
					fill="#3c4d39"
					stroke="#3c4d39"
					strokeWidth={1.5}
				/>
				<circle
					style={{
						display: getDisplayValue("head"),
					}}
					id="head"
					cx="74.2559"
					cy="88.5"
					r="30"
					fill="#FFFCF7"
					stroke="#3c4d39"
					strokeWidth={1.5}
				/>
			</svg>
		</div>
	);
};

export default HangedMan;
