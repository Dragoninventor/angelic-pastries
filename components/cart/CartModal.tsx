"use client";

import { useCart } from "@payloadcms/plugin-ecommerce/client/react";
import {
	ComponentPropsWithoutRef,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { usePathname } from "next/navigation";
import { OpenCartButton } from "@/components/cart/OpenCart";
import Link from "next/link";
import { Image } from "@/components/ui/Image";
import { Price } from "@/components/ui/Price";
import { Button } from "@/components/ui/button";
import { Cart, Product } from "@/payload-types";
import { ShoppingCart } from "lucide-react";
import { DeleteItemButton } from "@/components/cart/DeleteItemButton";
import { EditItemQuantity } from "@/components/cart/EditItemQuantity";

type CartModalProps = {
	// isOpen: boolean;
};
type Props = ComponentPropsWithoutRef<"dialog"> & CartModalProps;
export const CartModal = ({ ...props }: Props) => {
	const ref = useRef<HTMLDialogElement>(null);
	const { cart }: { cart: Cart } = useCart();
	const [open, setOpen] = useState(false);

	const totalQuantity = useMemo(() => {
		if (!cart || !cart.items || !cart.items.length) return undefined;

		return cart.items.reduce(
			(quantity, item) => (item.quantity || 0) + quantity,
			0,
		);
	}, [cart]);

	useEffect(() => {
		if (open) {
			ref.current?.showModal();
			document.body.classList.add("modal-open");
		} else {
			ref.current?.close();
			document.body.classList.remove("modal-open");
		}
	}, [open]);

	const pathname = usePathname();

	useEffect(() => {
		setOpen(false);
	}, [pathname]);

	return (
		<>
			<OpenCartButton onClick={() => setOpen((prev) => !prev)} />
			<dialog
				ref={ref}
				onCancel={() => setOpen(false)}
				className={
					"container mx-auto my-7 w-full rounded-lg bg-slate-50 px-4 py-7 shadow-2xl"
				}
			>
				<div className={"flex w-full flex-col items-center"}>
					<div className={"flex w-full max-w-4xl flex-col"}>
						<h2
							className={
								"mb-6 text-center text-2xl text-gray-950"
							}
						>
							My Cart
						</h2>
						{!cart || cart?.items?.length === 0 ? (
							<div
								className={
									"my-4 flex flex-col items-center gap-2 text-center"
								}
							>
								<ShoppingCart
									className={"size-16 text-gray-300"}
								/>
								<p className={"text-center text-gray-700"}>
									You have no items in your cart.
								</p>
							</div>
						) : (
							<div className={"flex grow px-4"}>
								<div
									className={
										"flex w-full flex-col justify-between"
									}
								>
									<ul className={"grow overflow-auto py-4"}>
										{cart?.items?.map((item, index) => {
											const product = item.product;
											const variant = item.variant;

											if (
												typeof product !== "object" ||
												!item ||
												!product ||
												!product.slug
											)
												return null;

											let image =
												typeof product.gallery?.[0]
													.image === "object"
													? product.gallery?.[0].image
													: null;
											let price = product.priceInUSD;

											const isVariant =
												Boolean(variant) &&
												typeof variant === "object";

											if (isVariant) {
												price = variant?.priceInUSD;

												const imageVariant =
													product.gallery?.find(
														(item) => {
															if (
																!item.variantOption
															)
																return false;
															const variantOptionID =
																typeof item.variantOption ===
																"object"
																	? item
																			.variantOption
																			.id
																	: item.variantOption;

															return variant?.options?.some(
																(option) => {
																	if (
																		typeof option ===
																		"object"
																	)
																		return (
																			option.id ===
																			variantOptionID
																		);
																	else
																		return (
																			option ===
																			variantOptionID
																		);
																},
															);
														},
													);

												if (
													imageVariant &&
													typeof imageVariant.image ===
														"object"
												) {
													image = imageVariant.image;
												}
											}

											return (
												<li
													key={index}
													className={
														"flex w-full flex-col"
													}
												>
													<div
														className={
															"relative flex w-full flex-row justify-between px-1 py-4"
														}
													>
														<div className="absolute z-40 -mt-2 ml-12">
															<DeleteItemButton
																item={item}
															/>
														</div>
														<Link
															href={`/products/${(item.product as Product)?.slug}`}
														>
															<div
																className={
																	"bg-sage-50 relative h-16 w-16 cursor-pointer overflow-hidden rounded border border-gray-300"
																}
															>
																{image && (
																	<Image
																		payloadImage={
																			image
																		}
																	/>
																)}
															</div>
															<div
																className={
																	"flex flex-1 flex-col text-base"
																}
															>
																<span
																	className={
																		"text-gray-800"
																	}
																>
																	{
																		product?.title
																	}
																</span>
																{isVariant &&
																variant ? (
																	<p
																		className={
																			"text-sm capitalize text-gray-500"
																		}
																	>
																		{variant.options
																			?.map(
																				(
																					option,
																				) => {
																					if (
																						typeof option ===
																						"object"
																					)
																						return option.label;

																					return null;
																				},
																			)
																			.join(
																				", ",
																			)}
																	</p>
																) : null}
															</div>
														</Link>
														<div
															className={
																"flex h-16 flex-col justify-between"
															}
														>
															{typeof price ===
																"number" && (
																<Price
																	amount={
																		price *
																		item.quantity
																	}
																	className={
																		"flex justify-end space-y-2 text-right text-sm"
																	}
																/>
															)}
															<EditItemQuantity
																item={item}
															/>
														</div>
													</div>
												</li>
											);
										})}
									</ul>
									<div className="py-4 text-sm text-neutral-500 dark:text-neutral-400">
										{typeof cart?.subtotal === "number" && (
											<div className="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 pt-1 dark:border-neutral-700">
												<p className={"text-slate-600"}>
													Total
												</p>
												<Price
													amount={cart?.subtotal}
													className="text-right text-xl text-slate-900"
												/>
											</div>
										)}

										<Button
											variant={"vibrant"}
											size={"lg"}
											className={"w-full sm:w-fit"}
											asChild
										>
											<Link
												// className="w-full"
												href="/checkout"
											>
												Proceed to Checkout
											</Link>
										</Button>
									</div>
								</div>
							</div>
						)}
					</div>
				</div>
			</dialog>
		</>
	);
};
