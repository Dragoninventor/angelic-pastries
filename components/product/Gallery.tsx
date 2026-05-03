"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Media, Product } from "@/payload-types";
import { Image } from "@/components/ui/Image";
import { DefaultDocumentIDType } from "payload";

type Props = {
	product: Product;
};
export const Gallery = ({ product }: Props) => {
	const searchParams = useSearchParams();

	const gallery = useMemo(
		() =>
			product.gallery
				?.filter((item) => typeof item.image === "object")
				.map((item) => ({
					...item,
					image: item.image as Media,
				})) || [],
		[product.gallery],
	);

	const [currentIndex, setCurrentIndex] = useState(0);
	const totalSlides = gallery.length;

	const showSlide = (index: number) => {
		// Ensure index is within bounds
		if (index >= totalSlides) setCurrentIndex(0);
		else if (index < 0) setCurrentIndex(totalSlides - 1);
		else setCurrentIndex(index);
	};

	useEffect(() => {
		const values = Array.from(searchParams.values());

		if (values) {
			const index = gallery.findIndex((item) => {
				if (!item.variantOption) return false;

				let variantId: DefaultDocumentIDType;

				if (typeof item.variantOption === "object") {
					variantId = item.variantOption.id;
				} else {
					variantId = item.variantOption;
				}

				return Boolean(
					values.find((value) => value === String(variantId)),
				);
			});

			if (index !== -1) {
				setCurrentIndex(index);
			}
		}
	}, [searchParams]);

	const moveCarousel = (direction: number) => {
		showSlide(currentIndex + direction);
	};

	const currentSlide = (index: number) => {
		showSlide(index - 1);
	};

	if (Boolean(gallery?.length)) {
		return (
			<div className={"relative flex flex-col gap-2 lg:flex-row"}>
				<div
					className={
						"order-1 h-fit w-full overflow-hidden rounded lg:order-2"
					}
				>
					<div
						className={
							"flex w-full rounded transition-transform duration-500"
						}
						style={{
							transform: `translateX(-${currentIndex * 100}%)`,
						}}
					>
						{gallery.map((item, index) => {
							if (typeof item.image !== "object") return null;

							return (
								<Image
									key={index}
									payloadImage={item.image}
									className={
										"aspect-square min-w-full object-cover"
									}
								/>
							);
						})}
					</div>
				</div>
				<div
					className={`relative order-2 flex w-full flex-row gap-2 overflow-x-auto lg:order-1 lg:h-full lg:w-20 lg:flex-col lg:overflow-y-auto`}
					data-slot={"carousel-content"}
				>
					{gallery.map((item, index) => {
						return (
							<div
								role={"group"}
								aria-roledescription={"slide"}
								data-slot={"carousel-item"}
								className={
									"relative flex w-20 shrink-0 lg:w-full"
								}
								key={index}
								onClick={() => setCurrentIndex(index)}
							>
								<Image
									payloadImage={item.image}
									className={
										"aspect-square cursor-pointer rounded-sm object-cover"
									}
								/>
							</div>
						);
					})}
				</div>
			</div>
		);
	}

	return null;
};
