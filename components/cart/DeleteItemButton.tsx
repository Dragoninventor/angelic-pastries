"use client";

import { useCart } from "@payloadcms/plugin-ecommerce/client/react";
import { XIcon } from "lucide-react";
import { cn } from "@/utils/cn";
import { CartItem } from "@/components/cart";
import { SyntheticEvent } from "react";

export const DeleteItemButton = ({ item }: { item: CartItem }) => {
	const { isLoading, removeItem } = useCart();
	const itemId = item.id;

	return (
		<form>
			<button
				aria-label={"Remove cart item"}
				className={cn(
					"ease bg-sage-200 text-vanilla-950 hover:bg-sage-300 flex cursor-pointer items-center justify-center rounded-full border border-slate-50 p-1 transition-colors duration-200",
					{
						"cursor-not-allowed": !itemId || isLoading,
					},
				)}
				onClick={(event: SyntheticEvent<HTMLButtonElement>) => {
					event.preventDefault();

					if (itemId) void removeItem(itemId);
				}}
				type={"button"}
			>
				<XIcon className={"size-4"} />
			</button>
		</form>
	);
};
