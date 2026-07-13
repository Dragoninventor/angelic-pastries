"use client";

import { Button } from "@/components/ui/button";
import { ComponentPropsWithoutRef, useMemo } from "react";
import { ShoppingCart } from "lucide-react";
import { font_sitenav } from "@/styles/fonts";
import { useCart } from "@payloadcms/plugin-ecommerce/client/react";

type OpenCartProps = {
	className?: string;
};
type Props = ComponentPropsWithoutRef<"button"> & OpenCartProps;

export const OpenCartButton = ({ className, ...props }: Props) => {
	const { cart } = useCart();

	const quantity = useMemo(() => {
		if (!cart || !cart.items || !cart.items.length) return undefined;

		return cart.items.reduce(
			(quantity, item) => (item.quantity || 0) + quantity,
			0,
		);
	}, [cart]);

	return (
		<div
			className={`fixed bottom-6 right-4 z-10 transition-opacity duration-150 ${quantity ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}${className ? ` ${className}` : ""}`}
		>
			<Button
				className={`${font_sitenav.className} relative h-16 w-16 rounded-full p-0 shadow shadow-gray-700/30`}
				{...props}
			>
				<ShoppingCart className={"h-5 w-5"} />
				{quantity && (
					<span
						className={
							"text-sage-700 bg-sage-50 absolute -right-1 -top-1 flex aspect-square h-6 w-6 items-center justify-center rounded-full text-xs shadow shadow-gray-700/30"
						}
					>
						{quantity}
					</span>
				)}
			</Button>
		</div>
	);
};
