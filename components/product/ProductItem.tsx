import { Product, Variant } from "@/payload-types";
import { Price } from "@/components/ui/Price";
import { Image } from "@/components/ui/Image";
import Link from "next/link";
import { cn } from "@/utils/cn";

type Props = {
	product: Product;
	style?: "compact" | "default";
	variant?: Variant;
	quantity?: number;
	currencyCode?: string;
};
export const ProductItem = ({
	product,
	style = "default",
	variant,
	quantity,
	currencyCode = "USD",
}: Props) => {
	const { title } = product;
	const compact = style === "compact";

	let image = product.gallery?.[0]?.image;

	const isVariant = Boolean(variant) && typeof variant === "object";

	if (isVariant) {
		const imageVariant = product.gallery?.find((item) => {
			if (!item.variantOption) return false;

			const variantOptionID =
				typeof item.variantOption === "object"
					? item.variantOption.id
					: item.variantOption;

			return variant?.options?.some((option) => {
				if (typeof option === "object")
					return option.id === variantOptionID;
				else return option === variantOptionID;
			});
		});

		if (imageVariant && typeof imageVariant.image !== "string") {
			image = imageVariant.image;
		}
	}

	const itemPrice = variant?.priceInUSD || product.priceInUSD;
	const itemURL = `/products/${product.slug}${variant ? `?variant=${variant.id}` : ""}`;

	return (
		<div className={"flex items-center gap-4"}>
			{image && (
				<div
					className={cn(
						"flex items-stretch justify-stretch rounded-lg shadow",
						compact ? "size-14" : "size-20",
					)}
				>
					<div className={"relative h-full w-full"}>
						<Image
							payloadImage={image}
							fill={true}
							className={"rounded-lg object-cover"}
						/>
					</div>
				</div>
			)}
			<div className={"flex grow items-center justify-between"}>
				<div
					className={cn(
						"flex flex-col",
						compact ? "gap-0.5" : "gap-1",
					)}
				>
					<p
						className={cn(
							"text-gray-800",
							compact ? "text-base" : "text-lg",
						)}
					>
						<Link href={`/products/${product.slug}`}>
							{product.title}
						</Link>
					</p>
					{variant && (
						<p
							className={cn(
								"text-sage-600 font-mono tracking-widest",
								compact ? "text-xs" : "text-sm",
							)}
						>
							{variant.options
								?.map((option) => {
									if (typeof option === "object")
										return option.label;

									return null;
								})
								.join(", ")}
						</p>
					)}
					{quantity && (
						<div
							className={cn(
								"inline-flex gap-0.5 font-mono text-gray-600",
								compact ? "text-sm" : "text-base",
							)}
						>
							<span>{"×"}</span>
							<span>{quantity}</span>
						</div>
					)}
				</div>
				{/* Item Price */}
				{itemPrice && quantity && (
					<Price
						amount={itemPrice * quantity}
						className={cn(
							"font-mono text-gray-800",
							compact ? "text-sm" : "text-md",
						)}
					/>
				)}
			</div>
		</div>
	);
};
