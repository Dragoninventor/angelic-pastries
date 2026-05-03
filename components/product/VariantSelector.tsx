"use client";

import { Button } from "@/components/ui/button";
import type { Product } from "@/payload-types";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { createUrl } from "@/utils/createUrl";

export function VariantSelector({ product }: { product: Product }) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const variants = product.variants?.docs?.filter(
		(variant) => typeof variant === "object",
	);
	const variantTypes = product.variantTypes?.filter(
		(type) => typeof type === "object",
	);
	const hasVariants = Boolean(
		product.enableVariants && variants?.length && variantTypes?.length,
	);

	if (!hasVariants) {
		return null;
	}

	return variantTypes?.map((variantType) => {
		if (!variantType || typeof variantType !== "object" || !variants) {
			return <></>;
		}

		const availableOptionsIds = new Set(
			variants.flatMap((variant) =>
				variant.options
					?.filter((option) => {
						const optionType =
							typeof option === "object"
								? typeof option.variantType === "object"
									? option.variantType.id
									: option.variantType
								: null;

						return optionType === variantType.id;
					})
					.map((option) =>
						typeof option === "object" ? option.id : option,
					),
			),
		);

		const options =
			variantType.options?.docs
				?.filter((option) => {
					if (typeof option !== "object") return false;

					return availableOptionsIds.has(option.id);
				})
				.filter((option) => typeof option === "object") || [];

		if (!options || !Array.isArray(options) || !options.length) {
			return <></>;
		}

		return (
			<dl className={""} key={variantType.id}>
				<dt className="mb-4 text-sm">{variantType.label}</dt>
				<dd className="flex flex-wrap gap-1">
					{options?.map((option, index) => {
						if (
							!option ||
							typeof option !== "object" ||
							!variants
						) {
							return null;
						}

						const optionID = option.id;
						const optionKeyLowerCase = variantType.name;

						const optionSearchParams = new URLSearchParams(
							searchParams.toString(),
						);

						// Update search params for this specific option category
						optionSearchParams.set(
							optionKeyLowerCase,
							String(optionID),
						);

						// Get values that would be in the URL if this option is clicked
						const targetOptions = Array.from(
							optionSearchParams.values(),
						);

						optionSearchParams.delete("variant");

						// Find a matching variant
						if (variants) {
							const matchingVariant = variants
								.filter(
									(variant) => typeof variant === "object",
								)
								.find((variant) => {
									if (
										!variant.options ||
										!Array.isArray(variant.options)
									)
										return false;

									// Check if the number of options matches to avoid partial matches
									if (
										variant.options.length !==
										variantTypes.length
									)
										return false;

									// Check if all variant options match the current options in the URL
									return variant.options.every(
										(variantOption) => {
											const variantId =
												typeof variantOption ===
												"object"
													? variantOption.id
													: variantOption;

											return targetOptions.includes(
												variantId,
											);
										},
									);
								});

							if (matchingVariant) {
								// If we found a matching variant, set the variant ID in the search params.
								optionSearchParams.set(
									"variant",
									String(matchingVariant.id),
								);
							}
						}

						const optionUrl = createUrl(
							pathname,
							optionSearchParams,
						);

						// The option is active if it's in the url params.
						const isActive =
							searchParams.get(optionKeyLowerCase) ===
							String(optionID);

						return (
							<Button
								// aria-disabled={!isAvailableForSale}
								// disabled={!isAvailableForSale}
								key={option.id}
								variant={
									isActive ? "secondary" : "secondary-outline"
								}
								size={"sm"}
								onClick={() => {
									if (isActive) {
										const newParams = new URLSearchParams(
											searchParams.toString(),
										);
										newParams.delete(optionKeyLowerCase);
										newParams.delete("variant");
										router.replace(
											createUrl(pathname, newParams),
											{
												scroll: false,
											},
										);
									} else {
										router.replace(`${optionUrl}`, {
											scroll: false,
										});
									}
								}}
								title={`${option.label}`}
							>
								{option.label}
							</Button>
						);
					})}
				</dd>
			</dl>
		);
	});
}
