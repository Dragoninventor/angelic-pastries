"use client";

import { CartItem } from "@/components/cart";
import { useCart } from "@payloadcms/plugin-ecommerce/client/react";
import { cn } from "@/utils/cn";
import { SyntheticEvent } from "react";
import { MinusIcon, PlusIcon } from "lucide-react";

export const EditItemQuantityButton = ({
	item,
	type,
}: {
	item: CartItem;
	type: "minus" | "plus";
}) => {
	const { addItem } = useCart();

	const product =
		item.product && typeof item.product !== "string" ? item.product : null;
	const step = product?.quantities?.quantitySet ?? 1;

	const isDisabled =
		type === "plus"
			? item.quantity >=
				(product?.quantities?.quantityMaximum ?? Infinity)
			: item.quantity <= (product?.quantities?.quantityMinimum ?? 0);

	return (
		<form>
			<button
				type={"button"}
				disabled={isDisabled}
				aria-label={
					type === "plus"
						? "Increase item quantity"
						: "Reduce item quantity"
				}
				className={cn(
					"ease flex h-full min-h-8 flex-none cursor-pointer items-center justify-center rounded-full transition-all duration-200 hover:border-neutral-800 hover:opacity-80",
					{
						"cursor-not-allowed": isDisabled,
						"ml-auto": type === "minus",
						"opacity-50": isDisabled,
					},
				)}
				onClick={(event: SyntheticEvent<HTMLButtonElement>) => {
					event.preventDefault();

					if (
						item.product &&
						typeof item.product !== "string" &&
						item.id &&
						!isDisabled
					) {
						void addItem(
							{
								product: item.product.id,
								variant:
									typeof item.variant === "object"
										? item.variant?.id
										: item.variant,
							},
							type === "plus" ? step : -step,
						);
					}
				}}
			>
				{type === "plus" ? (
					<div className={"bg-sage-300 rounded-r-full p-2"}>
						<PlusIcon className={"size-4"} />
					</div>
				) : (
					<div className={"bg-sage-300 rounded-l-full p-2"}>
						<MinusIcon className={"size-4"} />
					</div>
				)}
			</button>
		</form>
	);
};
