"use client";

import { Product } from "@/payload-types";
import { useState } from "react";
import { QuantitySelector } from "@/components/product/QuantitySelector";
import { AddToCart } from "@/components/product/AddToCart";

export function OrderControls({ product }: { product: Product }) {
	const options = product.quantities.quantityOptions;
	const [quantity, setQuantity] = useState<number>(options[0]);
	const [quantityValid, setQuantityValid] = useState<boolean>(true);

	return (
		<div className={"flex flex-col gap-3"}>
			<QuantitySelector
				product={product}
				quantity={quantity}
				setQuantity={setQuantity}
				onValidityChange={setQuantityValid}
			/>
			<AddToCart
				product={product}
				quantity={quantity}
				disabled={!quantityValid}
			/>
		</div>
	);
}
