"use client";

import React, { useState } from "react";
import NavLink from "@/components/layout/Header/NavLink";
import { Cart } from "@/components/cart";
import { Hamburger } from "./Hamburger";
import { cn } from "@/utils/cn";

const Nav = () => {
	const [open, setOpen] = useState(false);
	const authenticated = true;

	return (
		<>
			<Hamburger active={open} onClick={() => setOpen(!open)} />

			{/* Desktop Nav */}
			<nav className={"hidden items-center gap-10 md:flex"}>
				<NavLink href={"/"}>Home</NavLink>
				<NavLink href={"/contact"}>Contact</NavLink>
				{/*<NavLink href={"/checkout"}>Order Now</NavLink>*/}
				{authenticated && <NavLink href={"/admin"}>Dashboard</NavLink>}
				<Cart />
			</nav>

			{/* Mobile Nav Overlay */}
			<nav
				className={cn(
					"bg-sage-200 fixed inset-0 z-40 flex flex-col items-center justify-center gap-8 transition-transform duration-300 ease-in-out md:hidden",
					open ? "translate-x-0" : "translate-x-full",
				)}
			>
				<NavLink href={"/"} onClick={() => setOpen(false)}>
					Home
				</NavLink>
				<NavLink href={"/contact"} onClick={() => setOpen(false)}>
					Contact
				</NavLink>
				{authenticated && (
					<NavLink href={"/admin"} onClick={() => setOpen(false)}>
						Dashboard
					</NavLink>
				)}
				<div onClick={() => setOpen(false)}>
					<Cart />
				</div>
			</nav>
		</>
	);
};

export default Nav;
