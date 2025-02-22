/** @type {import('tailwindcss').Config} */

const distances = {
	18: "4.5rem",
	19: "4.75rem",
	22: "5.5rem",
	30: "7.5rem",
	34: "8.5rem",
	128: "32rem",
	144: "36rem",
	184: "46rem",
	200: "50rem",
	"0125vw": "0.125vw",
	"015vw": "0.15vw",
	"025vw": "0.25vw",
	"0375vw": "0.375vw",
	"1vw": "1vw",
	"2vw": "2vw",
	"3vw": "3vw",
	"1/2": "50%",
	"2/3": "66.67%",
	"3/5": "60%",
	"50vh": "50vh",
	"60vh": "60vh",
	"70vh": "70vh",
	"80vh": "80vh",
	inherit: "inherit",
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
			lime: "#7ffd45",
			cream: "#F7EBDB",
			paper: "#FFFCF7",
			line1: "#e2e2e2",
			line2: "#e8e8e8",
			error: "#FF6A6A",
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
			// rem sizes
			"5xl": "3.375rem",
			"4xl": "2.5rem",
			"3xl": "2rem",
			"2xl": "1.75rem",
			xl: "1.5rem",
			"xl-sans": "1.35rem",
			lg: "1.25rem",
			md: "1.125rem",
			base: "1rem",
			sm: "0.875rem",
			// vw sizes
			"2xl-vw": "14vw",
			"xl-vw": "7vw",
			"lg-vw": "5vw",
			"md-vw": "4.25vw",
			"sm-vw": "4vw",
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
				8: "8deg",
				10: "10deg",
				15: "15deg",
				20: "20deg",
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
			width: {
				...distances,
			},
			height: {
				...distances,
			},
			inset: {
				...distances,
			},
			minHeight: { ...distances },
			aspectRatio: {
				"9/13": "9 / 13",
			},
			textUnderlineOffset: { 3: "3px", 5: "5px" },
			screens: {
				xs: "480px",
			},
			keyframes: {
				blinkColors: {
					"0%, 100%": {
						"--tw-bg-opacity": "0",
						backgroundColor: "theme(colors.paper)",
					},
					"50%": {
						"--tw-bg-opacity": "1",
						backgroundColor: "theme(colors.lime)",
					},
				},
				wiggle1: {
					"0%, 100%": { transform: "rotate(-8deg)" },
					"50%": { transform: "rotate(-4deg)" },
				},
				wiggle2: {
					"0%, 100%": { transform: "rotate(-12deg)" },
					"50%": { transform: "rotate(-14deg)" },
				},
				wiggle3: {
					"0%, 100%": { transform: "rotate(10deg)" },
					"50%": { transform: "rotate(12deg)" },
				},
			},
			animation: {
				blinkColors: "blinkColors 1s infinite",
				wiggle1: "wiggle1 1s ease-in-out infinite",
				wiggle2: "wiggle2 1s ease-in-out infinite",
				wiggle3: "wiggle3 1s ease-in-out infinite",
			},
			grayscale: {
				70: "70%",
			},
			scale: {
				108: "108%",
			},
		},
	},
	plugins: [],
	safelist: [
		{ pattern: /font-/ },
		{ pattern: /border-/, variants: ["sm", "md", "lg"] },
		{ pattern: /scale-/, variants: ["md", "lg", "hover"] },
		{ pattern: /rotate-/, variants: ["md", "lg", "hover"] },
		{ pattern: /grid-cols-/, variants: ["md", "lg"] },
		{ pattern: /text-/ },
		{ pattern: /w-/, variants: ["md", "lg"] },
		{ pattern: /translate-x-/, variants: ["md", "lg", "hover", "active"] },
		{ pattern: /-translate-x-/, variants: ["md", "lg", "hover", "active"] },
		{ pattern: /translate-y-/, variants: ["md", "lg", "hover", "active"] },
		{ pattern: /-translate-y-/, variants: ["md", "lg", "hover", "active"] },
		{ pattern: /shadow-/, variants: ["md", "lg", "hover", "active"] },
		"active:shadow-button-click",
		"active:translate-x-px",
		"active:translate-y-[2px]",
		"hover:shadow-button-hover",
		"hover:-translate-y-[2px]",
		"hover:-translate-x-[2px]",
		{ pattern: /h-/, variants: ["md", "lg"] },
		{ pattern: /bg-/, variants: ["md", "lg"] },
	],
};
