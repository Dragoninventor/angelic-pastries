"use client";

import React, { useEffect, useState } from "react";
import NavLink from "@/components/layout/Header/NavLink";
import { Hamburger } from "./Hamburger";
import { cn } from "@/utils/cn";
import { usePathname } from "next/navigation";

const Nav = ({ authenticated = false }: { authenticated?: boolean }) => {
	const [open, setOpen] = useState(false);
	const [smoothTransition, setSmoothTransition] = useState(true);

	const pathname = usePathname();

	const toggleNav = () => {
		setSmoothTransition(true);
		setOpen((open) => !open);
	};

	const closeNav = (smooth: boolean = false) => {
		setSmoothTransition(smooth);
		setOpen(false);
	};

	useEffect(() => {
		if (open) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}

		return () => {
			document.body.style.overflow = "";
		};
	}, [open]);

	useEffect(() => {
		closeNav();
	}, [pathname]);

	return (
		<>
			<Hamburger active={open} onClick={() => toggleNav()} />
			<nav
				className={cn(
					"fixed inset-0 z-10 flex w-full flex-col items-center overflow-hidden px-6 pt-20 ease-in-out md:relative md:inset-auto md:right-8 md:z-auto md:flex md:translate-x-0 md:flex-row md:justify-end md:gap-10 md:bg-transparent md:px-0 md:pt-0 md:transition-none",
					open
						? "bg-sage-100 translate-x-0 delay-[0s,0.2s]"
						: "bg-sage-200 translate-x-full delay-[0.2s,0s] md:translate-x-0",
					smoothTransition
						? "transition-[translate,background-color] duration-[0.2s,0.2s]"
						: "",
				)}
			>
				<div
					className={
						"border-sage-300 mt-12 flex w-full flex-col items-end gap-6 border-y py-8 transition-[border-color] delay-200 duration-200 md:mt-0 md:flex-row md:justify-end md:gap-8 md:border-none md:py-0"
					}
				>
					<NavLink href={"/"} onClick={() => closeNav()}>
						Home
					</NavLink>
					{authenticated && (
						<NavLink href={"/admin"} onClick={() => closeNav()}>
							Dashboard
						</NavLink>
					)}
				</div>
			</nav>
		</>
	);
};

export default Nav;
