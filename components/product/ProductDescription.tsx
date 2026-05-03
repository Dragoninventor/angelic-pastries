"use client";
import type { Product, Variant } from "@/payload-types";

import { Price } from "@/components/ui/Price";
import React, { useMemo } from "react";

import { useCurrency } from "@payloadcms/plugin-ecommerce/client/react";
import { RichText } from "@/components/common/RichText";
import { useSearchParams } from "next/navigation";

export function ProductDescription({ product }: { product: Product }) {
	const searchParams = useSearchParams();

	const { currency } = useCurrency();
	let amount = 0,
		lowestAmount = 0,
		highestAmount = 0;
	const priceField = `priceIn${currency.code}` as keyof Product;
	const variants = (product.enableVariants && product.variants?.docs) || [];
	const hasVariants =
		product.enableVariants && Boolean(product.variants?.docs?.length);

	if (hasVariants) {
		const priceField = `priceIn${currency.code}` as keyof Variant;
		const variantsOrderedByPrice = product.variants?.docs
			?.filter((variant) => variant && typeof variant === "object")
			.sort((a, b) => {
				if (
					typeof a === "object" &&
					typeof b === "object" &&
					priceField in a &&
					priceField in b &&
					typeof a[priceField] === "number" &&
					typeof b[priceField] === "number"
				) {
					return a[priceField] - b[priceField];
				}

				return 0;
			}) as Variant[];

		const lowestVariant = variantsOrderedByPrice[0][priceField];
		const highestVariant =
			variantsOrderedByPrice[variantsOrderedByPrice.length - 1][
				priceField
			];
		if (
			variantsOrderedByPrice &&
			typeof lowestVariant === "number" &&
			typeof highestVariant === "number"
		) {
			lowestAmount = lowestVariant;
			highestAmount = highestVariant;
		}
	} else if (product[priceField] && typeof product[priceField] === "number") {
		amount = product[priceField];
	}

	const selectedVariant = useMemo<Variant | undefined>(() => {
		if (product.enableVariants && variants.length) {
			const variantId = searchParams.get("variant");

			const validVariant = variants.find((variant) => {
				if (typeof variant === "object") {
					return String(variant.id) === variantId;
				}

				return String(variant) === variantId;
			});

			if (validVariant && typeof validVariant === "object") {
				return validVariant;
			}
		}

		return undefined;
	}, [product.enableVariants, searchParams, variants]);

	const displayPrice = useMemo(() => {
		if (selectedVariant?.priceInUSD) {
			return (
				<Price
					className={
						"rounded-sm bg-slate-200 px-2.5 py-1 text-slate-900"
					}
					amount={selectedVariant.priceInUSD}
				/>
			);
		}

		if (hasVariants && lowestAmount && highestAmount) {
			return (
				<Price
					className={
						"rounded-sm bg-slate-200 px-2.5 py-1 text-slate-900"
					}
					lowestAmount={lowestAmount}
					highestAmount={highestAmount}
				/>
			);
		}

		if (product.priceInUSD) {
			return (
				<Price
					className={
						"rounded-sm bg-slate-200 px-2.5 py-1 text-slate-900"
					}
					amount={product.priceInUSD}
				/>
			);
		}

		return null;
	}, [
		selectedVariant,
		hasVariants,
		lowestAmount,
		highestAmount,
		product.priceInUSD,
	]);

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
				<h1 className="mb-2 text-2xl font-medium">{product.title}</h1>
				{displayPrice}
			</div>
			{product.description ? (
				<RichText className={""} data={product.description} />
			) : null}
		</div>
	);
}
