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
			className={`transition-width flex items-center justify-center duration-150 ${quantity ? "max-w-28" : "pointer-events-none max-w-0 delay-150"}${className ? ` ${className}` : ""}`}
		>
			<Button
				className={`${font_sitenav.className} gap-1.5 text-lg transition-opacity duration-150 ${quantity ? "opacity-100 delay-150" : "opacity-0"}`}
				{...props}
			>
				<ShoppingCart className={"h-4 w-4"} />
				<span className={"inline-flex gap-0.5"}>
					Cart
					{quantity && (
						<>
							<span>•</span>
							<span>{quantity}</span>
						</>
					)}
				</span>
			</Button>
		</div>
	);
};
