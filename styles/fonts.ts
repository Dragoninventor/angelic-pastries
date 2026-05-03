import {
	Hurricane,
	Open_Sans,
	Oswald,
	Playfair_Display,
} from "next/font/google"; // Default Font

// Default Font
export const font_default = Open_Sans({
	subsets: ["latin"],
	variable: "--font-default",
	fallback: ["sans-serif"],
});

// Hero Header
export const font_hero = Playfair_Display({
	subsets: ["latin"],
	weight: "900",
	variable: "--font-hero",
});

// Logo
export const font_logo = Hurricane({
	subsets: ["latin"],
	weight: "400",
	variable: "--font-logo",
});

// Site Nav Links
export const font_sitenav = Oswald({
	subsets: ["latin"],
	weight: "300",
	variable: "--font-sitenav",
});
