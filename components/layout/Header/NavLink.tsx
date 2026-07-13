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
				className={`${font_sitenav.className} text-sage-700 hover:text-sage-950 peer text-4xl tracking-tight transition-colors aria-[current=page]:underline aria-[current=page]:underline-offset-4 md:text-2xl md:tracking-tight`}
				aria-current={href === pathname ? "page" : undefined}
				onClick={onClick}
			>
				{children}
			</Link>
		</div>
	);
};

export default NavLink;
