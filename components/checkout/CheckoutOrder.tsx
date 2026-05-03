"use client";

import { useCart } from "@payloadcms/plugin-ecommerce/client/react";
import { Image } from "@/components/ui/Image";
import { Price } from "@/components/ui/Price";
import { Cart } from "@/payload-types";

export const CheckoutOrder = () => {
	const { cart }: { cart: Cart } = useCart();

	return (
		<div className="bg-primary/5 flex w-full basis-full flex-col rounded-lg border-none lg:basis-1/3 lg:pl-8">
			<h2 className="mb-2 text-xl">Your order</h2>
			<div className={"flex flex-col"}>
				{cart?.items?.map((item, index) => {
					if (typeof item.product === "object" && item.product) {
						const {
							product,
							product: { id, title, gallery },
							quantity,
							variant,
						} = item;

						if (!quantity) return null;

						let image = gallery?.[0]?.image;
						let price = product?.priceInUSD;

						const isVariant =
							Boolean(variant) && typeof variant === "object";

						if (isVariant) {
							price = variant?.priceInUSD;

							const imageVariant = product.gallery?.find(
								(item) => {
									if (!item.variantOption) return false;
									const variantOptionID =
										typeof item.variantOption === "object"
											? item.variantOption.id
											: item.variantOption;

									return variant?.options?.some((option) => {
										if (typeof option === "object")
											return (
												option.id === variantOptionID
											);
										else return option === variantOptionID;
									});
								},
							);

							if (
								imageVariant &&
								typeof imageVariant.image !== "string"
							) {
								image = imageVariant.image;
							}
						}

						return (
							<div
								className="flex items-center gap-4 border-t border-gray-200 py-4 first-of-type:border-none md:py-5"
								key={index}
							>
								<div className="flex size-16 items-stretch justify-stretch overflow-hidden rounded-lg shadow shadow-gray-700/30 lg:size-20">
									<div className="relative flex h-full w-full">
										{image && typeof image !== "string" && (
											<Image
												payloadImage={image}
												className={
													"aspect-square min-w-full object-cover"
												}
											/>
										)}
									</div>
								</div>
								<div className="flex grow items-center justify-between gap-4">
									<div className="flex flex-col">
										<p className="text-lg font-medium text-gray-800">
											{title}
										</p>
										{variant &&
											typeof variant === "object" && (
												<p className="text-sage-600 font-mono text-xs tracking-widest">
													{variant.options
														?.map((option) => {
															if (
																typeof option ===
																"object"
															)
																return option.label;
															return null;
														})
														.join(", ")}
												</p>
											)}
										<div
											className={
												"flex gap-0.5 text-gray-700"
											}
										>
											<span>{"×"}</span>
											<span>{quantity}</span>
										</div>
									</div>
									{typeof price === "number" && (
										<Price
											amount={price * quantity}
											className={"text-gray-900"}
										/>
									)}
								</div>
							</div>
						);
					}
					return null;
				})}
			</div>
			<hr className={"my-2 h-px border-0 bg-gray-500"} />
			<div
				className={
					"flex items-center justify-between gap-2 py-2 text-gray-900"
				}
			>
				<span className={""}>Total:</span>{" "}
				<Price
					className="text-xl font-medium"
					amount={cart.subtotal || 0}
				/>
			</div>
		</div>
	);
};
