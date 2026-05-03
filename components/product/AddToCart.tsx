"use client";

import { Product, Variant } from "@/payload-types";
import { useCart } from "@payloadcms/plugin-ecommerce/client/react";
import { FormEvent, useCallback, useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useNotification } from "@/components/Providers/NotificationProvider";

export const AddToCart = ({
	product,
	quantity,
	disabled,
}: {
	product: Product;
	quantity?: number;
	disabled?: boolean;
}) => {
	const { addItem, cart } = useCart();
	const { showNotification } = useNotification();
	const selectVariantHintRef = useRef<HTMLParagraphElement>(null);
	const variants = product.variants?.docs || [];
	const searchParams = useSearchParams();
	const requiresVariantSelection =
		product.enableVariants && variants.length > 0;

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
	}, [product.enableVariants, variants, searchParams]);
	const needsSelection = Boolean(
		requiresVariantSelection && !selectedVariant,
	);

	const isDisabled = Boolean(disabled || needsSelection);
	const requiredVariantTypesString = product.variantTypes
		?.map((variantType) => {
			if (typeof variantType === "object") {
				return variantType.label.toLowerCase();
			}

			return null;
		})
		.join(", ");

	const addToCart = useCallback(
		(event: FormEvent<HTMLButtonElement>) => {
			event.preventDefault();

			// const defaultQuantity = product.quantities.
			const quantityToAdd = quantity && quantity > 0 ? quantity : 1;

			// Check limit
			const currentItemInCart = cart?.items?.find((item) => {
				const itemProductId =
					typeof item.product === "object"
						? item.product.id
						: item.product;
				const itemVariantId =
					typeof item.variant === "object"
						? item.variant?.id
						: item.variant;
				return (
					itemProductId === product.id &&
					itemVariantId === (selectedVariant?.id ?? undefined)
				);
			});
			const currentQuantity = currentItemInCart?.quantity || 0;
			const maxQuantity = product.quantities?.quantityMaximum || 999;

			if (currentQuantity + quantityToAdd > maxQuantity) {
				showNotification(
					`You cannot add more than ${maxQuantity} of this item to your cart.`,
					"error",
				);
				return;
			}

			addItem(
				{
					product: product.id,
					variant: selectedVariant?.id ?? undefined,
				},
				quantityToAdd,
			).then(() => {
				showNotification(`${product.title} added to cart.`, "success");
			});
		},
		[addItem, product, selectedVariant, quantity, cart, showNotification],
	);

	const handleClick = (event: FormEvent<HTMLButtonElement>) => {
		event.preventDefault();

		if (isDisabled) {
			selectVariantHintRef.current?.scrollIntoView({
				behavior: "smooth",
			});

			return;
		}

		void addToCart(event);
	};

	return (
		<div className={"flex flex-col gap-2"}>
			<Button
				aria-label={"Add to Cart"}
				variant={"vibrant"}
				onClick={handleClick}
				type={"submit"}
				className={"w-fit gap-1"}
				disabled={isDisabled}
				aria-disabled={isDisabled}
				aria-describedby={
					needsSelection ? "select-variant-hint" : undefined
				}
			>
				<Plus className={"h-4 w-4"} />
				<span>Add to Cart</span>
			</Button>
			{needsSelection && (
				<p
					ref={selectVariantHintRef}
					id={"select-variant-hint"}
					className={"ml-0.5 text-sm text-gray-700"}
				>
					Select a {requiredVariantTypesString} to add this item to
					your cart.
				</p>
			)}
		</div>
	);
};
