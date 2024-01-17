/** @type {import('tailwindcss').Config} */

const distances = {
	"0125vw": "0.125vw",
	"015vw": "0.15vw",
	"1vw": "1vw",
	"2vw": "2vw",
};
const shadows = {
	text: "0 3px 3px 0px rgba(0, 0, 0, 0.3)",
	card: "4px 4px 8px 0 rgba(0, 0, 0, 0.3)",
	"inside-card": "2px 4px 6px 0 rgba(0, 0, 0, 0.3)",
};

module.exports = {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		fontFamily: {
			blaka: "var(--font-blaka), sans-serif",
			dela: "var(--font-dela), sans-serif",
		},
		colors: {
			military: "#3c4d39",
			yellow: "#fff267",
			black: "#000",
			lime: "#5EFC5B",
			cream: "#F7EBDB",
		},
		fontSize: {
			"6xl": "4.25vw",
			"5xl": "4vw",
			"4xl": "2.5rem",
			"3xl": "2rem",
			"2xl": "1.75rem",
			xl: "1.5rem",
			lg: "1.25rem",
		},
		extend: {
			backgroundImage: {
				"gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
				"gradient-conic":
					"conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
			},
			transitionTimingFunction: {
				"bouncy-1": "cubic-bezier(0.68, -0.55, 0.27, 1.55)",
			},
			transitionProperty: {
				height: "height",
				width: "width",
				size: "width, height",
			},
			borderWidth: {
				...distances,
			},
			margin: {
				...distances,
			},
			boxShadow: {
				...shadows,
			},
			dropShadow: {
				...shadows,
			},
		},
	},
	plugins: [],
	safelist: [
		{ pattern: /font-/ },
		{ pattern: /scale-/, variants: ["md", "lg"] },
		{ pattern: /text-/ },
		{ pattern: /w-/, variants: ["md", "lg"] },
		{ pattern: /h-/, variants: ["md", "lg"] },
	],
};
