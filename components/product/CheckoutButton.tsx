"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@payloadcms/plugin-ecommerce/client/react";
import { useMemo } from "react";
import { ShoppingCart } from "lucide-react";

export const CheckoutButton = () => {
	const { cart } = useCart();

	const quantity = useMemo(() => {
		if (!cart || !cart.items || !cart.items.length) return undefined;

		return cart.items.reduce(
			(quantity, item) => (item.quantity || 0) + quantity,
			0,
		);
	}, [cart]);

	if (quantity) {
		return (
			<Button variant={"vibrant"} size={"lg"} className={"w-fit gap-1"}>
				<ShoppingCart className={"h-4 w-4"} />
				<span>Checkout</span>
			</Button>
		);
	}

	return null;
};
