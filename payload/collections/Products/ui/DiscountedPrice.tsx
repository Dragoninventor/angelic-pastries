"use client";
import React, { useEffect } from "react";
import { useField } from "@payloadcms/ui";
import { Price } from "@/components/ui/Price";
import { Variant } from "@/payload-types";

export const DiscountedPrice: React.FC<{ path: string }> = ({ path }) => {
	const parentPath = path.split(".").slice(0, -1).join(".");

	const { value: discountType } = useField<string>({
		path: `${parentPath}.discountAmount.discountType`,
	});
	const { value: discountPercentage } = useField<number>({
		path: `${parentPath}.discountAmount.discountPercentage`,
	});
	const { value: discountFixedAmount } = useField<number>({
		path: `${parentPath}.discountAmount.discountFixedAmount`,
	});

	const { value: enableVariants } = useField<boolean>({
		path: "enableVariants",
	});

	const { value: variants } = useField<{ docs: (Variant | string)[] }>({
		path: "variants",
	});

	const [variantPrices, setVariantPrices] = React.useState<number[]>([]);

	useEffect(() => {
		if (enableVariants && variants?.docs) {
			const fetchPrices = async () => {
				const prices = await Promise.all(
					variants.docs.map(async (v) => {
						if (typeof v === "object") {
							return v.priceInUSD;
						}
						// If it's an ID, fetch it
						try {
							const res = await fetch(`/api/variants/${v}`);
							if (res.ok) {
								const data = await res.json();
								return data.priceInUSD;
							}
						} catch (e) {
							// Silent error for fetch
						}
						return null;
					}),
				);
				const validPrices = prices.filter(
					(p): p is number => typeof p === "number",
				);
				setVariantPrices(validPrices);
			};
			void fetchPrices();
		} else {
			setVariantPrices([]);
		}
	}, [variants, enableVariants]);

	const { value: basePrice } = useField<number>({ path: "priceInUSD" });

	const calculateDiscountedPrice = (price: number) => {
		let discountedPrice = price;
		if (discountType === "percentage" && discountPercentage) {
			discountedPrice = price * (1 - discountPercentage / 100);
		} else if (discountType === "fixedAmount" && discountFixedAmount) {
			discountedPrice = price - discountFixedAmount;
		}
		return discountedPrice;
	};

	let content: React.ReactNode = null;

	if (enableVariants && variants?.docs?.length) {
		if (variantPrices.length > 0) {
			const minPrice = Math.min(...variantPrices);
			const maxPrice = Math.max(...variantPrices);

			const minDiscounted = calculateDiscountedPrice(minPrice);
			const maxDiscounted = calculateDiscountedPrice(maxPrice);

			if (minDiscounted === maxDiscounted) {
				content = <Price amount={minDiscounted} as={"span"} />;
			} else {
				content = (
					<Price
						lowestAmount={minDiscounted}
						highestAmount={maxDiscounted}
						as={"span"}
					/>
				);
			}
		} else {
			content = "N/A (No variant prices)";
		}
	} else if (basePrice) {
		const discountedPrice = calculateDiscountedPrice(basePrice);
		content = <Price amount={discountedPrice} as={"span"} />;
	} else {
		content = "N/A";
	}

	return (
		<div style={{ marginBottom: "20px" }}>
			<p>
				<strong>Estimated Price after this Discount: </strong>
				{content}
			</p>
		</div>
	);
};

export default DiscountedPrice;
