"use client";

import React from "react";

export const Hamburger = ({
	active,
	onClick,
}: {
	active: boolean;
	onClick: () => void;
}) => {
	return (
		<button
			onClick={onClick}
			className="absolute right-8 z-20 flex h-8 w-8 cursor-pointer flex-col items-center justify-center focus:outline-none md:hidden"
			aria-label="Toggle Menu"
		>
			<span
				className={`bg-sage-800 absolute block h-0.5 w-6 transition-all duration-200 ease-in-out ${
					active ? "rotate-45" : "-translate-y-1.5"
				}`}
			></span>
			<span
				className={`bg-sage-800 absolute block h-0.5 w-6 transition-all duration-200 ease-in-out ${
					active ? "opacity-0" : ""
				}`}
			></span>
			<span
				className={`bg-sage-800 absolute block h-0.5 w-6 transition-all duration-200 ease-in-out ${
					active ? "-rotate-45" : "translate-y-1.5"
				}`}
			></span>
		</button>
	);
};
