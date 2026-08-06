import type { Metadata } from "next";
import { ReactNode } from "react";

import "./globals.css";
import SiteHeader from "@/components/layout/Header";
import {
	font_default,
	font_hero,
	font_logo,
	font_sitenav,
} from "@/styles/fonts";
import { Providers } from "@/components/Providers";
import { Cart } from "@/components/cart";
import Script from "next/script";

export const metadata: Metadata = {
	title: "Angela's Store",
	description: "An online store for crochet and baked goods",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	return (
		<html lang="en-us">
			<body
				className={`${font_default.variable} ${font_hero.variable} ${font_logo.variable} ${font_sitenav.variable} ${font_default.className} bg-vanilla-50`}
			>
				<Providers>
					<SiteHeader />
					{children}
					<Cart />
				</Providers>
				{/* Google tag */}
				<Script
					src={
						"https://www.googletagmanager.com/gtag/js?id=AW-18311865890"
					}
					strategy={"afterInteractive"}
				/>
				<Script id={"gtag"} strategy={"afterInteractive"}>
					{`window.dataLayer = window.dataLayer || [];
					function gtag(){dataLayer.push(arguments);}
					gtag('js', new Date());
					gtag('config', 'AW-18311865890');
				`}
				</Script>
			</body>
		</html>
	);
}
