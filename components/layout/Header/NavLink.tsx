"use client";

import { ReactNode } from "react";
import Link from "next/link";

import { usePathname } from "next/navigation";
import { font_sitenav } from "@/styles/fonts";

const NavLink = ({
	href,
	children,
	onClick,
}: {
	href: string;
	children: ReactNode;
	onClick?: () => void;
}) => {
	const pathname = usePathname();

	return (
		<div className={"flex flex-col"}>
			<Link
				href={href}
				className={`${font_sitenav.className} text-sage-700 hover:text-sage-950 peer text-xl transition-colors`}
				aria-current={href === pathname ? "page" : undefined}
				onClick={onClick}
			>
				{children}
			</Link>
			<span
				className={`border-sage-400 border-b opacity-0 peer-aria-[current=page]:opacity-100`}
			/>
		</div>
	);
};

export default NavLink;
