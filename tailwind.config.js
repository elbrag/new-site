/** @type {import('tailwindcss').Config} */

const distances = {
	18: "4.5rem",
	128: "32rem",
	144: "36rem",
	"0125vw": "0.125vw",
	"015vw": "0.15vw",
	"1vw": "1vw",
	"2vw": "2vw",
	"3vw": "3vw",
	"1/2": "50%",
	"2/3": "66.67%",
	"3/5": "60%",
	"80vh": "80vh",
};
const shadows = {
	text: "0 3px 3px 0px rgba(0, 0, 0, 0.3)",
	card: "4px 4px 8px 0 rgba(0, 0, 0, 0.3)",
	"inside-card": "2px 4px 6px 0 rgba(0, 0, 0, 0.3)",
	button: "2px 3px 0 0 #3c4d39, 1px 2px 0 0 #3c4d39",
	"button-hover":
		"4px 5px 0 0 #3c4d39, 3px 4px 0 0 #3c4d39, 2px 3px 0 0 #3c4d39, 1px 2px 0 0 #3c4d39, 0 1px 0 0 #3c4d39",
	"button-click": "1px 2px 0 0 #3c4d39",
};

module.exports = {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		fontFamily: {
			alegreya: "var(--font-alegreya), sans-serif",
			dela: "var(--font-dela), sans-serif",
		},
		colors: {
			military: "#3c4d39",
			yellow: "#fff267",
			black: "#000",
			lime: "#5EFC5B",
			cream: "#F7EBDB",
			paper: "#FFFCF7",
			confetti: {
				blue: "#8FD0FF",
				green: "#82FF80",
				yellow: "#F6FF8F",
				orange: "#FFAD72",
				red: "#FF6A6A",
				pink: "#FF9FF5",
				purple: "#B98FFF",
			},
		},
		fontSize: {
			"6xl": "4.25vw",
			"5xl": "4vw",
			"4xl": "2.5rem",
			"3xl": "2rem",
			"2xl": "1.75rem",
			xl: "1.5rem",
			"xl-sans": "1.35rem",
			lg: "1.25rem",
			base: "1rem",
			sm: "0.875rem",
		},
		extend: {
			backgroundImage: {
				"gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
				"gradient-conic":
					"conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
			},
			transitionTimingFunction: {
				"bouncy-1": "cubic-bezier(0.68, -0.55, 0.27, 1.55)",
				"bouncy-2": "cubic-bezier(0.68, 0.05, 0.27, 1.25)",
			},
			transitionProperty: {
				height: "height",
				width: "width",
				size: "width, height",
			},
			rotate: {
				4: "4deg",
				5: "5deg",
			},
			transitionDuration: {
				400: "400ms",
			},
			borderWidth: {
				...distances,
			},
			margin: {
				...distances,
			},
			padding: {
				...distances,
			},
			boxShadow: {
				...shadows,
			},
			dropShadow: {
				...shadows,
			},
			zIndex: {
				1: 1,
				2: 2,
			},
			maxWidth: {
				...distances,
			},
			minHeight: { ...distances },
			textUnderlineOffset: { 3: "3px", 5: "5px" },
		},
	},
	plugins: [],
	safelist: [
		{ pattern: /font-/ },
		{ pattern: /scale-/, variants: ["md", "lg"] },
		{ pattern: /text-/ },
		{ pattern: /w-/, variants: ["md", "lg"] },
		{ pattern: /h-/, variants: ["md", "lg"] },
		{ pattern: /bg-/, variants: ["md", "lg"] },
	],
};
