"use client";

import { Product } from "@/payload-types";
import { ProductItem } from "@/components/product/ProductItem";

export const Products = ({ products }: { products: Product[] }) => {
	return (
		<div className={"flex flex-col gap-2"}>
			{products.map((product, index) => {
				return <ProductItem product={product} key={index} />;
			})}
		</div>
	);
};
