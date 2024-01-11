/** @type {import('tailwindcss').Config} */
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
		},
	},
	plugins: [],
	safelist: [
		{ pattern: /font-/ },
		{ pattern: /scale-/, variants: ["md", "lg"] },
		{ pattern: /text-/ },
	],
};
