/** @type {import('tailwindcss').Config} */

let vwSizes = [];
for (var i = 0; i < 25; i++) {
	vwSizes[i] = `${i}vw`;
}

module.exports = {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		fontFamily: {
			blaka: "var(--font-blaka), sans-serif",
		},
		colors: {
			military: "#3c4d39",
			yellow: "#fff267",
			black: "#000",
			lime: "#5EFC5B",
			cream: "#F7EBDB",
		},
		fontSize: {
			"6xl": "7vw",
			"5xl": "6.5vw",
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
