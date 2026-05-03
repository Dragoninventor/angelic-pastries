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
			className="relative z-50 flex h-8 w-8 flex-col items-center justify-center focus:outline-none md:hidden"
			aria-label="Toggle Menu"
		>
			<span
				className={`bg-sage-800 absolute block h-0.5 w-6 transition duration-500 ease-in-out ${
					active ? "rotate-45" : "-translate-y-1.5"
				}`}
			></span>
			<span
				className={`bg-sage-800 absolute block h-0.5 w-6 transition duration-500 ease-in-out ${
					active ? "opacity-0" : ""
				}`}
			></span>
			<span
				className={`bg-sage-800 absolute block h-0.5 w-6 transition duration-500 ease-in-out ${
					active ? "-rotate-45" : "translate-y-1.5"
				}`}
			></span>
		</button>
	);
};
